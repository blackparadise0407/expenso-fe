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
}
