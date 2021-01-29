//
class scroll {
  constructor (){
    this.const = {
      a: CELL_SIZE * 0.2,
      markup:{
        n: null,
        m: null
      }
    };
    this.array = {
      rune: [],
      ink: []
    };
    this.var = {
      index: 0,
      ism: null,
      attached: {
        ligature: null,
        trace: [],
        moves: []
      },
      currentRune: 0
    };
    this.table = {
      markup: [],
      totem: []
    };
    this.flag = {
      update: true
    }

    this.init();
  }

  initMarkup(){
    //0 - knots
    //1 - ism
    this.table.markup = [ [], [] ];
    let size = 10 * this.const.a;
    let leftBorder = 2 * CELL_SIZE;
    let rightBorder = ( CANVAS_GRID.x - 3.5 ) * CELL_SIZE;
    this.const.markup.n = Math.floor( ( rightBorder - leftBorder ) / size );
    let topBorder = 2 * CELL_SIZE;
    let botBorder = ( CANVAS_GRID.y - 1 ) * CELL_SIZE;
    this.const.markup.m = 3;//Math.floor( ( botBorder - topBorder ) / size );

    for( let i = 0; i < this.const.markup.m; i++ ){
      this.table.markup[0].push( [] );

      for( let j = 0; j < this.const.markup.n; j++ )
        this.table.markup[0][i].push( createVector( leftBorder + j * size, topBorder + i * size ) );

    let x = leftBorder + ( rightBorder - leftBorder ) / 2;
    let y = topBorder + ( botBorder - topBorder ) / 2;
    this.table.markup[1].push( createVector( x, y ) )
    }
  }

  initTotems(){
    this.table.totem = [ 'A', 'J', 'B', 'D', 'V', 'O', 'F', 'M', 'Q', 'G', 'N', 'L', 'C', 'E', 'R', 'U', 'X', 'Z', 'W', 'Y', 'S', 'K', 'T', 'P', 'H', 'I' ]
  }

  initRunes(){
    this.array.rune = [ [], [] ];

    for( let i = 0; i < this.table.totem.length; i++ )
      this.addRune( this.table.totem[i] );
  }

  initIsm(){
    let size = 9;
    let a = this.const.a * 5;
    this.var.ism = new ism( a, size );
  }

  init(){
    this.initMarkup();
    this.initTotems();
    this.initRunes();
    this.initIsm();
  }

  addRune( totem ){
    this.array.rune[0].push( new rune( this.var.index, this.const.a, totem ) );
    this.var.index++;
  }

  tryToAttach(){
    let ism = this.var.ism;
    let rune = this.array.rune[0][this.var.currentRune];
    let ligature = ism.var.ligature;
    let moves = rune.array.move;
    let trace = [ ligature ];

    for( let i = 0; i < moves.length; i++ ){
      let last = trace[trace.length - 1];
      let grid = ism.convertIndex( last );
      let parity = grid.y % 2;
      grid.add( ism.array.neighbor[parity][moves[i]] );

      if( ism.checkInk( grid ) ){
        let index = ism.convertGrid( grid );
        trace.push( index );
      }
    }

    let obj = {
      ligature: ligature,
      trace: trace,
      moves: moves
    };
    return obj;
  }

  attachRune( obj ){
    let ism = this.var.ism;
    ism.flag.runeAttached = true;
    let flag = false;

    if( this.var.attached.trace.length > 0 )
      for( let i = 0; i < this.var.attached.trace.length; i++ ){
        let grid = ism.convertIndex( this.var.attached.trace[i] );
        ism.array.knot[grid.y][grid.x].switchStencil();
      }

    if( ism.flag.fillInk )
      this.fillInk();
    else{
      this.var.attached = obj;
      flag = true;

      for( let i = 0; i < this.var.attached.trace.length; i++ ){
        let grid = ism.convertIndex( this.var.attached.trace[i] );
        ism.array.knot[grid.y][grid.x].switchStencil();
      }
    }
  }

  fillInk(){
    this.array.ink.push( this.var.attached );
    let ism = this.var.ism;

    for( let i = 0; i < this.var.attached.trace.length; i++ ){
      let grid = ism.convertIndex( this.var.attached.trace[i] );
      ism.array.knot[grid.y][grid.x].setInk( 1 );
    }

    ism.setNextLigatures( this.array.ink );
    ism.flag.fillInk = false;
    ism.var.ligature = null;

    this.cleanAttached();
    let rune = this.array.rune[0].splice( this.var.currentRune, 1 );
    this.array.rune[1].push( rune );
    this.var.currentRune = 0;
  }

  cleanAttached(){
    this.var.ism.flag.runeAttached = false;
    this.var.attached = {
      ligature: null,
      trace: [],
      moves: []
    }
  }

  update(){
    let ism = this.var.ism;

    if( this.var.ism.var.ligature != null ){
      let obj = this.tryToAttach();
      if( obj.trace.length == 5 )
        this.attachRune( obj );
      else{
        for( let i = 0; i < this.var.attached.trace.length; i++ ){
          let grid = ism.convertIndex( this.var.attached.trace[i] );
          ism.array.knot[grid.y][grid.x].switchStencil();
        }
        this.cleanAttached();
      }
    }
  }

  pickRune(){
    let a = this.array.rune[0][0].const.a * 5;
    let mouse = createVector( mouseX - a * 0.5, mouseY - a * 0.3 );
    let min = INFINITY;
    let index = null;
    let i = 0;

    for( let j = 0; j < this.array.rune[i].length; j++ ){
      let y = Math.floor( j / this.table.markup[0][0].length );
      let x = j % this.table.markup[0][0].length;
      let center = this.table.markup[0][y][x].copy();
      let d = dist( mouse.x, mouse.y, center.x, center.y );
      if( d < min ){
       index = j;
       min = d;
      }
    }

    if( min < a ){
      if( this.var.currentRune == index )
         this.array.rune[0][index].rotate()
      else
        this.var.currentRune = index;
    }
  }
  
  click(){
    this.var.ism.click( this.table.markup[1][0].copy() );
    this.pickRune();
    this.update();
  }

  key(){
    let rune = this.array.rune[0][this.var.currentRune];

    switch ( key ) {
      case ' ':
        rune.flip();
        break;
    }
  }

  moved( offsets ){
  }

  draw(){
    let i = 0;

    for( let j = 0; j < this.array.rune[i].length; j++ ){
      let index = j;
      let y = Math.floor( index / this.table.markup[0][0].length );
      let x = index % this.table.markup[0][0].length;
      this.array.rune[i][j].draw( this.table.markup[0][y][x].copy() );

      if( this.var.currentRune == j ){
        let r = this.array.rune[i][j].const.r * 2;
        let a = this.array.rune[i][j].const.a * 1.5;
        noFill();
        strokeWeight( 2 );
        rect( this.table.markup[0][y][x].x - r, this.table.markup[0][y][x].y - a, r * 6, a * 6 );
      }
    }

    this.var.ism.draw( this.table.markup[1][0].copy() );
  }
}
