import { useLocation, useNavigate } from 'react-router-dom'

interface NavigationProps {
  location: LocationProps
}

interface LocationProps {
  state?: LocationState
}

interface LocationState {
  path?: string
}

function WithNavigate(Component: any) {
  function wrapper(props: any) {
    const location = useLocation()

    return <Component location={location} {...props} />
  }

  return wrapper
}

export type { NavigationProps }
export default WithNavigate
