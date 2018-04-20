# Google Places Collector

Harness the power of the Google Maps API and its [node.js libary](https://github.com/googlemaps/google-maps-services-js) to collect information for geographical locations within a city.

## The problem

The Google Maps API exposes a powerful set of queries for working with locations and places but imposes limitations both in what is available to search and how much data you can collect per query. This library is an evolving effort to build on top of the existing API to make certain queries possible and others easier.

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org/) and should be installed as one of your project's `dependencies`:

```
npm install --save google-places-collector
```

## Usage

Get an API Key from google gain permissions to places data. You can either define a property in a seperates .env file under GOOGLE_MAPS_KEY or
replace the 'YOUR_KEY_HERE' string in the index.js file.

```js
const googlePlacesCollector = require('./index');

const getPlaces = async () => {
  const results = await places.getPlacesByType('Business Bay', 'restaurant');
  console.log(results);
};

getPlaces();
```

Results will be supplied by an async function with an array of place objects (in this case, a listing of all restraunts within Dubai's Business Bay area).

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/you-didnt-ask-for-this.svg)](https://forthebadge.com)
