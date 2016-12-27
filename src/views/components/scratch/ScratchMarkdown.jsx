import { InlineScratchWorkspace } from './InlineScratchWorkspace';

import React, { Component, PropTypes } from 'react';

// accept text with inline Scratch markup language for displaying Scratch components
export default class ScratchMarkdown extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  }

  textToComponents(text, comps) {
    let lastKey = 0;
    function makeKey(text) {
      return text + (++lastKey);
    }
    function textNode(text) {
      const style = {
        //display: 'inline-block'
      };
      return (<span key={makeKey(text)} style={style}>{text}</span>);
    }

    function codeNode(text) {
      return (<InlineScratchWorkspace key={makeKey(text)} simpleCode={text} />);
    }

    try {
      const re = /\{\{([^}]+)\}\}/g;
      let lastIndex = 0;
      let match;
      while ((match = re.exec(text)) != null) {
        const matchStart = match.index, matchEnd = re.lastIndex;
        let prevText = text.substring(lastIndex, matchStart);
        let matchText = match[1];

        comps.push(textNode(prevText));
        comps.push(codeNode(matchText));

        lastIndex = matchEnd;
      }

      let prevText = text.substring(lastIndex, text.length);
      comps.push(textNode(prevText));
    }
    catch (err) {
      console.error('Invalid string: ' + text);
      console.error(err.stack);
    }
    return comps;
  }
  
  render() {
    const style = {
      'verticalAlign': 'middle'
    };
    const text = this.props.text;
    const comps = [];
    this.textToComponents(text, comps);
    return <div style={style}>{comps}</div>;
  }
}