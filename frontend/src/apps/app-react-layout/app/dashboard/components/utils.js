import appConstants from './../../app-utils/app-constants.js';
const Utils = {
  parsePosByChannel(pos, selectedChannel, ap) {
    let resultNest = d3.nest()
      .key((d) => {
        return d[ap.macrotypology.key];
      })
      .entries(pos);

    let cleanNest = {};
    for (let i = 0; i < resultNest.length; i++) {
      cleanNest[resultNest[i].key] = resultNest[i];
    }
    let sc = selectedChannel;
    let tempPosSelected = [];
    //** CAR DEALER
    if (sc === 1) {
      tempPosSelected = [];
      if (cleanNest[appConstants.CAR_DEALER]) {
        tempPosSelected = cleanNest[appConstants.CAR_DEALER].values;
      }
    }
    //** TYRE TRADE
    if (sc === 2) {
      tempPosSelected = [];
      let tempPosSelected2 = [];
      if (cleanNest[appConstants.TYRE_SPECIALIST]) {
        tempPosSelected = cleanNest[appConstants.TYRE_SPECIALIST].values;
      } else if (cleanNest[appConstants.AUTO_CENTRE]) {
        tempPosSelected2 = cleanNest[appConstants.AUTO_CENTRE].values;
      }
      tempPosSelected = tempPosSelected.concat(tempPosSelected2);
    }
    //** ALL
    if (sc === 0) {
      tempPosSelected = pos;
    }
    let posList = [];
    for (let j = 0; j < tempPosSelected.length; j++) {
      posList.push(tempPosSelected[j]);
    }
    return posList;
  },

  numberWithCommas(x, marketShare) {
    if (x === 'N/A') {
      return x;
    }
    if (x && Number(x)) {
      x = Math.floor(x);
    }
    let r;
    if (x) {
      if (isNaN(x)) {
        return x;
      }
      let parts = x.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      r =  parts.join('.');
    } else {
      if (x === 0) {
        r = 0;
      } else {
        r =  '*';
      }
    }
    return r;
  },

  createScaleColor(arr) {
    let minGap = d3.min(arr);
    let maxGap = d3.max(arr);
    let scaleColor = d3.scaleLinear()
     .domain([minGap, maxGap])
     .range(['#f0d124', '#f04524']);

    return scaleColor;
  },
  createScaleColor2(arr) {
    let minGap = d3.min(arr);
    let maxGap = d3.max(arr);
    let scaleColor = d3.scaleLinear()
     .domain([minGap, maxGap])
     .range(['#155b6a', '#56de2c']);

    return scaleColor;
  }
};
export default Utils;
