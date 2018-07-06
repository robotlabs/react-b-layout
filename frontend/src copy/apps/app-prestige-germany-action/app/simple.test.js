var React = require('React');
var renderer = require('react-test-renderer');
var ShallowRenderer = require('react-test-renderer/shallow')
var Simple = require('./simple.js')

/*
describe('User', () => {
  const user = {
    name: 'joe',
    email: 'joe@mail.com'
  };

  it('renders deep correctly', () => {
    const tree = renderer.create(<Simple/>);
    expect(tree).toMatchSnapshot();
  });
});
*/

const startState = {
    todos: [{ id: 1, done: false, name: 'Buy Milk' }]
  };
describe('Addition', () => {
    it('knows that 2 and 2 make 4', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('rob1', () => {
    it('YOYO', () => {
        expect(startState.todos).toEqual([
            { id: 1, done: false, name: 'Buy Milk' }
          ]);
    });
  });

