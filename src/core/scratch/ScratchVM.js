//import VirtualMachine from 'scratch-vm';
// TODO!

// npm i -S https://github.com/LLK/scratch-vm.git (build failing?)

import _ from 'lodash';

// wraps the Scratch VM
export class ScratchVM {
  constructor(workspaceCfg, renderCfg) {
    this.vm = new VirtualMachine();
    
    if (workspaceCfg) {
      this.setupWorkspace(workspaceCfg);
    }
    if (renderCfg) {
      this.setupRenderer(renderCfg);
    }

    this.vm.start();
  }
  
  setupWorkspace(workspaceCfg) {
    let {divEl, cfg} = workspaceCfg;
    // Instantiate scratch-blocks and attach it to the DOM
    // config: https://developers.google.com/blockly/guides/get-started/web#configuration
    const defaultCfg = {
      media: 'http://llk.github.io/scratch-vm/media/',
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.75
      },
      colours: {
        workspace: 'rgba(255, 255, 255, 0)',
        flyout: '#283856',
        scrollbar: '#24324D',
        scrollbarHover: '#0C111A',
        insertionMarker: '#FFFFFF',
        insertionMarkerOpacity: 0.3,
        fieldShadow: 'rgba(255, 255, 255, 0)',
        dragShadowOpacity: 0.6
      }
    };
    cfg = _.merge(defaultCfg, cfg);
    
    this.workspace = window.Blockly.inject(divEl, cfg);
    this.workspace.scale = cfg.scale || this.workspace.scale;
    this.attachWorkspaceEvents();
  }
  
  setupRenderer(renderCfg) {
    const {renderCanvas} = renderCfg;
    // Instantiate the renderer and connect it to the VM.
    this.renderer = new window.RenderWebGL(renderCanvas);
    vm.attachRenderer(this.renderer);
  }
  
  attachWorkspaceEvents() {
    const vm = this.vm;
    const workspace = this.workspace;
    
    workspace.addChangeListener(vm.blockListener);
    workspace.addChangeListener(vm.flyoutBlockListener);
    
    // Receipt of new block XML for the selected target.
    vm.on('workspaceUpdate', function (data) {
        workspace.clear();
        var xml = window.Blockly.Xml.textToDom(data.xml);
        window.Blockly.Xml.domToWorkspace(xml, workspace);
    });
    
    vm.on('SCRIPT_GLOW_ON', function(data) {
        workspace.glowStack(data.id, true);
    });
    vm.on('SCRIPT_GLOW_OFF', function(data) {
        workspace.glowStack(data.id, false);
    });
    vm.on('BLOCK_GLOW_ON', function(data) {
        workspace.glowBlock(data.id, true);
    });
    
    vm.on('BLOCK_GLOW_OFF', function(data) {
        workspace.glowBlock(data.id, false);
    });
    vm.on('VISUAL_REPORT', function(data) {
        workspace.reportValue(data.id, data.value);
    });
  }
  
  getSpriteByName(name) {
    return this.vm.runtime.getSpriteTargetByName(name);
  }
  
  loadJSon(jsonText) {
    this.vm.loadProject(jsonText);
  }
  
  loadXml(xmlText) {
    const xml = Blockly.Xml.textToDom(xmlText);
    const block = xml.block;
    if (block && (block.x < 0 || block.y < 0)) {
      console.warning("Block x or y are negative. This might cause it to be rendered off-screen: " + xmlText);
    }
    Blockly.Xml.domToWorkspace(xml, this.workspace);
  }
  
  // all opcodes: https://goo.gl/Bbi18z
  // more complete JSON example: https://goo.gl/nbPQPS
  loadSimpleCode(simpleCodeText) {
    const offset = 0;
    const x = offset, y = offset;
    
    // simple code only contains one script
    let script = JSON.parse(simpleCodeText);
    if (!_.isArray(script)) {
      script = [script];
    }
    if (!_.isArray(script[0])) {
      script = [script];
    }
    this.loadJSon(JSON.stringify({
      objName: "Stage",
      children: [{
        "objName": "DummySprite",
        "variables": [],
        "scripts": [[x,y,script]]
      }]
    }));
    
    // const workspace = this.workspace;
    // const topBlocks = workspace.getTopBlocks(true);
    // console.log(topBlocks[0].data);
  }
};