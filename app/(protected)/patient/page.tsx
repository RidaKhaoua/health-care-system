import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

async function PatientPage() {
  const user = await currentUser();
  
    const data = null;
    if(user && !data) {
        redirect("/patient/registration")
    }
  return (
    <div>
      <h1>Welcome to patient dashboard</h1>
    </div>
  )
}

export default PatientPage
