main()

function main() {
        const feedbackParent = document.querySelector('.fb-app')
        const fb = new Feedback(feedbackParent)

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

                alert('Feedback submitted: ' + form.feedback.value)

                form.reset()

                fb.stopListening()
        }

        cancelBtn.addEventListener('click', cancelFeedback)
        submitBtn.addEventListener('click', submitFeedback)

        feedbackModeToggle.addEventListener('change', function () {
                if (!fb.listening()) {
                        fb.listen(function (target) {
                                preview.innerHTML = target.outerHTML
                                diag.showModal()
                        })
                }
                else {
                        fb.stopListening()
                }

                console.info(fb.listening() ? 'feedback mode enabled' : 'feedback mode disabled')
        })
}
