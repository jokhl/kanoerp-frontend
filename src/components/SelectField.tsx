import { Fragment, useContext, useState } from 'react'
import { Button, Intent, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'

// Context
import { Form, FormContext } from '../providers/FormProvider'

interface ISelectItem {
  title: string
  subtitle?: string
  value: string
}

interface ISelectFieldProps {
  name: string
  label: string
  items: ISelectItem[]
  value?: string
  initialEditMode?: boolean
  filterable?: boolean
  className?: string
  onSave: (newValue: string) => void
}

const CustomSelect = Select.ofType<ISelectItem>()

const SelectField = ({
  name,
  label,
  items,
  value,
  initialEditMode,
  filterable,
  className,
  onSave,
}: ISelectFieldProps) => {
  const form: Form = useContext(FormContext)

  const [editMode, setEditMode] = useState(initialEditMode ?? false)
  const [selectedItem, setSelectedItem] = useState<ISelectItem | null>(
    items.find((item: ISelectItem) => item.value === value) ?? null
  )
  const [newSelectedItem, setNewSelectedItem] = useState<ISelectItem | null>()

  function onCancelClick(): void {
    setEditMode(false)
    setNewSelectedItem(undefined)
  }

  function onSaveClick(): void {
    if (newSelectedItem != null) {
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
    setNewSelectedItem(null)
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
        <CustomSelect
          items={items}
          activeItem={newSelectedItem ?? selectedItem}
          itemRenderer={(item: ISelectItem, { handleClick, modifiers }) => {
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
          onItemSelect={(item: ISelectItem) => setNewSelectedItem(item)}
          noResults={<MenuItem disabled={true} text="No results." />}
          popoverProps={{ minimal: true }}
          filterable={filterable ?? false}
          className={className}
        >
          <span className="flex w-full">
            <Button
              text={newSelectedItem?.title ?? selectedItem?.title}
              alignText="left"
              rightIcon="caret-down"
              className="flex-grow"
            />
            {controls}
          </span>
        </CustomSelect>
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

export default SelectField
export { type ISelectItem }
