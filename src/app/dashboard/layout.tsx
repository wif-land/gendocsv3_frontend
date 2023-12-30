"use client"
import React from 'react'
import {Avatar, AvatarIcon} from "@nextui-org/react";
import {  useEffect, useState } from 'react'
import { getCookie } from '@/shared/utils/CookiesUtil';
import { useRouter } from 'next/navigation';
import CareerModule from '@/shared/components/CareerModule';

interface LayoutProps{
    children: React.ReactNode
}
const layout: React.FC<LayoutProps>= ({children}) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      const userCookie = getCookie('user');
      if (userCookie) {
        setUser(await userCookie)
      }
    };
    fetchUser();
  }, []);
  console.log(user)
  const router = useRouter()
  const onhandleClick = () => {
    router.push('/dashboard/consejos')
  }
  return (
    <div className='container'>
        <main className='grid '>
          <nav className='fixed top-0 z-50  h-20 w-full bg-red-800  flex items-center '>
            <div className='w-full flex justify-end'>
            <Avatar
              icon={<AvatarIcon />}
              classNames={{
              base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B] m-10",
              icon: "text-black/80",
              }}
             />
            </div>
          </nav>
          <div className='mt-24'><div>
          <div className='w-1/4 bg-gray-200 h-screen'>
            <ul>
              <CareerModule onclick={onhandleClick}/>
            </ul>
          </div>
      <div className='w-3/4'>
      </div>
          </div>
            {children}</div>
        </main>
    </div>
  )
}

export default layout
