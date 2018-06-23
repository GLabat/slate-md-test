import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from 'slate-react'

import Plain from 'slate-plain-serializer'
// TODO: markdown marshaller

import './styles.css'

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin
} from './MarkPlugins/Basics'

import ImagePlugin from './BlockPlugins/Image.jsx'
import CodeBlockPlugin from './BlockPlugins/Code'
import MarkdownPlugin from './BlockPlugins/Markdown'

const existingValue = localStorage.getItem('content')
const initialValue = Plain.deserialize(
  existingValue || 'A string of plain text.'
)

/**
 *
 * * Only Slate Blocks.
 *
 * Heading-one -> heading-six => #{1-6}
 *
 * Inline code => `…`
 * Code block => ```[language]
 *  …
 * ```
 *
 * Quotes => > …
 *
 * Horizontal rule => --- or *** or ___
 *
 * Ordered list => number with space after
 * Unordered list =>  * with space after
 *
 * Links
 *
 * Image
 *
 * Table
 * Italic => *…* or _…_
 * Strikethrough => ~~…~~
 */

/**
 * For Mark, toggle the mark => easy
 * For Block, need to change block type depending on the typed chars
 * When removing a MD control char, restore default (paragraph) block type
 * and insert control char.
 *
 */

function DebugPlugin({ enabled = false } = {}) {
  if (enabled) {
    return {
      onKeyDown(event) {
        console.log(event.key)
      }
    }
  }
  return {}
}

// Create an array of plugins.
const plugins = [
  DebugPlugin({ enabled: false }),
  ...BoldPlugin().plugins,
  ...ItalicPlugin().plugins,
  ...UnderlinePlugin().plugins,
  ...StrikethroughPlugin().plugins,
  ...CodeBlockPlugin().plugins,
  ...MarkdownPlugin().plugins,
  ...ImagePlugin().plugins
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
