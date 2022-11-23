import ReactDOM from 'react-dom'

import 'normalize.css/normalize.css'
// blueprint-icons.css file must be included alongside blueprint.css!
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'
// add other blueprint-*.css files here
import './main.css'

import { FocusStyleManager } from '@blueprintjs/core'
FocusStyleManager.onlyShowFocusOnTabs()

import App from './App'
ReactDOM.render(<App />, document.getElementById('root'))
