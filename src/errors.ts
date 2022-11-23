import { AxiosError } from "axios"

interface Error {
  code: number
  description?: string
}

const CODES = {
  REQ_NO_RESPONSE: 1000,
  REQ_FAILED: 1001
}

export default CODES
export type { Error }