var topojson = require('./../vendor/libs/topojson/topojson.min.js');
var GermanPostcodesMap = require('./exporter/files/postleitzahlen.4.7.json');
var GermanyPirelliGeo = require('./exporter/files/germany.pirelli.geo.market.json');

var postcodes = topojson.feature(GermanPostcodesMap, GermanPostcodesMap.objects.postleitzahlen).features;

//** TEST MATCH
//** loop match pirelli geo postcodes TO germany map postcodes
//** we check if every postcode we have in pirelli geo has a correspondent in postcode

//** prepare dict
var germanyPostcodeDict = {};
var nrPostcodeByPostcode = 0;
for (var i = 0; i < postcodes.length; i++) {
  var postcode = postcodes[i].properties.postcode;
  germanyPostcodeDict[postcode] = true;
}
//** check match
for (var i = 0; i < GermanyPirelliGeo.length; i++) {
  var postcode = GermanyPirelliGeo[i].zipcode;
  // if (String(postcode).length === 4) {
  //   postcode = '0' + postcode;
  // }
  if (germanyPostcodeDict[postcode]) {
    //** console.log('>>> ', postcode);
  } else  {
    nrPostcodeByPostcode++;
    //** console.log('XXX ', postcode);
  }
}
