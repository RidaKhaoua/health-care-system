import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <SignIn/>
    </div>
  )
}

export default page
