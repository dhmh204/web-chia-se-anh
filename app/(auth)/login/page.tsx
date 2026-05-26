import React from 'react'
import LoginForm from './components/LoginForm'
import Hero from './components/Hero'

const LoginPage = () => {
  return (
    <div className='min-h-[100vh] grid grid-cols-[1.05fr_0.95fr] overflow-hidden auth-page'>
      <Hero />
      <LoginForm />
    </div>
  )
}

export default LoginPage