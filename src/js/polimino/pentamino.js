//
class pentamino {
  constructor(){
    this.const = {
      offset: createVector( cellSize * 2, cellSize * 2 ),
      a: cellSize * 0.5,
      n: 9
    };
    this.var = {
    }
    this.array = {
      adjacency: [],
      neighbor: [],
      grid: []
    }

    this.init();
  }

  init(){
    this.initNeighbors();
    this.initCells();
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
      this.array.grid.push( [] );
      for( let j = 0; j < this.const.n; j++ ){
          let index = i * this.const.n + j;
          let vec = createVector( this.const.offset.x, this.const.offset.y );
          let grid = createVector( j, i );
          vec.x += this.const.a * j;
          vec.y += this.const.a * i;
          this.array.grid[i].push(  );
      }
    }
    this.array.grid[0][0].setStatus( 1 );
  }

  draw(){
    for( let i = 0; i < this.const.n; i++ )
      for( let j = 0; j < this.const.n; j++ )
        this.array.grid[i][j].draw();
  }
}
