import React from 'react'
import isHotkey from 'is-hotkey'

function Hotkey(hotkey, fn) {
  return {
    onKeyDown(event, change, editor) {
      if (isHotkey(hotkey, event)) {
        change.call(fn)
      }
    }
  }
}

function RenderNode(blockType, Component) {
  return {
    renderNode(props) {
      if (props.node.type === blockType) {
        return <Component {...props} />
      }
    }
  }
}

function RenderMark(markType, Component) {
  return {
    renderMark(props) {
      if (props.mark.type === markType) {
        return <Component {...props.attributes}>{props.children}</Component>
      }
    }
  }
}

export { Hotkey, RenderNode, RenderMark }
