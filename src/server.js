const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const test = require('./test/test')
const dotenv = require('dotenv')
const axios = require('axios')

dotenv.config()

app.use(
  cors({
    origin: true,
  })
)
app.use(express.json({ limit: '100mb' }))
app.use(morgan('dev'))

const getTextData = ($) => {
  const textWithId = []
  let idCounter = 1
  $('div').each((index, element) => {
    const divElm = $(element)
    const text = divElm.text().trim()
    if (divElm.find('div').length === 0 && text.length > 0) {
      //it should not have any child div and text length should be greater then 0.
      textWithId.push({
        text,
        class: divElm.attr('class'),
      })
    }
    idCounter++
  })
  return textWithId
}

app.post('/', async (req, res) => {
  const { htmlString } = req.body

  const $ = cheerio.load(htmlString)
  $('script').remove()
  $('noscript').remove()
  $('style').remove()

  const textData = getTextData($)
  const {
    data: { data: patternsData },
  } = await axios.post(`${process.env.PYTHON_SERVER}/api/v1/predict`, {
    data: textData,
  })

  // const title = $('title').text()
  // let fileName = `${title}`.replace(/[<>:"/\\|?*]/g, '_').trim() // Replace invalid characters with underscore

  // if (fileName.length > 20) {
  //   fileName = fileName.substring(0, 20) // Take only the first 20 characters
  // }
  // fileName += '.html'

  // fs.writeFileSync(path.join(__dirname, 'html', fileName), $.html(), 'utf-8')
  // console.log(fileName)
  console.log(patternsData)
  res.json({ success: 'true', data: patternsData })
})

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/test', async (req, res) => {
  try {
    const data = await test()
    res.status(200).send(data)
  } catch (err) {
    // console.log(err.response.data)
    res.status(400).json({
      message: err?.response?.data?.error,
    })
  }
})
app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
