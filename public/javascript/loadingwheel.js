// Loading Wheel object for showing loading

/**
 * @class
 * Loading wheel object tracker
 */
export class LoadingWheel  {
    /**
     * @constructor
     * @param {string} idString - id parameter of the element that will be created.
     *
     * @example
     * const lw = new LoadingWheel("loadwheel");
     */
    constructor(idString) {
        this.id = idString;
        this.element;
        this.running = false;

        // Build the element that holds the loading wheel
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.classList.add("loader");
        this.element.style.visibility = "hidden";

        // Add the loading wheel to it's container on the document
        document.querySelector("#loading_spot").appendChild(this.element);
    }

    /**
     * Show the loading wheel on the screen.
     * @example
     * lw.start();
     */
    start() {
        // If the loading wheel is hidden, unhide it
        if (!this.running) {
            document.querySelector(`#${this.id}`).style.visibility = "visible";
            this.running = true;
        }
    }

    /**
     * Hide the loading wheel.
     * @example
     * lw.stop();
     */
    stop()  {
        // If the loading wheel is visible, hide it
        if (this.running) {
            document.querySelector(`#${this.id}`).style.visibility = "hidden";
            this.running = false;
        }
    }
}