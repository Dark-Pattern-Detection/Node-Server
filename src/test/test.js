const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const axios = require('axios')

// const getLocation = (node) => {
//   const locationParts = []

//   while (node && node.type === 'tag' && node.name !== 'html') {
//     let locationPart = node.name
//     if (node.attribs.class) {
//       locationPart += `.${node.attribs.class.split(' ').join('.')}`
//     }
//     const siblings = node.parent.children.filter(
//       (child) => child.type === 'tag' && child.name === node.name
//     )
//     if (siblings.length > 1) {
//       const index = siblings.indexOf(node) + 1
//       locationPart += `:nth-child(${index})`
//     }
//     locationParts.push(locationPart)
//     node = node.parent
//   }

//   return locationParts.reverse().join(' > ')
// }

// const getTextNodes = ($, parentNode) => {
//   const textNodes = []

//   const traverse = (node) => {
//     if (node.type === 'text' && node.data.trim() !== '') {
//       textNodes.push({
//         text: node.data.trim(),
//         location: getLocation(node.parent),
//       })
//     } else if (node.children) {
//       for (const childNode of node.children) {
//         traverse(childNode)
//       }
//     }
//   }

//   traverse(parentNode)

//   return textNodes
// }

// // const getTextNodes = ($, parentNode) => {
// //   const textNodes = []

// //   const traverse = (node) => {
// //     console.log('Node:', node)

// //     if (node.type === 'text' && node.data.trim() !== '') {
// //       textNodes.push({
// //         text: node.data.trim(),
// //         location: getLocation(node.parent),
// //       })
// //       console.log('Added text:', node.data.trim())
// //     } else if (
// //       node.type === 'tag' &&
// //       ['style', 'script', 'noscript'].includes(node.name)
// //     ) {
// //       console.log('Skipping node:', node.name)
// //       // Skip style, script, and noscript tags
// //       return
// //     } else if (
// //       node.type === 'tag' &&
// //       node.attribs &&
// //       (node.attribs.style || node.attribs.class || node.attribs.id)
// //     ) {
// //       console.log('Skipping node with attributes:', node.attribs)
// //       // Skip nodes with inline styles, classes, or IDs
// //       return
// //     } else if (node.children) {
// //       for (const childNode of node.children) {
// //         traverse(childNode)
// //       }
// //     }
// //   }

// //   traverse(parentNode)

// //   return textNodes
// // }

// const getElementByLocation = ($, location) => {
//   return $(location).text()
// }

// const getBodyTextWithLine = ($, bodyNode) => {
//   let bodyTextNodes = []
//   let lineNumber = 0

//   const traverseNodes = (node) => {
//     if (node.type === 'text') {
//       const text = node.data.trim()
//       if (text !== '') {
//         bodyTextNodes.push({
//           text,
//           lineNumber: ++lineNumber,
//         })
//       }
//     } else if (node.type === 'tag') {
//       lineNumber++
//       node.children.forEach(traverseNodes)
//     }
//   }

//   traverseNodes(bodyNode)

//   return bodyTextNodes
// }

// const addSyntheticIds = ($) => {
//   let idCounter = 0

//   const generateId = () => {
//     return `id_${++idCounter}`
//   }

//   const traverseAndAssignIds = (element) => {
//     if (
//       element.type === 'tag' &&
//       !['script', 'style', 'noscript'].includes(element.name)
//     ) {
//       $(element).attr('id', generateId())
//     }
//     element?.children?.forEach((child) => {
//       traverseAndAssignIds(child)
//     })
//   }

//   const body = $('body')[0]
//   if (body) {
//     traverseAndAssignIds(body)
//   }
// }

// const getTextsWithIds = ($) => {
//   const textObjects = []

//   const traverseAndPushText = (element) => {
//     if (
//       element.type === 'tag' &&
//       element.children.length === 1 &&
//       element.children[0].type === 'text'
//     ) {
//       const text = element.children[0].data.trim()
//       if (text !== '') {
//         const id = $(element).attr('id')
//         textObjects.push({ text, id })
//       }
//     }
//     element?.children?.forEach((child) => {
//       traverseAndPushText(child)
//     })
//   }

//   const body = $('body')[0]
//   if (body) {
//     traverseAndPushText(body)
//   }

//   return textObjects
// }

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

const test = async () => {
  const htmlFile = fs.readFileSync(
    path.join(__dirname, '..', 'html', 'Amazon.in_ Buy Lenov.html'),
    'utf-8'
  )
  const $ = cheerio.load(htmlFile)
  $('script').remove()
  $('noscript').remove()
  $('style').remove()

  const textData = getTextData($)
  // const jsonData = JSON.stringify(textData, null, 2)
  // const outputPath = path.join(__dirname, 'textData.json')
  // console.log(getElementByLocation($, `.id_940`))
  // fs.writeFileSync(outputPath, jsonData)

  // send this jsonData to python server.
  console.log(`${process.env.PYTHON_SERVER}/api/v1/predict`)
  const { data } = await axios.post(
    `${process.env.PYTHON_SERVER}/api/v1/predict`,
    {
      data: textData,
    }
  )

  return data
}

module.exports = test
