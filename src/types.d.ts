type Doc = {
  doctype: string
  name: string
  creation: Date
  modified: Date
  docstatus: number
  metadata: DocumentMetadata
}

interface Supplier extends Doc {
  naming_series: string
  supplier_name: string
  country: string
  supplier_group: string
  supplier_type: string
  vat_status: string
  tax_id: string
  tax_category: string
  default_price_list: string
  payment_terms: string
  disabled: number
  language: string
}

interface DocumentMetadata {
  total_comments: number
  versions: DocumentVersion[]
  tags: string
}

interface DocumentVersion {
  name: string
  owner: string
  creation: Date
  data: string
}

interface DocTypes {
  supplier: Supplier
}