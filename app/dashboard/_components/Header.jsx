"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'


const Header = () => {

  const router = useRouter();

  const path = usePathname();
  useEffect(()=>{

  },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={50} height={50} alt='logo' />
      <ul className="hidden md:flex gap-6">
        <li
          onClick={() => router.push('/dashboard')}
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard' && 'text-secondary font-bold'}
          `}
        >
          Dashboard
        </li>

        <li
          onClick={() => router.push("/dashboard/question")}
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/question' && 'text-primary font-bold'}
          `}
        >
          Questions
        </li>

        <li
          onClick={() => router.push("/dashboard/upgrade")}
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/upgrade' && 'text-primary font-bold'}
          `}
        >
          Upgrade
        </li>

        <li
          onClick={() => router.push("/dashboard/how")}
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/how' && 'text-primary font-bold'}
          `}
        >
          How it Works
        </li>
      </ul>

      <UserButton />
    </div>
  )
}

export default Header











