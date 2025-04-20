/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AuthController from '#controllers/auth_controller'
import RegisterController from '#controllers/register_controller'

import router from '@adonisjs/core/services/router'
import User from '#models/user'
import crypto from 'node:crypto'

router.on('/').render('pages/home')

// Auth & Register routes
router.get('register', [RegisterController, 'create'])
router.post('register', [RegisterController, 'store'])
router.get('login', [AuthController, 'create'])
router.post('login', [AuthController, 'store'])
router.delete('logout', [AuthController, 'destroy'])

// Social login
router.get('/auth/:provider', async ({ ally, params }) => {
  return ally.use(params.provider).redirect()
})

router.get('/auth/:provider/callback', async ({ ally, params, auth, response }) => {
  const provider = ally.use(params.provider)

  if (provider.accessDenied()) {
    return 'Access was denied'
  }

  const user = await provider.user()

  const existingUser = await User.findBy('email', user.email)
  let finalUser = existingUser

  if (!existingUser) {
    finalUser = await User.create({
      email: user.email,
      username: user.nickname || user.name || user.email.split('@')[0],
      fullName: user.name,
      password: crypto.randomUUID(),
    })
  }

  await auth.use('web').login(finalUser!)
  return response.redirect('/dashboard')
})

router
  .get('/dashboard', async ({ view, auth }) => {
    const userName = auth.user?.fullName
    return view.render('dashboard', { userName })
  })
  .as('dashboard')
