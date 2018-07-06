//** hook an xhr, to have power to cancel a request
import xhr from './utils/xhr.js';

// contains 0 where the dongleId should be replaced
const DSAStaticEndpoints = window.DSA.endpoints;

const api = {
  endpoints: {
    level0: function() {
      return DSAStaticEndpoints.level0;
    },
    locale: function() {
      return DSAStaticEndpoints.locale;
    },
    getTopojsonLandkreis: function() {
      return DSAStaticEndpoints.getTopojsonLandkreis;
    },
    getGermanyData: function() {
      return DSAStaticEndpoints.getGermanyData;
    },
    getLandkreisData: function() {
      return DSAStaticEndpoints.getLandkreisData;
    }
  },

  fetchData(apiName, resolve, reject, token, params) {
    let fetchPromise = xhr(apiName, token, 'json', params)
      .then(resolve)
      .catch(function(e) {
        reject();
        //return Promise.reject(e);
      });

    return fetchPromise;
  }
};

export default api;
