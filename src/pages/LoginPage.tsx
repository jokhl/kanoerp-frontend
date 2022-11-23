import { FormEvent, ReactElement, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Callout, FormGroup, InputGroup, Spinner } from '@blueprintjs/core'
import { useTranslator } from '@eo-locale/react'

// Contexts
import { BackendContext } from '../providers/BackendProvider'

// Components
import AppLayout from '../components/AppLayout'
import WithNavigation from '../components/WithNavigation'

const ERR_UNAUTHORIZED = 1

function _parseCookie() {
  const cookieStr = decodeURIComponent(document.cookie)
  const parts = cookieStr.split('; ')
  const cookie: Record<string, string> = {}
  parts.map((part) => {
    const [key, val] = part.split('=')
    cookie[key] = val
    return part
  })

  return cookie
}

function _handleError(error: any) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.status
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
}

const LoginPage = (props: any) => {
  const backend = useContext(BackendContext)
  const translator = useTranslator()
  const navigate = useNavigate()

  const initState: Record<string, any> = {
    username: '',
    password: '',
    error: undefined,
    loggingIn: false,
  }

  const [state, setState] = useState(initState)

  function loginCheck() {
    backend.client
      .run('frappe.auth.get_logged_user')
      .then((_) => {
        const cookie = _parseCookie()
        backend.user.setIsLoggedIn(true)
        backend.user.setFullName(cookie.full_name)
        navigate(props.location.state?.path || '/')
      })
      .catch(_handleError)
      .then((status) => {
        if (status === 403) backend.logout()
        else if (status === 401) showError(ERR_UNAUTHORIZED)
      })
  }

  // We MUST use arrow functions in order to have access to `this`.
  function onInput(event: FormEvent<HTMLInputElement>) {
    if (event.target) {
      const { name, value } = event.currentTarget

      setState({ ...state, [name]: value })
    }
  }

  function onLoginClick() {
    if (backend && backend.login) {
      setState({ loggingIn: true })

      backend
        .login(state.username, state.password)
        .then(() => {
          navigate(props.location.state?.path || '/')
        })
        .catch((error) => {
          const status = _handleError(error)
          setState({ loggingIn: false })

          if (status === 403) backend.logout()
          else if (status === 401) showError(ERR_UNAUTHORIZED)
        })
    }
  }

  function showError(errorCode: number) {
    switch (errorCode) {
      case ERR_UNAUTHORIZED:
        setState({ error: 'Unauthorized' })
        break
      default:
        break
    }
  }

  // Check if user is logged in.
  if (!backend.user.isLoggedIn) loginCheck()

  let body: ReactElement | ReactElement[] = []

  const i18n = {
    username: translator.translate('words.username'),
    password: translator.translate('words.password'),
    forgotPassword: translator.translate('pages.login.forgot_password'),
    enter: translator.translate('words.enter'),
    login: translator.translate('words.login'),
  }

  if (state.loggingIn) {
    body = (
      <span className="flex justify-center mt-4">
        <Spinner size={20} className="mr-2" /> Logging in...
      </span>
    )
  } else {
    if (state.error) {
      body = [
        <Callout key="error" intent="danger" className="mt-4">
          {state.error}
        </Callout>,
      ]
    } else {
      body = []
    }

    body.push(
      <form key="form" action="" className="mt-4">
        <FormGroup label={i18n.username} labelFor="username">
          <InputGroup name="username" id="username" onChange={onInput} />
        </FormGroup>
        <FormGroup label={i18n.password} labelFor="password">
          <InputGroup name="password" id="password" type="password" onChange={onInput} />
        </FormGroup>
        <div className="flex items-center justify-between">
          <Link to="/posts" className="text-bp-blue-800 underline hover:no-underline">
            {i18n.forgotPassword}
          </Link>
          <Button text={i18n.enter} onClick={onLoginClick} />
        </div>
      </form>
    )
  }

  return (
    <AppLayout>
      <section className="flex justify-center w-full mt-8 lg:mt-32 px-8">
        <div className="w-full lg:w-1/4 xl:w-1/5 2xl:w-2/12 p-4 bg-white border rounded-md shadow">
          <h2 className="text-xl font-bold text-center">{i18n.login}</h2>
          {body}
        </div>
      </section>
    </AppLayout>
  )
}

export default WithNavigation(LoginPage)
