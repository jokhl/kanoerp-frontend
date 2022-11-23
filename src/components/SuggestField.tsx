import { Fragment, useContext, useState } from 'react'
import { Button, Intent, MenuItem } from '@blueprintjs/core'
import { Suggest } from '@blueprintjs/select'

// Context
import { Form, FormContext } from '../providers/FormProvider'

interface ISuggestItem {
  title: string
  subtitle?: string
  value: string
}

interface ISuggestFieldProps {
  name: string
  label: string
  items: ISuggestItem[]
  value?: string
  initialEditMode?: boolean
  className?: string
  onSave: (newValue: string) => void
}

const SuggestField = ({ name, label, items, value, initialEditMode, className, onSave }: ISuggestFieldProps) => {
  const form: Form = useContext(FormContext)

  const [editMode, setEditMode] = useState(initialEditMode ?? false)
  const [selectedItem, setSelectedItem] = useState<ISuggestItem | undefined>(
    items.find((item: ISuggestItem) => item.value === value)
  )
  const [newSelectedItem, setNewSelectedItem] = useState<ISuggestItem | undefined>()

  function onCancelClick(): void {
    setEditMode(false)
    setNewSelectedItem(undefined)
  }

  function onSaveClick(): void {
    if (newSelectedItem !== undefined) {
      onSave(newSelectedItem.value)
      setSelectedItem(newSelectedItem)
    }
    setEditMode(false)
  }

  function onEditClick(): void {
    setEditMode(true)
  }

  // If user clicks on global Edit button and an input is locally in edit
  // mode, disable the local edit mode.
  if (form.editMode && editMode) {
    setEditMode(false)
    setNewSelectedItem(undefined)
  }

  if (editMode || form.editMode) {
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
        <Suggest
          items={items}
          selectedItem={newSelectedItem ?? selectedItem}
          itemRenderer={(item: ISuggestItem, { handleClick, modifiers, query }) => {
            return (
              <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={item.value}
                onClick={handleClick}
                text={item.title}
              />
            )
          }}
          onItemSelect={(item: ISuggestItem) => setNewSelectedItem(item)}
          inputValueRenderer={(item: ISuggestItem) => item.value}
          noResults={<MenuItem disabled={true} text="No results." />}
          popoverProps={{ minimal: true }}
          className={className}
        />
        {controls}
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <label htmlFor={name} className="block pb-0.5 font-medium text-bp-blue-900 text-sm">
          {label}
        </label>
        <span id={name} className="block mb-2 text-bp-gray-450 group">
          {selectedItem?.title ?? '-'}
          <Button
            icon="edit"
            minimal={true}
            small={true}
            className="invisible group-hover:visible ml-2"
            onClick={onEditClick}
          />
        </span>
      </Fragment>
    )
  }
}

export default SuggestField
export { type ISuggestItem }