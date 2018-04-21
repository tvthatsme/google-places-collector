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

Get an API Key from google [here](https://developers.google.com/places/web-service/) to gain permissions to the places data. Note that some of the methods exposed by this package might use quite a lot of queries in order to achieve the desired functionality. You should get 1500 free queries from Google per day but it is suggested that you verify your project (free but you need to submit a credit card for the verification) in order to get 150,000 queries per day.

You can either define a property in a seperate .env file under GOOGLE_MAPS_KEY or set the variable in our environment's path.

### Collecting your data

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
