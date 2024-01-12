'use client'

import React from 'react'
import useLoaderStore from '../store/useLoaderStore'
import { Spinner } from '@nextui-org/react'

const LoaderView = () => {
  const { loader } = useLoaderStore()

  return (
    <div
      className={`bg-red-50 w-full h-full z-[100] flex justify-center items-center ${
        loader.length ? 'absolute' : 'hidden'
      }`}
    >
      {loader.length && <Spinner color="primary" />}
    </div>
  )
}

export default React.memo(LoaderView)
