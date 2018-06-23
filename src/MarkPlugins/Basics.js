/**
 * Slate plugins to handle Markdown formatting of characters.
 * Only Slate Marks.
 *
 * Bold => **…**
 * Italic => *…* or _…_
 * Underline => ___…___
 * Strikethrough => ~~…~~
 *
 */

import React from 'react'

import { Hotkey, RenderMark } from '../utils'

/**
 * Create a Mark toggler plugin bound to a key shortcut
 */
function MakeMarkPlugin(options) {
  const { type, key, Renderer } = options
  const typeLabel = type.substring(0, 1).toUpperCase() + type.slice(1)
  const toggleType = change => change.toggleMark(type)

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    // Expose changes and components to the outside world with a small renaming
    changes: {
      [`toggle${typeLabel}`]: toggleType
    },
    components: {
      [`${typeLabel}Renderer`]: Renderer
    },
    plugins: [Hotkey(key, toggleType), RenderMark(type, Renderer)]
  }
}

const BoldPlugin = () =>
  MakeMarkPlugin({
    type: 'bold',
    key: 'mod+b',
    Renderer: props => <strong {...props.attributes}>{props.children}</strong>
  })

const ItalicPlugin = () =>
  MakeMarkPlugin({
    type: 'italic',
    key: 'mod+i',
    Renderer: props => <em {...props.attributes}>{props.children}</em>
  })

const UnderlinePlugin = () =>
  MakeMarkPlugin({
    type: 'underline',
    key: 'mod+u',
    Renderer: props => <u {...props.attributes}>{props.children}</u>
  })

const StrikethroughPlugin = () =>
  MakeMarkPlugin({
    type: 'strikethrough',
    key: 'ctrl+=',
    Renderer: props => <del {...props.attributes}>{props.children}</del>
  })

export { BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin }
