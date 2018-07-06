// import React from 'react';
var react = require('React');
var renderer = require('react-test-renderer');

// import renderer from 'react-test-renderer';
var ShallowRenderer = require('react-test-renderer/shallow')
// import ShallowRenderer from 'react-test-renderer/shallow';

// import Appx from './app';
var Appx = require('./app.js')

describe('User', () => {
  const user = {
    name: 'joe',
    email: 'joe@mail.com'
  };

  it('renders deep correctly', () => {
    const tree = renderer.create(<Appx user={ user }/>);
    expect(tree).toMatchSnapshot();
  });

  it('renders shallow correctly', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<User user={ user }/>);
    const tree = renderer.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});

