import { component, innerHTML, on, sub, is, wired, emits } from 'capsid'
import { css } from 'emotion'
import { Artwork } from '../domain/models'
import { drawArtwork } from '../adapters/canvas'
import { sendMessage } from 'lepont/browser'
import { PermissionsAndroid } from '@lepont/permissions-android'
import { getOS } from '@lepont/platform'
import { share } from '@lepont/share'

@component('edit-dialog')
@sub('open-edit-modal')
@innerHTML(`
  <canvas class="edit-canvas" width="50" height="50"></canvas>
  <div class="edit-controls">
    <button class="delete-btn">DELETE</button>
    <button class="share-btn">SHARE</button>
    <button class="download-btn">DOWNLOAD</button>
    <button class="cancel-btn">CANCEL</button>
  </div>
`)
@is(css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
`)
export class EditModal {
  el?: Element

  @wired('canvas')
  canvas?: HTMLCanvasElement

  artwork?: Artwork

  @on('open-edit-modal')
  open({ detail: artwork }: { detail: Artwork }) {
    const canvas = this.canvas!
    const { width, height } = canvas
    const ctx = canvas.getContext('2d')!
    this.artwork = artwork

    drawArtwork(ctx, artwork, width, height)
    this.el!.classList.add('show')
  }

  @on.click.at('.cancel-btn')
  @on('hide-edit-modal')
  hide() {
    this.el!.classList.remove('show')
  }

  @on.click.at('.delete-btn')
  delete() {
    alert('not impletemented!')
  }

  @on.click.at('.share-btn')
  async share() {
    const base64Content = this.canvas!.toDataURL()
    try {
      const os = await getOS()
      if (os === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Tententen Storage Permission',
            message:
              'Tententen needs access to your storage ' +
              'so you can save awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        )
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          alert('permission denied')
          return
        }
      }
      share({
        message: `${this.artwork?.text.body} #tententenapp`,
        urls: [base64Content]
      })
    } catch (e) {
      alert(e)
      alert(e.stack)
    }
  }

  @on.click.at('.download-btn')
  @emits('hide-edit-modal')
  async download() {
    const base64Content = this.canvas!.toDataURL().substr(22)
    try {
      const os = await getOS()
      if (os === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Tententen Storage Permission',
            message:
              'Tententen needs access to your storage ' +
              'so you can save awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        )
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          alert('permission denied')
          return
        }
      }
      const savedPath = await sendMessage({
        type: 'write-tmp-image',
        payload: {
          content: base64Content,
          filename: 'tmp.png',
          encode: 'base64'
        }
      })
      await sendMessage({
        type: 'cameraroll:save',
        payload: { tag: savedPath, type: 'photo', album: 'Tententen' }
      })
      alert('Saved the picture to the album')
    } catch (e) {
      alert(e)
      alert(e.stack)
    }
  }
}