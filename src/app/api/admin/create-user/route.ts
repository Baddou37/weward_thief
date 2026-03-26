import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import {
  accountCreatedEmailHtml,
  accountCreatedEmailSubject,
  accountCreatedEmailText,
} from '@/lib/emails/account-created'
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

  const { email, display_name, password, role, lang = 'fr' } = await request.json()

  if (!email || !display_name || !password) {
    return NextResponse.json(
      { error: 'Email, nom et mot de passe requis' },
      { status: 400 },
    )
  }

  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json(
      { error: 'Le mot de passe doit contenir au moins 8 caractères.' },
      { status: 400 },
    )
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
  const loginUrl = `${siteUrl.replace(/\/$/, '')}/login`

  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name },
    })

  if (createError) {
    const msg = createError.message.toLowerCase().includes('already been registered')
      || createError.message.toLowerCase().includes('already registered')
      ? 'Un compte avec cet email existe déjà.'
      : createError.message
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  if (!created.user) {
    return NextResponse.json({ error: 'Création utilisateur incomplète' }, { status: 500 })
  }

  await supabaseAdmin
    .from('profiles')
    .update({ role: role ?? 'user', display_name })
    .eq('id', created.user.id)

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
      subject: accountCreatedEmailSubject(lang),
      text: accountCreatedEmailText({
        displayName: display_name,
        loginUrl,
        lang,
      }),
      html: accountCreatedEmailHtml({
        displayName: display_name,
        loginUrl,
        lang,
      }),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Compte créé mais email non envoyé : ' + message },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
