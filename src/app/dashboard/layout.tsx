"use client"
import React from 'react'
import {Avatar, AvatarIcon, ScrollShadow,Divider} from "@nextui-org/react";
import {  useEffect, useState } from 'react'
import { getCookie } from '@/shared/utils/CookiesUtil';
import { useRouter } from 'next/navigation';
import CareerModule from '@/shared/components/CareerModule';
import { IUser } from '@/features/auth/types/IUserAccount';

interface LayoutProps{
    children: React.ReactNode
}
const layout: React.FC<LayoutProps>= ({children}) => {
  // const [user, setUser] = useState<User | null>(null);
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       // Asumiendo que getCookie es una función que devuelve una Promesa que se resuelve a una cadena
  //       const userCookieString = await Cookies.get('user'); // Cambia por tu función getCookie si no estás usando js-cookie
  //       if (userCookieString) {
  //         // Parsea la cadena JSON a un objeto JavaScript
  //         const userObject: User = JSON.parse(userCookieString);
  //         setUser(userObject);
  //       }
  //     } catch (error) {
  //       console.error('Error al obtener o parsear la cookie de usuario', error);
  //     }
  //   };

  //   fetchUser();
  // }, []);
  const router = useRouter()
  const onhandleClick = () => {
    router.push('/dashboard/consejos')
  }
  return (
    <div className='h-screen flex'>
      <nav className='fixed top-0 z-50 h-20 w-full bg-red-800 flex items-center'>
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
      <div className='flex mt-20 h-full w-full'>
        <aside className='w-56 bg-white h-full overflow-x-auto'>
          <ScrollShadow hideScrollBar className="h-full overflow-auto">
            <ul>
            <CareerModule items={''}/>
            </ul>
          </ScrollShadow>
        </aside>
        <Divider orientation='vertical'/>
        <section className='flex-grow p-4'>
          {children}
        </section>
      </div>
    </div>
  )
}

export default layout 
