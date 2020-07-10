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
    this.initCells();
    this.initPenta();
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
    for( let i = 0; i < this.array.cell.length; i++ )
      for( let j = 0; j < this.array.cell[i].length; j++ )
        this.array.cell[i][j].draw();
  }
}
