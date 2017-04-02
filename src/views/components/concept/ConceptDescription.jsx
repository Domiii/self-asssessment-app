import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Markdown from 'src/views/components/markdown';
import { Well } from 'react-bootstrap';

export default class ConceptDescription extends Component {
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
    return (
      <Well className="concept-description">
        { !!description &&
          (<Markdown source={description} />) ||
          (<span className="color-gray">no description</span>)
        }
      </Well>
    );
  }
}