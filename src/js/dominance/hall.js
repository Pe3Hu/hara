//
class hall {
  constructor ( index, center, floors, a ){
    this.const = {
      index: index,
      floors: floors,
      a: a
    };
    this.var = {
      center: center.copy()
    };

    this.init();
  }

  init(){

  }

  draw( vec ){
    let offset = this.var.center.copy()
    offset.add( vec );
    ellipse( offset.x, offset.y, this.const.a, this.const.a * this.const.floors );
  }
}
