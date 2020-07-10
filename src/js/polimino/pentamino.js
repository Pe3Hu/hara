//
class pentamino {
  constructor(){
    this.const = {
      offset: createVector( cellSize * 2, cellSize * 2 ),
      a: cellSize * 0.5,
      round: 4,
      n: 9
    };
    this.var = {
    }
    this.array = {
      adjacency: [],
      neighbor: [],
      mask: [],
      grid: []
    }

    this.init();
  }

  init(){
    this.initNeighbors();
    this.initGrid();
    this.generate ();
  }

  initNeighbors(){
    this.array.neighbor = [
      createVector( 0, -1 ),
      createVector( 1, 0 ),
      createVector( 0, 1 ),
      createVector( -1, 0 )
    ];
  }

  initGrid(){
    for( let i = 0; i < this.const.n; i++ ){
      this.array.grid.push( [] );
      for( let j = 0; j < this.const.n; j++ )
          this.array.grid[i].push( true );
    }

    let mid = Math.floor( this.const.n / 2 );
    let midIndex = mid * this.const.n + mid;
    this.array.grid[mid][mid] = false;
    this.array.mask.push( midIndex );


    for( let i = 0; i < this.array.neighbor.length; i++ ){
      let grid = this.convertIndex( midIndex );
      grid.add( this.array.neighbor[i] );
      let index = this.convertGrid( grid );
      this.array.adjacency.push( index );
    }
  }

  generate(){
    for( let r = 0; r < this.const.round; r++ ){
      let rand = Math.floor( Math.random() * this.array.adjacency.length );
      let addIndex = this.array.adjacency[rand];
      this.array.mask.push( addIndex );
      let addGrid = this.convertIndex( addIndex );
      this.array.grid[addGrid.y][addGrid.x] = false;
      this.array.adjacency.splice( rand, 1 )

      for( let i = 0; i < this.array.neighbor.length; i++ ){
        let adjGrid = this.convertIndex( addIndex );
        adjGrid.add( this.array.neighbor[i] );
        let adjIndex = this.convertGrid( adjGrid );
        if( this.array.grid[adjGrid.y][adjGrid.x] )
          this.array.adjacency.push( adjIndex );
      }
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

  draw(){
  }
}
