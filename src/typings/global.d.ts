export {}

declare global {
  interface Transaction {
    id: string
    name: string
    transactionDate: Date
    amount: number
    createdById: string
    income: boolean
    category: string
    createdAt: Date
    updatedAt: Date
  }

  interface PaginatedQuery {
    pageSize: number
    pageIndex: number
  }

  interface CallbackFn {
    (err?: string): void
  }

  interface Category {
    id: string
    name: string
    description: string
    imgUrl: string
    createdById: string
    createdAt: Date
    updatedAt: Date
  }

  type ToastVariant = 'success' | 'warn' | 'error'

  interface Toast {
    id: string
    message: string
    variant: ToastVariant
  }

  interface ToastOption {
    variant?: ToastVariant
  }
}
