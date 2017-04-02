import React, { Component, PropTypes } from 'react';
import { 
  Alert, ListGroupItem
} from 'react-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';


export default class ConceptCheckItem extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func
  };
  static propTypes = {
    check: PropTypes.object
  };

  render() {
    const { lookupLocalized } = this.context;
    const { check } = this.props;

    return (
      <ListGroupItem>
        { lookupLocalized(check, 'title') || '' }
      </ListGroupItem>
    );
  }
}