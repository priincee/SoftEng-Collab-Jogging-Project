
export const mapToken = 'pk.eyJ1Ijoic25haWxjcmVhdHVyZSIsImEiOiJjazZ4bG1mYmwwNmpkM2xwaXFqN3c3OTc4In0.t1two2u2gvRlgEfHl6nn2w';

import {Jog, emptyRoute} from "./jog.js";
import {toDecimalPoints} from "./circlemath.js";

/**
 * @class
 * Map class for handling MapBox map objects locally.
 */
export class Map    {
    /**
     * @constructor
     * @param {string} elementID - Element that holds the rendered map.
     */
    constructor(elementID)  {
        // Set the MapBox access token for the api
        mapboxgl.accessToken = mapToken;

        // Set the Mapbox client
        this.mbClient = mapboxSdk({ accessToken: mapboxgl.accessToken});

        // Create a map in the given element
        this.map = new mapboxgl.Map({
            container: elementID,
            center: [-1.0522612, 50.7980172],
            zoom: 12,
            style: 'mapbox://styles/snailcreature/ck6xhlt4w2fai1iqn0t5rqj12',
        });

        // Enable geolocation data for user device
        this.geoControl = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
        });
        this.map.addControl(this.geoControl);

        // Enable zoom and compass controls
        this.map.addControl(new mapboxgl.NavigationControl());

        // Add a scale bar to the map
        this.map.addControl(new mapboxgl.ScaleControl());

        // Initialise the jog and pos values as empty
        this.jog;
        this.pos;
    }

    /**
     * Set the data of the map's route source to the given route json.
     * @param {json} route
     */
    async renderRoute()  {
        if (this.jog) {
            // If the route is being plotted, generate and render a route
            let route;
            if (!this.jog.getFollowing()) {
                route = await this.jog.generateRoute();
            }
            // If the route is being followed, update the progress of following the route
            else    {
                route = await this.jog.updateProgress();
            }
            const routeData = turf.featureCollection([route]);
            this.map.getSource('route').setData(route);
        }
    }

    /**
     * Clears the map of all route data.
     */
    wipeMap()   {
        this.map.getSource('route').setData(emptyRoute);
    }

    /**
     * Defines what to do when the map is clicked.
     * @param {object} e - The location data of the point clicked on the map
     */
    async onClick(e)  {
        // Only run if the jog mode is linear
        if (this.getJog().getMode())    {
            // Get the longitude and latitude from the clicked point and convert to array
            const coord = this.map.unproject(e.point);
            const arrayCoord = [coord.lng, coord.lat];

            // Set the jog's destination to the clicked point
            this.getJog().setDestination(arrayCoord);
            // Wait for the route to render
            await this.renderRoute();
        }
        return 0;
    }

    // Setters
    /**
     * Set the jog object that the map is bound to
     * @param {Jog} jogObject
     */
    setJog(jogObject)   {
        this.jog = jogObject;
    }

    /**
     * Set the user's current position.
     * @param {number[]} position - Position obtained from Geolocate update
     * @returns {boolean} - True if the route needs re-rendering, false if not
     */
    setPos(position)    {
        position = [toDecimalPoints(position[0], 4), toDecimalPoints(position[1], 4)]
        if (this.pos == position)   {
            return false;
        }
        this.pos = position;
        if (this.jog)   {
            if (!this.jog.getFollowing()) {
                this.jog.setStartPoint(position);
            }
        }
        return true;
    }

    // Getters
    /**
     * Get the jog object that is bound to this map
     * @returns {Jog}
     */
    getJog()            {
        return this.jog;
    }

    /**
     * Getter method for the map stored in this object.
     * @returns {mapboxgl.Map}
     */
    getMap()    {
        return this.map;
    }

    /**
     * Get the GeolocateControl object linked to the map.
     * @returns {GeolocateControl}
     */
    getGeoControl() {
        return this.geoControl;
    }

    /**
     * Get the current stored position coordinates of the user
     * @returns {number[]}
     */
    getPos()    {
        return this.pos;
    }

    /**
     * Return the route that has been generated.
     * @returns {json}
     */
    getRoute()  {
        return this.jog.getRoute();
    }
}