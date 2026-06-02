import { useState } from 'react'
import SignInForm from '@/components/auth/SignInForm'
import SignUpForm from '@/components/auth/SignUpForm'

const Auth = () => {
  const [selected, setSelected] = useState('signIn')

  return selected === 'signIn' ? (
    <SignInForm setSelected={setSelected} />
  ) : (
    <SignUpForm setSelected={setSelected} />
  )
}

export default Auth
