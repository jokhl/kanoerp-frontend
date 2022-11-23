import { useContext, useState } from 'react'
import { Spinner, Tab, Tabs } from '@blueprintjs/core'
import { AxiosError } from 'axios'
import { Text, useTranslator } from '@eo-locale/react'
import { useParams } from 'react-router-dom'

import type { Error } from '../../../errors'

// Components
import AppLayout from '../../../components/AppLayout'
import FormActions from '../../../components/FormActions'

// Panels
import GeneralInfoPanel from './panels/GeneralInfo'

// Contexts
import { BackendContext } from '../../../providers/BackendProvider'
import FormProvider from '../../../providers/FormProvider'

// Data
import ERRORS from '../../../errors'

interface ISupplierCache {
  supplierTypes: string[]
  supplierGroups: string[]
  vatStatuses: string[]
  taxCategories: string[]
  buyingPriceLists: string[]
}

const ShowSupplierPage = () => {
  const params = useParams()
  const translator = useTranslator()
  const backend = useContext(BackendContext)

  // State
  const [supplier, setSupplier] = useState<Supplier | void>()
  const [cache, setCache] = useState<ISupplierCache>({
    supplierTypes: [
      translator.translate('words.company'),
      translator.translate('words.individual'),
    ],
    supplierGroups: [],
    vatStatuses: [
      translator.translate('words.liable'),
      translator.translate('words.nonliable'),
      translator.translate('words.exempt'),
    ],
    taxCategories: [],
    buyingPriceLists: [],
  })

  const i18n: Record<string, string> = {
    view: translator.translate('words.view'),
    edit: translator.translate('words.edit'),
    delete: translator.translate('words.delete'),
  }

  let initError: Error | undefined

  // States
  const [error, setError] = useState(initError)

  function _handleError(error: AxiosError) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setError({ code: error.response.status, description: error.response?.data })
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request)
      setError({ code: ERRORS.REQ_NO_RESPONSE })
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(error.message)
      setError({ code: ERRORS.REQ_FAILED })
    }
  }

  async function getSupplierGroups() {
    return backend.client
      .get_all('Supplier Group')
      .then((resp) => resp.data.data)
      .catch(_handleError)
  }

  async function getTaxCategories() {
    return backend.client
      .get_all('Tax Category')
      .then((resp) => resp.data.data)
      .catch(_handleError)
  }

  async function getBuyingPriceLists() {
    return backend.client
      .get_all('Price List', {
        filters: { buying: '1' }
      })
      .then((resp) => resp.data.data)
      .catch(_handleError)
  }

  async function getSupplier(name: string) {
    return backend.client
      .run('frappe.desk.form.load.getdoc', {
        params: {
          doctype: 'Supplier',
          name,
        },
      })
      .then((resp) => {
        const supplier: Supplier = {
          ...resp.data.docs[0],
          metadata: resp.data.docinfo,
        }
        return supplier
      })
      .catch(_handleError)
  }

  if (params.name && supplier == undefined) {
    const supplierName: string = params.name

    // First, we fetch all Link fields values and, only in the end,
    // we fetch the Supplier data. The page will render when Supplier
    // data is set in state.
    getSupplierGroups()
      .then((supplierGroups: Record<string, string>[]) => {
        setCache(prevCache => {
          prevCache.supplierGroups = supplierGroups.map((supplierGroup: Record<string, string>) => supplierGroup.name)
          return prevCache
        })
      })
      .then(getTaxCategories)
      .then((taxCategories: Record<string, string>[]) => {
        setCache(prevCache => {
          prevCache.taxCategories = taxCategories.map((taxCategory: Record<string, string>) => taxCategory.name)
          return prevCache
        })
      })
      .then(getBuyingPriceLists)
      .then((buyingPriceLists: Record<string, string>[]) => {
        setCache(prevCache => {
          prevCache.buyingPriceLists = buyingPriceLists.map((buyingPriceList: Record<string, string>) => buyingPriceList.name)
          return prevCache
        })
      })
      .then(() => getSupplier(supplierName))
      .then((supplier: Supplier | void) => {
        if (supplier) setSupplier(supplier)
      })
  }

  if (supplier) {
    return (
      <FormProvider doc={supplier}>
        <AppLayout>
          <section className="w-full">
            <header className="flex items-center w-full h-16 bg-white border-b border-slate-300 shadow-sm">
              <h1 className="flex items-center px-8 text-2xl font-bold text-bp-dark-gray-500">
                <Text id="doctypes.supplier" />: {supplier.supplier_name}{' '}
                <span className="ml-2 text-bp-gray-400 text-base font-normal">
                  ({supplier.name})
                </span>
              </h1>

              <div className="flex-grow"></div>

              <div className="flex items-center h-full px-8">
                <FormActions />
              </div>
            </header>

            <main className="w-full mt-4 px-8">
              <Tabs id="tabs">
                <Tab
                  id="general_info"
                  title="Informations"
                  panel={<GeneralInfoPanel supplier={supplier} cache={cache} />}
                />
              </Tabs>
            </main>
          </section>
        </AppLayout>
      </FormProvider>
    )
  } else {
    return (
      <AppLayout>
        <section className="w-full">
          <span className="flex justify-center mt-4">
            <Spinner size={20} className="mr-2" /> <Text id="words.loading" />
            ...
          </span>
        </section>
      </AppLayout>
    )
  }
}

export default ShowSupplierPage
export { type ISupplierCache }