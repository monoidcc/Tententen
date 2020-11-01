import * as Event from '../const/event'
import { create } from '../util/dom'
import { component, on, pub } from 'capsid'

export default {
  title: 'confirm-dialog'
}

@component('confirm-dialog-opener')
class ConfirmDialogOpener {
  el?: HTMLElement
  @on.click
  @pub(Event.OPEN_CONFIRM_DIALOG)
  onClick() {
    return { message: this.el!.dataset.message, onConfirm: () => {} }
  }
}

export const normal = () =>
  create(`
  <div>
    <div class="confirm-dialog-provider fixed-fill-content fade-in-opacity"></div>
    <button
      class="confirm-dialog-opener"
      data-message="Confirm dialog message lorem ipsum"
    >
      open ConfirmDialog
    </button>
  </div>
`)
