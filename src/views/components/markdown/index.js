import React, { Component, PropTypes } from 'react';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';
import SimpleScratchCode from 'src/views/components/scratch/SimpleScratchCode';

function markdownLinkRenderer(props) {
  return props.href.startsWith("/") ?
    <a href={props.href}>{props.children}</a> :
    <a href={props.href} target="_blank" rel="nofollow noopener noreferrer">{props.children}</a>;
}

// Adapted from: https://github.com/rexxars/react-markdown/blob/master/demo/src/demo.js
// For renderer implementations, consider: https://github.com/rexxars/commonmark-react-renderer/blob/master/src/commonmark-react-renderer.js#L18
export default class Markdown extends Component {
  constructor(props) {
    super(props);

    this.renderers = Object.assign({}, Markdown.renderers, {
      CodeBlock: CodeBlock,
      Code: SimpleScratchCode,
      link: markdownLinkRenderer
    });
  }

  render() {
    return (<ReactMarkdown className="markdown" source={this.props.source} renderers={this.renderers} />);
  }
}