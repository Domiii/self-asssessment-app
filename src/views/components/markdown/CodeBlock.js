// adapted from: https://github.com/rexxars/react-markdown/blob/master/demo/src/code-block.js

'use strict';

import React, { PureComponent } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import InlineScratchWorkspace from 'src/views/components/scratch/InlineScratchWorkspace';

let init = false;

export default class CodeBlock extends PureComponent {
  static propTypes = {
    literal: React.PropTypes.string,
    language: React.PropTypes.string
  };

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    if (!init) {
      hljs.initHighlightingOnLoad();
      init = true;
    }
    hljs.highlightBlock(this.refs.code);
  }

  render() {
    return (
      <div style={{margin: '0.5em 0'}}>
        <code ref="code" className={this.props.language}>
          {this.props.literal}
        </code>
      </div>
    );
  }
}