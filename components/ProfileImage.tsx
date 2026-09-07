"use client";
import { cn } from "@/lib/utils";
import { generateRandomColor } from "@/utils";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface IProfileImage {
  name: string;
  imageUrl?: StaticImageData | string | null ;
  className?: string;
  textClassName?:string
}

function ProfileImage({ name, imageUrl, className, textClassName }: IProfileImage) {
  if (!name) return null;
  

  return (

    <div
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ",
        className,
        imageUrl ? "transparent" :"bg-purple-500" 
      )}
      
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name} className="w-full object-cover" />
      ) : (
        <span className={cn("text-md text-white uppercase", textClassName)}>
          {name[0]} {name[1]}
        </span>
      )}
    </div>
  );
}

export default ProfileImage;
