import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'

import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
const fsPromises = require('fs').promises
import path from 'path'

export const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logName),
      logItem,
    )
  } catch (err) {
    console.log(err)
  }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(
    `${req.method}\t${req.statusCode}\t${req.headers.origin}\t${req.url}`,
    'reqLog.txt',
  )
  next()
}
