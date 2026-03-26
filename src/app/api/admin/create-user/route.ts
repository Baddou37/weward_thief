import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { inviteEmailHtml, inviteEmailSubject } from '@/lib/emails/invite'
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { email, display_name, role, lang = 'fr' } = await request.json()

  if (!email || !display_name) {
    return NextResponse.json({ error: 'Email et nom requis' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'

  // Générer le lien sans que Supabase envoie l'email
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback?type=invite`,
      data: { display_name },
    },
  })

  if (linkError) {
    const msg = linkError.message.toLowerCase().includes('already been registered')
      ? 'Un compte avec cet email existe déjà.'
      : linkError.message
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Mettre à jour le profil avec le bon rôle et nom
  await supabaseAdmin
    .from('profiles')
    .update({ role: role ?? 'user', display_name })
    .eq('id', linkData.user.id)

  // Envoyer l'email via Brevo SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_USER!,
      pass: process.env.BREVO_SMTP_KEY!,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.BREVO_FROM_EMAIL ?? 'Wecard Thief <noreply@wecardthief.fr>',
      to: email,
      subject: inviteEmailSubject(lang),
      html: inviteEmailHtml({ displayName: display_name, inviteUrl: linkData.properties.action_link, lang }),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Utilisateur créé mais email non envoyé : ' + message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
