
export const ProblemTypes = {
  Question: 1,        // default
  MiniProject: 2,
  Concept: 3
};

export const ProblemAbstractionLevel = {
  VerySpecific: 1,      // no unknown variables
  SomewhatAbstract: 2,  // some variables
  VeryAbstract: 3       // many variables, no grounding in specificity
};

export const ScratchSymbols = {
  // Block Shapes (https://wiki.scratch.mit.edu/wiki/Blocks#Block_Shapes)
  BlockShapes: {
    Hat: 1,
    Stack: 2,
    Boolean: 3,
    Reporter: 4,
    C: 5,
    Cap: 6
  }
};

export const SymbolImages = {
  BlockShapes: {
    Hat: 'https://wiki.scratch.mit.edu/w/images/The_shape_of_a_Hat_Block.png',
    Stack: 'https://wiki.scratch.mit.edu/w/images/The_shape_of_a_Stack_Block.png',
    Boolean: 'https://wiki.scratch.mit.edu/w/images/The_shape_of_a_Boolean_block.png',
    Reporter: 'https://wiki.scratch.mit.edu/w/images/The_shape_of_a_Reporter_Block.png',
    C: 'https://wiki.scratch.mit.edu/w/images/The_shape_of_one_of_the_C_blocks.png',
    Cap: 'https://wiki.scratch.mit.edu/w/images/The_shape_of_a_Cap_block.png'
  }
};

export const problems = [
  // ############################################################
  // [C1] 基礎移動－初級概念
  // ############################################################
  {
    
    q: 'What is the difference between {{["forward:", ""]}} and {{["glideSecs:toX:y:elapsed:from:", "","",""]}} ?'
  },{
    q: 'TODO: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    q: 'How to move a sprite horizontally, from the center to the very right of the stage?'
  },
  {
    q: 'How to move a sprite vertically, from the center to the very bottom of the stage?'
  },
  {
    q: 'How to make a sprite face upward?'
  },
  {
    q: 'What is the difference between {{["gotoX:y:", 0, 100]}} and {{["gotoX:y:", 0, -100]}}'
  },
  {
    q_zh: '當你用 {{["glideSecs:toX:y:elapsed:from:", "","",""]}} 時， 如果減少秒數的話但位置 (x, y) 沒變，角色的移動會發生甚麼樣的變化？'
  },
  {
    q_zh: '按綠旗時會發生甚麼事？'
  },
  {
    type: ProblemTypes.MiniProject,
    q_zh: '讓角色從右上角慢慢移動到左下角，再來讓她跑回去'
  },
  
  // ############################################################
  // [C1] 基礎移動－中級概念
  // ############################################################
  {
    q: 'Give two examples scripts that move a sprite from right to left?'
  },
  {
    q: 'How to make sure, sprite always starts at the same position initially?',
    hints: ['Which block(s) do you need? Where do the blocks need to be placed?']
  },
  {
    q: 'How to make sure, sprite always looks in the same direction initially?'
  },
  {
    q: 'What is the difference between {{["forward:", ""]}} and {{["gotoX:y:", "", ""]}} ?'
  },
  {
    q: 'What is the difference between {{["heading:", ""]}}, {{["turnLeft:", ""]}} and {{["turnRight:", ""]}}?'
  },
  {
    q: 'Where is position (x:0, y:0) on the stage?'
  },
  {
    q: 'What is the size of the stage?'
  },
  {
    q: 'What are the coordinates of the four stage corners?'
  },
  {
    q_zh: '{{["glideSecs:toX:y:elapsed:from:", "","",""]}} 有幾個參數？',
    props: ['permutable']   // many different equally valid questions
  },
  
  // ############################################################
  // [C1] 基礎移動－進階概念
  // ############################################################
  {
    q: 'How to animate a sprite moving from anywhere to anywhere?',
    abstraction: QuestionAbstractionLevel.VeryAbstract
  },
  {
    q: 'How to rotate a sprite?',
    abstraction: QuestionAbstractionLevel.SomewhatAbstract
  },
  {
    q: 'What is initialization? When does a program initialize?'
  },
  {
    q: 'When setting the position of the sprite, how do you know which point of the sprite will be at that exact position?',
    props: ['confusing']
  },
  {
    q: 'Find and describe any given position on the stage'
  },
  
  
  // ############################################################
  // [C2] 兩個角色互動－初級概念
  // ############################################################
  {
    q_zh: '怎麼設計一個新的程式？'
  },
  {
    q_zh: '怎麼找到你所有寫過的程式？'
  },
  {
    q_zh: '怎麼加一隻熊角色到場景裡？'
  },
  {
    q_zh: '當程式開始起動時要執行的指令需要加在哪一個方塊的下面？'
  },
  {
    q_zh: 'Scratch 的程式一開始平常要加哪三個方塊（提示：我們一開始平常需要做什麼？）？'
  },
  {
    q_zh: '請列出兩種頭部方塊（hat block）{{img: BlockShapes.Hat}}？'
  },
  {
    q_zh: '請列出至少 10 個函數（命令）方塊 ("stack block") {{img: BlockShapes.Stack}}？'
  },
  {
    type: ProblemTypes.MiniProject,
    q: '讓兩個角色在同一個角落出現，一個比較前面，一個後面。讓前面的角色跑到對面的角落。讓後面的角色追前面的角色，而且後面的角色到場景的重心已經追上了前面的腳色。'
  },
  
  
  // ############################################################
  // [C2] 兩個角色互動－中級概念
  // ############################################################
  {
    q: 'How to make a sprite move faster when using {{["glideSecs:toX:y:elapsed:from:", "","",""]}}?'
  },
  {
    q_zh: '請你確定你會針對角色做這些調整：複製，刪除，改變大小，基本的繪畫編輯',
    props: ['pure_concepts']
  },
  {
    q_zh: '頭部方塊 ({{img: BlockShapes.Hat}}) 與函數方塊（{{img: BlockShapes.Stack}}）有什麼差別？',
    props: ['confusing']
  },
  {
    q_zh: 'Scratch 有１０個分方塊的類別（例如：Motion 與 Looks）。你已經用過哪幾種的方塊類別？'
  },
  
  // ############################################################
  // [C3] Short Scripts, Long Runs－初級概念
  // project example: https://scratch.mit.edu/projects/118493281/
  // ############################################################
  {
    q_zh: '哪一個（哪一些？）方塊是讓角色講話的？'
  },
  {
    q: 'Why can’t you add blocks after {{["doForever"]}}?'
  },
  {
    q_zh: '把 {{["forward:", ""]}} 放在 {{["doForever"]}} 裡面會有什麼作用？',
    abstraction: QuestionAbstractionLevel.SomewhatAbstract
  },
  {
    q_zh: '請解釋在這個程式碼裡的 {{["bounceOffEdge"]}} 有什麼作用？如果沒有的話，會發生什麼事？',
    code: ['<xml xmlns="http://www.w3.org/1999/xhtml"><block type="event_whenflagclicked" id="-hHpF*R[O/56{2_h:-32" x="-193" y="231"><next><block type="control_forever" id="JPpe#B:(i:MB-V+8uAaW"><statement name="SUBSTACK"><block type="motion_movesteps" id="Lj))Hf,+,CZ-V5XoZQl8"><value name="STEPS"><shadow type="math_number" id="%%e2w;GlA[|CZXTspuqY"><field name="NUM">10</field></shadow></value><next><block type="motion_ifonedgebounce" id=";=4xDrHy@)j26.TaC#t^"></block></next></block></statement></block></next></block></xml>'],
    props: ['read_code']
  },
  {
    q_zh: '請用簡短的白話來解釋這個程式碼的作用',
    code: ['<xml xmlns="http://www.w3.org/1999/xhtml"><block type="event_whenflagclicked" id="qF/u?3d^uavM0r]0tfXZ" x="15" y="218"><next><block type="control_forever" id="{cJy^EL#BiNZy_TsB+Y?"><statement name="SUBSTACK"><block type="control_if" id="6c7-V0w/iMg%D7nZYd=:"><value name="CONDITION"><block type="sensing_touchingobject" id="UwRYw}~O$v^FNwo0;wNd"><value name="TOUCHINGOBJECTMENU"><shadow type="sensing_touchingobjectmenu" id="sJ%#T2njWsZMbZ4$0k/d"><field name="TOUCHINGOBJECTMENU">_mouse_</field></shadow></value></block></value><statement name="SUBSTACK"><block type="looks_sayforsecs" id="w#u~Lk0.QA}C-lN{L^cm"><value name="MESSAGE"><shadow type="text" id="D?#|6OSeLjH_J[s6+3+T"><field name="TEXT">Hello!</field></shadow></value><value name="SECS"><shadow type="math_number" id="4^jAO#CeJIE`;3b8)3O7"><field name="NUM">0.5</field></shadow></value></block></statement></block></statement></block></next></block></xml>'],
    props: ['read_code']
  },
  
  // ############################################################
  // [C3] Short Scripts, Long Runs－中級概念
  // ############################################################
  {
    q_zh: '請多列出兩種 Event (e.g. 程式開始 或 兩個角色碰撞)'
  },
  {
    q_zh: '為什麼碰撞測試 {{["doIf", ["touching:", ""]]}} 需要放在迴圈（例如 {{["doForever"]}}）裡面？為甚麼這個程式會不成功？',
    code: ['<xml><block type="event_whenflagclicked" id="qF/u?3d^uavM0r]0tfXZ" x="15" y="218"><next><block type="control_if" id="6c7-V0w/iMg%D7nZYd=:"><value name="CONDITION"><block type="sensing_touchingobject" id="UwRYw}~O$v^FNwo0;wNd"><value name="TOUCHINGOBJECTMENU"><shadow type="sensing_touchingobjectmenu" id="sJ%#T2njWsZMbZ4$0k/d"><field name="TOUCHINGOBJECTMENU">_mouse_</field></shadow></value></block></value><statement name="SUBSTACK"><block type="looks_sayforsecs" id="w#u~Lk0.QA}C-lN{L^cm"><value name="MESSAGE"><shadow type="text" id="D?#|6OSeLjH_J[s6+3+T"><field name="TEXT">Hello!</field></shadow></value><value name="SECS"><shadow type="math_number" id="4^jAO#CeJIE`;3b8)3O7"><field name="NUM">0.5</field></shadow></value></block></statement></block></next></block></xml>']
  },
  {
    q_zh: '[戰略] 當兩個角色發生碰撞的時候要有一些事情發生的話，你要怎麼寫？請你用白話來解釋。'
  },
  {
    q_zh: '兩個角色的程式功能都很像。請設計一個簡單的程式讓兩個角色不斷的碰移動，偶爾碰撞。測了之後，你覺得哪一個寫法比較好？為甚麼？',
    code: [
      '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="event_whenflagclicked" id="qF/u?3d^uavM0r]0tfXZ" x="-293" y="151"><next><block type="motion_pointindirection" id="|P`Zu|=T1k9E:uu$j?9a"><value name="DIRECTION"><shadow type="math_angle" id="w0K/-$J9$IyYi:r+_*%t"><field name="NUM">90</field></shadow></value><next><block type="motion_gotoxy" id="0iyP!0t9IQzVPP?wp-vv"><value name="X"><shadow type="math_number" id="e[`yC:xda7^T4R_lfla8"><field name="NUM">-21</field></shadow></value><value name="Y"><shadow type="math_number" id="*_!1Oc{w|Bq?)X[J0H_g"><field name="NUM">14</field></shadow></value><next><block type="control_forever" id="^HeiCP(Z;kK?bR%]W75#"><statement name="SUBSTACK"><block type="motion_movesteps" id="{=i6RPtdB6XIfIg-LUg["><value name="STEPS"><shadow type="math_number" id="^N?F0RFF,*#i^CUwb[ns"><field name="NUM">10</field></shadow></value><next><block type="motion_ifonedgebounce" id="V5!J`0=Mw$[;jQ~8ipsl"><next><block type="control_if" id="g^5_Tw%:hQ%rt_SFS8Rj"><value name="CONDITION"><block type="sensing_touchingobject" id="}140upFA@$CuXfBB+v16"><value name="TOUCHINGOBJECTMENU"><shadow type="sensing_touchingobjectmenu" id="1zG[_x_JXoNqDZxS-+{)"><field name="TOUCHINGOBJECTMENU">_mouse_</field></shadow></value></block></value><statement name="SUBSTACK"><block type="looks_sayforsecs" id="-bqilo,xF1zs)yo,c^,z"><value name="MESSAGE"><shadow type="text" id="/:|(Sz*Y:9$4}|E9p5mt"><field name="TEXT">Hello!</field></shadow></value><value name="SECS"><shadow type="math_number" id="l6H~d[M9r1P}(U+!DtiK"><field name="NUM">0.5</field></shadow></value></block></statement></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>',
      '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="event_whenflagclicked" id="qF/u?3d^uavM0r]0tfXZ" x="-492" y="120"><next><block type="motion_pointindirection" id="|P`Zu|=T1k9E:uu$j?9a"><value name="DIRECTION"><shadow type="math_angle" id="w0K/-$J9$IyYi:r+_*%t"><field name="NUM">90</field></shadow></value><next><block type="motion_gotoxy" id="0iyP!0t9IQzVPP?wp-vv"><value name="X"><shadow type="math_number" id="e[`yC:xda7^T4R_lfla8"><field name="NUM">-21</field></shadow></value><value name="Y"><shadow type="math_number" id="*_!1Oc{w|Bq?)X[J0H_g"><field name="NUM">14</field></shadow></value><next><block type="control_forever" id="^HeiCP(Z;kK?bR%]W75#"><statement name="SUBSTACK"><block type="motion_movesteps" id="{=i6RPtdB6XIfIg-LUg["><value name="STEPS"><shadow type="math_number" id="^N?F0RFF,*#i^CUwb[ns"><field name="NUM">10</field></shadow></value><next><block type="motion_ifonedgebounce" id="V5!J`0=Mw$[;jQ~8ipsl"></block></next></block></statement></block></next></block></next></block></next></block><block type="event_whenflagclicked" id=",zo`F74g*,^awFDjRVB4" x="-282" y="115"><next><block type="control_forever" id="Kg$zYENP7yLuKbrw(ZLn"><statement name="SUBSTACK"><block type="control_if" id="g^5_Tw%:hQ%rt_SFS8Rj"><value name="CONDITION"><block type="sensing_touchingobject" id="}140upFA@$CuXfBB+v16"><value name="TOUCHINGOBJECTMENU"><shadow type="sensing_touchingobjectmenu" id="1zG[_x_JXoNqDZxS-+{)"><field name="TOUCHINGOBJECTMENU">_mouse_</field></shadow></value></block></value><statement name="SUBSTACK"><block type="looks_sayforsecs" id="-bqilo,xF1zs)yo,c^,z"><value name="MESSAGE"><shadow type="text" id="/:|(Sz*Y:9$4}|E9p5mt"><field name="TEXT">Hello!</field></shadow></value><value name="SECS"><shadow type="math_number" id="l6H~d[M9r1P}(U+!DtiK"><field name="NUM">0.5</field></shadow></value></block></statement></block></statement></block></next></block></xml>'
    ]
  },
  
  
  // ############################################################
  // [C4] On the Dance Floor—Repeated Run Again
  // project: https://scratch.mit.edu/projects/118501117/#player
  // ############################################################
  
  {
    q: 'Can {{["doForever"]}} be placed in other loop blocks?'
  },
  {
    q: 'Can {{["doForever"]}} be placed in {{["doForever"]}}?'
  },
  {
    q: '這個程式執行會大概花多少時間？',
    props: ['permutable'],  // question template with one variable
    code: ['']
  },{
    
    q: '這份程式碼的效果是什麼? {{["doIfElse",["=", ["+", "ni hao", "3"], 310],[["setGraphicEffect:to:", "fisheye", ["readVariable", "x"]]],""]}}',
    props: ['permutable'] ,  // question template with one variable
  }
];
