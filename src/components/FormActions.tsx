import { Button } from '@blueprintjs/core'
import { Text } from '@eo-locale/react'
import { Fragment, useContext } from 'react'
import structuredClone from '@ungap/structured-clone'

// Context
import { Form, FormContext } from '../providers/FormProvider'

const FormActions = () => {
  const form: Form<keyof DocTypes> = useContext(FormContext)

  function onSaveClick(): void {
    form.save()
    form.setEditMode(false)
  }

  function onEditClick(): void {
    form.setEditMode(true)
  }

  function onCancelClick(): void {
    form.cancel()
    form.setEditMode(false)
  }

  if (form.editMode) {
    return (
      <Fragment>
        {form.isModified ? (
          <span className="inline-block mr-3 py-1 px-2 bg-amber-100 rounded text-sm text-amber-700">
            <Text id="words.modified" />
          </span>
        ) : (
          ''
        )}
        <Button className="mr-3" onClick={onCancelClick}>
          <Text id="words.cancel" />
        </Button>
        <Button
          intent="primary"
          icon="floppy-disk"
          disabled={!form.isModified}
          onClick={onSaveClick}
        >
          <Text id="words.save" />
        </Button>
      </Fragment>
    )
  } else {
    return (
      <Button intent="primary" icon="edit" onClick={onEditClick}>
        <Text id="words.edit" />
      </Button>
    )
  }
}

export default FormActions
