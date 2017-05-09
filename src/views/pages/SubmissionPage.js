import {
  ConceptResponsesRef
}
from 'src/core/concepts';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { 
  Alert, Button, Jumbotron, Well
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import {
  LinkContainer
} from 'react-router-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';
import { LoadOverlay } from 'src/views/components/overlays';
import { SubmissionList } from 'src/views/components/submissions';

import { firebaseConnect } from 'react-redux-firebase'

import _ from 'lodash';
import autoBind from 'react-autobind';



@firebaseConnect(({queryArgs}, firebase) => {
  //console.log(queryArgs.submissions.limit);
  return [
    ConceptResponsesRef.makeQuery(queryArgs.submissions)
  ];
})
@connect(({ firebase }, { queryArgs }) => {
  return {
    conceptResponsesRef: ConceptResponsesRef(firebase, null, null, queryArgs.submissions)
  };
})
class _SubmissionPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    conceptResponsesRef: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    autoBind(this);
  }

  get isNotLoadedYet() {
    const { conceptResponsesRef } = this.props;
    return !conceptResponsesRef.isLoaded;
  }

  get currentSubmissions() {
    const { conceptResponsesRef } = this.props;
    return conceptResponsesRef.val;
  }

  render() {
    if (this.isNotLoadedYet) {
      // still loading
      return (<LoadOverlay />);
    }

    if (!this.currentSubmissions) {
      return (
        <Alert bsStyle="warning">
          <span>there are no submissions</span>
        </Alert>
      );
    }

    const {
      loadMore
    } = this.props;
    const submissions = this.currentSubmissions;
    const submissionArgs = this.props.queryArgs.submissions;

    return (
      <SubmissionList  
        submissions={submissions}
        loadMore={loadMore}
        hasMore={_.size(submissions) === submissionArgs.limit}/>
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
          limit: this.itemsPerPage,
          filter: [],
          
          // see: http://react-redux-firebase.com/docs/populate
          populates: [
            { child: 'uid', root: 'users', keyProp: 'uid' },
            { child: 'conceptId', root: 'concepts', keyProp: 'conceptId' }
          ]
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

  render() {
    return(<_SubmissionPage
        {...this.props}
        {...this.state}

        setPage={this.setPage}
        loadMore={this.loadMore}
      />);
  }
}

export default SubmissionPage;