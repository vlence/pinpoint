import PinpointTo from "./pinpoint_to.mjs"

function main(){
    const feedbackParent = document.querySelector('.fb-app')
    console.log()
    const fb = new PinpointTo(feedbackParent)
    console.log(fb,"gbbb")
    /** @type {HTMLInputElement} */
    const feedbackModeToggle = document.querySelector('.feedback-mode-toggle input')
    /** @type {HTMLDialogElement} */
    const diag = document.getElementById('fb-dialog')
    /** @type {HTMLFormElement} */
    const form = document.getElementById('fb-form')
    /** @type {HTMLButtonElement} */
    const cancelBtn = form.querySelector('button[type=reset]')
    /** @type {HTMLButtonElement} */
    const submitBtn = form.querySelector('button[type=submit]')
    /** @type {HTMLElement} */
    const preview = form.querySelector('.preview')

    function cancelFeedback() {
        diag.close()
    }


    /**
     * @param {SubmitEvent} ev
     */
    function submitFeedback(ev) {
        ev.preventDefault()

        diag.close()

        alert('AI is ummm . . .: ' + form.feedback.value)

        form.reset()

        fb.stopListening()
    }
    if (fb.listening()) {
        fb.stopListening()
    }

    cancelBtn.addEventListener('click', cancelFeedback)
    submitBtn.addEventListener('click', submitFeedback)


    fb.liveListen(({ text, target }) => {
        preview.innerHTML = `
            <strong>Selected Text:</strong>
            <div>${text}</div>
            <hr/>
            <strong>Element:</strong>
            ${target.outerHTML}
        `

        diag.showModal()
    })
}

document.addEventListener('DOMContentLoaded', main)