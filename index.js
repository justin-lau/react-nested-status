'use strict';

var React = require('react'),
    createSideEffect = require('react-side-effect');

var _isRedirect = false;
var _redirectCode;
var _redirectHref;


function getStatusFromPropsList(propsList) {
  var innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return {
      isRedirect: true,
      code: innermostProps.code || 302,
      href: innermostProps.href
    };
  }

  return { isRedirect: false };
}

var NestedStatus = createSideEffect(function handleChange(propsList) {
  var status = getStatusFromPropsList(propsList);
  _isRedirect = status.isRedirect;
  _redirectCode = status.code;
  _redirectHref = status.href;
}, {
  displayName: 'NestedRedirect',

  propTypes: {
    code: React.PropTypes.number,
    href: React.PropTypes.string.isRequired,
  },

  statics: {
    peek: function () {
      return {
        isRedirect: _isRedirect,
        code: _redirectCode,
        href: _redirectHref,
      };
    },

    rewind: function () {
      var isRedirect = _isRedirect;
      var status = _redirectCode;
      var href = _redirectHref;
      this.dispose();
      return {
        isRedirect: isRedirect,
        code: status,
        href: href
      };
    }
  }
});

module.exports = NestedStatus;
