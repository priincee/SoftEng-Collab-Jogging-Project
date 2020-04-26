'use strict';

import {generateCircle, rotatePoints90Degs, multiTranslatePoint, distanceToLoc} from "./circlemath.js";
import {mapToken} from "./map.js";
import {total, startTimer, stopTimer} from "./timer.js";

export const emptyRoute = turf.featureCollection([]);

/**
 * Class to configure and manage a Jog locally.
 * @class
 */
export class Jog    {
    /**
     * Constructor for the Jog class.
     * @param {number} dist - Initial route distance
     * @param {boolean} linCirc - Linear (true) or circular (false) route
     * @param {number[]} startCoord - Start coordinates for any route
     */
    constructor(dist, linCirc, startCoord)   {
        this.distance = dist;
        this.lOrC = linCirc;
        this.startPoint = startCoord
        this.destination;

        this.route;
        this.legs;
        this.currentLeg = 0;
        this.step = 0;

        this.distanceTravelled = 0;

        this.following = false;
    }

    // LINEAR ROUTE
    /**
     * Generate a linear route from the start point to a selected end point. If there's no destination, return an empty route.
     * Makes a call to the Mapbox Directions API to get a possible route. Returns the route or displays an error message if there is an issue.
     * @returns {json} Route to be rendered on the map
     */
    async generateLinearRoute()   {
        // If the destination is undefined, return an empty route
        if (!this.destination)  {
            return emptyRoute;
        }

        // Build the query
        let req = "https://api.mapbox.com/directions/v5/mapbox/walking/";
        req += `${this.startPoint[0]}%2C${this.startPoint[1]}%3B${this.destination[0]}%2C${this.destination[1]}`;
        req += `?alternatives=true&geometries=geojson&steps=true&walkway_bias=1&access_token=${mapToken}`;

        // Make the API call. Display an error and return an empty route on failure
        let res = await fetch(req);
        if (res.status != 200)  {
            alert(`Error: ${res.status}`);
            this.setRoute(emptyRoute);
            return emptyRoute;
        }

        // Return the generated route
        res = await res.json();
        this.setRoute(res.routes[0]);
        return this.route;
    }


    // CIRCULAR ROUTE
    /**
     * Returns the length of the route closest to the desired route distance.
     * @param {number[]} distances - Distances to be compared
     * @returns {json}
     */
    getClosestDistance(distances)    {
        // Define array of deviations
        const deviations = [];

        // For each given distance, how much does it deviate from the desired distance?
        // Store result in deviations
        let deviation;
        for (let d of distances)    {
            deviation = Math.abs(this.distance - d);
            deviations.push(deviation);
        }
        // Which is the smallest deviation?
        const minDev = Math.min(...deviations);

        // Return the index of the route with the lowest deviation
        return deviations.indexOf(minDev);
    }

    /**
     * Generates 4 circles with circumference distance.
     * @returns {number[][]}
     */
    generatePossibleCircles()   {
        // Generate a base circle in an array
        const circles = [generateCircle(this.distance)];
        // Rotate it 3 times
        for (let i = 1; i < 4; i++)  {
            circles.push(rotatePoints90Degs(circles[0], i))
        }
        // Return generated circles
        return circles;
    }

    /**
     * Generates a circular route based on a given start point and a desired distance.
     * Starts by generating a set of circles with circumference distance, then matches each of those circles to the
     * start point, such that the start point is always one point on the circle. These circles are then used to generate
     * potential routes using the [Mapbox Directions API]{@link https://docs.mapbox.com/api/navigation/#directions}. This
     * produces a set of routes. The routes are then checked to see which one is closest in length to the given distance.
     * The route with the closest length is returned and the others discarded.
     * @returns {json} Route closest to the given distance
     */
    async generateCircularRoute() {
        // Get start point [lat, lon].
        // Generate possible circles with points represented as distance-bearing pairs [d, b].
        const circles = this.generatePossibleCircles(this.distance);

        // Apply the circles to start point, such that the origin is at the start point, getting new coords from the [d, b] pairs.
        const translatedCircs = [];
        for (let circle of circles) {
            translatedCircs.push(multiTranslatePoint(this.startPoint, circle));
        }

        // Generate routes for each circle.
        const routes = [];
        const distances = [];
        let req;
        let res;
        let route;
        // Note: Mapbox GL JS uses [longitude, latitude]
        for (let tCirc of translatedCircs)  {
            req = "https://api.mapbox.com/directions/v5/mapbox/walking/";
            req += `${tCirc[0][0]}%2C${tCirc[0][1]}`
            for (let point of tCirc.slice(1))    {
                req += `%3B${point[0]}%2C${point[1]}`;
            }
            req += `?alternatives=true&geometries=geojson&steps=true&walkway_bias=1&access_token=${mapToken}`;

            res = await fetch(req);
            if (res.status == 200) {
                route = await res.json();
                routes.push(route);

                // Measure length of each route generated.
                distances.push(route.routes[0].distance / 1000); // Convert from meters to km
            }
        }
        if (routes.length == 0)  {
            alert("Error: No routes returned\n" + res.status);
            this.setRoute(emptyRoute);
            return emptyRoute;
        }

        // Find route closest to target distance.
        const closestRoute = this.getClosestDistance(distances);

        // Return that route for Mapbox to render
        this.setRoute(routes[closestRoute].routes[0]);
        return this.route;
    }

    /**
     * Generate a route and render it on the given map.
     * @returns {json}
     */
    async generateRoute() {
        // Initialise route as an empty route in case of error
        let route = emptyRoute;

        // Generate a route based on the current mode
        // true = linear, false = circular
        if (!this.lOrC) {
            route = await this.generateCircularRoute();
        }
        else    {
            route = await this.generateLinearRoute();
        }
        // Return the generated route
        return route;
    }

    // JOG PROGRESSION
    /**
     * Start tracking the user's progress along the route and start the timer.
     */
    startJog()  {
        if (!this.following)    {
            this.following = true;
            startTimer();
        }
    }

    /**
     * Stop tracking the user's progress and the timer. Upload the data to the server.
     */
    endJog()    {
        if (this.following)     {
            this.following  = false;
            stopTimer();
            this.uploadData();
        }
    }

    /**
     * Upload the data from the most recent jog to the server and redirect to the index page.
     */
    async uploadData()    {
        const payload = {
            "jogid": 0,
            "uid": 0,
            "time": total,
            "distance": this.distanceTravelled
        };
        const response = await fetch('uploaddata', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
        });
        const resJson = await response.json();
        console.log(resJson);
        if (resJson == "success")    {
            window.location.href = "./menu.html";
        }
        else    {
            return "failure";
        }
    }

    // TRACK ROUTE
    /**
     * Track the user's closeness to waypoints in the journey and remove the waypoints as they approach them.
     * @param {number[]} userPos - User's current coordinates
     * @returns {json}
     */
    updateProgress() {
        // If no route to follow, return here
        if (!this.route || this.route == emptyRoute) {
            return;
        }
        // Get the distance from the user to the end of the current leg
        const toGo = distanceToLoc(this.startPoint, this.legs[this.currentLeg].steps[this.step].geometry.coordinates[0]);
        // If less than 20m to end of leg, go to next leg of route
        if (toGo < 20)  {
            // Remove passed coordinate from route
            this.distanceTravelled += this.legs[this.currentLeg].steps[this.step].distance;
            this.route.coordinates = this.route.coordinates.slice(1);
            this.step += 1;
            // If the current leg has been finished, increment leg
            if (this.step == this.legs[this.currentLeg].length) {
                this.step = 0;
                this.currentLeg += 1;
                // If all legs have been finished, stop following the route.
                if (this.currentLeg == this.legs.length)    {
                    this.endJog();
                    return emptyRoute;
                }
            }
        }
        // Return updated route
        return this.route;
    }

    // Setters
    /**
     * Change the distance to the new value.
     * @param {number} newDistance - The new distance property to be stored
     */
    setDistance(newDistance)    {
        this.distance = newDistance;
    }

    /**
     * Change the current route mode. True for linear, false for circular.
     * @param {boolean} newMode - The new mode property to be stored
     */
    setMode(newMode)    {
        this.lOrC = newMode;
    }

    /**
     * Change the start point for the route.
     * @param {number[]} newStart - The new start coordinate to be stored
     */
    setStartPoint(newStart) {
        this.startPoint = newStart;
    }

    /**
     * Change the destination to be targeted on linear route generation.
     * @param {number[]} newDestination - The new destination to be stored
     */
    setDestination(newDestination)  {
        this.destination = newDestination;
    }

    /**
     * Set the route currently stored here.
     * @param {json} newRoute
     */
    setRoute(newRoute)  {
        this.route = newRoute.geometry;
        if (this.route != emptyRoute)   {
            this.legs = newRoute.legs;
        }
    }

    // Getters
    /**
     * Get the distance value stored.
     * @returns {number}
     */
    getDistance()   {
        return this.distance;
    }

    /**
     * Get the mode value stored.
     * @returns {boolean}
     */
    getMode()       {
        return this.lOrC;
    }

    /**
     * Get the currently stored route.
     * @returns {json}
     */
    getRoute()  {
        return this.route;
    }

    /**
     * Get whether or not the route is being followed.
     * @returns {boolean}
     */
    getFollowing()  {
        return this.following;
    }
}