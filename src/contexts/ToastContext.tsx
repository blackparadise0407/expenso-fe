import { AnimatePresence } from 'framer-motion'
import { produce } from 'immer'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

import { Toast } from '@/components/Toast'

interface EnqueueFn {
  (message: string, opts?: ToastOption): void
}

interface RemoveFn {
  (id: string): void
}

interface IToastContext {
  toasts: Toast[]
  enqueue: EnqueueFn
  remove: RemoveFn
}

interface ToastProviderProps {
  children: ReactNode
}

const ToastContext = createContext<IToastContext>({
  toasts: [],
  enqueue: () => {},
  remove: () => {},
})

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const enqueue: EnqueueFn = useCallback((message, opts = {}) => {
    const toast = {
      id: Date.now().toString(),
      message,
      variant: opts.variant ?? 'success',
    } as Toast
    setToasts((prev) => [...prev, toast])
  }, [])

  const remove: RemoveFn = useCallback((id) => {
    setToasts(
      produce((draft) => {
        const foundIdx = draft.findIndex((it) => it.id === id)
        if (foundIdx > -1) {
          draft.splice(foundIdx, 1)
        }
      })
    )
  }, [])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        enqueue,
        remove,
      }}
    >
      {children}
      <div className="fixed top-3 right-3 space-y-3 z-[1000]">
        <AnimatePresence initial={false}>
          {toasts.map((it) => (
            <Toast key={it.id} data={it} onRemove={remove} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return useContext(ToastContext)
}
