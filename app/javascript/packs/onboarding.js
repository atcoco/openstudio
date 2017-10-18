import currentUser from 'stores/current-user'
import mount from 'onboarding/routes'

Object.assign(currentUser, window.OS.currentUser)

mount(document.body)
