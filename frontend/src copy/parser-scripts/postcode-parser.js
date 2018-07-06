var topojson = require('./../vendor/libs/topojson/topojson.min.js');
var GermanyPostCodes = require('./exporter/files/postleitzahlen.4.7.json');
var GermanyPirelliGeo = require('./exporter/files/germany.pirelli.geo.market.json');
var FilterPirelliGeo = require('./exporter/files/filter.pirelli-geo.maps.markets.json');
var fs = require('fs');

var postcodes = topojson.feature(GermanyPostCodes, GermanyPostCodes.objects.postleitzahlen).features;

//** revert filter
var FilterPirelligeoMapReverse = {};
for (var filter in FilterPirelliGeo) {
  FilterPirelligeoMapReverse[FilterPirelliGeo[filter]] = filter;
}

//** make dict
var germanyGeoDict = {};
for (var i = 0; i < GermanyPirelliGeo.length; i++) {
  var postcode = GermanyPirelliGeo[i].zipcode;
  if (String(postcode).length === 4) {
    postcode = '0' + postcode;
  }
  var landkreis = GermanyPirelliGeo[i].landkreis;
  germanyGeoDict[postcode] = landkreis;
}
//** add landkreiser to postcode
for (var i = 0; i < postcodes.length; i++) {
  var postcode = postcodes[i].properties.postcode;
  if (germanyGeoDict[postcode]) {
    var landkreiser = germanyGeoDict[postcode];
    if (FilterPirelligeoMapReverse[germanyGeoDict[postcode]]) {
      landkreiser = FilterPirelligeoMapReverse[germanyGeoDict[postcode]];
    }
    postcodes[i].properties.landkreiser = landkreiser;
  } else {
    postcodes[i].properties.landkreiser = 'not available';
  }

}
var postcodeContainer = {
  'postcodes': postcodes
};
var json = JSON.stringify(postcodeContainer);
fs.writeFile('./src/parser-scripts/exported/germany.postcode.map.market.json', json);
