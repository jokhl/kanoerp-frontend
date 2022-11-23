import { createContext, useState } from 'react'
import { deepEqual } from 'fast-equals'
import structuredClone from '@ungap/structured-clone'

interface IFormProviderProps<DocType> {
  doc: DocType
  children: any
}

interface Form<DocType> {
  editMode: boolean
  doc: DocType | undefined
  localDoc: DocType | undefined
  originalDoc: DocType | undefined
  isModified: boolean
  setDoc: (doc: DocType) => void
  setLocalDoc: (doc: DocType) => void
  setEditMode: (editMode: boolean) => void
  updateDoc: <K extends keyof DocType>(fieldName: K, newValue: DocType[K]) => void
  cancel: () => void
  save: () => void
}

// Reference for updateDoc:
// https://stackoverflow.com/questions/62987779/how-do-you-dynamically-update-a-key-value-pair-on-a-typed-object-in-typescript
function init<DocType>(initDoc: DocType): Form<DocType> {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [doc, setDoc] = useState<DocType>(structuredClone(initDoc))
  const [localDoc, setLocalDoc] = useState<DocType>(structuredClone(initDoc))
  const [originalDoc, _] = useState<DocType>(initDoc)
  const [isModified, setIsModified] = useState<boolean>(false)

  return {
    editMode,
    doc,
    localDoc,
    originalDoc,
    isModified,
    setDoc,
    setLocalDoc,
    setEditMode,
    updateDoc: <K extends keyof DocType>(fieldName: K, newValue: DocType[K]) => {
      localDoc[fieldName] = newValue
      if (deepEqual(localDoc, doc)) setIsModified(false)
      else setIsModified(true)
    },
    cancel: () => {
      setLocalDoc(structuredClone(doc))
      setIsModified(false)
    },
    save: () => {
      if (isModified) {
        setDoc(structuredClone(localDoc))
        setIsModified(false)
      }
    },
  }
}

const fakeForm: Form<Doc> = {
  editMode: false,
  doc: undefined,
  localDoc: undefined,
  originalDoc: undefined,
  isModified: false,
  setDoc: (doc: Doc): void => {},
  setLocalDoc: (doc: Doc): void => {},
  setEditMode: (editMode: boolean): void => {},
  updateDoc: <K extends keyof Doc>(fieldName: K, newValue: Doc[K]) => {},
  cancel: () => {},
  save: () => {},
}

const FormContext = createContext<Form<any>>(fakeForm)

const FormProvider = <DocType extends unknown>({ doc, children }: IFormProviderProps<DocType>) => {
  const form: Form<typeof doc> = init<typeof doc>(doc)

  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  )
}

export type { Form }
export { FormContext }
export default FormProvider
