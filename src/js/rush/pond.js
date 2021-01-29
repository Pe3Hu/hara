//
class pond {
  constructor ( size, a ){
    this.const = {
      size: size,
      n: 6,
      a: a
    };
    this.var = {
    };
    this.array = {
      neighbor: [],
      puddle: []
    };

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

  initPuddles(){
    for( let i = 0; i < this.const.size; i++ ){
      this.array.puddle.push( [] );
      for( let j = 0; j < this.const.size; j++ ){
        let index = i * this.const.size + j;
        let grid = createVector( j, i );
        let vec = createVector( this.const.r * 2 * j, this.const.a * 1.5 * ( i + 2/3 ) );
        if( i % 2 == 1 )
          vec.x += this.const.r;

        this.array.puddle[i].push( new puddle( index, vec, grid, this.const.a * 0.95 ) );
      }
    }

    this.preparePuddlesAroundCenter();
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / this.const.n ) * 2 );

    this.initHues();
    this.initNeighbors();
    this.initPuddles();
  }

  preparePuddlesAroundCenter(){
    let indexs = [];
    let half = ( this.const.size - 1 ) / 2;
    indexs.push( this.array.puddle[half][half].const.index );
    this.var.center = this.array.puddle[half][half].var.center;

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
        this.array.puddle[grid.y][grid.x].var.visiable = true;
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

  click( offsets ){

  }

  draw( offsets ){
    let offset = createVector();

    for( let puddles of this.array.puddle )
      for( let puddle of puddles )
        puddle.draw( offset, true );

  }
}
