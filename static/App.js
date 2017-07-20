const contentNode = document.getElementById('contents');

const continents = ['Africa', 'North America', 'Asia', 'Australia', 'Europe', 'Antarctica', 'South America'];

const message = continents.map(c => `Hello ${c}! `).join('<br/>');

const component = React.createElement(
  'p',
  null,
  message
); // simple jsx component

ReactDOM.render(component, contentNode); // Render component inside contentNode