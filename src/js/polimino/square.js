//
class square{
  constructor(){
    this.const = {
      offset: createVector( cellSize * 2, cellSize * 2 ),
      a: cellSize * 0.5,
      n: 9
    };
    this.var = {
    }
    this.array = {
      cell: []
    }

    this.init();
  }

  init(){
    this.const.offset = createVector( cellSize * 2, cellSize * 2 )
    this.initCells();
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
    this.array.cell[0][0].setStatus( 1 );
  }

  draw(){
    for( let i = 0; i < this.const.n; i++ )
      for( let j = 0; j < this.const.n; j++ )
        this.array.cell[i][j].draw();
  }
}
