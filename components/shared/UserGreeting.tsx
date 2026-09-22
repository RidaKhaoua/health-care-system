import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';

interface IUserGreetingProps {
    fullName: string;
}

function UserGreeting({fullName}:IUserGreetingProps) {
  return (
   <div className="flex justify-between items-center ">
          <h1 className="text-sm xl:text-2xl font-bold text-black flex gap-1.5 items-center">
            <span>Welcome,</span>
            <span>
              {fullName}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="hover:bg-black/30">
              {new Date().getFullYear()}
            </Button>
            <Link href={"/patient/self"}>
              <Button
                variant="outline"
                className="text-black cursor-pointer bg-white!"
              >
                View Profile
              </Button>
            </Link>
          </div>
        </div>
  )
}

export default UserGreeting
