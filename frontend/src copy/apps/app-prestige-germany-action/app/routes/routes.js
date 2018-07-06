import React from 'react';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

/*components*/
import App from './../app';
import AppConstants from './../app-utils/app-constants';
function routes(props) {
  let path = AppConstants.BASE_URL + ':profileLayout?/:land?/:landkreiser?/:extraInfo?';
  return (
      <Router basename="">
          <Route exact path={path} component={App}/>
      </Router>
  );
}
export default routes;
