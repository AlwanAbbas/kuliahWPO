import { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ view, params }: HttpContext) {
    const { userName } = params

    // Mengirimkan nama pengguna ke view
    return view.render('dashboard', { userName })
  }
}
