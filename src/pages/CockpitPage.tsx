import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Text, useTranslator } from '@eo-locale/react'

// Contexts
import { BackendContext } from '../providers/BackendProvider'

// Components
import AppLayout from '../components/AppLayout'

// Assets
import cartImage from '../assets/images/cart.png'
import salesImage from '../assets/images/sales.png'
import inventoryImage from '../assets/images/inventory.png'
import refreshImage from '../assets/images/refresh.png'

const CockpitPage = () => {
  const { user } = useContext(BackendContext)
  const translator = useTranslator()

  return (
    <AppLayout>
      <section className="flex flex-col items-center w-full pt-8">
        <h1 className="text-bp-dark-gray-600 text-4xl font-bold">
          <Text id="pages.cockpit.greeting" name={user.fullName} />
        </h1>

        <input
          type="text"
          className="w-full lg:w-1/2 mt-16 p-2 bg-neutral-50 focus:bg-white border-1.5 focus:border-bp-blue-700 rounded-md focus:shadow transition-all"
          placeholder={translator.translate('words.search')}
        />

        <div className="flex flex-wrap justify-center w-full lg:w-1/2 mt-10 -px-6">
          <div className="w-full lg:w-1/2 p-6">
            <h2 className="mb-2 text-xl font-medium">
              <Text id="words.buying" />
            </h2>
            <div className="flex w-full p-4 bg-white rounded-md shadow">
              <Link
                to="/posts"
                className="flex items-center justify-center w-20 h-20 p-2 bg-red-100 rounded-md"
              >
                <img src={cartImage} alt="Buying" className="w-3/4" />
              </Link>
              <ul className="ml-4">
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.supplier" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.purchase_order" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.purchase_receipt" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.purchase_invoice" form={'plural'} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-6">
            <h2 className="mb-2 text-xl font-medium">
              <Text id="words.selling" />
            </h2>
            <div className="flex w-full p-4 bg-white rounded-md shadow">
              <Link
                to="/posts"
                className="flex items-center justify-center w-20 h-20 p-2 bg-blue-100 rounded-md"
              >
                <img src={salesImage} alt="Selling" className="w-3/4" />
              </Link>
              <ul className="ml-4">
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.customer" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.sales_order" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.delivery_note" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.sales_invoice" form={'plural'} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-6">
            <h2 className="mb-2 text-xl font-medium">
              <Text id="words.stock" />
            </h2>
            <div className="flex w-full p-4 bg-white rounded-md shadow">
              <Link
                to="/posts"
                className="flex items-center justify-center w-20 h-20 p-2 bg-yellow-100 rounded-md"
              >
                <img src={inventoryImage} alt="Selling" className="w-3/4" />
              </Link>
              <ul className="ml-4">
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.item" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.item_group" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="doctypes.warehouse" form={'plural'} />
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    <Text id="reports.stock_balance" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-6">
            <h2 className="mb-2 text-xl font-medium">
              <Text id="words.connectors" />
            </h2>
            <div className="flex w-full p-4 bg-white rounded-md shadow">
              <Link
                to="/posts"
                className="flex items-center justify-center w-20 h-20 p-2 bg-green-100 rounded-md"
              >
                <img src={refreshImage} alt="Selling" className="w-3/4" />
              </Link>
              <ul className="ml-4">
                <li>
                  <Link to="/posts" className="">
                    Farandsoft
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="">
                    Winbooks
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default CockpitPage
