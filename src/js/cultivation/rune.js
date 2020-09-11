//
class rune{
  constructor( size ){
    this.const = {
      offset: createVector( cellSize * 2, cellSize * 2 ),
      n: size * 2 + 1,
      m: size * 2 + 1,
      size: size,
      knots: size * 2 + 1,
      a: cellSize * 0.5
    };
    this.var = {
      knot: {
        current: null,
        grid: null
      }
    };
    this.array = {
      windRose: [ 'NNE', 'E', 'SSE', 'SSW', 'W', 'NNW' ],
      knot: [],
      option: [],
      trace: [],
      hue: []
    };
    this.table = {
      rotate: []
    }

    this.init();
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
    console.log( this.table.rotate );
  }

  initKnots(){
    for( let i = 0; i < this.const.m; i++ ){
      this.array.knot.push( [] );
      for( let j = 0; j < this.const.n; j++ ){
          let index = i * this.const.n + j;
          let vec = createVector( this.const.offset.x, this.const.offset.y );
          let grid = createVector( j, i );
          vec.x += this.const.r * 2 * j;
          vec.y += this.const.a * 1.5 * i;
          if( i % 2 == 1 )
            vec.x += this.const.r;
          this.array.knot[i].push( new knot( index, vec, grid, this.const.a * 0.9 ) );
      }
    }

    this.prepareKnotsAroundCenter();
    let index = 1;
    this.setCurrentKnot( index );

    let parent = this.array.knot[this.var.knot.grid.y][this.var.knot.grid.x];
    parent.var.parent = index;
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

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHues();
    this.initNeighbors();
    this.initRotates();
    this.initKnots();
    this.designRune();
    this.rotate( 1, true )
  }

  setCurrentKnot( index ){
    this.var.knot.current = index;
    this.var.knot.grid = this.convertIndex( index );
    this.array.knot[this.var.knot.grid.y][this.var.knot.grid.x].setStatus( 2 );
  }

  cleanKnots(){
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        if( this.array.knot[i][j].var.free )
          this.array.knot[i][j].setStatus( 0 );
  }

  prepareKnotsAroundCenter(){
    let indexs = [];
    indexs.push( this.array.knot[this.const.size][this.const.size].const.index );

    for( let i = 0; i < this.const.size; i++ )
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
    this.cleanKnots();
    this.array.option = [];
    let grid = this.convertIndex( this.var.knot.current );
    let parity = ( grid.y % 2 );

    if( !this.checkKnot( grid ) )
      for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
        grid = this.convertIndex( this.var.knot.current );
        grid.add( this.array.neighbor[parity][l] );
        let addIndex = this.convertGrid( grid );
          if( !this.array.option.includes( addIndex ) && this.checkKnot( grid ) ){

            this.array.option.push( addIndex );
            this.array.knot[grid.y][grid.x].setStatus( 1 );;
          }
      }
  }

  chooseOption(){
    let rand = Math.floor( Math.random() * this.array.option.length );
    let index = this.array.option[rand];
    let grid = this.convertIndex( index );
    let parent = this.array.knot[this.var.knot.grid.y][this.var.knot.grid.x];
    let child = this.array.knot[grid.y][grid.x];
    parent.setAsParent( child );
    this.setCurrentKnot( index );
    this.array.trace.push( index );
  }

  engageNextKnot(){
    this.chooseOption();
    this.setOptionsAroundCurrentKnot();
  }

  designRune(){
    while( this.array.trace.length < 5 )//this.const.knots
      this.engageNextKnot();
    this.cleanKnots();
  }

  rotate( n, clockwise ){
    let trace = [];

    for( let i = 0; i <  this.array.trace.length ; i++ ){
      let gridP = this.convertIndex( this.array.trace[i] );
      let index = -1;

      for( let j = 0; j < this.table.rotate.length; j++ ){
        index = this.table.rotate[j].indexOf( this.array.knot[gridP.y][gridP.x].var.label );
        if( index != -1 ){
          index = ( index + n ) % this.table.rotate[j].length;
          let label = this.table.rotate[j][index];
          let next = this.convertLabel( label );
          trace.push( next );
          let gridN = this.convertIndex( next );
          console.log( gridN.y, gridN.x, this.array.knot[gridN.y][gridN.x].const.index )
          console.log( 'previous', this.array.trace[i], 'three', j,index, 'label', label, gridP.y, 'next', next )
          //this.array.knot[gridN.y][gridN.x].duplicate( this.array.knot[gridP.y][gridP.x] );
          this.array.knot[gridP.y][gridP.x].setStatus( 0 );
        }
      }
    }

    for( let i = 0; i < trace.length; i++ ){
      let grid = this.convertIndex( trace[i] );
      this.array.knot[grid.y][grid.x].setStatus( 2 );
      this.array.trace.push( trace[i] );
    }
  }

  //find the index by knot label
  convertLabel( label ){
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        if( this.array.knot[i][j].var.label == label && this.array.knot[i][j].var.visiable ){
          console.log( i, j, this.array.knot[i][j].const.index, this.array.knot[i][j].var.label, label )
          return this.array.knot[i][j].const.index;
        }

  }

  //find the grid coordinates by index
  convertIndex( index ){
    if( index == undefined )
      return null;

    let i = Math.floor( index / this.const.n );
    let j = index % this.const.n;
    return createVector( j, i );
  }

  //find the index coordinates by grid coordinates
  convertGrid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.n + vec.x;
  }

  //is the knot within the field
  checkBorder( grid ){
    let flag = true;

    if( grid.x < 0 || grid.y < 0 || grid.x > this.const.m - 1 || grid.y > this.const.n - 1 )
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

  draw(){
    //this.cleanKnots();
    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        this.array.knot[i][j].draw( this.array.toConstruct );
  }
}
