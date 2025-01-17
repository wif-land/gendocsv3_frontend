'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useModuleValidation = (codeModule: string | null) => {
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const validateModule = async () => {
      if (!codeModule) {
        router.push('/') // O cualquier ruta por defecto
        return
      }

      try {
        const validModuleId = codeModule
        if (mounted) {
          if (!validModuleId) {
            router.push('/') // Redirigir si no se encuentra el módulo
          } else {
            setModuleId(validModuleId)
          }
        }
      } catch (error) {
        console.error('Error validating module:', error)
        if (mounted) {
          router.push('/')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    validateModule()

    return () => {
      mounted = false
    }
  }, [codeModule, router])

  return { moduleId, isLoading }
}
