import Pinpoint from '../../pinpoint.mjs'

export default class PinpointTo extends Pinpoint {

    constructor(parent) {
        super(parent)
        this.parent = parent
    }

    liveListen(cb) {
        this.parent.addEventListener('mouseup', () => {
            const selection = window.getSelection()

            if (!selection || selection.isCollapsed) return

            const text = selection.toString().trim()
            if (!text) return

            const anchorNode = selection.anchorNode
            const target = anchorNode?.parentElement

            if (!target) return

            cb({
                text,
                target,
                selection
            })
        })
    }
}