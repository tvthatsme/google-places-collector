'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();

const uniqBy = require('lodash/uniqBy');
const has = require('lodash/has');
const isPointInPolygon = require('point-in-polygon');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_KEY || 'YOUR_KEY_HERE',
  Promise: Promise
});
const DEFAULT_LANGUAGE = 'en';

const isPlaceInArea = (place, area) => {
  const placePnt = [place.lat, place.lng];

  const areaPolygon = [[area.southwest.lat, area.southwest.lng], [area.northeast.lat, area.southwest.lng], [area.northeast.lat, area.northeast.lng], [area.southwest.lat, area.northeast.lng]];

  return isPointInPolygon(placePnt, areaPolygon);
};

const hasEnoughReviews = place => {
  return has(place, 'rating');
};

const getAllNearbyPlaces = (location, type = '*') => {
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

const getPlacesByType = (() => {
  var _ref = _asyncToGenerator(function* (locationName, locationPoints) {
    const params = {
      address: locationName,
      language: DEFAULT_LANGUAGE
    };
    const areaGeocode = yield googleMapsClient.geocode(params).asPromise();
    const areaCoords = areaGeocode.json.results[0].geometry.bounds;
    const increments = 5;
    const latIncrement = Math.abs(areaCoords.northeast.lat - areaCoords.southwest.lat) / increments;
    const lngIncrement = Math.abs(areaCoords.northeast.lng - areaCoords.southwest.lng) / increments;

    let pointsInArea = [];

    for (let i = 0; i <= increments; i++) {
      for (let j = 0; j <= increments; j++) {
        pointsInArea.push({
          lat: (areaCoords.southwest.lat + latIncrement * j).toFixed(7),
          lng: (areaCoords.southwest.lng + lngIncrement * i).toFixed(7)
        });
      }
    }

    const results = yield Promise.all(pointsInArea.map((() => {
      var _ref2 = _asyncToGenerator(function* (point) {
        const result = yield getAllNearbyPlaces(point, locationPoints);
        return result.json.results;
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })()));

    const places = results.reduce(function (a, b) {
      return a.concat(b);
    }, []).filter(function (place) {
      return isPlaceInArea(place.geometry.location, areaCoords);
    }).filter(function (place) {
      return hasEnoughReviews(place);
    });

    return uniqBy(places, function (place) {
      return place.id;
    });
  });

  return function getPlacesByType(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

module.exports.getPlacesByType = getPlacesByType;