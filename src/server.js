const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const test = require('./test/test')

app.use(
  cors({
    origin: true,
  })
)
app.use(express.json({ limit: '100mb' }))
app.use(morgan('dev'))

app.post('/', async (req, res) => {
  const htmlString = req.body // Assuming the HTML string is in the request body
  const $ = cheerio.load(htmlString.data)
  const title = $('title').text()
  let fileName = `${title}`.replace(/[<>:"/\\|?*]/g, '_').trim() // Replace invalid characters with underscore

  if (fileName.length > 20) {
    fileName = fileName.substring(0, 20) // Take only the first 20 characters
  }
  fileName += '.html'

  fs.writeFileSync(path.join(__dirname, 'html', fileName), $.html(), 'utf-8')
  console.log(fileName)
  res.json({ success: 'true' })
})

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/test', (req, res) => {
  test()
  res.send('test success')
})
app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
