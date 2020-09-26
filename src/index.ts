import express from 'express'
import bodyParser from 'body-parser'
import { exec } from 'child_process'

const TMP_FOLDER = 'tmp/'
const WEBP_FOLDER = '../webp'

import multer from 'multer'
const upload = multer({ dest: TMP_FOLDER })

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('bye')
})

app.post('/', upload.single('file'), (req, res) => {
  console.log(req.body, req.file)
  res.json({ success: true })
})

app.listen(8000, () => {
  console.log('now listening on http://localhost:8000')
})
