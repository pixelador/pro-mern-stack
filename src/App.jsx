import IssueList from './IssueList.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

const contentNode = document.getElementById('contents');

ReactDOM.render(<IssueList />, contentNode); // Render component inside contentNode

if (module.hot) {
    module.hot.accept();
}