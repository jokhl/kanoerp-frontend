import { Fragment, useContext, useEffect, useState } from 'react'
import {
  AnchorButton,
  Button,
  ButtonGroup,
  Checkbox,
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
  NumericInput,
  Spinner,
} from '@blueprintjs/core'
import { Text, useTranslator } from '@eo-locale/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import type { Error } from '../errors'

// Pages
import ErrorPage from './ErrorPage'

// Components
import AppLayout from '../components/AppLayout'
import ErrorComponent from '../components/ErrorComponent'
import Pagination from '../components/Pagination'

// Contexts
import { BackendContext } from '../providers/BackendProvider'

// Data
import Doctypes, { Doctype, ListViewColumn } from '../doctypes'
import ERRORS from '../errors'
import { Popover2 } from '@blueprintjs/popover2'

interface ListQueryParams {
  perPage?: number
  sortBy?: string
  sortOrder?: string
}

const MAX_PER_PAGE = 500

const ListPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const translator = useTranslator()
  const backend = useContext(BackendContext)

  const i18n: Record<string, string> = {
    view: translator.translate('words.view'),
    edit: translator.translate('words.edit'),
    delete: translator.translate('words.delete'),
  }
  const initSelectedRows: number[] = []
  
  let initError: Error | undefined
  let initRows: Array<any> | undefined
  let initTotal: number = 0
  let initPerPage: number = 20
  let initOffset: number = 0
  let initPageNumber: number = 1
  let initSortByFieldName: string = 'name'
  let initSortOrder: string = 'ASC'
  let doctype: Doctype | undefined

  // States
  const [error, setError] = useState(initError)
  const [rows, setRows] = useState(initRows)
  const [total, setTotal] = useState(initTotal)
  const [perPage, setPerPage] = useState(initPerPage)
  const [offset, setOffset] = useState(initOffset)
  const [pageNumber, setPageNumber] = useState(initPageNumber)
  const [sortByFieldName, setSortByFieldName] = useState(initSortByFieldName)
  const [sortOrder, setSortOrder] = useState(initSortOrder)
  const [selectedRows, setSelectedRows] = useState(initSelectedRows)

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

  function getFields(doctype: Doctype) {
    return doctype.listView.columns.map((col: ListViewColumn) => {
      return '`tab{doctype}`.`{fieldName}`'
        .replace('{doctype}', doctype.name)
        .replace('{fieldName}', col.fieldName)
    })
  }

  async function getDoctype(doctype: Doctype) {
    return backend.client
      .run('frappe.desk.form.load.getdoctype', {
        params: {
          doctype: doctype.name,
        },
      })
      .then((resp) => resp.data)
      .catch(_handleError)
  }

  async function getTotal(doctype: Doctype, filters: Array<Array<string>> = [], distinct: boolean = false) {
    return backend.client
      .run('frappe.desk.reportview.get_count', {
        params: {
          doctype: doctype.name,
          filters,
          distinct
        },
      })
      .then((resp) => resp.data.message)
      .catch(_handleError)
  }

  async function getDoctypeList(
    doctypeName: string,
    fields: Array<string>,
    filters?: Array<Array<string>>,
    orderBy?: string,
    orderDirection?: string,
    start: number = 0,
    pageLength: number = 20,
    view: string = 'List',
    withCommentCount: boolean = true
  ) {
    let params: Record<string, any> = {
      doctype: doctypeName,
      fields: JSON.stringify(fields),
      start: start,
      page_length: pageLength,
      view: view,
      with_comment_count: withCommentCount,
    }

    if (filters) params['filters'] = JSON.stringify(filters)
    if (orderBy) params['order_by'] = orderBy
    if (orderDirection) params['order_by'] += ` ${orderDirection}`

    return backend.client
      .run('frappe.desk.reportview.get', {
        params: params,
      })
      .then((resp) => resp.data.message)
      .catch(_handleError)
  }

  function refreshData(params: ListQueryParams = {}): void {
    if (doctype) {
      const fields = getFields(doctype)
      const newPerPage: number = params.perPage ?? perPage
      const newSortByFieldName: string = params.sortBy ?? sortByFieldName
      const newSortOrder: string = params.sortOrder ?? sortOrder

      getDoctypeList(doctype.name, fields, [], newSortByFieldName, newSortOrder, offset, newPerPage).then((data) => {
        const rows = data.values.map((row: Array<Record<string, any>>): Record<string, any> => {
          const cols: Record<string, any> = {}
          data.keys.forEach((key: string, idx: number): void => {
            cols[key] = row[idx]
          })
          return cols
        })

        setRows(rows)
      })
    }
  }

  function onRowCheckClick(rowIdx: number): void {
    const idx = selectedRows.indexOf(rowIdx)
    if (idx === -1) setSelectedRows([...selectedRows, rowIdx])
    else setSelectedRows(selectedRows.filter(item => (item !== rowIdx)))

    document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('bg-yellow-50')
    document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('border-orange-300')
    document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('last:border-0')
  }

  function onUnselectAllClick():void {
    selectedRows.forEach((rowIdx: number) => {
      document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('bg-yellow-50')
      document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('border-orange-300')
      document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('last:border-0')
    })
    setSelectedRows([])
  }

  function onSelectAllClick(): void {
    if (selectedRows.length > 0) {
      onUnselectAllClick()
      return
    }

    const allSelectedRows: number[] = []

    document.querySelectorAll('tr[data-row-idx').forEach((rowElem, idx) => {
      if (!rowElem.classList.contains('bg-yellow-50')) rowElem.classList.add('bg-yellow-50')
      if (!rowElem.classList.contains('border-orange-300')) rowElem.classList.add('border-orange-300')
      if (rowElem.classList.contains('last:border-0')) rowElem.classList.remove('last:border-0')

      allSelectedRows.push(idx)
    })

    setSelectedRows(allSelectedRows)
  }

  function toggleRowOutline(rowIdx: number): void {
    document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('bg-slate-100')
    document.querySelector(`tr[data-row-idx="${rowIdx}"]`)?.classList.toggle('border-slate-400')
    document.querySelector(`tr[data-row-idx="${rowIdx - 1}"]`)?.classList.toggle('border-slate-400')
  }

  function onRowMoreOpening(rowIdx: number): void {
    toggleRowOutline(rowIdx)
  }

  function onRowMoreClosing(rowIdx: number): void {
    toggleRowOutline(rowIdx)
  }

  function getUrl(row: any, col: ListViewColumn): string {
    let formattedUrl: string = col.link ?? ''

    const fieldNames: string[] = doctype?.listView.columns.map(col => col.fieldName) ?? []

    fieldNames.forEach(fieldName => {
      const idx: number = formattedUrl.indexOf(fieldName) ?? -1
      if (idx !== -1 && formattedUrl[idx - 1] === ':') {
        formattedUrl = formattedUrl.replace(`:${fieldName}`, row[fieldName])
      }
    })

    return formattedUrl
  }

  function onPageChange(pageNumber: number): void {
    setRows(undefined)
    setOffset((pageNumber - 1) * perPage)
    setPageNumber(pageNumber)
    refreshData()
  }

  function onPerPageChange(newPerPage: number): void {
    setPerPage(Math.trunc(newPerPage))
  }

  function onPerPageBlur(): void {
    let newPerPage: number = perPage
    if (perPage < initPerPage) newPerPage = initPerPage
    if (perPage > MAX_PER_PAGE) newPerPage = MAX_PER_PAGE
    if (newPerPage !== perPage) setPerPage(newPerPage)
    refreshData({ perPage: newPerPage })
  }

  function onSortByClick(fieldName: string): void {
    setSortByFieldName(fieldName)
    refreshData({ sortBy: fieldName })
  }

  function onSortOrderClick(): void {
    if (sortOrder === 'ASC') {
      setSortOrder('DESC')
      refreshData({ sortOrder: 'DESC' })
    } else {
      setSortOrder('ASC')
      refreshData({ sortOrder: 'ASC' })
    }
  }

  function getTitleKeyForField(fieldName: string): string {
    let titleKey: string = ''

    if (doctype) {
      const col: ListViewColumn | undefined = doctype.listView.columns.find(col => col.fieldName === sortByFieldName)
      if (col) titleKey = col.titleKey
    }

    return titleKey
  }

  if (params.doctypeSlug) {
    doctype = Doctypes[params.doctypeSlug]
  } else {
    navigate('/')
  }

  useEffect(() => {
    if (error) return

    if (doctype && rows == undefined) {
      const fields = getFields(doctype)
      getTotal(doctype).then((total: number) => setTotal(total))
      refreshData()
    }
  })

  if (doctype == undefined) {
    return <ErrorPage error={{ code: 404 }} />
  } else {
    let content

    if (error) {
      content = <ErrorComponent error={error} />
    } else if (rows == undefined) {
      content = (
        <span className="flex justify-center mt-16 text-slate-500 text-xl font-light">
          <Spinner size={20} className="mr-2" /> <Text id="phrases.loading_data" />
          ...
        </span>
      )
    } else {
      content = (
        <div className="grid grid-cols-12 gap-8 w-full p-4">
          <aside className="col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-2">
            <div className="w-full p-4 bg-white border border-slate-300">
              filters
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-8 xl:col-span-9 2xl:col-span-10">

            <div className="flex w-full py-1.5 px-4 bg-white border border-slate-300">
                {selectedRows.length > 0 ? (
                  <span className="flex items-center text-slate-500 text-sm font-light">
                    <Text id="phrases.rows_count_selected" selected={selectedRows.length} total={rows?.length} />
                  </span>
                ) : ''}
              <span className="flex-grow"></span>
              <div className="flex items-center px-8 text-slate-500 text-sm font-light">
                Sort by &nbsp;<Popover2
                        content={
                          <Fragment>
                            <div className="pt-2 px-2">
                              <ButtonGroup>
                                <Button icon="sort-asc" active={sortOrder === 'ASC'} onClick={onSortOrderClick}>
                                  <Text id="words.ascending" />
                                </Button>
                                <Button icon="sort-desc" active={sortOrder === 'DESC'} onClick={onSortOrderClick}>
                                  <Text id="words.descending" />
                                </Button>
                              </ButtonGroup>
                            </div>
                            <Menu>
                              {doctype.listView.columns.map(col => {
                                return <MenuItem text={translator.translate(col.titleKey)} onClick={() => onSortByClick(col.fieldName)} />
                              })}
                            </Menu>
                          </Fragment>
                        }
                        position="bottom"
                        interactionKind="click"
                        className="cursor-pointer"
                      >
                        <span className="inline-flex items-center pt-1.5 text-bp-blue-700">
                          <Icon icon={sortOrder === 'ASC' ? 'sort-asc' : 'sort-desc'} />
                          <span className="ml-1 leading-none font-normal">
                            <Text id={getTitleKeyForField(sortByFieldName)} />
                          </span>
                        </span>
                      </Popover2>
              </div>
              <div className="flex items-center text-slate-500 text-sm font-light">
                {total ? (
                  <Fragment>
                    <Text id="words.showing" />&nbsp;&nbsp;
                    <span className="w-12">
                      <NumericInput value={perPage} min={initPerPage} max={MAX_PER_PAGE} onValueChange={onPerPageChange} onBlur={onPerPageBlur} fill={true} buttonPosition="none" />
                    </span>&nbsp;&nbsp;
                    <Text id="words.of" />&nbsp;
                    {total}&nbsp;
                    <Text id={doctype.i18nKey} form={'plural'} />
                  </Fragment>
                ) : ''}
              </div>
            </div>

            <table className="w-full border border-slate-300 mt-4">
              <thead className="bg-slate-200 border border-slate-300 text-slate-500">
                <tr>
                  <th className="w-16 py-2 text-center">
                    <Checkbox checked={selectedRows.length === rows.length} indeterminate={selectedRows.length > 0 && selectedRows.length !== rows.length} className="m-0" onClick={onSelectAllClick} />
                  </th>
                  {doctype.listView.columns.map((col) => (
                    <th
                      className={`${
                        col.width ?? ''
                      } py-2 font-medium ${col.alignment ?? 'text-left'}`}
                    >
                      <Text id={col.titleKey} />
                    </th>
                  ))}
                  <th className="w-16 py-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {rows.map((row, idx) => (
                  <tr className="border-b last:border-0" data-row-idx={idx}>
                    <td className="py-2 text-center">
                      <Checkbox className="m-0" checked={selectedRows.includes(idx)} onClick={() => onRowCheckClick(idx)} />
                    </td>
                    {doctype?.listView.columns.map((col: ListViewColumn) => (
                      <td className={`py-2 font-light ${col.alignment ?? 'text-left'}`}>
                        {col.formatter ? (
                          col.link ? (
                            <Link to={getUrl(row, col)}
                            dangerouslySetInnerHTML={{ __html: col.formatter(row[col.fieldName]) }}
                          />
                          ) : <div
                          dangerouslySetInnerHTML={{ __html: col.formatter(row[col.fieldName]) }}
                        />
                        ) : (
                          col.link ? (
                            <a href={getUrl(row, col)}>{row[col.fieldName]}</a>
                          ) : row[col.fieldName]
                        )}
                      </td>
                    ))}
                    <td>
                      <Popover2
                        content={
                          <Menu>
                            <MenuItem icon="eye-open" text={i18n.view} />
                            <MenuItem icon="edit" text={i18n.edit} />
                            <MenuDivider />
                            <MenuItem icon="trash" text={i18n.delete} intent="danger" />
                          </Menu>
                        }
                        position="bottom-right"
                        interactionKind="click"
                        minimal={true}
                        className="cursor-pointer"
                        hoverCloseDelay={0}
                        hoverOpenDelay={0}
                        onOpening={() => onRowMoreOpening(idx)}
                        onClosing={() => onRowMoreClosing(idx)}
                      >
                        <Button icon="more" />
                      </Popover2>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex w-full p-4">
              <span className="w-1/3"></span>
              <span className="w-1/3 text-center">
                {total > 0 ? (
                  <Pagination initialPage={pageNumber} total={total} size={perPage} onPageChange={onPageChange}  />
                ) : ''}
              </span>
              <span className="w-1/3"></span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <AppLayout>
        <section className="w-full">
          <header className="flex items-center w-full h-16 bg-white border-b border-slate-300 shadow-sm">
            <h1 className="px-8 text-2xl font-bold text-bp-dark-gray-500">
              <Text id={doctype.i18nKey} form={'plural'} />
            </h1>

            <div className="flex-grow"></div>

            <div className="flex items-center h-full px-8">
              <AnchorButton intent="primary" href={`/${params.doctypeSlug}/new`}>
                <Text id="words.new" /> <Text id={doctype.i18nKey} />
              </AnchorButton>
            </div>
          </header>

          <main className="w-full">{content}</main>
        </section>
      </AppLayout>
    )
  }
}

export default ListPage
