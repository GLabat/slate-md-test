/**
 * Slate plugin to handle Markdown code block.
 */

import React from 'react'
import SoftBreak from 'slate-soft-break'

import { Hotkey, RenderNode } from '../utils'

function isCodeBlock(change) {
  return change.value.blocks.some(block => block.type === 'code')
}

function addCodeType(change) {
  change.setBlocks('code')
}

function removeCodeType(change) {
  change.setBlocks('paragraph')
}

function toggleCodeType(change) {
  isCodeBlock(change) ? removeCodeType(change) : addCodeType(change)
}

function CodeRenderer(props) {
  const style = {
    style: {
      backgroundColor: 'lightgrey'
    }
  }
  return (
    <pre {...props.attributes} {...style}>
      <code>{props.children}</code>
    </pre>
  )
}

function CodeBlockPlugin({ language = '' } = {}) {
  return {
    changes: {
      addCodeType,
      removeCodeType,
      toggleCodeType
    },
    components: {
      CodeRenderer
    },
    helpers: {
      isCodeBlock
    },
    plugins: [
      // Bind key to activate plugin
      Hotkey('ctrl+alt+c', (change, editor) => {
        toggleCodeType(change)
      }),
      // Allow soft breaks so that no extra block is created
      SoftBreak({
        onlyIn: ['code']
      }),
      // Define how to render a code block
      RenderNode('code', CodeRenderer)
    ]
  }
}

export default CodeBlockPlugin
