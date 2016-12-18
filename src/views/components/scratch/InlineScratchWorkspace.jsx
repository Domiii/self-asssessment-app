import { ScratchVM } from 'src/core/scratch/ScratchVM';
import { React } from 'react';

// simple stand-alone Workspace to just render a bunch of code
export class InlineScratchWorkspace extends React.Component {
  static propTypes = {
    workspaceConfig: PropTypes.object,
    xml: PropTypes.string,
    simpleCode: PropTypes.string,
  }

  onWorkspaceRef(el) {
    this.workspaceEl = el;
  }
  
  componentDidMount() {
    //const canvasEl = this.refs.canvas;
    const defaultWorkspaceConfig = {
      divEl: this.workspaceEl,
      cfg: {
        readOnly: true,
        zoom: { controls: false }
      }
    };
    
    const customCfg = this.props.workspaceConfig;
    const workspaceCfg = _.merge(defaultWorkspaceConfig,
                                 customCfg);
    const vm = this.scratchVM = new ScratchVM(workspaceCfg);
    
    if (this.props.xml) {
      vm.loadXml(this.props.xml);
    }
    else if (this.props.simpleCode) {
      vm.loadSimpleCode(this.props.simpleCode);
    }
    
    this.resizeToFit();
  }
  
  resizeToFit() {
    // see: https://github.com/google/blockly/blob/c0c43596615d714c745290078f5408200d382fa2/demos/blockfactory/block_option.js#L140
    // Get metrics
    const workspace = this.scratchVM.workspace;
    const metrics = workspace.getMetrics();
    const bounds = workspace.getBlocksBoundingBox();
    
    // change size to tightly fit the currently displayed blocks
    const $el = $(this.workspaceEl);
    const w = bounds.width * workspace.scale;
    const h = bounds.height * workspace.scale;
    $el.innerWidth(w);
    $el.innerHeight(h);
    
    // trigger resize event to get Blockly to revalidate its layout
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0); 
    window.dispatchEvent(evt);
  }
  
  render() {
    const style = {
      'marginLeft': '0.5em',
      'marginRight': '0.5em',
      width: '480px', 
      height: '360px', 
      display: 'inline-block'
    };
    return (
      <div ref={this.onWorkspaceRef.bind(this)}
        style={style}>
      </div>);
  }
}