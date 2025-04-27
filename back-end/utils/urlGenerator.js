import DataUriParser from 'datauri/parser'
import path from 'path'

const getDataUrl = (file) => {
  const parser = new DataUriParser()
  const extName = path.extname(file.originalname).toString()
  return parser.format(extName, file.buffer).content
}

export default getDataUrl
