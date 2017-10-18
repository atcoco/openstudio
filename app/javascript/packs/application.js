import './application.css'

import hideFlash from 'boot/alert'
setTimeout(hideFlash, 5*1000)

import handleClose from 'boot/close'
document.body.addEventListener('click', handleClose)

import photoList from 'boot/photo-list'
const photoRoot = document.querySelector('[data-photos-url]')
if (photoRoot) {
  photoList(photoRoot)
}

// import { handleRemoteClick, handleRemoteSubmit } from 'boot/remote'
// document.body.addEventListener('click', handleRemoteClick)
// document.body.addEventListener('submit', handleRemoteSubmit)

// import handleRemoveClick from 'boot/remove'
// document.body.addEventListener('click', handleRemoveClick)

import { handleClick as handleModuleClick, handleLocation as handleModuleLocation } from 'modules'
document.body.addEventListener('click', handleModuleClick)
setTimeout(handleModuleLocation)

// import handleModalClose from 'boot/modal-close'
// import handleModalOpen from 'boot/modal-open'
// document.body.addEventListener('click', handleModalClose)
// document.body.addEventListener('click', handleModalOpen)

// Array.prototype.forEach.call(document.querySelectorAll('.js-modal.instant'), node => {
//   handleModalOpen(null, node)
// })

// if (location.hash) {
//   let node = document.querySelector(`[data-modal="${location.hash}"]`)
//   node && handleModalOpen(null, node)
// }
