//
class corridor {
  constructor ( floors, type, a ){
    this.const = {
      a: a
    };
    this.var = {
      type: type
    };
    this.array = {
      floor: floors,
      shift: []
    }

    this.init();
  }

  initShifts(){
    let a = this.array.floor[0].var.center.copy();
    let b = this.array.floor[1].var.center.copy();

    switch ( this.var.type ) {
      case 0:
        a.x += this.const.a / 2;
        b.x -= this.const.a / 2;
        break;
      case 1:
        a.y += this.const.a / 2;
        b.y -= this.const.a / 2;
        break;
      case 2:
        a.y -= this.const.a / 2;
        b.y += this.const.a / 2;
        break;
    }

    this.array.shift = [ a, b ];
  }

  init(){
    this.initShifts();
  }

  draw( offset ){
    let begin = this.array.shift[0].copy();
    let end = this.array.shift[1].copy();
    begin.add( offset );
    end.add( offset );
    line( begin.x, begin.y, end.x, end.y );
  }
}
