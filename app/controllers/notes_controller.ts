import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Note from '#models/note'
import { schema, rules } from '@adonisjs/validator'

export default class NotesController {
  public async index(ctx: HttpContext) {
    const notes = await Note.all()
    return ctx.view.render('dashboard', { notes })
  }

  public async store(ctx: HttpContext) {
    const request = ctx.request
    const response = ctx.response

    // Validasi input menggunakan schema
    const noteSchema = schema.create({
      title: schema.string({}, [rules.minLength(3), rules.maxLength(255)]),
      content: schema.string({}, [rules.minLength(5)]),
    })

    // Melakukan validasi terhadap data input dari form
    const payload = await request.validate({ schema: noteSchema })
    const { title, content } = payload

    // Menangani file gambar
    const image = request.file('image', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '2mb',
    })

    let imagePath = ''
    if (image) {
      // Validasi apakah file valid
      if (!image.isValid) {
        return response.badRequest('File yang diunggah tidak valid')
      }

      // Menyimpan file gambar ke folder public/uploads
      await image.move(app.publicPath('uploads'), {
        name: `${new Date().getTime()}.${image.extname}`,
        overwrite: true,
      })

      // Cek apakah file berhasil dipindahkan
      if (image.state === 'moved') {
        imagePath = `/uploads/${image.fileName}`
      } else {
        return response.badRequest('Gagal mengunggah gambar')
      }
    }

    // Membuat catatan baru di database
    await Note.create({ title, content, imagePath })

    // Kembali ke halaman sebelumnya
    return response.redirect().back()
  }
}
