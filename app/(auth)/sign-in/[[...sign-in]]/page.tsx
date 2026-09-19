import { SignIn } from '@clerk/nextjs'


function page() {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <SignIn/>
    </div>
  )
}

export default page
