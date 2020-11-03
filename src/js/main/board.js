//playing field displayed on screen
class board {
  constructor (){
    this.const = {
      a: CELL_SIZE,
      menuButtons: 10,
      menuInscription: 0,
      grid: {
        x: null,
        y: null,
      },
      blendSize: 4,
      blendCount: 3,
      blendShred: 2,
      blendA: null
    }
    this.var = {
      layer: 5,
      buttonID: 0,
      borderID: 0,
      inscriptionID: 0,
      menuButton: 0
    }
    this.array = {
      layer: [],
      button: [],
      border: [],
      inscription: [],
      offset: []
    }
    this.const.blendA = Math.floor( ( CANVAS_GRID.x - 3.5 ) * CELL_SIZE / ( this.const.blendSize + 1 ) / this.const.blendCount );

    this.init();
  }

  init(){
    this.initGrid();
    this.initLayers();
    this.initOffsets();
    this.initButtons();
    this.initBorders();
    this.initInscriptions();
  }

  initGrid(){
    this.const.grid.x = Math.floor( CANVAS_SIZE.x / CELL_SIZE );
    this.const.grid.y = Math.floor( CANVAS_SIZE.y / CELL_SIZE );
  }

  initOffsets(){
    this.array.offset = [];
    this.array.offset.push( [] );
    this.array.offset.push( [] );
    this.array.offset.push( [] );
    this.array.offset.push( [] );

    let layer = 3;
    this.array.offset[layer].push( createVector( CELL_SIZE *  0.5, CELL_SIZE * 0.5 ) );
  }

  initLayers(){
    this.array.layer.push( new settlement( 4 ) );
    this.array.layer.push( new square( 2 ) );
    this.array.layer.push( new scroll() );
    this.array.layer.push( new blend( this.const.blendSize,  this.const.blendShred, this.const.blendA ) );
    this.array.layer.push( new carpet() );
    this.array.layer.push( new isle() );
  }

  initBorders(){
    //
    let layer = MENU_LAYER;
    let name = 'layerMenu';
    let offset = createVector( CELL_SIZE * ( CANVAS_GRID.x - 2.25 ), CELL_SIZE * 0.5 );
    let size = createVector( CELL_SIZE * 2, CELL_SIZE * ( this.var.menuButton + 1 ) );
    this.addBorder( layer, name, offset, size );

    layer = 3;
    name = 'blendMenu';
    offset = this.array.offset[layer][0];
    let l = this.array.layer[layer].table.shred[this.const.blendShred].length;
    size = createVector( CELL_SIZE * ( 16 * 1.25 + 3 ), CELL_SIZE * 1.25 * l + CELL_SIZE * 4 );
    this.addBorder( layer, name, offset, size );

    name = 'blendSreds';
    offset = this.array.offset[layer][0].copy();
    offset.y +=  CELL_SIZE * 1.25 * l + CELL_SIZE * 4.5;
    this.array.offset[layer][1] = offset;
    size = createVector(
      this.const.blendA * ( ( this.const.blendSize + 1 ) * this.const.blendCount - 0.25 ),
      this.const.blendA * ( this.const.blendSize + 0.75 ) );
    this.addBorder( layer, name, offset, size );

    this.updateBorders();
  }

  addBorder( layer, name, offset, size ){
    this.array.border.push( new border( this.var.borderID, layer, name, offset, size ));
    this.var.borderID++;
  }

  cleanBorders(){
    for ( let i = 0; i < this.array.border.length; i++ )
      if( this.array.border[i].const.layer != MENU_LAYER )
        this.array.border[i].var.onScreen = false;
  }

  updateBorders(){
    let offsetID = null;
    this.cleanBorders();

    switch ( this.var.layer ) {
      case 3:
        offsetID = 1;
        this.array.border[offsetID].var.onScreen = true;
        this.array.border[offsetID + 1].var.onScreen = true;
        break;
    }
  }

  initButtons(){
    //
    let layer, name, type, vec, offset;

    //set layer change buttons
    layer = MENU_LAYER;
    name = 'switchToExpansion';
    type = 0;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToPolimino';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToScroll';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToBlend';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToCarpet';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToShattered';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    layer = 1;
    name = '';
    type = this.const.menuButtons;
    vec = createVector( CELL_SIZE * 20.5, CELL_SIZE * 2 );
    this.addButton( layer, name, type, vec.copy() );

    layer = 1;
    type++;
    vec = createVector( CELL_SIZE * 20.5, CELL_SIZE * 4 );
    this.addButton( layer, name, type, vec.copy() );

    layer = 3;
    type++;
    let laws = this.array.layer[layer].obj.laws.obj;
    offset = this.array.offset[layer][0];
    let l = this.array.layer[layer].obj.laws.array.value.length;

    let i = 0;
    for( let subtype in laws )
      for( let location in laws[subtype] ){
        let j = 0;
        let jj = 0;
        if( subtype == 'single' || subtype == 'total' )
          jj = 1;

        for( let value in laws[subtype][location] ){
          name = subtype + ' ' + location + ' ' + value;
          vec = createVector( CELL_SIZE * ( i * 1.25 + 2.75 ), CELL_SIZE * ( ( j + jj ) * 1.25 + 3 ) );
          vec.add( offset );
          this.addButton( layer, name, type, vec.copy() );
          j++;
        }
        i++
      }

    layer = 5;
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 3.25 ), CELL_SIZE * 1.5 );
    this.addButton( layer, name, type, vec.copy() );

    layer = 5;
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 3.25 ), CELL_SIZE * 2.5 );
    this.addButton( layer, name, type, vec.copy() );

    for ( let i = 0; i < this.array.button.length; i++ )
      if( this.array.button[i].const.layer == MENU_LAYER )
        this.array.button[i].var.onScreen = true;

    this.updateButtons();
  }

  addButton( layer, name, type, center ){
    this.array.button.push( new button( this.var.buttonID, layer, name, type, center ));
    this.var.buttonID++;
    if( layer == MENU_LAYER )
      this.var.menuButton++;
  }

  cleanButtons(){
    let begin = this.var.menuButtons;

    for( let i = begin; i < this.array.button.length; i++ )
      this.array.button[i].var.onScreen = false;
  }

  updateButtons(){
    this.cleanButtons();

    let offsetID = this.var.menuButton;
    let count = null;

    for( let i = offsetID; i < this.array.button.length; i++ ){
        if( this.array.button[i].const.layer ==  this.var.layer )
          this.array.button[i].var.onScreen = true;
    }

    /*switch ( this.var.layer ) {
      case 0:
          break;
      case 1:
          this.array.button[offsetID].var.onScreen = true;
          this.array.button[offsetID + 1].var.onScreen = true;
          break;
      case 3:
          offsetID += 2;
          let l = this.array.layer[this.var.layer].obj.laws.array.value.length;
          let length = 16 * ( l + 0.5 );
          for( let i = offsetID; i < length + offsetID ; i++ ){
            this.array.button[i].var.onScreen = true;
            this.array.button[i].setStatus( 2 );
          }
          break;
      case 5:
          offsetID =
          this.array.button[offsetID].var.onScreen = true;
          this.array.button[offsetID + 1].var.onScreen = true;
          break;
      }*/
  }

  initInscriptions(){
    let layer, content, center, size;
    let a = this.const.a * 1.25;

    layer = 3;
    size = FONT_SIZE;

    let laws = this.array.layer[layer].obj.laws;
    let offset = this.array.offset[0];
    let i = 0;

    for( let subtype in laws.obj ){
      let j = 0;
      center = createVector( a * ( 4 * i + j + 1.25 ) + CELL_SIZE * 3.5, CELL_SIZE * 1.5 );
      center.add( offset );
      content = subtype;
      this.addInscription( layer, content, center, size );
      j = -1;

      for( let location in laws.obj[subtype] )
        if( !location.includes( 'not' ) ){
          center = createVector( a * ( 4 * i + j + 1.25 ) + CELL_SIZE * 3.5, CELL_SIZE * 2.5 );
          center.add( offset );
          content = location;
          this.addInscription( layer, content, center, size );
          j += 2;
        }

      i++;
    }

    i = 0;

    for( let value in laws.obj['shortest']['on'] ){
      center = createVector( a * -1.5  + CELL_SIZE * 3.5, a * i + CELL_SIZE * 3.5 );
      center.add( offset );
      content = laws.table['label'][value];
      this.addInscription( layer, content, center, size );
      i++;
    }

    this.updateInscription();
  }

  addInscription( layer, content, center, size ){
    this.array.inscription.push( new inscription( this.var.inscriptionID, layer, content, center, size ));
    this.var.inscriptionID++;
  }

  cleanInscriptions(){
    for( let i = this.const.menuInscription; i < this.array.inscription.length; i++ )
      this.array.inscription[i].var.onScreen = false;
  }

  updateInscription(){
    let offsetID = null;
    this.cleanInscriptions();

    switch ( this.var.layer ) {
      case 3:
        let laws = this.array.layer[this.var.layer].obj.laws;
        offsetID = 0;
        //4 subtypes * ( 2 locations + 1 name subtype )
        let length = laws.array.value.length + 3 * 4 + 1;
        for( let i = offsetID; i < length + offsetID; i++ )
            this.array.inscription[i].var.onScreen = true;
        break;
    }
  }

  update(){
    this.updateButtons();
    this.updateBorders();
    this.updateInscription();
  }

  buttonClickCheck(){
    let x = mouseX;// - this.offset.x;
    let y = mouseY;// - this.offset.y;
    let vec = createVector( x, y );
    let minDist = INFINITY;
    let buttonID = null;

    for( let i = 0; i < this.array.button.length; i++ )
      if ( vec.dist( this.array.button[i].const.center ) < minDist ){
        minDist = vec.dist( this.array.button[i].const.center );
        buttonID = i;
      }
    if ( minDist > CELL_SIZE / 2 || !this.array.button[buttonID].var.onScreen )
        return;

    //change board layer
    if( buttonID >= 0 && buttonID < 6 )
      this.switchLayer( buttonID );

    let layer = this.array.layer[this.var.layer];
    switch ( this.var.layer ) {
      case 1:
        switch ( buttonID ) {
          case 4:
            this.array.layer[this.var.layer].nextCell();
            break;
          case 5:
            this.array.layer[this.var.layer].returnCard();
            break;
        }
        break;
      case 3:
        let length = 16 * ( layer.obj.laws.array.value.length + 0.5 ) + 1;
        if( buttonID > 5 && buttonID < 5 + length )
          layer.activateButton( this.array.button, buttonID );
        break;
      case 5:
        if( buttonID > 127 && buttonID < 130 ){
          let shift = -( buttonID - 128.5 ) * 2;
          layer.part.underworld.switchFloor( shift );
        }
        break;
    }

    this.update();
  }

  click(){
    this.buttonClickCheck();

    this.array.layer[this.var.layer].click( this.array.offset[this.var.layer] );//this.array.offset[this.var.layer]
  }

  key(){
    this.array.layer[this.var.layer].key();
  }

  switchLayer( buttonID ){
    let buttonOffset = 0;
    this.var.layer = buttonID - buttonOffset;
  }

  //drawing game frame
  draw(){
    //draw borders
    for( let i = 0; i < this.array.border.length; i++ )
      this.array.border[i].draw( this.var.layer );

    //draw buttons
    for( let i = 0; i < this.array.button.length; i++ )
      this.array.button[i].draw( this.var.layer );

    //draw inscriptions
    for( let i = 0; i < this.array.inscription.length; i++ )
        this.array.inscription[i].draw( this.var.layer );

    //draw layer
    this.array.layer[this.var.layer].draw( this.array.offset[this.var.layer] );
  }
}
