import { Empty } from '../Empty'
import { Loader } from '../Loader'

interface StateWrapperProps {
  loading?: boolean
  error?: string
  empty?: boolean
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  fulfilledComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
}

export default function StateWrapper({
  loading = false,
  error,
  empty,
  loadingComponent,
  errorComponent,
  emptyComponent,
  fulfilledComponent,
}: StateWrapperProps) {
  if (loading) {
    return loadingComponent ? <>{loadingComponent}</> : <Loader />
  }

  if (error) {
    return errorComponent ? <>{errorComponent}</> : <>An error happened</>
  }

  if (empty) {
    return emptyComponent ? <>{emptyComponent}</> : <Empty />
  }

  return <>{fulfilledComponent}</>
}
