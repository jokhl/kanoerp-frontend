import { Text, useTranslator } from '@eo-locale/react'
import { useContext } from 'react'

import { ISupplierCache } from '../Supplier'

// Components
import TextInputField from '../../../../components/TextInputField'
import SuggestField, { ISuggestItem } from '../../../../components/SuggestField'
import SelectField from '../../../../components/SelectField'

// Context
import { Form, FormContext } from '../../../../providers/FormProvider'

interface ISupplierInfoProps {
  supplier: Supplier
  cache: ISupplierCache
}

const GeneralInfoPanel = ({ supplier, cache }: ISupplierInfoProps) => {
  const translator = useTranslator()
  const form: Form<any> = useContext(FormContext)

  const i18n = {
    fields: {
      name: translator.translate('doctypes.fields.supplier.name'),
      supplier_name: translator.translate('doctypes.fields.supplier.supplier_name'),
      supplier_type: translator.translate('doctypes.fields.supplier.supplier_type'),
      supplier_group: translator.translate('doctypes.fields.supplier.supplier_group'),
      vat_status: translator.translate('doctypes.fields.supplier.vat_status'),
      tax_id: translator.translate('doctypes.fields.supplier.tax_id'),
      tax_category: translator.translate('doctypes.fields.supplier.tax_category'),
      default_price_list: translator.translate('doctypes.fields.supplier.default_price_list'),
    },
  }

  const supplierTypes: ISuggestItem[] = cache.supplierTypes.map((supplierType: string): ISuggestItem => {
    return {
      title: supplierType,
      value: supplierType
    }
  })
  const supplierGroups: ISuggestItem[] = cache.supplierGroups.map((supplierGroup: string): ISuggestItem => {
    return {
      title: supplierGroup,
      value: supplierGroup
    }
  })
  const vatStatuses: ISuggestItem[] = cache.vatStatuses.map((vatStatus: string): ISuggestItem => {
    return {
      title: vatStatus,
      value: vatStatus
    }
  })
  const taxCategories: ISuggestItem[] = cache.taxCategories.map((taxCategory: string): ISuggestItem => {
    return {
      title: taxCategory,
      value: taxCategory
    }
  })
  const buyingPriceLists: ISuggestItem[] = cache.buyingPriceLists.map((buyingPriceList: string): ISuggestItem => {
    return {
      title: buyingPriceList,
      value: buyingPriceList
    }
  })

  return (
    <div className="flex flex-wrap w-full pb-4 px-4 bg-white border border-slate-300">
      <div className="w-full md:w-1/2 xl:w-1/3 mt-4">
        <h2 className="inline-block mb-3 py-1 px-2 bg-slate-200 rounded uppercase text-xs font-medium text-bp-gray-450 tracking-wide">
          <Text id="words.general" />
        </h2>

        <div className="w-full pl-3 border-l-2 border-slate-300">
          <TextInputField
            name="name"
            label={i18n.fields.name}
            value={form.doc['name']}
            editable={false}
          />
          <TextInputField
            name="supplier_name"
            label={i18n.fields.supplier_name}
            value={form.doc['supplier_name']}
          />
          <SelectField
            name="supplier_type"
            label={i18n.fields.supplier_type}
            items={supplierTypes}
            value={supplier.supplier_type}
            onSave={(newValue: string) => (supplier.supplier_type = newValue)}
            className="inline-block w-64 mb-2"
          />
          <SuggestField
            name="supplier_group"
            label={i18n.fields.supplier_group}
            items={supplierGroups}
            value={supplier.supplier_group}
            onSave={(newValue: string) => (supplier.supplier_group = newValue)}
            className="inline-block w-64 mb-2"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 xl:w-1/3 mt-4">
        <h2 className="inline-block mb-3 py-1 px-2 bg-slate-200 rounded uppercase text-xs font-medium text-bp-gray-450 tracking-wide">
          <Text id="words.tax" />
        </h2>

        <div className="w-full pl-3 border-l-2 border-slate-300">
          <SelectField
            name="vat_status"
            label={i18n.fields.vat_status}
            items={vatStatuses}
            value={supplier.vat_status}
            onSave={(newValue: string) => (supplier.vat_status = newValue)}
            className="inline-block w-64 mb-2"
          />

          <TextInputField
            name="tax_id"
            label={i18n.fields.tax_id}
            value={form.doc['tax_id']}
          />

          <SelectField
            name="tax_category"
            label={i18n.fields.tax_category}
            items={taxCategories}
            value={supplier.tax_category}
            onSave={(newValue: string) => (supplier.tax_category = newValue)}
            className="inline-block w-72 mb-2"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 xl:w-1/3 mt-4">
        <h2 className="inline-block mb-3 py-1 px-2 bg-slate-200 rounded uppercase text-xs font-medium text-bp-gray-450 tracking-wide">
          <Text id="words.commercial" />
        </h2>

        <div className="w-full pl-3 border-l-2 border-slate-300">
          <SuggestField
            name="default_price_list"
            label={i18n.fields.default_price_list}
            items={buyingPriceLists}
            value={supplier.default_price_list}
            onSave={(newValue: string) => (supplier.default_price_list = newValue)}
            className="inline-block w-64 mb-2"
          />

          <label
            htmlFor="payment_terms"
            className="block pb-0.5 font-medium text-bp-blue-900 text-sm"
          >
            <Text id="doctypes.fields.supplier.payment_terms" />
          </label>
          <span id="payment_terms" className="block mb-2 text-bp-gray-450">
            {supplier.payment_terms ?? '-'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default GeneralInfoPanel
