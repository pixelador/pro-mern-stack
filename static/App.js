'use strict';

var contentNode = document.getElementById('contents');

var continents = ['Africa', 'North America', 'Asia', 'Australia', 'Europe', 'Antarctica', 'South America'];

var message = continents.map(function (c) {
  return 'Hello ' + c + '! ';
}).join('<br/>');

var component = React.createElement(
  'p',
  null,
  message
); // simple jsx component

ReactDOM.render(component, contentNode); // Render component inside contentNode