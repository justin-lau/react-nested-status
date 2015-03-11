React Nested Status
===================

A server-side utility component that passes status codes. Useful to set HTTP status codes based on which components are being rendered.

Built with [React Side Effect](https://github.com/gaearon/react-side-effect).

Based (heavily) on [React Document Title](https://github.com/gaearon/react-document-title).

====================

## Installation

```
npm install --save react-nested-status
```

Dependencies: React >= 0.11.0

## Features

* Made for isomorphic apps. Really doesn't have a use without server-side React.
* Does not emit DOM, not even a `<noscript>`;
* Like a normal React compoment, can use its parent's `props` and `state`;
* Can be defined in many places throughout the application;
* Supports arbitrary levels of nesting, so you can define app-wide and page-specific titles;

## Example

Assuming you use something like [react-router](https://github.com/rackt/react-router):

```javascript
var App = React.createClass({
  render: function () {
    // Use "My Web App" if no child overrides this
    return (
      <NestedStatus code={200}>
        <this.props.activeRouteHandler />
      </NestedStatus>
    );
  }
});

var HomePage = React.createClass({
  render: function () {
    // Use "Home" while this component is mounted
    return (
      <NestedStatus code={200}>
        <h1>Home, sweet home.</h1>
      </NestedStatus>
    );
  }
});

var ErrorPage = React.createClass({
  mixins: [LinkStateMixin],

  render: function () {
    // Update using value from state while this component is mounted
    return (
      <NestedStatus code={404}>
        <div>
          <h1>Four-oh-four</h1>
          <p>Page not found.</p>
        </div>
      </NestedStatus>
    );
  }
});
```

## Server Usage

Call `NestedStatus.rewind()` after rendering components to string to retrieve the status code given to the innermost `NestedStatus`. You can then use this to set your Express (or other web server) status code.

Because this component keeps track of mounted instances, **you have to make sure to call `rewind` on server**, or you'll get a memory leak.

### Example

```javascript
var markup = React.renderToString(React.createFactory(Handler)());
var status = NestedStatus.rewind();
var html = React.renderToStaticMarkup(htmlComponent({
    markup: markup
}));

// Express
res.status(status).send('<!DOCTYPE html>' + html);
```

## Thank you

A huge thanks to [gaearon](https://github.com/gaearon) for his open-source [React Document Title](https://github.com/gaearon/react-document-title) that was easy to understand and modify.
