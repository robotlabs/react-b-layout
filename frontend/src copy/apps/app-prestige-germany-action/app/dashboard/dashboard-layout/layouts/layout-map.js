
import {layout as layoutHome} from './profile-all/layout-home.js';
import {layout as layoutLand} from './profile-all/layout-land.js';
import {layout as layoutLandkreis} from './profile-all/layout-landkreis.js';
import {layout as layoutAction} from './profile-all/layout-action.js';
import appConstants from './../../../app-utils/app-constants.js';
const layoutDict = {
  'l-home': layoutHome,
  'l-home-cd': layoutHome,
  'l-home-tt': layoutHome,
  'l-land': layoutLand,
  'l-landkreis': layoutLandkreis,
  'l-lsm-cd': layoutLandkreis,
  'l-lsm-tt': layoutLandkreis,
  'l-action': layoutAction
};

const layoutMap = {
  //** request for new url
  getLayout(match) {
    return this.urlValidate(match);
  },
  urlValidate(match) {
    let profileLayout = match.params.profileLayout;
    let drillLevel = match.params.drillLevel;
    let baseLayout = '';
    let nameLayout;
    let valid = true;
    let nameLayoutHome = baseLayout + appConstants.L_HOME;
    if (!profileLayout) {
      valid = false;
      nameLayout = nameLayoutHome;
    } else {
      if (!drillLevel) {
        if (layoutDict[baseLayout + profileLayout]) {
          nameLayout = baseLayout + profileLayout;
        } else {
          valid = false;
          nameLayout = nameLayoutHome;
        }
      } else {
        if (layoutDict[baseLayout + profileLayout + '-' + drillLevel]) {
          nameLayout = baseLayout + profileLayout + '-' + drillLevel;
        } else {
          valid = false;
          nameLayout = nameLayoutHome;
        }
      }
    }
    return {
      valid: valid,
      layout: layoutDict[nameLayout]
    };
  }
};

export default layoutMap;
