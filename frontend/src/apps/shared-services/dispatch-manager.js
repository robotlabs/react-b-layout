/* HOW TO USE
this.testToken = dispatchManager.addListener('testEvent', tt);
function tt(r) {
}

setTimeout(() => {
  dispatchManager.removeListener(this.testToken);
}, 9000);

setTimeout(() => {
  dispatchManager.dispatch('testEvent', [10, 33, 'xxx']);
}, 3000);
*/

const {EventEmitter} = require('fbemitter');
const dispatchManager = {
  flags: {
    REQUEST_LAYOUT_UPDATE: 'request-layout-update',
    LAYOUT_UPDATED: 'layout-updated'
  },
  listeners: {},
  eventEmitter: new EventEmitter,
  addListener(eventName, listener) {
    return this.eventEmitter.addListener(eventName, (p) => {
      listener(p);
    });
  },
  removeListener(eventToken) {
    eventToken.remove();
  },
  dispatch(eventName, params) {
    this.eventEmitter.emit(eventName, params);
  }
};

export default dispatchManager;
