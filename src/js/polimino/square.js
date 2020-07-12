//
class square{
  constructor( size ){
    this.const = {
      offset: createVector( cellSize * 4, cellSize * 4 ),
      a: cellSize * 2,
      n: size * 2 + 1,
      size: size
    };
    this.var = {
      distributionLength: 0
    }
    this.array = {
      distribution: [],
      cell: []
    }

    this.init();
  }

  init(){
    this.initNeighbors();
    this.initCells();
    this.initDistribution();
    this.nextCell();
    //this.initPenta();
  }

  initNeighbors(){
    this.array.neighbor = [
      createVector( 0, -1 ),
      createVector( 1, 0 ),
      createVector( 0, 1 ),
      createVector( -1, 0 )
    ];
  }

  initCells(){
    for( let i = 0; i < this.const.n; i++ ){
      this.array.cell.push( [] );
      for( let j = 0; j < this.const.n; j++ ){
          let index = i * this.const.n + j;
          let vec = createVector( this.const.offset.x, this.const.offset.y );
          let grid = createVector( j, i );
          vec.x += this.const.a * j;
          vec.y += this.const.a * i;
          this.array.cell[i].push( new cell( index, vec, grid, this.const.a ) );
      }
    }
  }

  initPenta(){
    this.penta = new pentamino();

    for( let i = 0; i < this.penta.array.mask.length; i++ ){
      let grid = this.convertIndex( this.penta.array.mask[i] );
      this.array.cell[grid.y][grid.x].setStatus( 1 );
    }
  }

  initDistribution(){
    let indexs = [];
    let oldAdjacency = [];
    let newAdjacency = [];
    let allCells = [];
    let count = 0;
    let d = this.const.n;

    //start distribution from the center
    let grid = createVector( this.const.size, this.const.size );
    let index = this.convertGrid( grid );
    indexs.push( index );
    this.array.distribution.push( [] );

    for( let i = 0; i < d; i++ )
      this.array.distribution[count].push( index );

    //set all not distributed cells
    for( let i = 0; i < this.array.cell.length; i++ )
      for( let j = 0; j < this.array.cell[i].length; j++ )
        if( this.array.cell[i][j].const.index != index )
          allCells.push( this.array.cell[i][j].const.index );

    //сalculate first neighbors
    oldAdjacency.push( index );
    while( allCells.length > 0 && count < d ){
      count++;
      newAdjacency = [];

      for( let i = 0; i < oldAdjacency.length; i++ )
        for( let j = 0; j < this.array.neighbor.length; j++ ){
          let newGrid = this.convertIndex( oldAdjacency[i] );
          newGrid.add( this.array.neighbor[j] );
          //validation check
          if( this.checkGrid( newGrid ) ){
            let newIndex = this.convertGrid( newGrid );
            let idAll = allCells.indexOf( newIndex);
            let idNew = indexs.indexOf( newIndex);
            //console.log( newIndex, idAll, idNew );
            //add only missing indexes
            if( idAll != -1 && idNew == -1 ){
              newAdjacency.push( newIndex );
              indexs.push( newIndex );
              allCells.splice( idAll, 1 );
            }
          }
        }

      oldAdjacency =  [];
      this.array.distribution.push( [] );

      for( let i = 0; i < newAdjacency.length; i++ ){
        for( let j = 0; j < d - count; j++ )
          this.array.distribution[count].push( newAdjacency[i] );
        oldAdjacency.push( newAdjacency[i] );
      }
    }

    //sort and length
    for( let i = 0; i < this.array.distribution.length; i++ ){
      this.array.distribution[i].sort(
        function(a, b) {
          if ( a > b )
            return 1;
          if ( a < b )
            return -1;
          return 0;
        }
       );
      this.var.distributionLength += this.array.distribution[i].length;
    }
  }

  nextCell( round ){
    if( this.var.distributionLength == 0 )
      return;

    let index = null;
    let grid = null;
    let count = null;
    let id = null;
    let l = 0;
    let rand = Math.floor( Math.random() * this.var.distributionLength );

    for( let i = 0; i < this.array.distribution.length; i++ ){
      l += this.array.distribution[i].length;
      if( l > rand ){
        //this.array.distribution[i].length
        id = l - rand;
        if( id == this.array.distribution[i].length )
           id = 0;

        index = this.array.distribution[i][id];
        count = i;
        grid = this.convertIndex( index );
        for( let j = this.array.distribution[i].length - 1; j >= 0; j-- )
          if( this.array.distribution[i][j] == index )
            this.array.distribution[i].splice( j, 1 );

        this.var.distributionLength -= this.const.n - count;
        break;
      }
    }

    this.array.cell[grid.y][grid.x].setStatus( 1 );
    /*  console.log( rand, l, id, count, index, grid )
      console.log( this.var.distributionLength );
      console.log( this.array.distribution );*/
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

  checkGrid( vec ){
    let flag = true;
    if( vec.x >= this.const.n || vec.x < 0 ||
        vec.y >= this.const.n || vec.y < 0 )
      flag = false;
    return flag;
  }

  compareNumbers(a, b) {
    if ( a > b )
      return 1;
    if ( a < b )
      return -1;
    return 0;
  }

  lips(){
    stroke( 0 );
    let offset = createVector( 0.25 * this.const.a, 0.25  * this.const.a );
    noFill();
    rect( offset.x, offset.y, this.const.a, this.const.a );

    let vertex = [];

    let center = offset.copy();
    let d = this.const.a / 12;
    center.x += this.const.a / 2;
    center.y += this.const.a / 2;
    let point = center.copy();
    point.x -= 1.5 * d;
    point.y -= 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 1.5 * d;
    point.y -= 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= 6 * d;
    point.y -= 0.5 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 6 * d;
    point.y -= 0.5 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= 2.5 * d;
    point.y += 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 2.5 * d;
    point.y += 2 * d;
    vertex.push( point.copy() );

    line( vertex[0].x, vertex[0].y, vertex[1].x, vertex[1].y );
    line( vertex[0].x, vertex[0].y, vertex[2].x, vertex[2].y );
    line( vertex[3].x, vertex[3].y, vertex[2].x, vertex[2].y );
    line( vertex[3].x, vertex[3].y, vertex[2].x, vertex[2].y );
    line( vertex[0].x, vertex[0].y, vertex[4].x, vertex[4].y );
    line( vertex[5].x, vertex[5].y, vertex[1].x, vertex[1].y );
    line( vertex[3].x, vertex[3].y, vertex[6].x, vertex[6].y );
    line( vertex[6].x, vertex[6].y, vertex[7].x, vertex[7].y );
    line( vertex[1].x, vertex[1].y, vertex[7].x, vertex[7].y );
    line( vertex[6].x, vertex[6].y, vertex[7].x, vertex[7].y );
    line( vertex[8].x, vertex[8].y, vertex[2].x, vertex[2].y );
    line( vertex[3].x, vertex[3].y, vertex[8].x, vertex[8].y );
    line( vertex[6].x, vertex[6].y, vertex[9].x, vertex[9].y );
    line( vertex[9].x, vertex[9].y, vertex[7].x, vertex[7].y );
    line( vertex[9].x, vertex[9].y, vertex[8].x, vertex[8].y );
  }

  draw(){
    for( let i = 0; i < this.array.cell.length; i++ )
      for( let j = 0; j < this.array.cell[i].length; j++ )
        this.array.cell[i][j].draw()

    this.lips();
  }
}
