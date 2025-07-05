/**
 * Configuration of the feedback library.
 *
 * @typedef {Object} FeedbackConfig
 * @prop {string} enabledClass The CSS class applied to the parent of the feedback targets when you start listening for feedback. Default is `'fb-mode'`.
 * @prop {string} targetClass The CSS class used by feedback targets. Default is `'fb-target'`.
 */

/**
 * Feedback is a simple library that is designed to help both your user give and for you to collect
 * useful feedback. The main purpose of this library is to help you collect error reports and issues
 * directly from your users.
 *
 * Feedback uses the concepts of a feedback parent and feedback targets. Both feedback parents and
 * feedback targets are regular HTML elements. Feedback parents are ancestors of feedback targets.
 * Feedback targets are identified by special class names. By default this library uses `'fb-target'`
 * to identify feedback targets. You can specify your own class when creating an instance of Feedback.
 *
 * Feedback instances are either listening or not listening. When listening Feedback will wait for a
 * feedback target to be clicked. When this happens your supplied callback function is called with
 * the target element. At this point you can choose to, for example, display a dialog and ask the
 * user for feedback on what they just clicked. You can take advantage of data-* attributes on
 * your feedback targets to add more context to your feedback. Once you've handled the user's
 * feedback you can stop listening for feedback.
 *
 * Feedback adds a CSS class to the feedback parent when it starts listening. By default this is `'fb-mode'`.
 * You can supply your own class when creating a Feedback instance. Using these classes you can style
 * your website to convey to the user which feedback target they're pointing at. For example when listening
 * you can style feedback targets to have an outline while being hovered.
 */
class Feedback {
        /** @type {HTMLElement} The parent of the feedback targets */
        #parent

        /** @type {string} The CSS class applied to the parent of the feedback targets when you start listening for feedback. */
        #enabledClass = 'fb-mode'

        /** @type {string} The CSS class used by feedback targets. */
        #targetClass = 'fb-target'

        /** @type {Function} This event listener is triggered in the capture phase when a feedback target is clicked. */
        #captureListener

        /** @type {{[target: Node]: Function}?} Event listeners mapped to feedback targets. The event listener is called when the click event bubbles up to the target. */
        #bubblingListeners

        /** @type {NodeList?} The list of feedback targets */
        #targets

        /** @type {boolean} True when listening for clicks on feedback targets. */
        #listening = false

        /**
         * Asserts the given condition `cond`. Assertions are checks that the program must
         * pass. If an assertion fails an error is thrown. Use assertions to check your
         * assumptions during runtime.
         *
         * @param {boolean} cond The assertion condition which must pass
         * @param {string} msg The error message if the assertion doesn't pass
         *
         * @throws {Error}
         */
        #assert(cond, msg) {
                if (!cond) throw new Error(msg)
        }

        /**
         * @param {HTMLElement} parent
         * @param {FeedbackConfig?} config
         */
        constructor(parent, config) {
                this.#assert(parent instanceof HTMLElement, 'parent is not a HTMLElement')

                if (config && config.enabledClass && typeof config.enabledClass == 'string') {
                        this.#enabledClass = config.enabledClass
                }

                this.#parent = parent
        }

        /**
         * Starts listening for feedback. When a feedback target is clicked the given
         * callback `cb` is called with the target. Call `stopListening()` once done.
         *
         * @param {Function?} cb The callback function
         */
        listen(cb) {
                /**
                 * Callback called during the capture phase of the pointer event.
                 * When the user clicks directly on a feedback target then this
                 * function will be executed.
                 *
                 * @param {PointerEvent} ev
                 */
                const captureListener = (ev) => {
                        /** @type {HTMLElement} */
                        const target = ev.target
                        const targetIsHtmlElement = target instanceof HTMLElement

                        if (!targetIsHtmlElement) return

                        const isTarget = target.classList.contains(this.#targetClass)

                        if (!isTarget) return

                        ev.stopImmediatePropagation()

                        if (typeof cb == 'function') cb(target)
                }

                this.#captureListener = captureListener
                this.#bubblingListeners = {}
                this.#targets = this.#parent.querySelectorAll('.' + this.#targetClass)

                this.#parent.addEventListener('click', captureListener, true)
                this.#targets.forEach(target => {
                        const listener = (ev) => {
                                ev.stopImmediatePropagation()

                                if (typeof cb == 'function') cb(target)
                        }

                        this.#bubblingListeners[target] = listener

                        target.addEventListener('click', listener)
                })

                this.#parent.classList.add(this.#enabledClass)

                this.#listening = true
        }

        /**
         * Stops listening for feedback.
         */
        stopListening() {
                this.#parent.removeEventListener('click', this.#captureListener, true)
                this.#targets.forEach(target => target.removeEventListener('click', this.#bubblingListeners[target]))
                this.#parent.classList.remove(this.#enabledClass)
                this.#listening = false
        }

        /**
         * Returns true if listening for clicks on feedback targets.
         *
         * @returns {boolean}
         */
        listening() {
                return this.#listening
        }

        /**
         * Returns the CSS class added to the feedback parent when we start listening for feedback.
         *
         * @returns {string}
         */
        enabledClass() {
                this.#assert(typeof this.#enabledClass == 'string', 'CSS class')
                return this.#enabledClass
        }
}
