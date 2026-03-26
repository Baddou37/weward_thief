interface AccountCreatedEmailData {
  displayName: string
  loginUrl: string
  lang: 'fr' | 'en'
}

export function accountCreatedEmailSubject(lang: 'fr' | 'en'): string {
  return lang === 'en'
    ? 'Your Wecard Thief account is ready'
    : 'Votre compte Wecard Thief est prêt'
}

export function accountCreatedEmailText({
  displayName,
  loginUrl,
  lang,
}: AccountCreatedEmailData): string {
  if (lang === 'en') {
    return `Hello ${displayName},

An administrator has created your Wecard Thief account.

Sign in with the email and password you received from them (not by email), then you can change your password in the app if you wish.

Open: ${loginUrl}

— Wecard Thief
`
  }

  return `Bonjour ${displayName},

Un administrateur a créé votre compte Wecard Thief.

Connectez-vous avec l’email et le mot de passe qu’il ou elle vous a communiqués (pas par ce mail), puis vous pourrez changer votre mot de passe dans l’application si vous le souhaitez.

Connexion : ${loginUrl}

— Wecard Thief
`
}

export function accountCreatedEmailHtml({
  displayName,
  loginUrl,
  lang,
}: AccountCreatedEmailData): string {
  if (lang === 'en') {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:32px 16px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:8px;border:1px solid #e5e7eb;padding:32px;">
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Your account is ready</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">Wecard Thief — Weward groups moderation</p>
    <p style="color:#374151;">Hello <strong>${displayName}</strong>,</p>
    <p style="color:#374151;">An administrator has created your account. Sign in with the <strong>email and password they gave you</strong> (not in this email), then you can change your password in the app under <em>Account</em>.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">Sign in</a>
    </div>
    <p style="color:#9ca3af;font-size:13px;">If you were not expecting this, ignore this message.</p>
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
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Votre compte est prêt</h2>
    <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">Wecard Thief — modération des groupes Weward</p>
    <p style="color:#374151;">Bonjour <strong>${displayName}</strong>,</p>
    <p style="color:#374151;">Un administrateur a créé votre compte. Connectez-vous avec <strong>l’email et le mot de passe qu’il ou elle vous a communiqués</strong> (pas dans ce mail), puis vous pourrez modifier votre mot de passe dans l’application, section <em>Mon compte</em>.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">Se connecter</a>
    </div>
    <p style="color:#9ca3af;font-size:13px;">Si vous n’attendiez pas ce message, ignorez-le.</p>
  </div>
</body>
</html>`
}
