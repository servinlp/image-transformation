import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { exec } from 'child_process'
import { renameSync, unlinkSync } from 'fs'
import path from 'path'
import cors from 'cors'

const TMP_FOLDER = 'tmp/'
const WEBP_FOLDER = 'webp'

import multer from 'multer'
const upload = multer({ dest: TMP_FOLDER })

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

interface BodyOptions {
  quality?: string // Default form-data sends as string
  lossless?: string
}

app.post('/', upload.single('file'), (req: Request, res: Response) => {
  const file: Express.Multer.File = req.file
  const body: BodyOptions = req.body
  console.log(file)
  console.log(body)
  const {
    quality = '75', // 75 is the default of cwebp
    lossless,
  } = body
  const newName = TMP_FOLDER + file.originalname
  const newWebpName = `${TMP_FOLDER}${file.filename}.webp`

  renameSync(file.path, newName)

  exec(
    [
      `${WEBP_FOLDER}/cwebp`,
      `-q ${Number(quality)} `,
      lossless === 'true' ? '-lossless ' : ' ',
      `'${newName}'`,
      `-o ${newWebpName}`,
    ].join(' '),
    (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
      }
      console.log('stdout', stdout)
      console.log('stderr', stderr)
      res.sendFile(path.resolve(newWebpName), err => {
        if (err) {
          console.log('err', err)
        }
        unlinkSync(newName)
        unlinkSync(newWebpName)
      })
    },
  )
})

app.listen(8000, () => {
  console.log('now listening on http://localhost:8000')
})
