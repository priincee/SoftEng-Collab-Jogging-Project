/**
 * @module circlemath
 */

'use strict';
/**
 * Converts from degrees to radians
 * @param {number} degrees - Degrees value to convert
 * @returns {number} - radians
 */
export function degreesToRadians(degrees)   {
    return (degrees / 180) * Math.PI;
}

/**
 * Converts from radians to degrees
 * @param radians - Radians value to convert
 * @returns {number} - degrees
 */
export function radiansToDegrees(radians)   {
    return (radians / Math.PI) * 180;
}

/**
 * Rotate a distance-bearing pair 90 degrees around the origin a number of times.
 * @param {number[]} point - Point to rotate about the origin
 * @param {number} times - How many times to rotate
 * @returns {number[]} - New point value
 */
export function rotate90Degrees(point, times)  {
    // If there are still rotations to do, add 90 degrees to the bearing and call recursively
    if (times > 1) {
        return rotate90Degrees([point[0], point[1] + 90], times-1)
    }
    // Return the rotated point
    return [point[0], point[1] + 90];
}

/**
 * Rotate an array of distance-bearing pairs 90 degrees around the origin a number of times.
 * @param {number[][]} points - Array of points to rotate
 * @param {number} times - How many times to rotate them
 * @returns {number[][]} - New, rotated points
 */
export function rotatePoints90Degs(points, times)  {
    // Initialise an empty array of rotated points
    const newPoints = [];
    // Rotate each point a number of times and push to newPoints
    for (let point of points)   {
        newPoints.push(rotate90Degrees(point, times));
    }
    // Return the array of rotated points
    return newPoints;
}

/**
 * Get the sign of a given number.
 * @param {number} value - Value to get the sign of
 * @returns {number} - Either 1 or -1
 */
function sign(value)    {
    if (value < 0)  {
        return -1;
    }
    return 1;
}

/**
 * Takes a point coordinate and converts it to a distance and bearing from the origin.
 * @param {number[]} point - Point coordinate to convert
 * @returns {number[]} - Distance-bearing pair
 */
export function pointToDistanceBearing(point)  {
    let angle = 0;
    // Find where the point is relative to origin
    const sector = [sign(point[0]) == 1, sign(point[1]) == 1];
    if (sector[0] && !sector[1]) {
        angle = 90;
    }
    else if (!sector[0] && !sector[1])  {
        angle = 180;
    }
    else if (!sector[0] && sector[1])   {
        angle = 270;
    }
    // Normalise the coordinate to North East of origin
    point = [Math.abs(point[0]), Math.abs(point[1])];

    // Get distance from origin to point, d
    const distance = distanceToLoc([0, 0], point)//Math.sqrt(point[0]**2 + point[1]**2);
    // Get angle from origin to normalised point, angle
    if (point[0] == 0)  {
        angle += 0;
    }
    else    {
        angle += radiansToDegrees(Math.atan(point[1]/point[0]));
    }
    return [distance, angle];
}

/**
 * Holder for 45 degrees in radians.
 * @type {number}
 */
export const d = degreesToRadians(45);

/**
 * Holder for the radius of the Earth.
 * @type {number}
 */
export const R = 6378.1;

/**
 * Generates 8 points on a circle of a circumference with the first point being the
 * bottom of the circle. All angles are in degrees.
 * @param {number} circumference - Circumference of the circle
 * @returns {number[][]} Array of [x,y] coordinates
 */
export function generateCircle(circumference)   {
    // Get the radius of the circule based on the circumference
    const r = circumference/(2*Math.PI);
    // Generate 8 points on the circle
    // Each point will remain equidistance regardless of circumference
    const points = [
        [0, 0],
        [-r * Math.sin(d), r - r * Math.cos(d)],
        [-r, r],
        [-r * Math.sin(d), r + r * Math.cos(d)],
        [0, 2*r],
        [r * Math.sin(d), r + r * Math.cos(d)],
        [r, r],
        [r * Math.sin(d), r - r * Math.cos(d)]
    ];

    // Convert each point to a distance-bearing pair
    const circle = [];
    for (let point of points)   {
        circle.push(pointToDistanceBearing(point));
    }

    // Return the points on the circle
    return circle;
}

/**
 * Gets a new long-lat point from a given origin and a distance-bearing pair.
 * @param {number[]} originPoint - Original coordinate; [long, lat]
 * @param {number[]} translation - Translation to apply [distance, bearing]
 * @returns {number[]} - New coordinate; [long, lat]
 */
export function pointLatLongFromOrigin(originPoint, translation)  {
    // Unpack the distance-bearing pair
    const distance = translation[0];
    const bearing = translation[1];

    // Convert the latitude and longitude to radians
    const radOrgPt = [degreesToRadians(originPoint[0]), degreesToRadians(originPoint[1])];

    // Get the new latitude and longitude based on the distance-bearing pair using trigonometry
    let lon = Math.asin(Math.sin(radOrgPt[0]) * Math.cos(distance/R) + Math.cos(radOrgPt[0]) * Math.sin(distance/R) * Math.cos(bearing));
    let lat = radOrgPt[1] + Math.atan2(Math.sin(bearing) * Math.sin(distance/R) * Math.cos(radOrgPt[0]), Math.cos(distance/R) - Math.sin(radOrgPt[0]) * Math.sin(lon));

    // Convert the new coordinates back to degrees
    lon = radiansToDegrees(lon);
    lat = radiansToDegrees(lat);

    // Return the new coordinate
    return [lon, lat];
}

/**
 * Applies the function pointLatLongFromOrigin to an origin multiple times.
 * @param {number[]} originPoint - The original point to translate; [long, lat]
 * @param {number[][]} translations - Array of translations to apply to it; [[distance, bearing]]
 * @returns {number[][]} - Translated points
 */
export function multiTranslatePoint(originPoint, translations)  {
    // Create an empty array to hold the translated points
    const newPoints = [];
    // Apply each translation and store the result in newPoints
    for (let dbPair of translations)    {
        newPoints.push(pointLatLongFromOrigin(originPoint, dbPair));
    }
    // Return the translated points
    return newPoints;
}

/**
 * Round a given number to a given number of decimal points.
 * @param {number} num - Decimal number
 * @param {number} dps - Integer number of decimal points to have left over
 * @returns {number} - Rounded num
 */
export function toDecimalPoints(num, dps)   {
    num = num * (10**dps);
    num = Math.round(num);
    num = num / (10**dps);
    return num;
}

/**
 * Get the trigonometric distance between two points. (Inaccurate over long distances on a map).
 * @param {number[]} current - Current coordinate [long, lat]
 * @param {number[]} destination - Destination coordinate [long, lat]
 * @returns {number} - Distance in km
 */
export function distanceToLoc(current, destination) {
    return Math.sqrt((destination[0] - current[0])**2 + (destination[1] - current[1])**2);
}