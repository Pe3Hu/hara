//
class settlement{
  constructor( size ){
    this.const = {
      offset: createVector( CELL_SIZE * 2, CELL_SIZE * 2 ),
      n: size * 2 + 1,
      m: size * 2 + 1,
      size: size,
      a: CELL_SIZE * 0.5
    };
    this.var = {
    }
    this.array = {
      windRose: [ 'NNE', 'E', 'SSE', 'SSW', 'W', 'NNW' ],
      area: [],
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

  initAreas(){
    for( let i = 0; i < this.const.m; i++ ){
      this.array.area.push( [] );
      for( let j = 0; j < this.const.n; j++ ){
          let index = i * this.const.n + j;
          let vec = createVector( this.const.offset.x, this.const.offset.y );
          let grid = createVector( j, i );
          vec.x += this.const.r * 2 * j;
          vec.y += this.const.a * 1.5 * i;
          if( i % 2 == 1 )
            vec.x += this.const.r;
          this.array.area[i].push( new area( index, vec, grid, this.const.a *0.9 ) );
      }
    }

    this.areasAroundCenter();
    this.array.area[this.const.size][this.const.size].setStatus( 1 );
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
    this.initAreas();
  }

  cleanAreas(){
    for( let i = 0; i < this.array.area.length; i++ )
      for( let j = 0; j < this.array.area[i].length; j++ )
          this.array.area[i][j].setStatus( 0 );
  }

  areasAroundCenter(){
    let indexs = [];
    indexs.push( this.array.area[this.const.size][this.const.size].const.index );

    for( let i = 0; i < this.const.size; i++ )
      for( let j = indexs.length - 1; j >= 0; j-- ){
        let vec = this.convertIndex( indexs[j] );
        let parity = ( vec.y % 2 );

        for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
          vec = this.convertIndex( indexs[j] );
          vec.add( this.array.neighbor[parity][l] );
          let addIndex = this.convertGrid( vec );
            if( !indexs.includes( addIndex ) )
                indexs.push( addIndex );
        }
      }

      for( let i = 0; i < indexs.length; i++ ){
        let vec = this.convertIndex( indexs[i] );
        this.array.area[vec.y][vec.x].var.visiable = true;
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

  //is the area within the field
  checkBorder( grid ){
    let flag = true;

    if( grid.x < 0 || grid.y < 0 || grid.x > this.const.m - 1 || grid.y > this.const.n - 1 )
      flag = false;

    return flag;
  }

  checkArea( grid ){
    let flag = this.checkBorder( grid );

    if( flag )
      flag = this.array.area[grid.y][grid.x].var.free;

    return flag;
  }

  click(){

  }

  draw(){
    //this.cleanAreas();
    for( let i = 0; i < this.array.area.length; i++ )
      for( let j = 0; j < this.array.area[i].length; j++ )
        this.array.area[i][j].draw( this.array.toConstruct );
  }
}
