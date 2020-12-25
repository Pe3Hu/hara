//playing field displayed on screen
class board {
  constructor (){
    this.const = {
      a: CELL_SIZE,
      menu: {
        buttons: 10,
        inscription: 0
      },
      grid: {
        x: null,
        y: null,
      },
      blend: {
        size: 4,
        count: 3,
        shread: 2,
        a: null
      }
    }
    this.var = {
      layer: 9,
      id: {
        button: 0,
        border: 0,
        inscription: 0
      },
      menu: {
        button: 0
      }
    }
    this.array = {
      layer: [],
      button: [],
      border: [],
      inscription: [],
      offset: []
    }
    this.const.blend.a = Math.floor(
      ( CANVAS_GRID.x - 3.5 ) * CELL_SIZE /
      ( this.const.blend.size + 1 ) / this.const.blend.count );

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

    for ( let i = 0; i < this.var.layer + 1; i++ )
      this.array.offset.push( [] );

    let layer = 3;
    this.array.offset[layer].push( createVector( CELL_SIZE * 0.5, CELL_SIZE * 0.5 ) );
    layer = 6;
    this.array.offset[layer].push( createVector( CELL_SIZE * Math.floor( this.const.grid.x / 2 ), CELL_SIZE * 2.5 ) );
    layer = 7;
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 2 ),
      CELL_SIZE * Math.floor( this.const.grid.y * 7 / 24 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x - 6 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 4 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x - 6 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 2 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 2 ),
      CELL_SIZE * Math.floor( this.const.grid.y * 13 / 16 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 2 ),
      CELL_SIZE * Math.floor( this.const.grid.y * 7 / 12 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( 5 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 2 ) ) );
    layer = 8;
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 2 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 2 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 4 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 2 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x * 3 / 4 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 2 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 2 ),
      CELL_SIZE * Math.floor( this.const.grid.y * 5 / 16 ) ) );
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x / 2  ),
      CELL_SIZE * Math.floor( this.const.grid.y * 11 / 16 ) ) );
    layer = 9;
    this.array.offset[layer].push( createVector(
      CELL_SIZE * Math.floor( this.const.grid.x * 3 / 4 ),
      CELL_SIZE * Math.floor( this.const.grid.y / 2 ) ) );
  }

  initLayers(){
    this.array.layer.push( new settlement( 4 ) );
    this.array.layer.push( new square( 2 ) );
    this.array.layer.push( new scroll() );
    this.array.layer.push( new blend( this.const.blend.size, this.const.blend.shread, this.const.blend.a ) );
    this.array.layer.push( new carpet() );
    this.array.layer.push( new isle() );
    this.array.layer.push( new debate() );
    this.array.layer.push( new collision() );
    this.array.layer.push( new grappled() );
    this.array.layer[this.array.layer.length - 1].setOffsets( this.array.offset[this.array.layer.length - 1] );
    this.array.layer.push( new joust() );
  }

  initBorders(){
    //
    let layer = MENU_LAYER;
    let name = 'layerMenu';
    let offset = createVector( CELL_SIZE * ( CANVAS_GRID.x - 2.25 ), CELL_SIZE * 0.5 );
    let size = createVector( CELL_SIZE * 2, CELL_SIZE * ( this.var.menu.button + 1 ) );
    this.addBorder( layer, name, offset, size );

    layer = 3;
    name = 'blendMenu';
    offset = this.array.offset[layer][0];
    let l = this.array.layer[layer].table.shred[this.const.blend.shread].length;
    size = createVector( CELL_SIZE * ( 16 * 1.25 + 3 ), CELL_SIZE * 1.25 * l + CELL_SIZE * 4 );
    this.addBorder( layer, name, offset, size );

    name = 'blendSreds';
    offset = this.array.offset[layer][0].copy();
    offset.y +=  CELL_SIZE * 1.25 * l + CELL_SIZE * 4.5;
    this.array.offset[layer][1] = offset;
    size = createVector(
      this.const.blend.a * ( ( this.const.blend.size + 1 ) * this.const.blend.count - 0.25 ),
      this.const.blend.a * ( this.const.blend.size + 0.75 ) );
    this.addBorder( layer, name, offset, size );

    layer = 6;
    let t = this.array.layer[layer].data.tribune;
    this.array.offset[layer][0].x -= t.const.a * 1.5 * ( t.const.m / 2 - 0.5 );
    name = 'tribune';
    offset = this.array.offset[layer][0].copy();
    offset.x -= t.const.a + this.const.a;
    offset.y -= this.const.a + ( 1 - t.const.size % 2 ) * t.const.r;
    size = createVector(
      t.const.a * 1.5 * ( t.const.m + 1/3 ) + this.const.a * 2,
      t.const.r * ( t.const.n * 2)  + this.const.a * 2 );
    this.addBorder( layer, name, offset, size );

    name = 'communityZoomOrigin';
    offset = this.array.offset[layer][0].copy();
    size = createVector();
    offset.y += t.const.r * ( t.const.n * 2 - ( 1 - t.const.size % 2 ) ) + this.const.a * 2;
    offset.x += t.const.a * 1.5 * ( t.const.m / 2 - 0.5 );
    this.addBorder( layer, name, offset, size );
    this.array.offset[layer].push( offset.copy() );

    name = 'communityZoomShifted';
    this.addBorder( layer, name, offset, size );
    this.array.offset[layer].push( offset.copy() );

    this.updateBorders();
  }

  addBorder( layer, name, offset, size ){
    this.array.border.push( new border( this.var.id.border, layer, name, offset, size ));
    this.var.id.border++;
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
      case 6:
        offsetID = 3;
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

    name = 'switchToElection';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToDominance';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToSkirmish';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    name = 'switchToTourney';
    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 1.25 ), CELL_SIZE * ( 1.5 + type ) );
    this.addButton( layer, name, type, vec.copy() );

    layer = 1;
    name = '';
    type = this.const.menu.buttons;
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

    type++;
    vec = createVector( CELL_SIZE * ( CANVAS_GRID.x - 3.25 ), CELL_SIZE * 2.5 );
    this.addButton( layer, name, type, vec.copy() );

    for ( let i = 0; i < this.array.button.length; i++ )
      if( this.array.button[i].const.layer == MENU_LAYER )
        this.array.button[i].var.onScreen = true;

    this.updateButtons();
  }

  addButton( layer, name, type, center ){
    this.array.button.push( new button( this.var.id.button, layer, name, type, center ));
    this.var.id.button++;
    if( layer == MENU_LAYER )
      this.var.menu.button++;
  }

  cleanButtons(){
    let begin = this.var.menu.buttons;

    for( let i = begin; i < this.array.button.length; i++ )
      this.array.button[i].var.onScreen = false;
  }

  updateButtons(){
    this.cleanButtons();

    let offsetID = this.var.menu.button;
    let count = null;

    for( let i = offsetID; i < this.array.button.length; i++ ){
        if( this.array.button[i].const.layer ==  this.var.layer )
          this.array.button[i].var.onScreen = true;
    }
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
    this.array.inscription.push( new inscription( this.var.id.inscription, layer, content, center, size ));
    this.var.id.inscription++;
  }

  cleanInscriptions(){
    for( let i = this.const.menu.inscription; i < this.array.inscription.length; i++ )
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
    if( buttonID >= 0 && buttonID < this.const.menu.buttons )
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
        if( buttonID > this.const.menu.buttons - 1 && buttonID < this.const.menu.buttons + length )
          layer.activateButton( this.array.button, buttonID );
        break;
      case 5:
        let buttonNumber = 130;
        if( buttonID == buttonNumber ||
            buttonID == buttonNumber + 1 ){
          let shift = -( buttonID - buttonNumber - 0.5 ) * 2;
          layer.part.underworld.switchFloor( shift );
        }
        break;
    }

    this.update();
  }

  click(){
    this.buttonClickCheck();

    this.array.layer[this.var.layer].click( this.array.offset[this.var.layer] );

    switch ( this.var.layer ) {
      case 6:
      if( this.array.layer[this.var.layer].data.tribune.data.zoom == null )
        this.array.border[4].setSize( createVector() );
      else{
        let l = this.array.layer[this.var.layer].data.tribune.data.zoom.const.a * 3;
        let size = createVector( ( CELL_SIZE + l ) * 2, ( CELL_SIZE + l ) * 2 );
        this.array.border[4].setSize( size );
        let offset = this.array.border[5].const.offset.copy();
        offset.x -= size.x / 2;
        this.array.border[4].setOffset( offset );
      }
      break;
    }

  }

  key(){
    this.array.layer[this.var.layer].key();
  }

  moved(){
    this.array.layer[this.var.layer].moved( this.array.offset[this.var.layer] );
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
