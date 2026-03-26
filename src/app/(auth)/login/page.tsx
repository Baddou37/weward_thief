import { Suspense } from 'react'
import { LoginForm } from './login-form'

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <p className="text-sm text-gray-500">Chargement…</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
