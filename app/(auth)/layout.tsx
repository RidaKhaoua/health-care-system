import Image from "next/image";
import AuthImg from "../../assets/auth-img.jpg";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="flex-1/2">{children}</div>
      <div className="hidden lg:block flex-1/2 relative">
        <Image
          src={AuthImg}
          alt="auth-img"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 w-full bg-black/40 flex justify-center items-center z-50">
          <div className="text-center space-y-2">
            <h1 className="text-6xl font-bold text-blue-500">
              Healt Care System
            </h1>
            <p className="text-xl">You're Welcome</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
