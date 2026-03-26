import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { LoginFallback } from './login-fallback'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
