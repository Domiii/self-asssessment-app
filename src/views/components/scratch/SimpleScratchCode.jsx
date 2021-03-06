import InlineScratchWorkspace from './InlineScratchWorkspace';

import React, { PureComponent, PropTypes } from 'react';

// accept text with inline Scratch markup language for displaying Scratch components
export default class SimpleScratchCode extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    literal: PropTypes.string
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
      return (<code key={makeKey(text)} style={style}>{text}</code>);
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

        if (prevText.length > 0) {
          comps.push(textNode(prevText));
        }
        comps.push(codeNode(matchText));

        lastIndex = matchEnd;
      }

      let prevText = text.substring(lastIndex, text.length);
      if (prevText.length > 0) {
        comps.push(textNode(prevText));
      }
    }
    catch (err) {
      console.error('Invalid string: ' + text);
      console.error(err.stack);
    }
    return comps;
  }
  
  render() {
    const text = this.props.text || this.props.literal;
    const comps = [];
    this.textToComponents(text, comps);
    return <span>{comps}</span>;
  }
}