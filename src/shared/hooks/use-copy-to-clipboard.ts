import { useState } from 'react'

type CopiedValue = string | null

type CopyFn = (text: string) => Promise<boolean>

type ReturnType = {
  copy: CopyFn
  copiedText: CopiedValue
}

export const useCopyToClipboard = (): ReturnType => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      setCopiedText(null)
      return false
    }
  }

  return { copiedText, copy }
}
