import { createContext, useState } from 'react'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

interface User {
  isLoggedIn: boolean
  fullName: string
  setIsLoggedIn: Function
  setFullName: Function
}

interface Backend {
  user: User
  client: BackendClient
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

interface IBackendParams {
  fields?: string[]
  filters?: Record<string, string>
}

class BackendClient {
  instance: AxiosInstance

  constructor(headers: Record<string, string>) {
    this.instance = axios.create({
      headers,
      withCredentials: true,
      responseType: 'json',
    })
  }

  run(method: string, config?: AxiosRequestConfig) {
    return this.instance({
      baseURL: API_METHOD_URL,
      url: method,
      ...config
    })
  }

  get_all(doctype: string, params?: IBackendParams) {
    return this.instance({
      url: DOCS_URL + doctype,
      params: {
        fields: JSON.stringify(params?.fields ?? ['name']),
        filters: JSON.stringify(params?.filters ?? {})
      }
    })
  }
}

const API_METHOD_URL: string = 'http://erp.local/api/method/'
const DOCS_URL: string = 'http://erp.local/api/resource/'
const HEADERS: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

function init() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fullName, setFullName] = useState('')

  return {
    user: {
      isLoggedIn: isLoggedIn,
      fullName: fullName,
      setIsLoggedIn,
      setFullName,
    },
    client: new BackendClient(HEADERS),
    login: function (username: string, password: string): Promise<void> {
      return this.client
        .run('login', {
          method: 'POST',
          params: {
            usr: username,
            pwd: password,
          }
        })
        .then((resp) => {
          if (resp.status === 200) {
            setIsLoggedIn(true)
            setFullName(resp.data.full_name)
          }
        })
    },
    logout: function (): void {
      this.client.run('logout').then((resp) => {
        if (resp.status === 200) {
          setIsLoggedIn(false)
          setFullName('')
        }
      })
    },
  }
}

const fakeBackend: Backend = {
  user: {
    isLoggedIn: false,
    fullName: '',
    setIsLoggedIn: function () {},
    setFullName: function () {},
  },
  client: new BackendClient(HEADERS),
  login: function (username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {})
  },
  logout: function (): void {},
}

const BackendContext = createContext(fakeBackend)

function BackendProvider(props: any) {
  const backend: Backend = init()
  return <BackendContext.Provider value={backend}>{props.children}</BackendContext.Provider>
}

export type { Backend }
export { BackendContext }
export default BackendProvider
