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

router.on('/').render('pages/home')
router.get('register', [RegisterController, 'create'])
router.post('register', [RegisterController, 'store'])
router.delete('logout', [AuthController, 'destroy'])
