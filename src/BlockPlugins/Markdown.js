/**
 * Inspired from https://github.com/ianstormtaylor/slate/blob/master/examples/markdown-shortcuts/index.js
 */

import React from 'react'

import AutoReplace from 'slate-auto-replace'

// Import block types
//https://github.com/GitbookIO/markup-it/blob/master/src/constants/blocks.js

/**
 * Get the block type for a series of auto-markdown shortcut `chars`.
 *
 * @param {String} chars
 * @return {String} block
 *
 */

const getBlockType = chars => {
  switch (chars) {
    case '*':
    case '-':
    case '+':
      return 'list_item'
    case '>':
      return 'blockquote'
    case '#':
      return 'header_one'
    case '##':
      return 'header_two'
    case '###':
      return 'header_three'
    case '####':
      return 'header_four'
    case '#####':
      return 'header_five'
    case '######':
      return 'header_six'
    default:
      return null
  }
}

const renderNode = props => {
  const { attributes, children, node } = props

  switch (node.type) {
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'list_item':
      return <li {...attributes}>{children}</li>
    case 'header_one':
      return <h1 {...attributes}>{children}</h1>
    case 'header_two':
      return <h2 {...attributes}>{children}</h2>
    case 'header_three':
      return <h3 {...attributes}>{children}</h3>
    case 'header_four':
      return <h4 {...attributes}>{children}</h4>
    case 'header_five':
      return <h5 {...attributes}>{children}</h5>
    case 'header_six':
      return <h6 {...attributes}>{children}</h6>
  }
}

function MarkdownPlugin(options) {
  return {
    changes: {},
    helpers: {
      getBlockType
    },
    components: {},
    plugins: [
      {
        renderNode
      },
      // '# ' to <h1>
      AutoReplace({
        trigger: 'space',
        before: /^(#)$/,
        transform: (transform, e, matches) => {
          return transform.setBlocks({ type: 'heading-one' })
        }
      }),
      // <h1> to '#'
      AutoReplace({
        trigger: 'Backspace',
        before: /(^)/,
        onlyIn: ['heading-one'],
        transform: (transform, e, matches) => {
          console.log(matches)
          return transform.setBlocks({ type: 'paragraph' }).insertText('#')
        }
      }),
      // '#1 ' to <h2>
      AutoReplace({
        trigger: 'space',
        before: /^(##)$/,
        transform: (transform, e, matches) => {
          console.log(matches)
          return transform.setBlocks({ type: 'heading-one' })
        }
      }),
      // Quote
      AutoReplace({
        trigger: 'space',
        before: /^(>)$/,
        transform: (transform, e, matches) => {
          return transform.setBlocks({ type: 'blockquote' })
        }
      }),
      // List
      AutoReplace({
        trigger: 'space',
        before: /^(\*|-)$/,
        transform: (transform, e, matches) => {
          console.log('plop')
          return transform.setBlocks({ type: 'list_item' })
        }
      }),
      AutoReplace({
        trigger: 'Backspace',
        before: /(^)/,
        onlyIn: ['list'],
        transform: (transform, e, matches) => {
          console.log(matches)
          return transform.setBlocks({ type: 'paragraph' }).insertText('*')
        }
      })
    ]
  }
}

export default MarkdownPlugin
