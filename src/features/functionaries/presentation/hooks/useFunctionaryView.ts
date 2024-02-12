import { useEffect } from 'react'
import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'

export const useFunctionaryView = () => {
  const { functionaries, setFunctionaries, get } = useFunctionaryStore()
  const { loader } = useLoaderStore()

  useEffect(() => {
    get()
  }, [])

  return {
    loader,
    functionaries,
    setFunctionaries,
  }
}
