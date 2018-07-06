
import {layout as layoutHome} from './layout-home.js';
const layoutDict = {
  'l-home': layoutHome
};

const layoutMap = {
  //** request for new url
  getLayout(match) {
    return this.urlValidate(match);
  },
  urlValidate(match) {
    return {
      valid: true,
      layout: layoutDict['l-home']
    };
  }
};

export default layoutMap;
