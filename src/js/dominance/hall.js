//
class hall {
  constructor ( index, center, grid, floors, a ){
    this.const = {
      index: index.hall,
      floors: floors,
      i: grid.x,
      j: grid.y,
      a: a
    };
    this.var = {
      center: center.copy()
    };
    this.array = {
      floor: []
    };

    this.init( index.floor );
  }

  initFloors( index ){
    for( let i = 0; i < this.const.floors; i++ ){
      let center = createVector( this.var.center.x, this.var.center.y + ( -this.const.floors / 2 + i ) * this.const.a );
      center.add( this.var.center.copy() );
      let grid = createVector( this.const.i, this.const.j, i );

      this.array.floor.push( new floor( index + i,  center, grid, this.const.a ) );
    }
  }

  init( index ){
    this.initFloors( index );
  }

  draw( offset ){
    for( let i = 0; i < this.array.floor.length; i++ )
      this.array.floor[i].draw( offset )
  }
}
