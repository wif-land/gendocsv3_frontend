import { IAccountUser } from '@/features/auth/types/IUserAccount'
import { decode } from 'punycode'
import {Listbox, ListboxItem,Divider} from "@nextui-org/react";
import {ListboxWrapper} from "./ListboxWrapper";
import { useRouter } from 'next/navigation'
import { useState } from 'react';


interface CareerModuleProps{
  items: any
}


const CareerModule = ({items}:CareerModuleProps  ) => {
  const [selectedItem, setSelectedItem] = useState(null)
  const onHandleClick = (itemKey:any) => {
    setSelectedItem(itemKey)
    if(itemKey === 'new'){
      router.push('/dashboard/council')
    }else if(itemKey==='copy'){
      router.push('/dashboard/search')
    }
  }
    console.log(items)
    const router = useRouter()
  return (
    <>
       <ListboxWrapper >
        <h1 className='ml-4 mb-2 text-gray-500'>Modulo</h1>
        <Listbox
          aria-label="Actions"
          className="ml-6 mr-2 "
        >

          <ListboxItem key="new" onClick={()=>onHandleClick('new')} className={selectedItem === 'new' ? 'text-gray-400' : 'text-black'}>New file</ListboxItem>
          <ListboxItem key="copy" onClick={()=>onHandleClick('copy')} className={selectedItem === 'copy' ? 'text-gray-400' : 'text-black'}>Copy link</ListboxItem>
          <ListboxItem key="edit" >Edit file</ListboxItem>
        </Listbox>
      </ListboxWrapper>
    </>

  )
}

export default CareerModule
