import React from 'react'

async function page({params}:{params: Promise<{id:string}>}) {
  const {id} = await params
  return (
    <div>
      <h1 className='text-black'> Record User {id}</h1>
    </div>
  )
}

export default page
