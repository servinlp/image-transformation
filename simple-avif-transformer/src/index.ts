import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { exec } from 'child_process'
import { renameSync, unlinkSync, readFileSync } from 'fs'
import path from 'path'
import cors from 'cors'

import wasm_avif from '@saschazar/wasm-avif';
import defaultOptions from '@saschazar/wasm-avif/options';

const TMP_FOLDER = 'tmp/'
const WEBP_FOLDER = 'webp'

import multer from 'multer'
const upload = multer({ dest: TMP_FOLDER })

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const buffer = readFileSync('images/images.jpeg')
console.log(buffer)


// Encoding example:
// Load raw RGB(A) pixels in Uint8Array
const array = new Uint8Array(buffer);
const width = 225;
const height = 225;
let result;
 
// Initialize the WebAssembly Module
const avifModule = wasm_avif({
 // @ts-ignore
  async onRuntimeInitialized() {
    const channels = 4; // 4 representing RGBA buffer in source array, 3 RGB
    const chroma = 3; // chroma subsampling: 1 for 4:4:4, 2 for 4:2:2, 3 for 4:2:0
    const a = await avifModule;
    console.log(a)
    // @ts-ignore
    result = a.encode(
      array,
      width,
      height,
      channels,
      defaultOptions,
      chroma
    ); // encode image data and return a new Uint8Array
    // @ts-ignore
    a.free(); // clean up memory after encoding is done
  },
});

// app.use(cors())

// interface BodyOptions {
//   quality?: string // Default form-data sends as string
//   lossless?: string
// }

// app.post('/', upload.single('file'), (req: Request, res: Response) => {
//   const file: Express.Multer.File = req.file
//   const body: BodyOptions = req.body
//   console.log(file)
//   console.log(body)
//   const {
//     quality = '75', // 75 is the default of cwebp
//     lossless,
//   } = body
//   const newName = TMP_FOLDER + file.originalname
//   const newWebpName = `${TMP_FOLDER}${file.filename}.webp`

//   renameSync(file.path, newName)

//   //   exec(
//   //     [
//   //       `${WEBP_FOLDER}/cwebp`,
//   //       `-q ${Number(quality)} `,
//   //       lossless === 'true' ? '-lossless ' : ' ',
//   //       `'${newName}'`,
//   //       `-o ${newWebpName}`,
//   //     ].join(' '),
//   //     (error, stdout, stderr) => {
//   //       if (error) {
//   //         console.log('error', error)
//   //       }
//   //       console.log('stdout', stdout)
//   //       console.log('stderr', stderr)
//   //       res.sendFile(path.resolve(newWebpName), err => {
//   //         if (err) {
//   //           console.log('err', err)
//   //         }
//   //         unlinkSync(newName)
//   //         unlinkSync(newWebpName)
//   //       })
//   //     },
//   //   )
// })

// app.listen(8000, () => {
//   console.log('now listening on http://localhost:8000')
// })
