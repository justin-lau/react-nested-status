/*jshint newcap: false */
/*global describe, it */
'use strict';
var expect = require('expect.js'),
    React = require('react'),
    NestedStatus = require('../');

describe('NestedStatus', function () {
  it('has a displayName', function () {
    var el = React.createElement(NestedStatus);
    expect(el.type.displayName).to.be.a('string');
    expect(el.type.displayName).not.to.be.empty();
  });
  it('hides itself from the DOM', function () {
    var Component = React.createClass({
      render: function () {
        return React.createElement(NestedStatus, {code: 2727},
          React.createElement('div', null, 'hello')
        );
      }
    });
    var markup = React.renderToStaticMarkup(React.createElement(Component));
    expect(markup).to.equal('<div>hello</div>');
  });
  it('throws an error if it has multiple children', function (done) {
    var Component = React.createClass({
      render: function () {
        return React.createElement(NestedStatus, {code: 2727},
          React.createElement('div', null, 'hello'),
          React.createElement('div', null, 'world')
        );
      }
    });
    expect(function () {
      React.renderToStaticMarkup(React.createElement(Component));
    }).to.throwException(function (e) {
      expect(e.message).to.match(/^Invariant Violation:/);
      done();
    });
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
        return React.createElement(NestedStatus, {code: 2727},
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

describe('NestedStatus.rewind', function () {
  it('clears the mounted instances', function () {
    React.renderToStaticMarkup(
      React.createElement(NestedStatus, {code: 201},
        React.createElement(NestedStatus, {code: 202}, React.createElement(NestedStatus, {code: 203}))
      )
    );
    expect(NestedStatus.peek()).to.equal(203);
    NestedStatus.rewind();
    expect(NestedStatus.peek()).to.equal(200);
  });
  it('returns the latest status code', function () {
    var code = 200;
    React.renderToStaticMarkup(
      React.createElement(NestedStatus, {code: 404},
        React.createElement(NestedStatus, {code: 500}, React.createElement(NestedStatus, {code: code}))
      )
    );
    expect(NestedStatus.rewind()).to.equal(code);
  });
  it('returns 200 if no mounted instances exist', function () {
    React.renderToStaticMarkup(
      React.createElement(NestedStatus, {code: 500},
        React.createElement(NestedStatus, {code: 404}, React.createElement(NestedStatus, {code: 301}))
      )
    );
    NestedStatus.rewind();
    expect(NestedStatus.peek()).to.equal(200);
  });
});
