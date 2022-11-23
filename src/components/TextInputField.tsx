import { ChangeEvent, Fragment, useContext, useEffect, useState } from 'react'
import { Button, InputGroup, Intent } from '@blueprintjs/core'

// Context
import { Form, FormContext } from '../providers/FormProvider'

interface ITextFieldInputProps {
  name: string
  label: string
  value?: string
  editable?: boolean
  initialEditMode?: boolean
}

const TextInputField = ({
  name,
  label,
  value,
  editable,
  initialEditMode,
}: ITextFieldInputProps) => {
  const form: Form<any> = useContext(FormContext)

  const [localEditMode, setLocalEditMode] = useState(initialEditMode ?? false)
  const [localValue, setLocalValue] = useState(value ?? '')

  editable = editable ?? true

  function onInputChange(e: ChangeEvent<HTMLInputElement>): void {
    form.updateDoc(name.toString(), e.target.value)
    setLocalValue(e.target.value)
  }

  function onCancelClick(): void {
    form.cancel()
    setLocalEditMode(false)
    setLocalValue(value ?? '')
  }

  function onSaveClick(): void {
    form.save()
    setLocalEditMode(false)
    setLocalValue(value ?? '')
  }

  function onEditClick(): void {
    setLocalEditMode(true)
  }

  useEffect(() => {
    // This is executed when the user exits the global edit mode.
    if (editable && !(localEditMode || form.editMode)) {
      setLocalValue(value ?? '')
    }
  })

  // If user clicks on global Edit button and an input is locally in edit
  // mode, disable the local edit mode.
  if (form.editMode && localEditMode) {
    setLocalEditMode(false)
  }

  if (editable && (localEditMode || form.editMode)) {
    let controls

    // We want to show the input controls only if we are in local edit mode.
    // If we are in global edit mode (i.e. the whole form is in edit mode),
    // we hide the controls.
    if (!form.editMode) {
      controls = (
        <Fragment>
          <Button
            icon="small-cross"
            intent={Intent.DANGER}
            minimal={true}
            onClick={onCancelClick}
          />
          <Button icon="small-tick" intent={Intent.SUCCESS} minimal={true} onClick={onSaveClick} />
        </Fragment>
      )
    }

    return (
      <Fragment>
        <label htmlFor={name} className="block pb-0.5 font-medium text-bp-blue-900 text-sm">
          {label}
        </label>
        <InputGroup
          name={name}
          value={localValue ?? ''}
          rightElement={controls}
          className="inline-block mb-2"
          onChange={onInputChange}
        />
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <label htmlFor={name} className="block pb-0.5 font-medium text-bp-blue-900 text-sm">
          {label}
        </label>
        <span id={name} className="block mb-2 text-bp-gray-450 group">
          {value ?? '-'}
          {editable ? (
            <Button
              icon="edit"
              minimal={true}
              small={true}
              className="invisible group-hover:visible ml-2"
              onClick={onEditClick}
            />
          ) : (
            ''
          )}
        </span>
      </Fragment>
    )
  }
}

export default TextInputField
