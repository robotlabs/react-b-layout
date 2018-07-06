//** temp test data
import utils from './../dashboard/components/utils.js';
import filters from './../../app/data/filter.pirelli-geo.maps.markets.json';
// let ap;
export const parserGlobalData = (globalData, metadata) => {
  let mdo = metadata.o;
  let reverseFilter = {};
  for (let filter in filters) {
    reverseFilter[filters[filter]] = filter;
  }

  let dictScalesColorsLandkreis = {};
  let tempArr = [];
  let tempDictLand = {};
    //** first loop to obtain array to get scaleColors
  for (let land in globalData.Germany.lands) {
    if (land !== 'Others') {
      let landObj = globalData.Germany.lands[land];
      tempArr.push(landObj.globals[mdo.gap.key]);
      tempDictLand[land] = [];
      for (let landkreis in landObj.landkreis) {
        let landkreisObj = landObj.landkreis[landkreis];
        tempDictLand[land].push(landkreisObj.globals[mdo.gap.key]);
      }
      dictScalesColorsLandkreis[land] = utils.createScaleColor(tempDictLand[land]);
    }
  }
  let scaleColorLands = utils.createScaleColor(tempArr);

    //** loop to create dictionaries (colors, carDealers, tyreTraders)
  let landsColors = {};
  let landsColorsCarDealer = {};
  let landsColorsTyreTrade = {};
  let dictCarDealers = {};
  let dictTyreTrade = {};
  let dictLandkreis = {};
  let iterCarDealer = 0;
  let iterTyreTrader = 0;
  for (let land in globalData.Germany.lands) {
    if (land !== 'Others') {
      let landObj = globalData.Germany.lands[land];
      let c = scaleColorLands(landObj.globals[mdo.gap.key]);
      landsColors[land] = {
        color: c
      };

      for (let landkreis in landObj.landkreis) {
        let landkreisObj = landObj.landkreis[landkreis];

        dictLandkreis[landkreis] = landkreisObj;
        if (reverseFilter[landkreis]) {
          dictLandkreis[reverseFilter[landkreis]] = landkreisObj;
        }
          //** deal with car dealers and tyretrader
        let carDealer = landkreisObj.globals.car_dealer;
        let tyreTrade = landkreisObj.globals.tyre_trade;

        if (!dictCarDealers[carDealer]) {
          dictCarDealers[carDealer] = {
            iter: iterCarDealer,
            arr: [],
            list: [],
            dictLandkreis: {}
          };
          iterCarDealer++;
        }
        dictCarDealers[carDealer].dictLandkreis[landkreis] = true;
        dictCarDealers[carDealer].arr.push(landkreis);
        dictCarDealers[carDealer].list.push(landkreisObj);
        if (!dictTyreTrade[tyreTrade]) {
          dictTyreTrade[tyreTrade] = {
            iter: iterTyreTrader,
            arr: [],
            list: [],
            dictLandkreis: {}
          };
          iterTyreTrader++;
        }
        dictTyreTrade[tyreTrade].dictLandkreis[landkreis] = true;
        dictTyreTrade[tyreTrade].arr.push(landkreis);
        dictTyreTrade[tyreTrade].list.push(landkreisObj);
        landsColors[landkreis] = {
          color: dictScalesColorsLandkreis[land](landkreisObj.globals[mdo.gap.key]),
          carDealer: carDealer,
          tyreTrade: tyreTrade
        };

        if (reverseFilter[landkreis]) {
          landsColors[reverseFilter[landkreis]] = {
            color: dictScalesColorsLandkreis[land](landkreisObj.globals[mdo.gap.key]),
            carDealer: carDealer,
            tyreTrade: tyreTrade
          };
        }
      }

    }
  }

  //** CAR DEALERS PARSE
  let tempGapSummerCarDealersArr = [];
  for (let carDealer in dictCarDealers) {
    let arrLandkCardealers = dictCarDealers[carDealer].arr;
    let totalPotential = 0;
    let summerPull = 0;
    let pirelliVolumes = 0;
    let gapSummer = 0;
    let directVolumes = 0;
    let indirectVolumes = 0;
    let marketShare = 0;
    let vehicles = 0;
    let prestigeCarParc = 0;
    for (let i = 0; i < arrLandkCardealers.length; i++) {
      let landkreisGlobals = dictLandkreis[arrLandkCardealers[i]].globals;
      totalPotential += landkreisGlobals[mdo.tyre_potential.key];
      prestigeCarParc += landkreisGlobals[mdo.prestige_car_parc.key];
      summerPull += landkreisGlobals[mdo.pullthrough_potential.key];
      pirelliVolumes += landkreisGlobals[mdo.pirelli_volumes.key];
      directVolumes += landkreisGlobals[mdo.direct_volumes.key];
      indirectVolumes += landkreisGlobals[mdo.indirect_volumes.key];
      vehicles += landkreisGlobals[mdo.vehicles_count.key];
    }
    gapSummer = summerPull - (directVolumes + indirectVolumes);

    // marketShare = summerPull / pirelliVolumes;
    marketShare = pirelliVolumes / totalPotential * 100;

    if (gapSummer < 0) {
      gapSummer = 0;
    }
    if (marketShare < 0) {
      marketShare = 0;
    }
    if (marketShare > 100) {
      marketShare = 100;
    }
    tempGapSummerCarDealersArr.push(gapSummer);
    dictCarDealers[carDealer].globals = {
      [mdo.prestige_car_parc.key]: prestigeCarParc,
      [mdo.vehicles_count.key]: vehicles,
      [mdo.tyre_potential.key]: totalPotential,
      [mdo.pullthrough_potential.key]: summerPull,
      [mdo.pirelli_volumes.key]: pirelliVolumes,
      [mdo.gap.key]: gapSummer,
      [mdo.direct_volumes.key]: directVolumes,
      [mdo.indirect_volumes.key]: indirectVolumes,
      [mdo.market_share.key]: marketShare,
      land: carDealer
    };
  }
  let scaleColorCarDealers = utils.createScaleColor(tempGapSummerCarDealersArr);
    //** TYRE TRADER PARSE
  let tempGapSummerTyreTraderArr = [];
  for (let tyreTrade in dictTyreTrade) {
    let arrLandkTyreTrader = dictTyreTrade[tyreTrade].arr;
    let totalPotential = 0;
    let summerPull = 0;
    let pirelliVolumes = 0;
    let gapSummer = 0;
    let directVolumes = 0;
    let indirectVolumes = 0;
    let marketShare = 0;
    let vehicles = 0;
    let prestigeCarParc = 0;
    for (let i = 0; i < arrLandkTyreTrader.length; i++) {
      let landkreisGlobals = dictLandkreis[arrLandkTyreTrader[i]].globals;
      totalPotential += landkreisGlobals[mdo.tyre_potential.key];
      prestigeCarParc += landkreisGlobals[mdo.prestige_car_parc.key];
      summerPull += landkreisGlobals[mdo.pullthrough_potential.key];
      pirelliVolumes += landkreisGlobals[mdo.pirelli_volumes.key];
      directVolumes += landkreisGlobals[mdo.direct_volumes.key];
      indirectVolumes += landkreisGlobals[mdo.indirect_volumes.key];
      vehicles += landkreisGlobals[mdo.vehicles_count.key];
    }
    gapSummer = summerPull - (directVolumes + indirectVolumes);
    marketShare = pirelliVolumes / totalPotential * 100;

    if (gapSummer < 0) {
      gapSummer = 0;
    }
    if (marketShare < 0) {
      marketShare = 0;
    }
    if (marketShare > 100) {
      marketShare = 100;
    }
    tempGapSummerTyreTraderArr.push(gapSummer);
    dictTyreTrade[tyreTrade].globals = {
      [mdo.prestige_car_parc.key]: prestigeCarParc,
      [mdo.vehicles_count.key]: vehicles,
      [mdo.tyre_potential.key]: totalPotential,
      [mdo.pullthrough_potential.key]: summerPull,
      [mdo.pirelli_volumes.key]: pirelliVolumes,
      [mdo.gap.key]: gapSummer,
      [mdo.direct_volumes.key]: directVolumes,
      [mdo.indirect_volumes.key]: indirectVolumes,
      [mdo.market_share.key]: marketShare,
      land: tyreTrade
    };
  }
  let scaleColorTyreTrader = utils.createScaleColor(tempGapSummerTyreTraderArr);
  this.dictCarDealers = dictCarDealers;
  this.dictTyreTrade = dictTyreTrade;

  //** calculate colors for car dealer landkreis groups
  let tempDictLandCarDealer = {};
  let dictScalesColorsLandkreisCarDealers = {};
  for (let carDealer in this.dictCarDealers) {
    let carDealerObj = this.dictCarDealers[carDealer];
    tempDictLandCarDealer[carDealer] = [];
    for (let i = 0; i < carDealerObj.list.length; i++) {
      let landkreisGap = carDealerObj.list[i].globals[mdo.gap.key];
      tempDictLandCarDealer[carDealer].push(landkreisGap);
    }
    //** create scales for every landkreis (based on car dealer)
    dictScalesColorsLandkreisCarDealers[carDealer] = utils.createScaleColor(tempDictLandCarDealer[carDealer]);
  }

  //** calculate colors for Tyre trade landkreis groups
  let tempDictLandTyreTrade = {};
  let dictScalesColorsLandkreisTyreTrade = {};
  for (let tyreTrade in this.dictTyreTrade) {
    let tyreTradeObj = this.dictTyreTrade[tyreTrade];
    tempDictLandTyreTrade[tyreTrade] = [];
    for (let i = 0; i < tyreTradeObj.list.length; i++) {
      let landkreisGap = tyreTradeObj.list[i].globals[mdo.gap.key];
      tempDictLandTyreTrade[tyreTrade].push(landkreisGap);
    }
    //** create scales for every landkreis (based on tyre trade)
    dictScalesColorsLandkreisTyreTrade[tyreTrade] = utils.createScaleColor(tempDictLandTyreTrade[tyreTrade]);
  }

  //** assign color to landkreis based on car dealer
  for (let carDealer in this.dictCarDealers) {
    let carDealerObj = this.dictCarDealers[carDealer];

    for (let landkreis in carDealerObj.list) {
      let landkreisObj = carDealerObj.list[landkreis];
      let c = dictScalesColorsLandkreisCarDealers[carDealer](landkreisObj.globals[mdo.gap.key]);
      landsColorsCarDealer[landkreisObj.globals.landkreis] = {
        color: c
      };
    }
  }

  //** assign color to landkreis based on Tyre Trade
  for (let tyreTrade in this.dictTyreTrade) {
    let tyreTradeObj = this.dictTyreTrade[tyreTrade];

    for (let landkreis in tyreTradeObj.list) {
      let landkreisObj = tyreTradeObj.list[landkreis];
      let c = dictScalesColorsLandkreisTyreTrade[tyreTrade](landkreisObj.globals[mdo.gap.key]);
      landsColorsTyreTrade[landkreisObj.globals.landkreis] = {
        color: c
      };
    }
  }

  return {
    landsColors: landsColors,
    landsColorsCarDealer: landsColorsCarDealer,
    landsColorsTyreTrade: landsColorsTyreTrade,
    dictCarDealers: dictCarDealers,
    dictTyreTrade: dictTyreTrade,
    dictLandkreis: dictLandkreis,
    scaleColorCarDealers: scaleColorCarDealers,
    scaleColorTyreTrader: scaleColorTyreTrader,
    globalData: globalData
  };
};

export const parseLandkData = (data) => {
  return data;
};
