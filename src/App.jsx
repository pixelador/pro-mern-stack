const contentNode = document.getElementById('contents');

class IssueFilter extends React.Component {
    render() {
        return(
            <div>Placeholder for the issue filter</div>
        );
    }
}

class IssueRow extends React.Component {

    render() {
        const issue = this.props.issue
        console.log('IssueRow render called')
        return(
            <tr>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.effort}</td>
                <td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
                <td>{issue.title}</td>
            </tr>
        );
    }
}

class IssueTable extends React.Component {
    render() {

        const issueRows = this.props.issues.map(e => <IssueRow key={e.id} issue={e} />)

        return(
            <table className="bordered-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Created</th>
                        <th>Effort</th>
                        <th>Completion</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>{issueRows}</tbody>
            </table>
        );
    }
}

class IssueAdd extends React.Component {
    render() {
        return(
            <div>Placeholder for the Issue Add entry form</div>
        );
    }
}

const issuesArray = [
    {
        id: 1,
        status: 'Open',
        owner: 'Ravan',
        created: new Date('2016-08-15'),
        effort: 5,
        completionDate: undefined,
        title: 'Error when clicking Add',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        created: new Date('2016-08-16'),
        effort: 14,
        completionDate: new Date('2016-08-30'),
        title: 'Missing bottom border on panel',
    },
];

class IssueList extends React.Component {
    constructor() {
        super();
        this.state = {issues: []};
        setTimeout(this.createTestIssue.bind(this), 2000);
    }

    loadData() {
        setTimeout(() => {
            this.setState({issues: issuesArray});
        }, 500);
    }

    componentDidMount() {
        this.loadData();
    }

    createIssue(newIssue) {
        const newIssues = this.state.issues.slice();
        newIssue.id = this.state.issues.length + 1;
        newIssues.push(newIssue);
        this.setState({issues: newIssues});
    }

    createTestIssue() {
        this.createIssue({
            status: 'New',
            owner: 'Pieta',
            created: new Date(),
            title: 'Completion date should be optional',
        });
    }

    render() {
        return (
            <div>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr/>
                <IssueTable issues={this.state.issues} />
                <hr/>
                <IssueAdd />
            </div>
        );
    }
}

ReactDOM.render(<IssueList />, contentNode); // Render component inside contentNode