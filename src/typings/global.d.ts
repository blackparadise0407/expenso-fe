export {}

declare global {
  interface Transaction {
    id: string
    name: string
    transactionDate: number
    amount: number
    createdById: string
    description: string
    income: boolean
    category: Category | string
    createdAt: Date
    updatedAt: Date
    parsedTransactionDate?: string
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
