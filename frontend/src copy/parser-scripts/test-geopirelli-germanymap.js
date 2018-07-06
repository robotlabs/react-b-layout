// import GermanyPirelli from './exporter/files/germany.pirelli.geo.json';
var GermanyPirelli = require('./exporter/files/germany.pirelli.geo.market.json');
// var Germany = require('./exporter/files/germany.json');
var GermanyNew = require('./exporter/files/germany.new.json');
// var FilterPirelligeoMap = require('./exporter/files/filter.pirelli-geo.maps.json');
var FilterPirelligeoMapMarket = require('./exporter/files/filter.pirelli-geo.maps.markets.json');

//** revert filter
var FilterPirelligeoMapReverse = {};
for (var filter in FilterPirelligeoMapMarket) {
  FilterPirelligeoMapReverse[FilterPirelligeoMapMarket[filter]] = filter;
}
//** loop match pirelli geo TO germany map
for (var i = 0; i < GermanyPirelli.length; i++) {
  var landk = GermanyPirelli[i].landkreis;
  var notFound = true;
  for (var j = 0; j < GermanyNew.objects.counties.geometries.length; j++) {
    var landkmap = GermanyNew.objects.counties.geometries[j].properties.name;
    if (landkmap === landk) {
      notFound = false;
    }
  }
  if (notFound) {
    if (FilterPirelligeoMapReverse[landk]) {
      //** console.log('FIXED', landk);
    } else {
      //** console.log('== NF', landk);
    }
  }
}

//** loop match germany map TO pirelli geo
for (var z = 0; z < GermanyNew.objects.counties.geometries.length; z++) {
  var landk = GermanyNew.objects.counties.geometries[z].properties.name;
  var notFound = true;
  for (var y = 0; y < GermanyPirelli.length; y++) {
    var landkPirelli = GermanyPirelli[y].landkreis;
    if (landkPirelli === landk) {
      notFound = false;
    }
  }
  if (notFound) {
    if (FilterPirelligeoMapMarket[landk]) {

    } else {
      //** console.log('+++ ', landk);
    }
  }
}
