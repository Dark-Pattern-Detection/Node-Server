module.exports.getTextNodes = (rootNode) => {
  const textNodes = []

  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
      textNodes.push(node)
    } else {
      for (const childNode of node.childNodes) {
        traverse(childNode)
      }
    }
  }

  traverse(rootNode)

  return textNodes
}

module.exports.getLocation = (node) => {
  const locationParts = []

  while (node && node.type === 'tag' && node.name !== 'html') {
    let locationPart = node.name
    if (node.attribs.class) {
      locationPart += `.${node.attribs.class.split(' ').join('.')}`
    }
    const siblings = node.parent.children.filter(
      (child) => child.type === 'tag' && child.name === node.name
    )
    if (siblings.length > 1) {
      const index = siblings.indexOf(node) + 1
      locationPart += `:nth-child(${index})`
    }
    locationParts.push(locationPart)
    node = node.parent
  }

  return locationParts.reverse().join(' > ')
}

module.exports.getElementByLocation = ($, location) => {
  const selector = location
    .split(' ')
    .map((part) => {
      const [tagName, ...classNames] = part.split('.')
      return `${tagName}${
        classNames.length > 0 ? '.' + classNames.join('.') : ''
      }`
    })
    .join(' ')

  return $(selector)
}

// const container = document.querySelector('.container')
// const textNodes = getTextNodes(container)
// const textData = getLocation(textNodes)

// console.log(textData)
