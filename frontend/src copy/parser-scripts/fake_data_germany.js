var BigData = require('./exporter/data_merge.json');
var FakeDataStructure = require('./exporter/files/fake-structure.json');
var germanyStructure = require('./exported/germany-structure.markets.json');
var GermanyPirelliGeo = require('./exporter/files/germany.pirelli.geo.market.json');
var fs = require('fs');
var d3 = require('./../vendor/libs/d3/d3.4.10.2.min.js');

var BigDataG = BigData.Germany;
var GG = FakeDataStructure.Germany;

var landRef = {
};
for (var m in GG.lands.Thüringen) {
  if (m !== 'kreise') {
    landRef[m] = GG.lands.Thüringen[m];
  }
}
var landKRef = {
  globals: {}
};

var posRef = GG.lands.Thüringen.kreise.Erfurt.postcodes[0].pos[0];
var posCarParkRef = GG.lands.Thüringen.kreise.Erfurt.postcodes[0].car_park[0];

//** get random PoS name
var arrRnPosName = [];
for (var m in BigDataG.lands) {
  for (var landk in BigDataG.lands[m].kreise) {
    var pos = BigDataG.lands[m].kreise[landk].pos;
    if (pos) {
      for (var i = 0; i < pos.length; i++) {
        var str = pos[i]['Pos Name'];
        if (str.length > 2) {
          arrRnPosName.push(str);
        }
      }
    }
  }
};

var arrRandomBrand = [
  'Porsche', 'BMW', 'RENAULT', 'Ferrari', 'Lambo'
];
var arrRandomNameplate = [
  '911', '333', '666', 'ZX120', 'LLL'
];

var arrRnChannel = [
  'Car Dealer', 'Tyre Trader'
];

createGermany();
createLandks();

/*
***********
***********
***********
***********
***********
***********
***********
*/
function createGermany() {
  var GermanyObject = {
    Germany: {
      globals: {}
    }
  };
  for (var m in FakeDataStructure.Germany) {
    if (m !== 'lands' && m !== 'zip2coords') {
      GermanyObject.Germany.globals[m] = FakeDataStructure.Germany[m];
    }
  }
  for (var m in GG.lands.Thüringen.kreise.Erfurt) {
    if (m !== 'landkreis' && m !== 'postcodes' && m !== 'focus') {
      landKRef.globals[m] = GG.lands.Thüringen.kreise.Erfurt[m];
    }
  };
  var landk = {};
  GermanyObject.Germany.lands = {};
  for (var land in germanyStructure.Germany) {
    GermanyObject.Germany.lands[land] = {};
    GermanyObject.Germany.lands[land].globals = landRef;
    GermanyObject.Germany.lands[land].landkreis = {};
    for (var landk in germanyStructure.Germany[land]) {
      GermanyObject.Germany.lands[land].landkreis[landk] = landKRef;
    }
  }

  var json = JSON.stringify(GermanyObject);
  fs.writeFile('./src/parser-scripts/exported/fake-germany-data/Germany.data.json', json);
}
/*
***************
***************
***************
***************
***************
***************
***************
*/

function createLandks() {
  for (var m in GG.lands.Thüringen.kreise.Erfurt) {
    if (m === 'postcodes' || m === 'focus') {
      //** randomize
      if (m === 'focus') {
        var focuscarpark = GG.lands.Thüringen.kreise.Erfurt.focus.car_park[0];
        landKRef.globals.focus = {
          'car_park': []
        };

        var arrParcs = [];
        var tempcarparkObj = {};
        for (var m in focuscarpark) {
          switch (m) {
          case 'Brand':
            tempcarparkObj[m] = arrRandomBrand[Math.floor(Math.random() * arrRandomBrand.length)];
            break;
          case 'NamePlate':
            tempcarparkObj[m] = arrRandomNameplate[Math.floor(Math.random() * arrRandomNameplate.length)];
            break;
          default:
            tempcarparkObj[m] = Math.floor(Math.random() * 1000);
          }
        }
        arrParcs.push(tempcarparkObj);
        landKRef.globals.focus.car_park = arrParcs;
      }
      // if ()
      landKRef.globals[m] = GG.lands.Thüringen.kreise.Erfurt[m];
    }
  };
  var carparkObj = landKRef.globals.focus.car_park[0];

  var zipcodesArr = d3.nest()
    .key((d) => {
      return d.landkreis;
    })
    .rollup((v) => {
      return v;
    })
    .entries(GermanyPirelliGeo);

  var zipcodeDictByLandk = {};
  for (var i = 0; i < zipcodesArr.length; i++) {
    var item = zipcodesArr[i];
    zipcodeDictByLandk[item.key] = item.value;
  }

  for (var land in germanyStructure.Germany) {
    for (var landk in germanyStructure.Germany[land]) {
      var landkObj = {
        focus: {
          car_park: []
        }
      };

      //** randomize Car Parc in focus
      var totRn = 2 + Math.floor(Math.random() * 10);
      var arrParcs = [];
      for (var i = 0; i < totRn; i++) {
        var tempcarparkObj = {};
        for (var m in carparkObj) {
          switch (m) {
          case 'Brand':
            tempcarparkObj[m] = arrRandomBrand[Math.floor(Math.random() * arrRandomBrand.length)];
            break;
          case 'NamePlate':
            tempcarparkObj[m] = arrRandomNameplate[Math.floor(Math.random() * arrRandomNameplate.length)];
            break;
          case 'Pirelli Sales (summer)':
            tempcarparkObj[m] = Math.floor(Math.random() * 10);
            break;
          case 'Program':
            tempcarparkObj[m] = '*';
            break;
          case 'Rim':
            tempcarparkObj[m] = Math.floor(Math.random() * 20);
            break;
          case 'Size':
            tempcarparkObj[m] = Math.floor(Math.random() * 20);
            break;
          case 'Summer Pullthrough':
            tempcarparkObj[m] = Math.floor(Math.random() * 25);
            break;
          default:
            tempcarparkObj[m] = Math.floor(Math.random() * 1000);
          }
        }
        landkObj.focus.car_park.push(tempcarparkObj);
      }
      var postcodes = [];
      //** randomize postcode and pos
      if (zipcodeDictByLandk[landk]) {
        var a = zipcodeDictByLandk[landk];
        for (var i = 0; i < a.length; i++) {
          var zipcodeObj = {};
          zipcodeObj.postcode = a[i].zipcode;
          zipcodeObj.pos = [];
          var rnTotPos = Math.floor(Math.random() * 15);
          for (var j = 0; j < rnTotPos; j++) {
            var posObj = {};
            for (var m in posRef) {
              switch (m) {
              case 'PoS Channel':
                posObj[m] = arrRnChannel[Math.floor(Math.random() * arrRnChannel.length)];
                break;
              case 'Pos Name':
                posObj[m] = arrRnPosName[Math.floor(Math.random() * arrRnPosName.length)];
                break;
              case 'Sellin':
                posObj[m] = Math.floor(Math.random() * 100);
                break;
              case 'Declared Potential':
                posObj[m] = Math.floor(Math.random() * 400);
                break;
              case 'type':
                if (Math.random() < 0.5) {
                  posObj[m] = 'active';
                } else {
                  posObj[m] = 'prospect';
                }
                break;
              case 'Direct Volumes':
                posObj[m] = Math.floor(Math.random() * 40);
              case 'trendVendite':
                var trendvendite = [];
                for (var x = 0; x < posRef[m].length; x++) {
                  var ttObj = {
                    downloads: Math.floor(Math.random() * 200),
                    timestamp: posRef[m][x].timestamp
                  };
                  trendvendite.push(ttObj);
                }
                posObj[m] = trendvendite;
              default:
                posObj[m] = posRef[m];
              }
            }
            zipcodeObj.pos.push(posObj);
          }

          zipcodeObj.car_park = [];
          var rnCarPark = Math.floor(Math.random() * 6)  + 2;
          for (var f = 0; f < rnCarPark; f++) {
            var carParkObj = {};
            for (var m in posCarParkRef) {
              switch (m) {
              case '#veichles':
                carParkObj[m] = Math.floor(Math.random() * 80);
                break;
              case 'Brand':
                carParkObj[m] = arrRandomBrand[Math.floor(Math.random() * arrRandomBrand.length)];
                break;
              case 'Gap Volumes':
                carParkObj[m] = Math.floor(Math.random() * 40);
                break;
              case 'Nameplate':
                carParkObj[m] = arrRandomNameplate[Math.floor(Math.random() * arrRandomNameplate.length)];
                break;
              case 'Pirelli Sales (summer)':
                carParkObj[m] = Math.floor(Math.random() * 10);
                break;
              case 'Program':
                carParkObj[m] = '*';
                break;
              case 'Rim':
                carParkObj[m] = Math.floor(Math.random() * 20);
                break;
              case 'Size':
                carParkObj[m] = Math.floor(Math.random() * 20);
                break;
              case 'Summer Pullthrough':
                carParkObj[m] = Math.floor(Math.random() * 25);
                break;
              }
            }
            zipcodeObj.car_park.push(carParkObj);
          }
          zipcodeObj['Gap Summer'] = Math.random() * 10000 - Math.random() * 20000;
          postcodes.push(zipcodeObj);
        }
      }

      landkObj.postcodes = postcodes;
      var json = JSON.stringify(landkObj);
      fs.writeFile('./src/parser-scripts/exported/fake-kreise-data/' + landk + '.json', json);
    }
  }
}
