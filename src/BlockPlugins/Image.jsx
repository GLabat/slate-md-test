import React from 'react'

import InsertImages from 'slate-drop-or-paste-images'
import { RenderNode } from '../utils'

/**
 * Image node renderer.
 *
 * @type {Component}
 */

class Image extends React.Component {
  state = {}

  componentDidMount() {
    const { node } = this.props
    const { data } = node
    const file = data.get('file')
    this.load(file)
  }

  load(file) {
    const reader = new FileReader()
    reader.addEventListener('load', () => this.setState({ src: reader.result }))
    reader.readAsDataURL(file) // base64
  }

  render() {
    const { attributes } = this.props
    const { src } = this.state
    return src ? <img {...attributes} src={src} /> : <span>Loading...</span>
  }
}

function ImagePlugin(options) {
  return {
    components: Image,
    plugins: [
      InsertImages({
        extensions: ['png'],
        insertImage: (transform, file) => {
          return transform.insertBlock({
            type: 'image',
            isVoid: true,
            data: { file }
          })
        }
      }),
      RenderNode('image', Image)
    ]
  }
}

export default ImagePlugin
