//
class ism{
  constructor( a, size ){
    this.const = {
      size: size,
      a: a
    };
    this.var = {
      center: createVector(),
      ligature: null
    };
    this.array = {
      knot: [],
      option: [],
      hue: [],
      sleeve: [],
      move: [],
      chain: [],
      ligature: []
    };
    this.flag = {
      runeAttached: false,
      fillInk: false
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

  initSleeves(){
    this.startSleeves();
    this.finishSleeves();
    this.setParents();
    this.mergerSleeves();
    this.setFirstLigatures();
  }

  mergerSleeves(){
    //2 - mergered first and second sleeve
    this.array.sleeve.push( [] );

    for( let i = this.array.sleeve[0].length - 1; i > 0; i-- )
      this.array.sleeve[2].push( this.array.sleeve[0][i] );

    for( let i = 0; i < this.array.sleeve[1].length; i++ )
      this.array.sleeve[2].push( this.array.sleeve[1][i] );

    this.array.move.push( [] );
    for( let i = this.array.move[0].length - 1; i > -1; i-- ){
      let move = ( this.array.move[0][i] + 3 ) % 6;
      this.array.move[2].push( move );
    }

    for( let i = 0; i < this.array.move[1].length; i++ )
      this.array.move[2].push( this.array.move[1][i] );
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHues();
    this.initNeighbors();
    this.initKnots();
    this.initSleeves();
    console.log( this.array.sleeve )
    console.log( this.array.move )
  }

  prepareKnotsAroundCenter(){
    let indexs = [];
    let half = ( this.const.size - 1 ) / 2;
    indexs.push( this.array.knot[half][half].const.index );
    this.var.center = this.array.knot[half][half].var.center;

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

  startSleeves(){
    //0 - first sleeve 1 - second sleeve
    this.array.sleeve = [ [], [] ];
    this.array.move = [ [], [] ];
    //0 -index 1 - step
    this.array.option = [ [ [], [] ], [ [], [] ] ];
    let option = [];
    let half = ( this.const.size - 1 ) / 2;
    let head = this.array.knot[half][half];
    head.setStatus( 1, 4 );
    let parity = half % 2;
    let index = this.array.knot[half][half].const.index;
    this.array.sleeve[0].push( index );
    this.array.sleeve[1].push( index );
    let addIndex, grid;

    for( let i = 0; i < this.array.neighbor[parity].length; i++ ){
      grid = createVector( half, half );
      grid.add( this.array.neighbor[parity][i] );
      addIndex = this.convertGrid( grid );
      option.push( addIndex );
    }

    //beginning of the first sleeve
    let sleeve = 0;
    let firstRand = Math.floor( Math.random() * option.length );
    index = option[firstRand];
    grid = this.convertIndex( index );
    this.array.knot[grid.y][grid.x].setStatus( 1, sleeve + 1 );
    this.array.sleeve[sleeve].push( index );
    this.array.move[sleeve].push( firstRand );
    parity = grid.y % 2;
    for( let i = 0; i < this.array.neighbor[parity].length; i++ ){
      grid = this.convertIndex( index );
      grid.add( this.array.neighbor[parity][i] );
      addIndex = this.convertGrid( grid );
      if( this.checkGutter( grid ) ){
        this.array.option[sleeve][0].push( addIndex );
        this.array.option[sleeve][1].push( i );
      }
    }

    //beginning of the second sleeve
    let secondRand;
    do
     secondRand = Math.floor( Math.random() * option.length );
    while( secondRand == firstRand )
    index = option[secondRand];
    let usedIndex = this.array.option[sleeve][0].indexOf( index );
    if( usedIndex != -1 ){
        this.array.option[sleeve][0].splice( usedIndex, 1 );
        this.array.option[sleeve][1].splice( usedIndex, 1 );
    }

    grid = this.convertIndex( index );
    sleeve++;
    this.array.knot[grid.y][grid.x].setStatus( 1, sleeve + 1 );
    this.array.sleeve[sleeve].push( index );
    this.array.move[sleeve].push( secondRand );
    parity = grid.y % 2;

    for( let i = 0; i < this.array.neighbor[parity].length; i++ ){
      grid = this.convertIndex( index );
      grid.add( this.array.neighbor[parity][i] );
      addIndex = this.convertGrid( grid );
      if( this.checkGutter( grid ) ){
        this.array.option[sleeve][0].push( addIndex );
        this.array.option[sleeve][1].push( i );
      }
    }

    grid = this.convertIndex( this.array.sleeve[0][1] );
    let parent = this.array.knot[grid.y][grid.x];
    parent.setAsParent( head, this.array.move[0][0] + 3 );
  }

  finishSleeves(){
    let options = Math.max( this.array.option[0][0].length, this.array.option[1][0].length );
    let counter = 0, stoper = 33;//61
    while( options > 0 && counter < stoper ){
      let rands = [];
      for( let i = 0; i < this.array.option.length; i++ ){
        let rand = Math.floor( Math.random() * this.array.option[i][0].length );
        if( i == 1 &&
          rands[0] == this.array.option[i][0][rand] &&
          this.array.option[i][0].length > 1
         )
          while( rands[0] == this.array.option[i][0][rand] )
            rand = Math.floor( Math.random() * this.array.option[i][0].length );
        let value = this.array.option[i][0][rand];

        if( this.array.option[i][0].length > 0 ){
          let index = this.array.option[i][0][rand];
          rands.push( index );
          this.array.sleeve[i].push( this.array.option[i][0][rand] );
          this.array.move[i].push( this.array.option[i][1][rand] );
          this.array.option[i] = [ [], [] ];

          let grid = this.convertIndex( index );
          this.array.knot[grid.y][grid.x].setStatus( 1, i + 1 );
          let parity = grid.y % 2;

          for( let j = 0; j < this.array.neighbor[parity].length; j++ ){
            let addGrid = this.convertIndex( index );
            addGrid.add( this.array.neighbor[parity][j] );
            let addIndex = this.convertGrid( addGrid );
            if( this.checkGutter( addGrid ) ){
              this.array.option[i][0].push( addIndex );
              this.array.option[i][1].push( j );
            }
          }

          if( i == 1 ){
            index = this.array.option[i - 1][0].indexOf( value );
            if( index != -1 ){
              this.array.option[i - 1][0].splice( index, 1 );
              this.array.option[i - 1][1].splice( index, 1 );
            }
          }
        }
      }

      options = Math.max( this.array.option[0][0].length, this.array.option[1][0].length );
      counter++;
    }
  }

  setParents(){
    for( let i = 0; i < this.array.move.length; i++ )
      for( let j = 0; j < this.array.move[i].length; j++ ){
        let indexP = this.array.sleeve[i][j];
        let gridP = this.convertIndex( indexP );
        let parent = this.array.knot[gridP.y][gridP.x];
        let indexC = this.array.sleeve[i][j + 1];
        let gridC = this.convertIndex( indexC );
        let child = this.array.knot[gridC.y][gridC.x];
        parent.setAsParent( child,  this.array.move[i][j] );
      }
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

  checkInk( grid ){
    let flag = this.checkBorder( grid );

    if( flag )
      flag = this.array.knot[grid.y][grid.x].var.visiable;

    if( flag )
      flag = !this.array.knot[grid.y][grid.x].var.ink;
    return flag;
  }

  setFirstLigatures(){
    for( let i = 0; i < this.array.sleeve[2].length; i++ ){
      let grid = this.convertIndex( this.array.sleeve[2][i] );
      this.array.ligature.push( this.array.sleeve[2][i] );
      this.array.knot[grid.y][grid.x].setLigature( 1 );
    }
  }

  setNextLigatures( ink ){
    for( let i = 0; i < this.array.ligature.length; i++ ){
      let grid = this.convertIndex( this.array.ligature[i] );
      this.array.knot[grid.y][grid.x].setLigature( 0 );
    }

    this.array.ligature = [];

    for( let i = 0; i < ink.length; i++ )
      for( let j = 0; j < ink[i].trace.length; j++ ){
      let grid = this.convertIndex( ink[i].trace[j] );
      let parity = ( grid.y % 2 );

      for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
        grid = this.convertIndex( ink[i].trace[j] );
        grid.add( this.array.neighbor[parity][l] );

        if( this.checkInk( grid ) ){
          let addIndex = this.convertGrid( grid );
          this.array.ligature.push( addIndex );
        }
      }
    }

    //console.log( this.array.ligature )
    for( let i = 0; i < this.array.ligature.length; i++ ){
      let grid = this.convertIndex( this.array.ligature[i] );
      this.array.knot[grid.y][grid.x].setLigature( 1 );
    }
  }

  setCurrentLigature( index ){
    let grid;

    if( this.var.ligature != null ){
      grid = this.convertIndex( this.var.ligature );
      this.array.knot[grid.y][grid.x].switchOptionLigature();

      if( this.var.ligature == this.array.ligature[index] && this.flag.runeAttached )
        this.flag.fillInk = true;
    }

    this.var.ligature = this.array.ligature[index];
    grid = this.convertIndex( this.var.ligature );
    this.array.knot[grid.y][grid.x].switchOptionLigature();
  }

  click( offset ){
    let min = infinity;
    let index = null;
    let mouse = createVector(
      mouseX + this.var.center.x - offset.x,
      mouseY + this.var.center.y - offset.y );

    for( let i = 0; i < this.array.ligature.length; i++ ){
      let grid = this.convertIndex( this.array.ligature[i] );
      let center = this.array.knot[grid.y][grid.x].var.center.copy();
      let d = dist( mouse.x, mouse.y, center.x, center.y );
      if( d < min ){
        index = i;
        min = d;
      }
    }

    if( min < this.const.r )
      this.setCurrentLigature( index );
  }

  draw( vec ){
    if( vec == null )
      vec = createVector();
    vec.sub( this.var.center )

    for( let i = 0; i < this.array.knot.length; i++ )
      for( let j = 0; j < this.array.knot[i].length; j++ )
        this.array.knot[i][j].draw( vec, true );
  }
}
