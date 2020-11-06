//
class underworld {
  constructor( size ){
    this.const = {
      offset: createVector( CELL_SIZE * 2, CELL_SIZE * 2 ),
      n: size * 2 + 1,
      m: size * 2 + 1,
      f: size,
      size: size,
      a: CELL_SIZE * 0.5,
      floor:{
        min: 0,
        max: size * 2 - 1
      }
    };
    this.var = {
      floor: 0
    }
    this.array = {
      rood: [],
      hue: []
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

  initRoods(){
    for( let f = 0; f < this.const.f; f++ ){
      this.array.rood.push( [] );
      for( let i = 0; i < this.const.m; i++ ){
        this.array.rood[f].push( [] );
        for( let j = 0; j < this.const.n; j++ ){
            let index = i * this.const.n + j + f * this.const.m * this.const.n;
            let vec = createVector( this.const.offset.x, this.const.offset.y );
            let grid = createVector( j, i );
            vec.x += this.const.r * 2 * j;
            vec.y += this.const.a * 1.5 * i;
            vec.z += this.const.r * f;
            if( i % 2 == 1 )
              vec.x += this.const.r;
            this.array.rood[f][i].push( new rood( index, vec, grid, this.const.a ) );
        }
      }
    }

    this.roodsAroundCenter();
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
    this.initRoods();
  }

  cleanRoods(){
    for( let i = 0; i < this.array.rood.length; i++ )
      for( let j = 0; j < this.array.rood[i].length; j++ )
          this.array.rood[i][j].setStatus( 0 );
  }

  roodsAroundCenter(){
    for( let f = 0; f < this.const.f; f++ ){
      let indexs = [];
      let paritys  = [];
      indexs.push( this.array.rood[f][this.const.size][this.const.size].const.index );

      for( let i = 0; i < this.const.size; i++ ){

          //console.log( indexs );
          for( let j = indexs.length - 1; j >= 0; j-- ){
            let vec = this.convertIndex( indexs[j] );
            let parity = ( vec.y % 2 );

            for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
              vec = this.convertIndex( indexs[j] );
              vec.add( this.array.neighbor[parity][l] );
              let addIndex = this.convertGrid( vec );
                if( !indexs.includes( addIndex ) ){
                  indexs.push( addIndex );
                  paritys.push( ( i + 1 ) % 2  );
                  //console.log( addIndex, ( i + 1 ) % 2 )
                }
            }
          }
      }
        //console.log( indexs );


        for( let i = 0; i < indexs.length; i++ ){
          let vec = this.convertIndex( indexs[i] );
          this.array.rood[f][vec.y][vec.x].var.visiable = true;
          this.array.rood[f][vec.y][vec.x].var.parity = paritys[i];
          //console.log( i, paritys[i] )
        }
    }
    //    this.array.rood[this.const.size][this.const.size].setStatus( 1 );
  }

  //find the grid coordinates by index
  convertIndex( index ){
    if( index == undefined )
      return null;


    let f = Math.floor( index / this.const.n / this.const.m );
    let remainder = index % ( this.const.n * this.const.m )
    let i = Math.floor( remainder / this.const.n );
    let j = remainder % this.const.n;
    return createVector( j, i, f );
  }

  //find the index coordinates by grid coordinates
  convertGrid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.n + vec.x;
  }

  //is the rood within the field
  checkBorder( grid ){
    let flag = true;

    if( grid.x < 0 || grid.y < 0 || grid.x > this.const.m - 1 || grid.y > this.const.n - 1 )
      flag = false;

    return flag;
  }

  checkRood( grid ){
    let flag = this.checkBorder( grid );

    if( flag )
      flag = this.array.rood[grid.y][grid.x].var.free;

    return flag;
  }

  click(){
    //
  }

  switchFloor( shift ){
    this.var.floor += shift;
    if( this.var.floor < this.const.floor.min )
      this.var.floor = this.const.floor.min;
    if( this.var.floor > this.const.floor.max )
      this.var.floor = this.const.floor.max;

    console.log( this.var.floor )
  }

  draw(){
    //this.cleanRoods();
    let f = Math.floor( this.var.floor / 2 );
    let parity = this.var.floor % 2;

    if( this.array.rood.length > 0 )
      for( let i = 0; i < this.array.rood[f].length; i++ )
        for( let j = 0; j < this.array.rood[f][i].length; j++ )
          //if( this.array.rood[f][i][j] == parity )
            this.array.rood[f][i][j].draw( this.array.toConstruct );
  }
}
