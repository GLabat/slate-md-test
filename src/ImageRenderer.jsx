import React from 'react'

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

export default Image
