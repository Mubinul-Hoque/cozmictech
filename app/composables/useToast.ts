import { useState } from '#imports'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const useToast = () => {
  // Use Nuxt's useState to ensure singleton state across the app
  const toasts = useState<ToastMessage[]>('admin-toasts', () => [])

  const add = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration = 3000) => add(message, 'success', duration)
  const error = (message: string, duration = 4000) => add(message, 'error', duration)
  const info = (message: string, duration = 3000) => add(message, 'info', duration)

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info
  }
}
