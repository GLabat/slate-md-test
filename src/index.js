import React from 'react'
import ReactDOM from 'react-dom'
import { Value } from 'slate'
import { Editor } from 'slate-react'

import { State } from 'markup-it'
import markdown from 'markup-it/lib/markdown'

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

import readme from '../README.md'

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

const mdParser = State.create(markdown)
const existingValue = localStorage.getItem('content') || readme
const initialValueDocument = mdParser.deserializeToDocument(existingValue)

class App extends React.Component {
  state = {
    value: Value.create({ document: initialValueDocument })
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      try {
        const content = mdParser.serializeDocument(value.document)
        localStorage.setItem('content', content)
      } catch (e) {
        console.error(e)
      }
    }

    this.setState({ value })
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <Editor
            plugins={plugins}
            value={this.state.value}
            onChange={this.onChange}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
          />
          <textarea
            onChange={e =>
              this.setState({
                value: Value.create({
                  document: mdParser.deserializeToDocument(e.target.value)
                })
              })
            }
            value={mdParser.serializeDocument(this.state.value.document)}
          />
        </div>

        <hr />
        <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
      </React.Fragment>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
