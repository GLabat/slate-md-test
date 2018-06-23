/**
 * Inspired from https://github.com/ianstormtaylor/slate/blob/master/examples/markdown-shortcuts/index.js
 */

import React from 'react'

import AutoReplace from 'slate-auto-replace'

/**
 * Get the block type for a series of auto-markdown shortcut `chars`.
 *
 * @param {String} chars
 * @return {String} block
 */

const getBlockType = chars => {
  switch (chars) {
    case '*':
    case '-':
    case '+':
      return 'list-item'
    case '>':
      return 'block-quote'
    case '#':
      return 'heading-one'
    case '##':
      return 'heading-two'
    case '###':
      return 'heading-three'
    case '####':
      return 'heading-four'
    case '#####':
      return 'heading-five'
    case '######':
      return 'heading-six'
    default:
      return null
  }
}

const renderNode = props => {
  const { attributes, children, node } = props

  switch (node.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
  }
}

function MarkdownPlugins(options) {
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
          return transform.setBlocks({ type: 'title2' })
        }
      }),
      // Quote
      AutoReplace({
        trigger: 'space',
        before: /^(>)$/,
        transform: (transform, e, matches) => {
          return transform.setBlocks({ type: 'quote' })
        }
      }),
      // List
      AutoReplace({
        trigger: 'space',
        before: /^(\*|-)$/,
        transform: (transform, e, matches) => {
          console.log('plop')
          return transform.setBlocks({ type: 'list' })
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

export default MarkdownPlugins
