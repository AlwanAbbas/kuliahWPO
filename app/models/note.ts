import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public title: string

  @column()
  declare public content: string

  @column()
  declare public imagePath: string

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime
}
