import { component, install } from 'capsid'
import debug from 'capsid/debug'
install(debug)
import './splash-screen'
import './main'
import './app'
import './modals/list-modal'
import './modals/edit-modal'

@component('app')
export class App {}
