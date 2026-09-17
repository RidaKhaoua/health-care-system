import { Loader2 } from 'lucide-react'


function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center text-black'>
      <Loader2 className='size-12 animate-spin'/>
    </div>
  )
}

export default Loading
