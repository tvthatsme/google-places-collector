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

### API Key

Get an API Key from Google [here](https://developers.google.com/places/web-service/) to gain permissions to the places data. Note that some of the methods exposed by this package might use quite a lot of queries in order to achieve the desired functionality. You should get 1500 free queries from Google per day but it is suggested that you verify your project (free but you need to submit a credit card for the verification) in order to get 150,000 queries per day.

You can either define a property in a separate .env file under GOOGLE_MAPS_KEY or set the variable in our environment's path.

### Sample usage

```js
const gpc = require('google-places-collector');

const getPlaces = async () => {
  const results = await gpc.getPlacesByType('Business Bay', 'restaurant');
  console.log(results);
};

getPlaces();
```

Results will be supplied by an async function with an array of place objects (in this case, a listing of all restaurants within Dubai's Business Bay area).

## Methods

### getPlacesByType

Google Maps API is great for collecting places in and around a given coordinate. However, it is difficult to get all the places of a particular type within a geographic region (think city area). The `getPlacesByType` method fixes that. Supported types can be found in Google's [Place Types documentation](https://developers.google.com/places/supported_types#table1).

Example usage:
```js
const getPlaces = async () => {
  const results = await gpc.getPlacesByType('Business Bay', 'restaurant');
  console.log(results);
};
```

### confirmPlaces

The `getPlacesByType` method does its best to collect only places that are within the place requested. However, due to the internal algorithm used, you might notice that there are few discrepancies. This can be fixed! Note: the method for ensuring that all places returned fall within the requested area consumes additional API queries and is therefore exposed as an option method.

Example usage:

```js
const getBusinessBayRestaurants = async () => {
  const areaName = 'Business Bay';
  // Get restaurants within Business Bay
  const bestGuessData = await gpc.getPlacesByType(areaName, 'restaurant');
  // Double check all the results and trim out any restaurants that are on
  // the edge of the Business Bay area but are not actually within
  const bestData = await gpc.confirmPlaces(bestGuessData, areaName);
};
```

## Contributing

This package represents methods that are useful for myself for extending the functionality of Google Maps API. If you have other needs or have ideas of improving this work, please contact me or raise an issue or pull request!

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/you-didnt-ask-for-this.svg)](https://forthebadge.com)
