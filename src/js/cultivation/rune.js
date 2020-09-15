//
class rune{
  constructor( index, moves ){
    this.const = {
      index: index,
      size: 5,
      a: cellSize * 0.5
    };
    this.var = {
      knot: {
        current: null,
        grid: null
      },
      totem: null
    };
    this.array = {
      windRose: [ 'NNE', 'E', 'SSE', 'SSW', 'W', 'NNW' ],
      knot: [],
      option: [],
      trace: [],
      move: [],
      way: [],
      hue: []
    };
    this.table = {
      rotate: [],
      flip: [],
      ramification: []
    }

    this.init( moves );
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

  initRamification(){
    this.table.ramification = {
      'o': [ 'i' ],
      'i': [ 'I', 'u', 'v' ],
      'I': [ 'f', 'p', 'l' ],
      'u': [ 'p', 'D', 'c', 'l', 'z' ],
      'v': [ 'n', 'p', 'D' ],
      'f': [ 'F', 'd', 'm', 'L' ],
      'p': [ 'm', 'b', 'V', 'w', 'q', 'x', 'R', 'S', 'a', 'r', 'd' ],
      'l': [ 'L', 'C', 'R', 'b', 'd', 'j', 'Z', 'a', 'q', 'N', 'L' ],
      'D': [ 'w', 'b', 'S' ],
      'c': [ 'R', 's', 'j', 'G' ],
      'z': [ 's', 'Z', 'W', 'X', 'b' ]
    };
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

  init( moves ){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHues();
    this.initNeighbors();
    this.initRotates();
    this.initFlips();
    this.initKnots();
    this.designRune( moves );
    //this.normalizeRune();
    this.updateTotem();
  }

  updateTotem(){
    console.log( this.array.move )
    let notation = this.array.neighbor[0].length;
    let code = this.encode( this.array.move, notation );

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
      case 296:
        this.var.totem = 'M';
        break;
      case 297:
        this.var.totem = 'Q';
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
      case 343:
        this.var.totem = 'Z';
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
        this.var.totem = 'F';
        break;
      case 513:
        this.var.totem = 'P';
        break;
      case 518:
        this.var.totem = 'I';
        break;
    }

    console.log( code, this.var.totem  )
    let array = this.decode( code, notation );
    console.log( array  )
  }

  setCurrentKnot( index ){
    this.var.knot.current = index;
    this.var.knot.grid = this.convertIndex( index );
    this.array.knot[this.var.knot.grid.y][this.var.knot.grid.x].setStatus( 2 );
  }

  //0 - only free
  //1 - all
  cleanKnots( mode ){
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        switch ( mode ) {
          case 0:
            if( this.array.knot[i][j].var.free )
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
    this.cleanKnots( 0 );
    this.array.option = [];
    this.array.ways = [];
    let grid = this.convertIndex( this.var.knot.current );
    let parity = ( grid.y % 2 );

    if( !this.checkKnot( grid ) )
      for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
        grid = this.convertIndex( this.var.knot.current );
        grid.add( this.array.neighbor[parity][l] );
        let addIndex = this.convertGrid( grid );
          if( !this.array.option.includes( addIndex ) && this.checkKnot( grid ) ){
            this.array.option.push( addIndex );
            this.array.way.push( l );
            this.array.knot[grid.y][grid.x].setStatus( 1 );
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
    if(  this.checkKnot( grid ) )
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

  designRune( ways ){
    for( let i = 0; i < ways.length; i++ )
      this.moveInChosenDirection( ways[i], null);
    //this.moveInChosenDirection(way, null);
    //this.moveInChosenDirection(way, null);
    //this.moveInChosenDirection(way, null);
    /*while( this.array.trace.length < this.const.size )
      this.engageNextKnot();*/
    this.cleanKnots( 0 );
  }

  rotate( n, clockwise ){
    let trace = [];
    n = n % this.table.rotate[0].length;

    for( let i = 0; i <  this.array.trace.length ; i++ ){
      let gridP = this.convertIndex( this.array.trace[i] );
      let index = -1;

      for( let j = 0; j < this.table.rotate.length; j++ ){
        index = this.table.rotate[j].indexOf( this.array.knot[gridP.y][gridP.x].var.label );
        if( index != -1 ){
          index = ( index + n * clockwise + this.table.rotate[j].length ) % this.table.rotate[j].length;
          let label = this.table.rotate[j][index];
          let next = this.convertLabel( label );
          trace.push( next );
          let gridN = this.convertIndex( next );
          //console.log( gridN.y, gridN.x, this.array.knot[gridN.y][gridN.x].const.index )
          //console.log( 'previous', this.array.trace[i], 'three', j,index, 'label', label, gridP.y, 'next', next )
          this.array.knot[gridP.y][gridP.x].setStatus( 0 );
        }
      }
    }

    this.array.trace = [];
    this.array.move = this.findMovesByTrace( trace );
    for( let i = 0; i < trace.length; i++ ){
      let grid = this.convertIndex( trace[i] );
      this.array.knot[grid.y][grid.x].setStatus( 2 );
      this.array.trace.push( trace[i] );
    }
  }

  findFliped(){
    let fliped = []
    for( let i = 0; i < this.array.trace.length; i++ ){
      let index = this.table.flip[0].indexOf( this.array.trace[i] );
      fliped.push( this.table.flip[1][index] );
    }

    return fliped;
  }

  flip(){
    let fliped = this.findFliped();
    this.updateKnotsByTrace( fliped );
  }

  normalizeRune(){
    let moves = this.findMovesByTrace( this.array.trace );
    let firstMove = moves[0];
    let allPossibilitys = [];
    let result = null;
    //console.log( 'moves', moves );

    for( let i = 1; i < firstMove; i++ ){
      let indexs = [ 1 ];
      let cranked = [];

      for( let j = 0; j < moves.length; j++ ){
        let crankedMove = ( moves[j] - i + this.array.neighbor[0].length ) % this.array.neighbor[0].length;
        cranked.push( crankedMove );
      }

      for( let j = 0; j < cranked.length; j++ ){
        let index = this.moveInChosenDirection( cranked[j], indexs[indexs.length - 1] );
        indexs.push( index );
      }

      allPossibilitys.push( indexs );
    }

    for( let i = allPossibilitys.length - 1; i > -1; i-- ){
      let flag = true;
      for( let j = 0; j < allPossibilitys[i].length; j++ )
        if( allPossibilitys[i][j] == null )
          flag = false;

      if( flag )
        result = allPossibilitys[i];
    }

    if( result == null ){
      let fliped = this.findFliped();

      for( let i = 0; i < this.array.trace.length; i++ )
        if( fliped[i] < this.array.trace[i] ){
          this.updateKnotsByTrace( fliped );
          return;
        }
    }
    else
      this.updateKnotsByTrace( result );
    return;
  }

  updateKnotsByTrace( trace ){
    this.array.trace = [];
    this.array.move = this.findMovesByTrace( trace );
    this.cleanKnots( 1 );

    for( let i = 0; i < trace.length; i++ ){
        let grid = this.convertIndex( trace[i] );
        this.array.trace.push( trace[i] );
        this.array.knot[grid.y][grid.x].setStatus( 2 );
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

    let trace = [ begin ]
    for( let j = 0; j < moves.length; j++ ){
      console.log( moves[j] )
      let index = this.moveInChosenDirection( moves[j], trace[trace.length - 1] );
      trace.push( index );
    }

    return trace;
  }

  //find the index by knot label
  convertLabel( label ){
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        if( this.array.knot[i][j].var.label == label && this.array.knot[i][j].var.visiable )
          //console.log( i, j, this.array.knot[i][j].const.index, this.array.knot[i][j].var.label, label )
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

  checkKnot( grid ){
    let flag = this.checkBorder( grid );

    if( flag )
      flag = this.array.knot[grid.y][grid.x].var.visiable;

    if( flag )
      flag = this.array.knot[grid.y][grid.x].var.free;

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
    let division = Math.pow( notation, this.array.move.length - 1 );

    while ( division >= 1 ){
      let move = Math.floor( code / division );
      array.push( move )
      code = code % division;
      division /= notation;
    }


    return array;
  }

  draw( offset ){
    //return;
    if( offset == null )
      offset = createVector();

    //this.cleanKnots( 0 );
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        this.array.knot[i][j].draw( offset );
  }
}
