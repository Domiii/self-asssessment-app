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
    // if (!init) {
    //   hljs.initHighlightingOnLoad();
    //   init = true;
    // }
    if (this.refs.code) {
      hljs.highlightBlock(this.refs.code);
    }
  }

  renderScratch() {
    const style = {
      display: 'flex',
      margin: '4px 0'
    };
    return (<pre style={style} className="hljs">
      <InlineScratchWorkspace simpleCode={this.props.literal} />
    </pre>);
  }

  renderOther() {
    const style = {
      margin: '4px 0'
    };
    return <div style={style}>
      <pre className="hljs no-margin no-padding">
        <code ref="code"
          className={this.props.language}>
          {this.props.literal}
        </code>
      </pre>
    </div>;
  }

  render() {
    return (this.props.language === 'scratch' && !!this.props.literal ?
      this.renderScratch() :
      this.renderOther()
    );
  }
}