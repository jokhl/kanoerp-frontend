import type { Error } from '../errors'

// Components
import AppLayout from '../components/AppLayout'
import ErrorComponent from '../components/ErrorComponent'

const ErrorPage = ({ error }: Record<string, Error>) => {
  return (
    <AppLayout>
      <ErrorComponent error={error} />
    </AppLayout>
  )
}

export default ErrorPage
