var GermanyPirelliGeo = require('./exporter/files/germany.pirelli.geo.market.json');
var d3 = require('./../vendor/libs/d3/d3.4.10.2.min.js');
var fs = require('fs');

var germanyArr = d3.nest()
  .key((d) => {
    return d.land;
  })
  .rollup((v) => {
    return v;
  })
  .entries(GermanyPirelliGeo);

var germanyDict = {
  Germany: {}
};
for (var i = 0; i < germanyArr.length; i++) {
  var germanyObj = germanyArr[i];
  germanyDict.Germany[germanyObj.key] = {};
  for (var j = 0; j < germanyObj.value.length; j++) {
    germanyDict.Germany[germanyObj.key][germanyObj.value[j].landkreis] = {};
  }
}

var landkreisArr = d3.nest()
  .key((d) => {
    return d.landkreis;
  })
  .rollup((v) => {
    return v;
  })
  .entries(GermanyPirelliGeo);

landkreisDict = {};
for (var i = 0; i < landkreisArr.length; i++) {
 	var landkreisObj = landkreisArr[i];
 	var arrPostcodes = [];
 	for (var x = 0; x < landkreisObj.value.length; x++) {
 		arrPostcodes.push(landkreisObj.value[x].zipcode);
 	}
 	landkreisDict[landkreisObj.key] = arrPostcodes;
}

for (var land in germanyDict.Germany) {
 	var landObj = germanyDict.Germany[land];
 	for (var landk in landObj) {
 		germanyDict.Germany[land][landk] = landkreisDict[landk];
 	}
}

var json = JSON.stringify(germanyDict);
fs.writeFile('./src/parser-scripts/exported/germany-structure.markets.json', json);
