require('dotenv').config();

const uniqBy = require('lodash/uniqBy');
const has = require('lodash/has');
const isPointInPolygon = require('point-in-polygon');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_KEY || 'YOUR_KEY_HERE',
  Promise: Promise
});
const DEFAULT_LANGUAGE = 'en';

/**
 * Determine if a place is located within a geographic location
 *
 * @param {Object} place latitude and longitude of place
 * @param {Object} area southwest and northeast bounds of area
 */
const isPlaceInArea = (place, area) => {
  // Create a marker for the place's location
  const placePnt = [place.lat, place.lng];
  // Create a polygon using the area's southwest and northeast bounds
  const areaPolygon = [
    [area.southwest.lat, area.southwest.lng],
    [area.northeast.lat, area.southwest.lng],
    [area.northeast.lat, area.northeast.lng],
    [area.southwest.lat, area.northeast.lng]
  ];

  return isPointInPolygon(placePnt, areaPolygon);
};

/**
 * Determine if a place has enough reviews on Google to prove that it
 * is a legitimate place. Having a rating should help to filter
 * out the ghost shops or places that haven't opened yet.
 *
 * @param {Object} place Place of interest than needs to be validated
 */
const hasEnoughReviews = place => {
  // For now having any kind of rating is enough to show that this might
  // be a valid place. However, this might need to change in the future
  // to be a bit more strict.
  return has(place, 'rating');
};

/**
 * Provided a location, get all the places nearby
 *
 * @param {*} location
 * @param {*} radius
 * @param {*} type
 * @returns {Promise}
 */
const getAllNearbyPlaces = (location, type = '*') => {
  // TODO: there might be some reasons for making radius more dynamic in the
  // future
  let params = {
    language: DEFAULT_LANGUAGE,
    location,
    radius: 1000
  };

  if (type !== '*') {
    params['type'] = type;
  }

  return googleMapsClient.placesNearby(params).asPromise();
};

/**
 * Get an array of places matching a certain type within an area
 *
 * @param {String} locationName name of the area to search in
 * @param {String} locationPoints type of place to search for
 */
const getPlacesByType = async function(locationName, locationPoints) {
  const params = {
    address: locationName,
    language: DEFAULT_LANGUAGE
  };
  const areaGeocode = await googleMapsClient.geocode(params).asPromise();
  const areaCoords = areaGeocode.json.results[0].geometry.bounds;
  const increments = 5;
  const latIncrement =
    Math.abs(areaCoords.northeast.lat - areaCoords.southwest.lat) / increments;
  const lngIncrement =
    Math.abs(areaCoords.northeast.lng - areaCoords.southwest.lng) / increments;

  let pointsInArea = [];

  // Create a 'battleship'-like grid covering the area
  // * * * * * X
  // * * * * * *
  // * * * * * *
  // * * * * * *
  // * * * * * *
  // X * * * * *
  for (let i = 0; i <= increments; i++) {
    for (let j = 0; j <= increments; j++) {
      pointsInArea.push({
        lat: (areaCoords.southwest.lat + latIncrement * j).toFixed(7),
        lng: (areaCoords.southwest.lng + lngIncrement * i).toFixed(7)
      });
    }
  }

  const results = await Promise.all(
    pointsInArea.map(async point => {
      const result = await getAllNearbyPlaces(point, locationPoints);
      return result.json.results;
    })
  );

  // flatten and filter
  const places = results
    .reduce((a, b) => a.concat(b), [])
    .filter(place => isPlaceInArea(place.geometry.location, areaCoords))
    .filter(place => hasEnoughReviews(place));

  // return all the unique places
  return uniqBy(places, place => place.id);
};

module.exports.getPlacesByType = getPlacesByType;
