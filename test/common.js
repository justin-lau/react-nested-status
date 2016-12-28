/*jshint newcap: false */
/*global describe, it */
'use strict';
var expect = require('expect.js'),
    React = require('react'),
    NestedRedirect = require('../');

describe('NestedRedirect', function () {
  it('has a displayName', function () {
    var el = React.createElement(NestedRedirect);
    expect(el.type.displayName).to.be.a('string');
    expect(el.type.displayName).not.to.be.empty();
  });
  it('hides itself from the DOM', function () {
    var Component = React.createClass({
      render: function () {
        return React.createElement(NestedRedirect, {code: 2727},
          React.createElement('div', null, 'hello')
        );
      }
    });
    var markup = React.renderToStaticMarkup(React.createElement(Component));
    expect(markup).to.equal('<div>hello</div>');
  });
  it('works with complex children', function () {
    var Component1 = React.createClass({
      render: function() {
        return React.createElement('p', null,
          React.createElement('span', null, 'c'),
          React.createElement('span', null, 'd')
        );
      }
    });
    var Component2 = React.createClass({
      render: function () {
        return React.createElement(NestedRedirect, {code: 301, href: 'https://www.google.com'},
          React.createElement('div', null,
            React.createElement('div', null, 'a'),
            React.createElement('div', null, 'b'),
            React.createElement('div', null, React.createElement(Component1))
          )
        );
      }
    });
    var markup = React.renderToStaticMarkup(React.createElement(Component2));
    expect(markup).to.equal(
      '<div>' +
        '<div>a</div>' +
        '<div>b</div>' +
        '<div>' +
          '<p>' +
            '<span>c</span>' +
            '<span>d</span>' +
          '</p>' +
        '</div>' +
      '</div>'
    );
  });
});

describe('NestedRedirect.rewind', function () {
  it('clears the mounted instances', function () {
    React.renderToStaticMarkup(
      React.createElement(NestedRedirect, {code: 301, href: 'https://www.google.com'},
        React.createElement(
          NestedRedirect,
          {code: 302, href: 'https://www.yahoo.com'},
          React.createElement(NestedRedirect, {code: 301, href: 'https://www.bing.com'}
        ))
      )
    );
    var peekedStatus = NestedRedirect.peek();
    expect(peekedStatus).to.have.property('isRedirect', true);
    expect(peekedStatus).to.have.property('code', 301);
    expect(peekedStatus).to.have.property('href', 'https://www.bing.com');
    NestedRedirect.rewind();
    expect(NestedRedirect.peek()).to.have.property('isRedirect', false);
  });
  it('returns the latest status code', function () {
    React.renderToStaticMarkup(
      React.createElement(NestedRedirect, {code: 302, href: 'https://www.google.com'},
        React.createElement(NestedRedirect, {code: 301, href: 'https://www.bing.com'},
          React.createElement(NestedRedirect, {code: 302, href: 'https://www.yahoo.com'}
        ))
      )
    );
    var peekedStatus = NestedRedirect.peek();
    expect(peekedStatus).to.have.property('isRedirect', true);
    expect(peekedStatus).to.have.property('code', 302);
    expect(peekedStatus).to.have.property('href', 'https://www.yahoo.com');
  });
  it('returns `isRedirect: false` if no mounted instances exist', function () {
    React.renderToStaticMarkup(
      React.createElement(NestedRedirect, {code: 301, href: 'https://www.google.com'},
        React.createElement(NestedRedirect, {code: 302, href: 'https://www.yahoo.com'},
          React.createElement(NestedRedirect, {code: 301, href: 'https://www.bing.com'}
        ))
      )
    );
    NestedRedirect.rewind();
    expect(NestedRedirect.peek()).to.have.property('isRedirect', false);
  });
});
