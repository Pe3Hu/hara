//
class rune{
  constructor( index, a, totem ){
    this.const = {
      index: index,
      size: 5,
      a: a
    };
    this.var = {
      knot: {
        current: null,
        grid: null
      },
      totem: null,
      display: {
        mode: null,
        description: null
      },
      begin: createVector()
    };
    this.array = {
      knot: [],
      option: [],
      trace: [],
      move: [],
      way: [],
      hue: []
    };
    this.table = {
      rotate: [],
      flip: []
    };

    this.init( totem );
  }

  initNeighbors(){
    this.array.neighbor = [
      [
        createVector( 0, -1 ),
        createVector( 1, 0 ),
        createVector( 0, 1 ),
        createVector( -1, 1 ),
        createVector( -1, 0 ),
        createVector( -1, -1 ),
      ],
      [
        createVector( 1, -1 ),
        createVector( 1, 0 ),
        createVector( 1, 1 ),
        createVector( 0, 1 ),
        createVector( -1, 0 ),
        createVector( 0, -1 ),
      ]
    ];
  }

  initRotates(){
    this.table.rotate.push( [ 6, 11, 15, 14, 9, 5 ] );
    this.table.rotate.push( [ 3, 12, 19, 17, 8, 1 ] );
    this.table.rotate.push( [ 7, 16, 18, 13, 4, 2 ] );
  }

  initFlips(){
    this.table.flip.push( [ 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23 ] );
    this.table.flip.push( [ 1, 5, 10, 2, 6, 11, 15, 3, 7, 12, 16, 21, 8, 13, 17, 22, 14, 18, 23 ] );
  }

  initKnots(){
    for( let i = 0; i < this.const.size; i++ ){
      this.array.knot.push( [] );
      for( let j = 0; j < this.const.size; j++ ){
          let index = i * this.const.size + j;
          let grid = createVector( j, i );
          let vec = createVector( this.const.r * 2 * j, this.const.a * 1.5 * i );
          if( i % 2 == 1 )
            vec.x += this.const.r;
          this.array.knot[i].push( new knot( index, vec, grid, this.const.a * 0.9 ) );
      }
    }

    this.prepareKnotsAroundCenter();
    let index = 1;
    this.setCurrentKnot( index );
    this.array.trace.push( index );
    this.setOptionsAroundCurrentKnot();
  }

  initHues(){
    this.array.hue = [
      52,
      122,
      192,
      262,
      297,
      332
    ];
  }

  updateDisplay( mode ){
    this.var.display.mode = mode;

    switch ( mode ) {
      case 0:
        this.var.display.description = 'all visible knots';
        break;
      case 1:
        this.var.display.description = 'all visible & option knots';
        break;
      case 2:
        this.var.display.description = 'only involved knots';
        break;
    }
  }

  init( totem ){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHues();
    this.initNeighbors();
    this.initRotates();
    this.initFlips();
    this.initKnots();
    this.getTotem( totem );
    this.alignHorizontally();
    this.setParents();
    this.updateDisplay( 2 );
    this.flip();
  }

  setTotem( code ){
    switch ( code ) {
      case 266:
        this.var.totem = 'A';
        break;
      case 267:
        this.var.totem = 'J';
        break;
      case 268:
        this.var.totem = 'B';
        break;
      case 272:
        this.var.totem = 'D';
        break;
      case 273:
        this.var.totem = 'V';
        break;
      case 274:
        this.var.totem = 'O';
        break;
      case 290:
        this.var.totem = 'F';
        break;
      case 296:
        this.var.totem = 'M';
        break;
      case 297:
        this.var.totem = 'Q';
        break;
      case 300:
        this.var.totem = 'G';
        break;
      case 301:
        this.var.totem = 'N';
        break;
      case 302:
        this.var.totem = 'L';
        break;
      case 303:
        this.var.totem = 'C';
        break;
      case 304:
        this.var.totem = 'E';
        break;
      case 307:
        this.var.totem = 'R';
        break;
      case 310:
        this.var.totem = 'U';
        break;
      case 340:
        this.var.totem = 'X';
        break;
      case 343:
        this.var.totem = 'Z';
        break;
      case 444:
        this.var.totem = 'W';
        break;
      case 482:
        this.var.totem = 'Y';
        break;
      case 483:
        this.var.totem = 'S';
        break;
      case 488:
        this.var.totem = 'K';
        break;
      case 490:
        this.var.totem = 'T';
        break;
      case 513:
        this.var.totem = 'P';
        break;
      case 516:
        this.var.totem = 'H';
        break;
      case 518:
        this.var.totem = 'I';
        break;
    }

    this.getTotem( this.var.totem );
  }

  getTotem( totem ){
    let code = null;

    switch ( totem ) {
      case 'A':
        code = 266;
        break;
      case 'J':
        code = 267;
        break;
      case 'B':
        code = 268;
        break;
      case 'D':
        code = 272;
        break;
      case 'V':
        code = 273;
        break;
      case 'O':
        code = 274;
        break;
      case 'F':
        code = 290;
        break;
      case 'M':
        code = 296;
        break;
      case 'Q':
        code = 297;
        break;
      case 'G':
        code = 300;
        break;
      case 'N':
        code = 301;
        break;
      case 'L':
        code = 302;
        break;
      case 'C':
        code = 303;
        break;
      case 'E':
        code = 304;
        break;
      case 'R':
        code = 307;
        break;
      case 'U':
        code = 310;
        break;
      case 'X':
        code = 340;
        break;
      case 'Z':
        code = 343;
        break;
      case 'W':
        code = 444;
        break;
      case 'Y':
        code = 482;
        break;
      case 'S':
        code = 483;
        break;
      case 'K':
        code = 488;
        break;
      case 'T':
        code = 490;
        break;
      case 'P':
        code = 513;
        break;
      case 'H':
        code = 516;
        break;
      case 'I':
        code = 518;
        break;
    }

    let notation = this.array.neighbor[0].length;
    let moves = this.decode( code, notation );
    this.designRune( moves );
  }

  setCurrentKnot( index ){
    this.var.knot.current = index;
    this.var.knot.grid = this.convertIndex( index );
    this.array.knot[this.var.knot.grid.y][this.var.knot.grid.x].setStatus( 1 );
  }

  //0 - only free
  //1 - all
  cleanKnots( mode ){
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        switch ( mode ) {
          case 0:
            if( !this.array.knot[i][j].var.gutter )
              this.array.knot[i][j].setStatus( 0 );
            break;
          case 1:
            this.array.knot[i][j].setStatus( 0 );
            break;
        }
  }

  prepareKnotsAroundCenter(){
    let indexs = [];
    let half = ( this.const.size - 1 ) / 2;
    indexs.push( this.array.knot[half][half].const.index );

    for( let i = 0; i < half; i++ )
      for( let j = indexs.length - 1; j >= 0; j-- ){
        let grid = this.convertIndex( indexs[j] );
        let parity = ( grid.y % 2 );

        for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
          grid = this.convertIndex( indexs[j] );
          grid.add( this.array.neighbor[parity][l] );
          let addIndex = this.convertGrid( grid );
            if( !indexs.includes( addIndex ) && this.checkBorder( grid ) )
                indexs.push( addIndex );
        }
      }

      for( let i = 0; i < indexs.length; i++ ){
        let grid = this.convertIndex( indexs[i] );
        this.array.knot[grid.y][grid.x].var.visiable = true;
      }
  }

  setOptionsAroundCurrentKnot(){
    this.array.option = [];
    this.array.way = [];
    let grid = this.convertIndex( this.var.knot.current );
    let parity = ( grid.y % 2 );

    if( !this.checkGutter( grid ) )
      for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
        grid = this.convertIndex( this.var.knot.current );
        grid.add( this.array.neighbor[parity][l] );
        let addIndex = this.convertGrid( grid );
          if( !this.array.option.includes( addIndex ) && this.checkGutter( grid ) ){
            this.array.option.push( addIndex );
            this.array.way.push( l );
          }
      }
  }

  chooseOption(){
    let rand = Math.floor( Math.random() * this.array.option.length );
    let index = this.array.option[rand];
    let grid = this.convertIndex( index );
    this.setCurrentKnot( index );
    this.array.trace.push( index );
  }

  engageNextKnot(){
    this.chooseOption();
    this.setOptionsAroundCurrentKnot();
  }

  moveInChosenDirection( way, begin ){
    let flag = false;
    if( begin == null ){
      flag = true;
      begin = this.var.knot.grid;
    }
    else
      begin = this.convertIndex( begin );

    let neighbor = this.array.neighbor[begin.y % 2][way];
    let grid = createVector( neighbor.x + begin.x, neighbor.y + begin.y );
    if(  this.checkGutter( grid ) )
      if( flag ){
        let index = this.convertGrid( grid );
        this.array.trace.push( index );
        this.array.move.push( way );
        this.setCurrentKnot( index );
        this.setOptionsAroundCurrentKnot();
      }
      else
        return this.convertGrid( grid );
    else
      return null;

    return;
  }

  resultOfMove( way, begin ){
    let grid = this.convertIndex( begin );
    let parity = grid.y % 2;
    let neighbor = this.array.neighbor[parity][way];
    grid = createVector( neighbor.x + grid.x, neighbor.y + grid.y );
    if( this.checkGutter( grid ) )
      return -1;
    else
      return this.convertGrid( grid );

  }

  designRune( ways ){
    for( let i = 0; i < ways.length; i++ )
      this.moveInChosenDirection( ways[i], null);
    this.cleanKnots( 0 );
  }

  rotate( n, clockwise ){
    if( n == undefined )
      n = 1;
    if( clockwise == undefined )
      clockwise = 1;

    let trace = [];
    let centerLabel = 10;
    n = n % this.table.rotate[0].length;

    for( let i = 0; i <  this.array.trace.length ; i++ ){
      let gridP = this.convertIndex( this.array.trace[i] );
      let index = -1;

      if( this.array.knot[gridP.y][gridP.x].var.label == centerLabel ){
        let next = this.convertLabel( centerLabel );
        trace.push( next );
      }
      else
        for( let j = 0; j < this.table.rotate.length; j++ ){
          index = this.table.rotate[j].indexOf( this.array.knot[gridP.y][gridP.x].var.label );
          if( index != -1 ){
            index = ( index + n * clockwise + this.table.rotate[j].length ) % this.table.rotate[j].length;
            let label = this.table.rotate[j][index];
            let next = this.convertLabel( label );
            trace.push( next );
            this.array.knot[gridP.y][gridP.x].setStatus( 0 );
            this.array.knot[gridP.y][gridP.x].setAsParent();
            break;
          }
        }
    }

    this.array.trace = [];
    this.array.move = this.findMovesByTrace( trace );
    for( let i = 0; i < trace.length; i++ ){
      let grid = this.convertIndex( trace[i] );
      this.array.knot[grid.y][grid.x].setStatus( 1 );
      this.array.trace.push( trace[i] );
    }

    this.setParents();
  }

  flip(){
    let moves = [];
    for( let i = this.array.move.length - 1; i > -1 ; i-- ){
      let move = this.array.move[i];
      let result, firstAdd, scale;

      if( move == 0 || move == 5 ){
        firstAdd = 0;
        scale = 5;
      }
      if( move == 1 || move == 4 ){
        firstAdd = 1;
        scale = 3;
      }
      if( move == 2 || move == 3 ){
        firstAdd = 2;
        scale = 1;
      }

      let secondAdd = ( move - firstAdd + scale ) % ( scale * 2 );
      result = firstAdd + secondAdd;
      moves.push( result );
    }

    let begin = this.array.trace[this.array.trace.length];
    let trace = this.findTraceByMoves( moves, begin );

    if( trace.length > 0  ){
      for( let i = 0; i < this.array.trace.length; i++ ){
          let grid = this.convertIndex( this.array.trace[i] );
          this.array.knot[grid.y][grid.x].setAsParent();
        }
        
      this.updateKnotsByTrace( trace );
      this.setParents();
    }
  }

  alignHorizontally(){
    for( let i = 0; i < this.array.trace.length; i++ )
      if( this.array.trace[i] > 14 ){
        this.rotate( 1, -1 );
        this.pressToTop();
        return;
      }

    let index = this.array.trace[0];
    let grid = this.convertIndex( index );
    this.var.begin = this.array.knot[grid.y][grid.x].var.center;
  }

  pressToTop(){
    let way = 0;
    let flag = true;
    let trace = [];

    for( let i = 0; i < this.array.trace.length; i++ ){
      let grid = this.convertIndex( this.array.trace[i] );
      this.array.knot[grid.y][grid.x].setAsParent();
      let neighbor = this.array.neighbor[grid.y % 2][way];
      grid.add( neighbor );
      if( this.checkBorder( grid ) )
        flag = this.array.knot[grid.y][grid.x].var.visiable;

      trace.push( this.array.knot[grid.y][grid.x].const.index )
    }

    if( flag ){
       this.updateKnotsByTrace( trace );
    }
    return;
  }

  setParents(){
    for( let i = 0; i < this.array.move.length; i++ ){
      let indexP = this.array.trace[i];
      let gridP = this.convertIndex( indexP );
      let parent = this.array.knot[gridP.y][gridP.x];
      let indexC = this.array.trace[i + 1];
      let gridC = this.convertIndex( indexC );
      let child = this.array.knot[gridC.y][gridC.x];
      parent.setAsParent( child,  this.array.move[i] );
    }
  }

  updateKnotsByTrace( trace ){
    this.array.trace = [];
    this.array.move = this.findMovesByTrace( trace );
    this.cleanKnots( 1 );

    for( let i = 0; i < trace.length; i++ ){
        let grid = this.convertIndex( trace[i] );
        this.array.trace.push( trace[i] );
        this.array.knot[grid.y][grid.x].setStatus( 1 );
      }
  }

  findMovesByTrace( trace ){
    let moves = [];
    for( let i = 0; i < trace.length - 1; i++ ){
      let grid = this.convertIndex( trace[i] );
      let parity = ( grid.y % 2 );

      for( let j = 0; j < this.array.neighbor[parity].length; j++ ){
        grid = this.convertIndex( trace[i] );
        grid.add( this.array.neighbor[parity][j] );
        let neighborIndex = this.convertGrid( grid );
          if( neighborIndex == trace[i + 1] && this.checkBorder( grid ) )
              moves.push( j );
      }
    }
    return moves;
  }

  findTraceByMoves( moves, begin ){
    if( begin == null ){
      begin = 1;
    }
    let flag = true;

    let trace = [ begin ]
    for( let j = 0; j < moves.length; j++ ){
      let index = this.resultOfMove( moves[j], trace[trace.length - 1] );
      if( index < 0 )
        return [];
      trace.push( index );
    }

    return trace;
  }

  //find the index by knot label
  convertLabel( label ){
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        if( this.array.knot[i][j].var.label == label && this.array.knot[i][j].var.visiable )
          return this.array.knot[i][j].const.index;
  }

  //find the grid coordinates by index
  convertIndex( index ){
    if( index == undefined )
      return null;

    let i = Math.floor( index / this.const.size );
    let j = index % this.const.size;
    return createVector( j, i );
  }

  //find the index coordinates by grid coordinates
  convertGrid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.size + vec.x;
  }

  //is the knot within the field
  checkBorder( grid ){
    let flag = true;

    if( grid.x < 0 || grid.y < 0 || grid.x > this.const.size - 1 || grid.y > this.const.size - 1 )
      flag = false;

    return flag;
  }

  checkGutter( grid ){
    let flag = this.checkBorder( grid );

    if( flag )
      flag = this.array.knot[grid.y][grid.x].var.visiable;

    if( flag )
      flag = !this.array.knot[grid.y][grid.x].var.gutter;

    return flag;
  }

  encode( array, notation ){
    let code = 0;
    let division = Math.pow( notation, array.length - 1 );

    for( let i = 0; i < array.length; i++ ){
      code += array[i] * division;
      division /= notation;
    }

    return code;
  }

  decode( value, notation ){
    let code = value;
    let array = [];
    let grade = 3; //4 moves - 1
    let division = Math.pow( notation, grade );

    while ( division >= 1 ){
      let move = Math.floor( code / division );
      array.push( move )
      code = code % division;
      division /= notation;
    }

    return array;
  }

  draw( vec ){
    if( vec == null )
      vec = createVector();


    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ ){
        let flag = true;

        switch ( this.var.display.mode ) {
          case 2:
            flag = ( this.array.knot[i][j].var.status.id == 1 );
            break;
        }

        if( flag )
          this.array.knot[i][j].draw( vec );
      }
  }
}
