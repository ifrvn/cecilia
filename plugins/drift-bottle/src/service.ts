import SQLiteDriver from '@minatojs/driver-sqlite/lib/index'
import { BindParams, Statement } from '@minatojs/sql.js'
import { Context, Direction, Keys, Selection } from 'koishi'
import { DriftBottle } from '.'
import { outdent } from 'outdent'

declare module 'koishi' {
  interface Tables {
    drift_bottle: DriftBottle
  }
}

export default class BottleService {
  private readonly db = () => {
    const driver = this.ctx.database.drivers.default as SQLiteDriver
    return driver.db
  }

  constructor(private readonly ctx: Context) {}

  async getAll(
    options: {
      fields?: Array<Keys<DriftBottle, unknown>>
      orderBy?: { field: Selection.Field<DriftBottle>; order?: Direction }
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

  async update(id: number, data: Partial<Exclude<DriftBottle, 'id'>>) {
    return await this.ctx.database.set('drift_bottle', id, data)
  }

 async delete (id: number) {
    return await this.ctx.database.remove('drift_bottle', { id })
  }

  async create(data: Partial<Exclude<DriftBottle, 'id'>>) {
    return await this.ctx.database.create('drift_bottle', data)
  }

  async getOneRandomly(guildId: string): Promise<DriftBottle> {
    const tableName = 'drift_bottle'
    return await (this.exec(
      'getAsObject',
      outdent`
      SELECT * FROM ${tableName} AS t1  JOIN (
        SELECT ROUND(
          ${Math.random()} * ((SELECT MAX(id) FROM ${tableName})-(SELECT MIN(id) FROM ${tableName}))
          +(SELECT MIN(id) FROM ${tableName})
        ) AS id
      ) AS t2 WHERE (
        t1.id >= t2.id
        AND t1.bannedAt = 0
        AND (t1.isPublic = 1 OR (t1.isPublic = 0 AND guildId = :guildId))
      )
      ORDER BY t1.id LIMIT 1
      `,
      {guildId}
    ) as unknown as Promise<DriftBottle>)
  }

  private async exec<K extends 'get' | 'getAsObject' | 'run'>(
    action: K,
    sql: string,
    params: BindParams = null
  ) {
    const logger = this.ctx.logger('BottleService')
    return await new Promise<ReturnType<Statement[K]>>((resolve, reject) => {
      try {
        const stmt =  this.db().prepare(sql)
        const result = stmt[action](params) as ReturnType<Statement[K]>
        logger.debug('SQL > %c', sql)
        resolve(result)
      } catch (e) {
        logger.warn('SQL > %c', sql)
        reject(e)
      }
    })
  }
}
