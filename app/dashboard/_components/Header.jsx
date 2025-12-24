"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
const Header = () => {

  const path = usePathname();
  useEffect(()=>{

  },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={50} height={50} alt='logo'/>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all curson-pointer
        ${path=='/dashboard'&&'text-secondary font bold'}
        `}
        >Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all curson-pointer
        ${path=='/dashboard/Question'&&'text-primary font bold'}
        `}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all curson-pointer
        ${path=='/dashboard/Upgrade'&&'text-primary font bold'}
        `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all curson-pointer
        ${path=='/dashboard/how'&&'text-primary font bold'}
        `}>How it Works</li>
      </ul>
      <UserButton />
    </div>
  )
}

export default Header




// import React from "react";
// import Image from "next/image";

// const Header = () => {
//   return (
//     <div className="flex items-center p-4 gap-10">
//       <Image src="/logo.svg" width={100} height={100} alt="logo" />

//       <ul className="flex gap-6">
//         <li>Dashboard</li>
//         <li>Questions</li>
//         <li>Upgrade</li>
//         <li>How it Works</li>
//       </ul>
//     </div>
//   );
// };

// export default Header;
