'use client'

import {
  type Dispatch,
  type ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react'
import { type FileWithPath } from 'react-dropzone'

interface EsignFormProviderProps {
  children: ReactNode
}

const EsignFormProviderContext = createContext<{
  value: Value
  setValue: Dispatch<Partial<Value>>
} | null>(null)

type Value = {
  recipients: {
    email: string
    name?: string
  }[]
  orderedDelivery: boolean
  document: FileWithPath[]
}

export function EsignFormProvider({ children }: EsignFormProviderProps) {
  const [value, setValue] = useReducer(
    (data: Value, partialData: Partial<Value>) => ({ ...data, ...partialData }),
    {} as Value,
  )

  return (
    <EsignFormProviderContext.Provider value={{ value, setValue }}>
      {children}
    </EsignFormProviderContext.Provider>
  )
}

export const useEsignValues = () => {
  const data = useContext(EsignFormProviderContext)

  if (!data) {
    throw new Error("useEsignValues shouldn't be null")
  }

  return data
}
