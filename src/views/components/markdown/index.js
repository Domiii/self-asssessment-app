import React, { Component, PropTypes } from 'react';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';
import SimpleScratchCode from 'src/views/components/scratch/SimpleScratchCode';
import {
  Alert, ListGroupItem, ListGroup, ButtonGroup, Button,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';

class MarkdownLinkRenderer extends Component {
  constructor(...args) {
    super(...args);

    this.state = {};
  }

  togglePreview = () => {
    const {
      isOpen
     } = this.state;

    this.setState({ isOpen: !isOpen });
  }

  renderPreviewModal() {
    const url = this.props.href;
    // return (
    //   <iframe src={url} width="800px" height="600px" showborder="0" />
    // );
  }

  render() {
    const url = this.props.href;

    const tooltip = (
      <Tooltip className="in" id="tooltip">
        {
          this.renderPreviewModal()
        }
        {/* <Button
          onClick={this.togglePreview}>
          🔍Preview?🔍
        </Button> */}
      </Tooltip>
    );

    return (<span>
      {/* <OverlayTrigger placement="bottom" overlay={tooltip}> */}
        <a href={url} target="_blank" rel="nofollow noopener noreferrer">
          {this.props.children}
        </a>
      {/* </OverlayTrigger> */}
    </span>);
  }
}

// Adapted from: https://github.com/rexxars/react-markdown/blob/master/demo/src/demo.js
// For renderer implementations, consider: https://github.com/rexxars/commonmark-react-renderer/blob/master/src/commonmark-react-renderer.js#L18
export default class Markdown extends Component {
  constructor(props) {
    super(props);

    this.renderers = Object.assign({}, Markdown.renderers, {
      CodeBlock: CodeBlock,
      Code: SimpleScratchCode,
      link: MarkdownLinkRenderer
    });
  }

  render() {
    return (<ReactMarkdown className="markdown" source={this.props.source} renderers={this.renderers} />);
  }
}