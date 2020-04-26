// Timer
/**
 * @module timer
 */

// DEFINITIONS
export let total = 0;
let ms = 0;
let secs = 0;
let mins = 0;
let hrs = 0;

export let current;

/**
 * Start the timer.
 */
export function startTimer()   {
    // Trigger the timer on a set interval
    current = setTimeout(update, 1000);
}

/**
 * Stop the timer.
 */
export function stopTimer()    {
    // Stop triggering the update function
    clearTimeout(current);
}

/**
 * Update the timer. Increment the timer by the number of milliseconds
 * passed. Increment other trackers if needed.
 */
function update()    {
    // 1 second has passed
    total += 1000;
    // Increase ms
    ms += 1000;
    if (ms >= 1000) {
        // Reset ms and increment secs
        ms = 0;
        secs++;
        if (secs >= 60)    {
            // Reset secs and increment mins
            secs = 0;
            mins++;
            if (mins >= 60)    {
                // Reset mins and increment hrs
                mins = 0;
                hrs++;
            }
        }
    }
    // Update the timer on the screen
    document.querySelector("#timer_box").textContent = `${hrs}:${mins}:${secs}:${ms}`;
    // Rerun the time function so that it calls again in another second
    startTimer();
}