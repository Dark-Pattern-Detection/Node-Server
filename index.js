const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

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
  const fileName = `${title}.html`.replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters with underscore
  fs.writeFileSync(
    path.join(__dirname, 'html', fileName),
    htmlString.data,
    'utf-8'
  )

  res.json({ success: 'true' })
})

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
