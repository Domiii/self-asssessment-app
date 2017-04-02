import React, { Component, PropTypes } from 'react';
import { 
  Alert, ListGroupItem, ListGroup, ButtonGroup, Button,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import { ConceptCheckResponseTypes } from 'src/core/concepts';


export default class ConceptCheckItem extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func
  };
  static propTypes = {
    check: PropTypes.object
  };

  get ResponsesEl() {
    // TODO: Allow for different response types, depending on settings

    
    const { lookupLocalized } = this.context;
    const responses = ConceptCheckResponseTypes.default;
    const responseEls = _.map(responses, (response, name) => {
      const tooltip = (
        <Tooltip className="in" id="tooltip">
          { lookupLocalized(response, 'title') || '' }
        </Tooltip>
      );
      return (
          <OverlayTrigger placement="bottom" overlay={tooltip}>
            <Button style={{width:'4em', marginLeft: '0.5em'}} bsSize="large"
              bsStyle={response.bsStyle || 'default'}
              className={'no-padding ' + response.className || ''}>
              {response.icon && <FAIcon name={response.icon} /> }
            </Button>
          </OverlayTrigger>
      );
    });
    return (
      <ButtonGroup block className="max-width">
        {responseEls}
      </ButtonGroup>
    );
/*
        <Flex>
          <Item flexGrow="1" key={name}>
            {responseEls}
          </Item>
        </Flex>
*/
  }

  render() {
    const { lookupLocalized } = this.context;
    const { check } = this.props;

    return (
      <ListGroupItem className="no-padding">
        <ListGroup className="no-margin">
          <ListGroupItem>
            { lookupLocalized(check, 'title') || '' }
          </ListGroupItem>
          <ListGroupItem className="no-padding">
            { this.ResponsesEl }
          </ListGroupItem>
        </ListGroup>
      </ListGroupItem>
    );
  }
}