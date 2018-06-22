import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from 'slate-react'

import AutoReplace from 'slate-auto-replace'
import InsertImages from 'slate-drop-or-paste-images'
import Plain from 'slate-plain-serializer'

import './styles.css'
import ImageRenderer from './ImageRenderer.jsx'

const existingValue = localStorage.getItem('content')
const initialValue = Plain.deserialize(
  existingValue || 'A string of plain text.'
)

// Define a React component renderer for our code blocks.
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

function TitleNode(props) {
  return <h1 {...props.attributes}>{props.children}</h1>
}

function QuoteNode(props) {
  return <blockquote {...props.attributes}>{props.children}</blockquote>
}

// Define a React component to render bold text with.
function BoldMark(props) {
  return <strong>{props.children}</strong>
}

function ItalicMark(props) {
  return <i>{props.children}</i>
}

function MarkHotkey(options) {
  const { type, key } = options

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, change) {
      // Check that the key pressed matches our `key` option.
      if (!event.ctrlKey || event.key !== key) return

      // Prevent the default characters from being inserted.
      event.preventDefault()

      // Toggle the mark `type`.
      change.toggleMark(type)
      return true
    }
  }
}

function ChangeBlockType({ key, type, fallbackType }) {
  return {
    onKeyDown(event, change) {
      console.log(event.key)
      if (!event.ctrlKey || event.key !== key) return
      // Determine whether any of the currently selected blocks are curren type blocks.
      const isTyped = change.value.blocks.some(block => block.type === type)

      // Prevent the "`" from being inserted by default.
      event.preventDefault()
      // Toggle the block type.
      change.setBlocks(isTyped ? fallbackType : type)
    }
  }
}

const toggleCodeBlockPlugin = ChangeBlockType({
  key: 'Dead',
  type: 'code',
  fallbackType: 'paragraph'
})

// Initialize our bold-mark-adding plugin.
const boldPlugin = MarkHotkey({
  type: 'bold',
  key: 'b'
})
const italicPlugin = MarkHotkey({
  type: 'italic',
  key: 'i'
})

const markdownPlugins = [
  // '# ' to <h1>
  AutoReplace({
    trigger: 'space',
    before: /^(#)$/,
    transform: (transform, e, matches) => {
      console.log(matches)
      return transform.setBlocks({ type: 'title' })
    }
  }),
  // <h1> to '#'
  AutoReplace({
    trigger: 'Backspace',
    before: /(^)/,
    onlyIn: ['title'],
    transform: (transform, e, matches) => {
      console.log(matches)
      return transform.setBlocks({ type: 'paragraph' }).insertText('#')
    }
  }),
  AutoReplace({
    trigger: 'space',
    before: /^(>)$/,
    transform: (transform, e, matches) => {
      return transform.setBlocks({ type: 'quote' })
    }
  })
]

// Create an array of plugins.
const plugins = [
  boldPlugin,
  italicPlugin,
  toggleCodeBlockPlugin,
  ...markdownPlugins,
  InsertImages({
    extensions: ['png'],
    insertImage: (transform, file) => {
      return transform.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      })
    }
  })
]

class App extends React.Component {
  state = {
    value: initialValue
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    if (value.document != this.state.value.document) {
      const content = Plain.serialize(value)
      localStorage.setItem('content', content)
    }

    this.setState({ value })
  }

  // Add a `renderNode` method to render a typed blocks
  renderNode = props => {
    // eslint-disable-next-line
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
      case 'title':
        return <TitleNode {...props} />
      case 'quote':
        return <QuoteNode {...props} />
      case 'image':
        return <ImageRenderer {...props} />
    }
  }

  // Add a `renderMark` method to render marks.
  renderMark = props => {
    // eslint-disable-next-line
    switch (props.mark.type) {
      case 'bold':
        return <BoldMark {...props} />
      case 'italic':
        return <ItalicMark {...props} />
    }
  }

  render() {
    return (
      <div>
        <Editor
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
        <hr />
        <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
