//playing field displayed on screen
class board {
  constructor ( offset ){
    this.offset = offset;
    this.const = {
      a: cellSize,
      menuButtons: 10,
      grid: {
        x: null,
        y: null,
      }
    }
    this.var = {
      layer: 1,
      buttonID: 0,
      borderID: 0
    }
    this.array = {
      layer: [],
      button: [],
      border: []
    }

    this.init();
  }

  init(){
    this.initGrid();
    this.initLayers();
    this.initBorders();
    this.initButtons();
  }

  initGrid(){
    this.const.grid.x = Math.floor( canvasSize.x / cellSize );
    this.const.grid.y = Math.floor( canvasSize.y / cellSize );
  }

  initLayers(){
    this.array.layer.push( new settlement( 4 ) );
    this.array.layer.push( new square( 2 ) );
  }

  initBorders(){
    //let craftView = this.array.layer[0].array.view.length * 9;
    //let gardenView = this.array.layer[1].array.view.length * 8;
    let layer = 99;
    let name = 'layerMenu';
    let offset = createVector( cellSize * ( canvasGrid.x - 2.5 ), cellSize * 0.5 );
    let size = createVector( cellSize * 2, cellSize * 21 );
    this.addBorder( layer, name, offset, size );

    this.updateBorders();
  }

  addBorder( layer, name, offset, size ){
    this.array.border.push( new border( this.var.borderID, layer, name, offset, size ));
    this.var.borderID++;
  }

  cleanBorders(){
    for ( let i = 0; i < this.array.border.length; i++ )
      if( this.array.border[i].layer != 99 )
        this.array.border[i].onScreen = false;
  }

  updateBorders(){
    let offsetID = null;
    this.cleanBorders();

    switch ( this.var.layer ) {
      case 0:
        //offsetID = 1;
        //this.array.border[offsetID].onScreen = true;
        break;
    }
  }

  initButtons(){
    //let craftView = this.array.layer[0].array.view.length * 9;
    //let gardenView = this.array.layer[1].array.view.length * 7.5;
    let layer;
    let name;
    let type;
    let vec;

    //set layer change buttons
    layer = 99;
    name = 'switchToExpansion';
    type = 0;
    vec = createVector( cellSize * ( canvasGrid.x - 1.5 ), cellSize * 1.5 );
    this.addButton( layer, name, type, vec.copy() );
    name = 'switchToPolimino';
    type++;
    vec = createVector( cellSize * ( canvasGrid.x - 1.5 ), cellSize * 2.5 );
    this.addButton( layer, name, type, vec.copy() );


    layer = 1;
    type = this.const.menuButtons;
    vec = createVector( cellSize * 20.5, cellSize * 2 );
    this.addButton( layer, name, type, vec.copy() );

    layer = 1;
    type++;
    vec = createVector( cellSize * 20.5, cellSize * 4 );
    this.addButton( layer, name, type, vec.copy() );

    for ( let i = 0; i < this.array.button.length; i++ )
      if( this.array.button[i].layer == 99 )
        this.array.button[i].onScreen = true;

    this.updateButtons();
  }

  addButton( layer, name, type, center ){
    this.array.button.push( new button( this.var.buttonID, layer, name, type, center ));
    this.var.buttonID++;
  }

  cleanButtons(){
    for ( let i = this.const.menuButtons; i < this.array.button.length; i++ )
        this.array.button[i].onScreen = false;
  }

  updateButtons(){
    this.cleanButtons();

    let offsetID = null;
    let count = null;

    switch ( this.var.layer ) {
      case 0:
          break;
      case 1:
          offsetID = 2;
          this.array.button[offsetID].onScreen = true;
          this.array.button[offsetID + 1].onScreen = true;
          break;
      }
  }

  update(){
    this.updateButtons();
    this.updateBorders();
  }

  buttonClickCheck(){
    let x = mouseX;// - this.offset.x;
    let y = mouseY;// - this.offset.y;
    let vec = createVector( x, y );
    let minDist = infinity;
    let buttonID = null;

    for( let i = 0; i < this.array.button.length; i++ )
      if ( vec.dist( this.array.button[i].center ) < minDist ){
        minDist = vec.dist( this.array.button[i].center );
        buttonID = i;
      }
    if ( minDist > cellSize / 2 || !this.array.button[buttonID].onScreen )
        return;

    //change board layer
    if( buttonID >= 0 && buttonID < 2 )
      this.switchLayer( buttonID );

    if( buttonID == 2 )
      this.array.layer[this.var.layer].nextCell();

    if( buttonID == 3 )
      this.array.layer[this.var.layer].returnCard();

    this.update();
  }

  click(){
    this.buttonClickCheck();

    if( this.var.layer == 1 )
      this.array.layer[this.var.layer].click();
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

    //draw layer
    this.array.layer[this.var.layer].draw();

    //draw buttons
    for( let i = 0; i < this.array.button.length; i++ )
      this.array.button[i].draw( this.var.layer );
  }
}
