// Source: https://github.com/palantir/blueprint/issues/1029

import { Button, ButtonGroup, Intent, Position } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import { IconNames } from '@blueprintjs/icons'
import { memo, Reducer, useReducer } from 'react'
import { useTranslator } from '@eo-locale/react'

interface Props {
  initialPage?: number
  total: number
  size?: number
  onPageChange: (page: number) => void
}

interface InitialState {
  currentPage: number
  size: number
  total: number
}

interface State extends InitialState {
  pages: number[]
  showEndEllipsis: boolean
  showStartEllipsis: boolean
  totalPages: number
}

interface Actions {
  // tslint:disable-next-line:no-reserved-keywords
  type: 'PAGE_CHANGE'
  page: number
}

const getState = ({ currentPage, size, total }: InitialState): State => {
  const totalPages = Math.ceil(total / size)

  const PAGES_TO_SHOW = 5
  const PAGES_ON_EITHER_SIDE = 2

  let showStartEllipsis = false
  let showEndEllipsis = false

  // create an array of pages to repeat in the pager control
  let startPage = 0
  let endPage = 0
  if (totalPages <= PAGES_TO_SHOW) {
    // less than PAGES_TO_SHOW total pages, so show all
    startPage = 1
    endPage = totalPages
  } else {
    if (currentPage <= PAGES_TO_SHOW - PAGES_ON_EITHER_SIDE) {
      // more than PAGINATION_THRESHOLD total pages so calculate start and end pages
      startPage = 1
      endPage = PAGES_TO_SHOW
      showEndEllipsis = true
    } else if (currentPage + PAGES_ON_EITHER_SIDE >= totalPages) {
      // current page approaching the total pages
      startPage = totalPages - (PAGES_TO_SHOW - 1)
      endPage = totalPages
      showStartEllipsis = true
    } else {
      // current page is somewhere in the middle
      startPage = currentPage - PAGES_ON_EITHER_SIDE
      endPage = currentPage + PAGES_ON_EITHER_SIDE
      showStartEllipsis = true
      showEndEllipsis = true
    }
  }

  const pages = Array.from({ length: endPage + 1 - startPage }, (_, i) => startPage + i)

  // Too large or small currentPage
  let correctCurrentPage = currentPage
  if (currentPage > totalPages) {
    correctCurrentPage = totalPages
  }
  if (currentPage <= 0) {
    correctCurrentPage = 1
  }

  return {
    currentPage: correctCurrentPage,
    pages,
    showEndEllipsis,
    showStartEllipsis,
    size,
    total,
    totalPages,
  }
}

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case 'PAGE_CHANGE':
      return getState({
        ...state,
        currentPage: action.page,
      })

    default:
      throw new Error()
  }
}

const Pagination = memo<Props>(
  ({ initialPage = 1, total, size = 10, onPageChange }) => {
    const [state, dispatch] = useReducer(
      reducer,
      { currentPage: initialPage, total, size, totalPages: 0 },
      getState
    )

    const changePage = (page: number) => {
      dispatch({ type: 'PAGE_CHANGE', page })
      onPageChange(page)
    }

    const translator = useTranslator()

    const i18n = {
      firstPage: translator.translate('words.first_page'),
      previousPage: translator.translate('words.previous_page'),
      nextPage: translator.translate('words.next_page'),
      lastPage: translator.translate('words.last_page')
    }

    if (state.totalPages === 1) {
      return null
    }

    return (
      <div>
        <ButtonGroup>
          <Tooltip2 content={i18n.firstPage} disabled={state.currentPage === 1} position={Position.TOP}>
            <Button
              disabled={state.currentPage === 1}
              icon={IconNames.DOUBLE_CHEVRON_LEFT}
              onClick={() => changePage(1)}
            />
          </Tooltip2>
          <Tooltip2
            content={i18n.previousPage}
            disabled={state.currentPage === 1}
            position={Position.TOP}
          >
            <Button
              icon={IconNames.CHEVRON_LEFT}
              disabled={state.currentPage === 1}
              onClick={() => changePage(Math.max(1, state.currentPage - 1))}
            />
          </Tooltip2>
          {state.showStartEllipsis && <Button disabled={true}>&#8230;</Button>}
          {state.pages.map((page) => (
            <Button
              key={page}
              intent={state.currentPage === page ? Intent.PRIMARY : Intent.NONE}
              onClick={() => changePage(page)}
            >
              {page}
            </Button>
          ))}
          {state.showEndEllipsis && <Button disabled={true}>&#8230;</Button>}
          <Tooltip2
            content={i18n.nextPage}
            disabled={state.currentPage === state.totalPages}
            position={Position.TOP}
          >
            <Button
              icon={IconNames.CHEVRON_RIGHT}
              disabled={state.currentPage === state.totalPages}
              onClick={() => changePage(Math.min(state.currentPage + 1, state.totalPages))}
            />
          </Tooltip2>
          <Tooltip2
            content={i18n.lastPage}
            disabled={state.currentPage === state.totalPages}
            position={Position.TOP}
          >
            <Button
              disabled={state.currentPage === state.totalPages}
              icon={IconNames.DOUBLE_CHEVRON_RIGHT}
              onClick={() => changePage(state.totalPages)}
            />
          </Tooltip2>
        </ButtonGroup>
      </div>
    )
  }
)

export default Pagination