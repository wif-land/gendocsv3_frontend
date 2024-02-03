'use client'

import React from 'react'
import useLoaderStore from '../store/useLoaderStore'
import { LoadingScreen } from './loading-screen'

const LoaderView = () => {
  const { loader } = useLoaderStore()

  return <div>{loader.length ? <LoadingScreen color="primary" /> : null}</div>
}

export default React.memo(LoaderView)
