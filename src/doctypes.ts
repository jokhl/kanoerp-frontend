interface Doctype {
  name: string
  i18nKey: string
  listView: ListViewSettings
}

interface ListViewSettings {
  columns: ListViewColumn[]
}

interface ListViewColumn {
  fieldName: string
  titleKey: string
  className?: string
  childClassName?: string
  width?: string
  alignment?: string
  link?: string
  formatter?: Function
}

const Doctypes: Record<string, Doctype> = {
  'purchase-invoice': {
    name: 'Purchase Invoice',
    i18nKey: 'Purchase Invoice',
    listView: {
      columns: [
        { fieldName: 'name', titleKey: 'fields.reference', className: 'w-2/12 py-2 px-3' },
        { fieldName: 'posting_date', titleKey: 'fields.date', className: 'w-2/12 py-2 px-3' },
        {
          fieldName: 'grand_total',
          titleKey: 'fields.grand_total',
          className: 'w-1/12 py-2 px-3 text-right',
        },
        { fieldName: 'status', titleKey: 'fields.status', className: 'w-1/12 py-2 px-3' },
      ],
    },
  },
  'sales-invoice': {
    name: 'Sales Invoice',
    i18nKey: 'Sales Invoice',
    listView: {
      columns: [
        { fieldName: 'name', titleKey: 'fields.reference', className: 'w-2/12 py-2 px-3' },
        { fieldName: 'customer_name', titleKey: 'fields.customer', className: 'w-2/12 py-2 px-3' },
        { fieldName: 'posting_date', titleKey: 'fields.date', className: 'w-2/12 py-2 px-3' },
        {
          fieldName: 'grand_total',
          titleKey: 'fields.grand_total',
          className: 'w-1/12 py-2 px-3 text-right',
        },
        { fieldName: 'status', titleKey: 'fields.status', className: 'w-1/12 py-2 px-3' },
      ],
    },
  },
  customer: {
    name: 'Customer',
    i18nKey: 'Customer',
    listView: {
      columns: [
        {
          fieldName: 'name',
          titleKey: 'fields.reference',
          className: 'w-1/12 py-2 px-3',
          childClassName: 'font-mono text-neutral-500',
          link: '/customer/:name',
        },
        {
          fieldName: 'customer_name',
          titleKey: 'fields.customer_name',
          className: 'w-4/12 py-2 px-3',
          childClassName: 'font-medium text-storm-gray-700',
        },
        { fieldName: 'tax_id', titleKey: 'fields.vat_number', className: 'w-2/12 py-2 px-3' },
        {
          fieldName: 'disabled',
          titleKey: 'fields.status',
          className: 'w-1/12 py-2 px-3',
          formatter: function (status: number) {
            if (status === 0)
              return '<span class="py-1 px-2 bg-blue-100 rounded text-blue-500 font-medium text-xs">Enabled</span>'
            else
              return '<span class="py-1 px-2 bg-neutral-200 rounded text-neutral-600 font-medium text-xs">Disabled</span>'
          },
        },
      ],
    },
  },
  suppliers: {
    name: 'Supplier',
    i18nKey: 'doctypes.supplier',
    listView: {
      columns: [
        {
          fieldName: 'name',
          titleKey: 'doctypes.fields.supplier.name',
          link: '/suppliers/:name',
          width: 'w-24'
        },
        {
          fieldName: 'supplier_name',
          titleKey: 'doctypes.fields.supplier.supplier_name',
        },
        { fieldName: 'tax_id', titleKey: 'doctypes.fields.supplier.tax_id' },
        {
          fieldName: 'disabled',
          titleKey: 'doctypes.fields.supplier.status',
          width: 'w-32',
          alignment: 'text-center',
          formatter: function (status: number) {
            if (status === 0)
              return '<span class="py-1 px-2 bg-blue-100 rounded text-blue-500 font-medium text-xs">Enabled</span>'
            else
              return '<span class="py-1 px-2 bg-neutral-200 rounded text-neutral-600 font-medium text-xs">Disabled</span>'
          },
        },
      ],
    },
  },
}

export default Doctypes
export type { Doctype, ListViewColumn }
