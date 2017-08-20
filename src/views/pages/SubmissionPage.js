import {
  ConceptSubmissionsRef
}
from 'src/core/concepts';

import { EmptyObject, EmptyArray } from 'src/util';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import { 
  Alert, Button, Jumbotron, Well, Panel
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FAIcon } from 'src/views/components/util';
import { LoadOverlay } from 'src/views/components/overlays';
import { SubmissionList } from 'src/views/components/submissions';

import { firebaseConnect } from 'react-redux-firebase'

import _ from 'lodash';


@firebaseConnect(({ queryArgs }, firebase) => {
  return [
    ConceptSubmissionsRef.makeQuery(queryArgs.submissions)
  ];
})
@connect(({ firebase }, { queryArgs }) => {
  return {
    conceptSubmissionsRef: ConceptSubmissionsRef(firebase, null, null, queryArgs.submissions)
  };
})
class _SubmissionPage extends Component {
  static propTypes = {
    //conceptSubmissionsRef: PropTypes.object.isRequired
    loadMore: PropTypes.func.isRequired,
    isLoadAll: PropTypes.func.isRequired,
    toggleLoadAll: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  get isNotLoadedYet() {
    const { conceptSubmissionsRef } = this.props;
    return !conceptSubmissionsRef.isLoaded;
  }

  get currentSubmissions() {
    const { conceptSubmissionsRef } = this.props;
    return conceptSubmissionsRef.val;
  }

  get hasMore() {
    const submissions = this.currentSubmissions;
    const submissionArgs = this.props.queryArgs.submissions;
    return _.size(submissions) === submissionArgs.limit;
  }

  PanelTitle() {
    const {
      loadMore,
      toggleLoadAll,
      isLoadAll
    } = this.props;
    const hasMore = this.hasMore;
    const submissionCount = _.size(this.currentSubmissions);

    return (<span>
      <h3>
        Submissions ({submissionCount})
        <span className="margin-half"/>
        <Button
          bsStyle={isLoadAll() ? 'success' : 'danger'}
          active={isLoadAll()}
          onClick={toggleLoadAll}>
          all
        </Button>
        <Button
          bsStyle="primary"
          onClick={loadMore}
          disabled={!hasMore}>
          load more...
        </Button>
      </h3>
    </span>);
  }

  render() {
    if (this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    const submissions = this.currentSubmissions;

    if (!submissions) {
      return (
        <Alert bsStyle="warning">
          <span>there are no submissions</span>
        </Alert>
      );
    }

    return (
      <Panel header={this.PanelTitle()}>
        <SubmissionList {...{
          submissions
        }} />
      </Panel>
    );
  }
}







class SubmissionPage extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      queryArgs: {
        submissions: {
          page: 0,
          storeAs: 'submission_data',
          limit: this.itemsPerPage,
          //filter: ['hasSubmitted', true],
          orderBy: 'updatedAt',
          
          // see: http://react-redux-firebase.com/docs/populate

          populates: (dataKey, originalData) => {
            //console.log(dataKey, originalData);
            return [
              { 
                child: 'uid',
                root: 'users',
                keyProp: 'uid'
              },
              {
                child: 'conceptId',
                root: 'concepts',
                keyProp: 'conceptId'
              }
            ];
          }
        }
      }
    };

    autoBind(this);
  }

  get itemsPerPage() {
    return this.props.itemsPerPage || 20;
  }

  get currentPage() {
    const { queryArgs } = this.state;
    return queryArgs.submissions.page;
  }

  setPage(iPage) {
    const { queryArgs } = this.state;

    queryArgs.submissions.page = iPage;
    queryArgs.submissions.limit = (iPage+1) * this.itemsPerPage;
    this.setState({queryArgs});
  }

  loadMore() {
    this.setPage(this.currentPage+1);
  }

  isLoadAll() {
    const { queryArgs } = this.state;

    return !queryArgs.submissions.limit;
  }

  toggleLoadAll() {
    this.setLoadAll(!this.isLoadAll());
  }

  setLoadAll(isOn) {
    const { queryArgs } = this.state;

    if (isOn) {
      queryArgs.submissions.limit = null;
      this.setState({queryArgs});
    }
    else {
      this.setPage(this.currentPage);
    }
  }

  render() {
    return(<_SubmissionPage
        {...this.props}
        {...this.state}

        setPage={this.setPage}
        loadMore={this.loadMore}
        isLoadAll={this.isLoadAll}
        toggleLoadAll={this.toggleLoadAll}
      />);
  }
}

export default SubmissionPage;