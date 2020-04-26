/**
 * @module index
 */
import {Map} from './map.js';
import {Jog} from './jog.js';
import {LoadingWheel} from './loadingwheel.js';

import './circlemath.js';

export let map = new Map('map');
export const lw = new LoadingWheel("loader");
export const distSelectors = ["#km1", "#km5", "#km10", "#km15"];
export const modeSelectors = ["#circular", "#linear"];

/**
 * Update the map when a distance option is changed in the options section.
 */
export async function onDistClick()  {
    // Get the current distance
    const currentDist = map.getJog().getDistance();
    let selectedDist = currentDist;
    let radioButton;
    // Check which radio button is checked and use it's value
    for (let selector of distSelectors)  {
        radioButton = document.querySelector(selector);
        if (radioButton.checked && radioButton.value != currentDist)    {
            selectedDist = radioButton.value;
            break;
        }
    }
    // End process here if there was no change
    if (selectedDist == currentDist)    {
        return;
    }
    // Change the distance of the jog
    map.getJog().setDistance(selectedDist);
    lw.start();
    // Re-render the route
    await map.renderRoute();
    lw.stop();
    return 0;
}

/**
 * Update the current mode of the jog. Linear route = true, Circular = false.
 */
export async function onModeClick()  {
    // Get the current jog mode and initialise holder variables
    const currentMode = map.getJog().getMode();
    let selectedMode = currentMode;
    let radioButton;
    // Check each of the radio buttons to see which is checked
    for (let selector of modeSelectors) {
        radioButton = document.querySelector(selector);
        // If the button is checked, set the selected mode to it's value
        if (radioButton.checked)    {
            selectedMode = radioButton.value;
            break;
        }
    }
    // If the mode hasn't changed, stop here
    if (selectedMode == currentMode)    {
        return;
    }
    // Convert selectedMode from string (HTML) to a boolean
    selectedMode = selectedMode == true;
    // Set the mode of the jog
    map.getJog().setMode(selectedMode);
    // Change which controls/instructions are visible annd hidden
    const distanceSection = document.querySelector("#dist_select");
    const destinatSection = document.querySelector("#dest_select");
    if (selectedMode)   {
        distanceSection.style.visibility = "hidden";
        destinatSection.style.visibility = "visible";
        map.wipeMap();
    }
    else    {
        distanceSection.style.visibility = "visible";
        destinatSection.style.visibility = "hidden";
    }
    // Re-render the map
    lw.start();
    await map.renderRoute();
    lw.stop();
    return 0;
}

/**
 * Clear the options box and replace with the timer.
 */
export function startFollowing()   {
    // Start tracking and the timer
    map.getJog().startJog();
    // Remove the jog configuration options
    const opts = document.querySelector("#options");
    opts.remove();
    // Add the timer
    const timer_box = document.createElement('h1');
    timer_box.id = "timer_box";
    timer_box.textContent = "0:0:0:000";
    document.querySelector("#top_box").insertBefore(timer_box, document.querySelector("#loading_spot"));
    // Change the start button to a stop button
    const button = document.querySelector("#startStop")
    button.onclick = stopFollowing;
    button.textContent = "Stop"
    return 0;
}

/**
 * Finish the jog and return to the home screen.
 */
export async function stopFollowing()    {
    // End the jog
    const ended = await map.getJog().endJog();
    // If there was an issue, say so
    if (ended != "success") {
        console.log("help!")
    }
    return 0;
}

/**
 * Function to run on page load.
 * Sets the onclick properties of the option pane and hides the destination selection prompt.
 */
function pageLoaded()   {
    document.querySelector("#dist_select").onclick = onDistClick;
    document.querySelector("#mode_select").onclick = onModeClick;
    document.querySelector("#dest_select").style.visibility = "hidden";
    document.querySelector("#startStop").onclick = startFollowing;
}

/**
 * Function to run when the map loads
 */
export async function mapLoaded()  {
    // Start the loading wheel
    lw.start();

    // Set what happens when the map is clicked
    map.getMap().on('click', async function(e)    {
        lw.start();
        await map.onClick(e);
        lw.stop();
    });

    // Add the route source for routes to be rendered with
    // Start with an empty route
    map.getMap().addSource('route', {
        type: 'geojson',
        data: turf.featureCollection([])
    });

    // Add a layer to render the route on
    map.getMap().addLayer({
        id: 'route_line',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#3887be',
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 3,
                22, 12
            ]
        }
    }, 'waterway-label');

    // Add a layer to show directionality on the map
    map.getMap().addLayer({
        id: 'route_arrows',
        type: 'symbol',
        source: 'route',
        layout: {
            'symbol-placement': 'line',
            'text-field': '▶',
            'text-size': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 24,
                22, 60
            ],
            'symbol-spacing': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 30,
                22, 160
            ],
            'text-keep-upright': false
        },
        paint: {
            'text-color': '#3887be',
            'text-halo-color': 'hsl(55, 11%, 96%)',
            'text-halo-width': 3
        }
    }, 'waterway-label');

    // Get user's current position and set geolocation loop
    await map.getGeoControl().on('geolocate', async function(e) {
        const position = [e.coords.longitude, e.coords.latitude];
        const newPos = map.setPos(position);
        if (newPos) {
            lw.start();
            await map.renderRoute();
            lw.stop();
        }
    });
    await map.getGeoControl().trigger();

    // Set the jog object bound to the map
    map.setJog(new Jog(5, false, map.getPos()));
    return 0;
}

// What happens when the page loads
window.addEventListener('load', pageLoaded);

// What happens when the map loads
map.getMap().on('load', mapLoaded);
