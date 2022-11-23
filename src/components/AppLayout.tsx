import { Component, Fragment, MouseEvent, ReactElement, useContext } from 'react'
import { Menu, MenuItem } from '@blueprintjs/core'
import { Classes, Popover2 } from '@blueprintjs/popover2'
import { Text } from '@eo-locale/react'
import { useTranslator } from '@eo-locale/react'
import { Link, useNavigate } from 'react-router-dom'

// Contexts
import { BackendContext } from '../providers/BackendProvider'
import { LocaleContext } from '../providers/LocalizationProvider'

interface AppLayoutProps {
  children: Component | Array<Component> | ReactElement
}

function AppLayout(props: AppLayoutProps) {
  const backend = useContext(BackendContext)
  const { language, setLanguage, languages } = useContext(LocaleContext)

  function onLanguageClick(e: MouseEvent, lang: string) {
    e.preventDefault()
    setLanguage(lang)
  }

  function onLogoutClick() {
    backend.logout()
  }

  const translator = useTranslator()
  const navigate = useNavigate()

  const i18n = {
    suppliers: translator.translate('doctypes.supplier', { form: 'plural' }),
    purchase_orders: translator.translate('doctypes.purchase_order', { form: 'plural' }),
    purchase_receipts: translator.translate('doctypes.purchase_receipt', { form: 'plural' }),
    purchase_invoices: translator.translate('doctypes.purchase_invoice', { form: 'plural' }),
  }

  return (
    <Fragment>
      <header className="flex items-center w-full h-10 px-4 lg:px-8 bg-bp-dark-gray-500 text-neutral-50">
        <Link className="hover:text-neutral-50 hover:no-underline font-medium" to="/">
          KanoERP
        </Link>

        <div className="flex-grow flex items-center mx-16">
          {backend.user.isLoggedIn ? (
            <Fragment>
              <Popover2
                content={
                  <Menu>
                    <MenuItem icon="shopping-cart" text={i18n.suppliers} onClick={() => navigate('/suppliers/list')} />
                    <MenuItem icon="document-share" text={i18n.purchase_orders} />
                    <MenuItem icon="clipboard" text={i18n.purchase_receipts} />
                    <MenuItem icon="euro" text={i18n.purchase_invoices} />
                  </Menu>
                }
                position="bottom-left"
                interactionKind="hover"
                minimal={true}
                className="h-10 cursor-pointer siteNav-item"
                hoverCloseDelay={0}
                hoverOpenDelay={0}
              >
                <span className="flex items-center h-full px-4">
                  <Text id="words.buying" />
                </span>
              </Popover2>
              <Popover2
                content={
                  <Menu>
                    <MenuItem text="Purchase Invoice" />
                  </Menu>
                }
                position="bottom-left"
                interactionKind="hover"
                minimal={true}
                className="h-10 cursor-pointer siteNav-item"
                hoverCloseDelay={0}
                hoverOpenDelay={0}
              >
                <span className="flex items-center h-full px-4">
                  <Text id="words.selling" />
                </span>
              </Popover2>
              <Popover2
                content={
                  <Menu>
                    <MenuItem text="Purchase Invoice" />
                  </Menu>
                }
                position="bottom-left"
                interactionKind="hover"
                minimal={true}
                className="h-10 cursor-pointer siteNav-item"
                hoverCloseDelay={0}
                hoverOpenDelay={0}
              >
                <span className="flex items-center h-full px-4">
                  <Text id="words.connectors" />
                </span>
              </Popover2>
            </Fragment>
          ) : (
            ''
          )}
        </div>

        <Popover2
          interactionKind="hover"
          placement="bottom"
          content={
            <ul className="p-3">
              {Object.keys(languages).map((lang) => {
                if (lang !== language) {
                  return (
                    <li>
                      <a
                        href=""
                        className={`block py-1 px-2 hover:bg-neutral-100 rounded hover:no-underline ${Classes.POPOVER2_DISMISS}`}
                        onClick={(e) => onLanguageClick(e, lang)}
                      >
                        {languages[lang]}
                      </a>
                    </li>
                  )
                }
              })}
            </ul>
          }
        >
          <button className="mx-4">{languages[language]}</button>
        </Popover2>

        {backend.user.isLoggedIn ? (
          <button onClick={onLogoutClick}>
            <Text id="words.logout" />
          </button>
        ) : (
          ''
        )}
      </header>
      <main className="flex-grow w-full">{props.children}</main>
    </Fragment>
  )
}

export default AppLayout
