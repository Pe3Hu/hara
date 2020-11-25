//
class hall {
  constructor ( index, center, grid, floors, symmetrys, a ){
    this.const = {
      index: index.hall,
      floors: floors,
      i: grid.x,
      j: grid.y,
      symmetrys: symmetrys,
      a: a
    };
    this.var = {
      center: center.copy()
    };
    this.array = {
      floor: [],
    };

    this.init( index.floor );
  }

  initFloors( index ){
    for( let i = 0; i < this.const.floors; i++ ){
      let center = createVector( this.var.center.x, this.var.center.y + ( -this.const.floors / 2 + i ) * this.const.a );
      center.add( this.var.center.copy() );
      let grid = createVector( this.const.i, this.const.j, i );
      let f = this.const.floors / 2 - i;
      switch ( this.const.floors ) {
        case 1:
          f = null;
          break;
        case 2:
        case 3:
          f -= 0.5;
          break;
      }
      let symmetrys = {
        i: this.const.symmetrys.i,
        j: this.const.symmetrys.j,
        f: f
      };

      this.array.floor.push( new floor( index + i,  center, grid, symmetrys, this.const.a ) );
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
