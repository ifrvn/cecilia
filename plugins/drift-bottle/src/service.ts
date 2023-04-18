import SQLiteDriver from '@minatojs/driver-sqlite/lib/index'
import MySQLDriver from '@minatojs/driver-mysql/lib/index'
import { Context, Direction, Keys, $ } from 'koishi'
import { DriftBottle } from './index'
import { outdent } from 'outdent'

declare module 'koishi' {
  interface Tables {
    drift_bottle: DriftBottle
  }
}

export default class BottleService {
  constructor(private readonly ctx: Context) {}

  async count() {
    return await this.ctx.database
      .select('drift_bottle')
      .execute((row) => $.count(row.id))
  }

  async getAll(
    options: {
      fields?: Array<Keys<DriftBottle, unknown>>
      orderBy?: { field: Keys<DriftBottle>; order?: Direction }
      limit?: number
      offset?: number
    } = {
      limit: 10,
      offset: 0,
    }
  ) {
    const { fields, orderBy, limit, offset } = options
    const selection = this.ctx.database.select('drift_bottle')
    if (orderBy != null) selection.orderBy(orderBy.field, orderBy.order)
    selection.limit(limit ?? 10).offset(offset ?? 0)
    if (fields != null) selection.project(fields)
    return await selection.execute()
  }

  async get(id: number) {
    return await this.ctx.database.get('drift_bottle', id)
  }

  async find(content: string) {
    return await this.ctx.database.select('drift_bottle', { content }).execute()
  }

  async search(s: string, options: {
    limit: number
    offset: number
  } = {
    limit: 10,
    offset: 0,
  }) {
    const { limit, offset } = options
    const selection = this.ctx.database.select('drift_bottle', {
      $or: [
        { userId: { $regex: new RegExp(s) } },
        { guildId: { $regex: new RegExp(s) } },
        { content: { $regex: new RegExp(s) } }
      ]
    })
    selection.limit(limit ?? 10).offset(offset ?? 0)
    const data = await selection.execute()
    const totalLines = await selection.execute(row => $.count(row.id))
    return {
      page: Math.floor(offset / limit) + 1,
      totalLines,
      totalPages: Math.ceil(totalLines / limit),
      data
    }
  }

  async update(id: number, data: Partial<Exclude<DriftBottle, 'id'>>) {
    return await this.ctx.database.set('drift_bottle', id, data)
  }

  async delete (id: number) {
    return await this.ctx.database.remove('drift_bottle', { id })
  }

  async create(data: Partial<Exclude<DriftBottle, 'id'>>) {
    return await this.ctx.database.create('drift_bottle', data)
  }

  async getOneRandomly(guildId: string): Promise<DriftBottle | undefined> {
    if (this.checkDatabaseType() === 'mysql') {
      const SQL_MYSQL = outdent`
        SELECT * FROM drift_bottle AS t1 WHERE
        (t1.bannedAt IS NULL OR t1.bannedAt = 0)
          AND (t1.isPublic = 1 OR (t1.isPublic = 0 AND t1.guildId = "${guildId}"))
        ORDER BY RAND() LIMIT 1;`
      return this.exec_MySQL(SQL_MYSQL)
    }else{
      const SQL_SQLITE = outdent`
        SELECT * FROM drift_bottle AS t1 WHERE
          (t1.bannedAt = NULL OR t1.bannedAt = 0)
          AND (t1.isPublic = 1 OR (t1.isPublic = 0 AND t1.guildId = "${guildId}"))
        ORDER BY RANDOM() LIMIT 1;`
      return this.exec_SQLite(SQL_SQLITE)as unknown as Promise<DriftBottle>
    }
  }

  private checkDatabaseType() {
    // @ts-expect-error sqlite属性不在Driver类型声明中
    if (this.ctx.database.drivers.default.sqlite)
      return 'sqlite'
    else return 'mysql'
  }

  private dbDriver() {
    const driver = this.ctx.database.drivers.default as SQLiteDriver | MySQLDriver
    // @ts-expect-error sqlite属性不在Driver类型声明中
    if (typeof driver.sqlite !== 'undefined') {
      return (driver as SQLiteDriver)
    } else {
      return (driver as MySQLDriver)
    }
  }

  private async exec_SQLite(sql: string) {
    const logger = this.ctx.logger('BottleService')
    return await new Promise((resolve, reject) => {
      try {
        const stmt =  (this.dbDriver() as SQLiteDriver).db.prepare(sql)
        stmt.step()
        const result = stmt.getAsObject()
        logger.debug('SQL > %c', sql)
        logger.info(result)
        resolve(result)
      } catch (e) {
        logger.warn('SQL > %c', sql)
        reject(e)
      }
    })
  }

  private async exec_MySQL(sql: string) {
    const logger = this.ctx.logger('BottleService')
    try {
      const result = await (this.dbDriver() as MySQLDriver).query<DriftBottle[]>(sql)
      logger.info('SQL > %c', sql)
      logger.info(result)
      return result[0]
    } catch (e) {
      logger.warn('SQL > %c', sql)
    }
  }
}
