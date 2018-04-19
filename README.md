# Google Places Collector

Harness the power of the Google Maps API and its [node.js libary](https://github.com/googlemaps/google-maps-services-js) to collect information for geographical locations within a city.

## Installation

This module is distributed via [npm][npm] and should be installed as one of your project's `dependencies`:

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
