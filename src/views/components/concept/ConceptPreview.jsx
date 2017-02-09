import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Markdown from 'src/views/components/markdown';

export default class ConceptPreview extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func
  };

  static propTypes = {
    //conceptId: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired
  };

  render() {
    // data
    const { lookupLocalized } = this.context;
    const { 
      //conceptId, 
      concept
    } = this.props;
    const description = lookupLocalized(concept, 'description') || '';

    // tags
    // hierarchy

    // actions

    // render!
    return (
      <Markdown source={description} />
    );
  }
}