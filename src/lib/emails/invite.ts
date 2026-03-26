interface InviteEmailData {
  displayName: string
  inviteUrl: string
  lang: 'fr' | 'en'
}

export function inviteEmailHtml({ displayName, inviteUrl, lang }: InviteEmailData): string {
  if (lang === 'en') {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 16px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:8px;border:1px solid #e5e7eb;padding:32px;">
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">You've been invited to Wecard Thief</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">Weward groups moderation platform</p>

    <p style="color:#374151;">Hello <strong>${displayName}</strong>,</p>
    <p style="color:#374151;">An administrator has invited you to join <strong>Wecard Thief</strong>, the moderation database for Weward exchange groups.</p>
    <p style="color:#374151;">Click the button below to set your password and access the platform:</p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${inviteUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
        Create my password
      </a>
    </div>

    <p style="color:#9ca3af;font-size:13px;">This link expires in 24 hours. If you were not expecting this invitation, you can safely ignore this email.</p>
  </div>
</body>
</html>`
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 16px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:8px;border:1px solid #e5e7eb;padding:32px;">
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Vous avez été invité sur Wecard Thief</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">Plateforme de modération des groupes Weward</p>

    <p style="color:#374151;">Bonjour <strong>${displayName}</strong>,</p>
    <p style="color:#374151;">Un administrateur vous a invité à rejoindre <strong>Wecard Thief</strong>, la base de modération des groupes d'échange Weward.</p>
    <p style="color:#374151;">Cliquez sur le bouton ci-dessous pour choisir votre mot de passe et accéder à la plateforme :</p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${inviteUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
        Créer mon mot de passe
      </a>
    </div>

    <p style="color:#9ca3af;font-size:13px;">Ce lien expire dans 24h. Si vous n'attendiez pas cette invitation, ignorez cet email.</p>
  </div>
</body>
</html>`
}

export function inviteEmailSubject(lang: 'fr' | 'en'): string {
  return lang === 'en'
    ? 'You\'ve been invited to Wecard Thief'
    : 'Invitation à rejoindre Wecard Thief'
}
