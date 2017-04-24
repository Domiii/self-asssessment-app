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
    // TODO: only render a small portion of all the description

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
    return (<div className="concept-description concept-description-preview">
      <Markdown source={description} />
    </div>);
  }
}