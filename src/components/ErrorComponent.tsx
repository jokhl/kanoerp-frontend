import { NonIdealState } from '@blueprintjs/core'
import { Text } from '@eo-locale/react'
import type { Error } from '../errors'

const ErrorComponent = ({ error }: Record<string, Error>) => {
  let title = <Text id={`errors.${error.code}.title`} />
  let description = <Text id={`errors.${error.code}.description`} />

  return (
    <section className="w-full">
      <NonIdealState icon="error" title={title} description={description} />
    </section>
  )
}

export default ErrorComponent
