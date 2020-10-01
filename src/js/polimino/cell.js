//
class cell {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      center: center,
      j: grid.x,
      i: grid.y,
      a: a
    };
    this.array = {
    };
    this.var = {
      card: null
    };

    this.init();
  }

  init(){
    this.setStatus( 0 );
  }

  setStatus( status, card ){
    switch ( status ) {
      //show free
      case 0:
        this.var.status = 'empty';
        this.var.free = true;
        this.var.hue = 60;
        this.var.saturation = COLOR_MAX;
        this.var.lightness = COLOR_MAX * 0.75;
        this.var.card = null;
        break;
      //show taken
      case 1:
        this.var.status = 'taken';
        this.var.free = false;
        this.var.hue = 210;
        this.var.saturation = COLOR_MAX;
        this.var.lightness = COLOR_MAX * 0.5;
        this.var.card = card;
        break;
    }
  }

  draw(){
    if( this.var.card == null ){
      stroke( 0 );
      fill( this.var.hue, this.var.saturation, this.var.lightness );
      rect(
        this.const.center.x - this.const.a / 2,
        this.const.center.y - this.const.a / 2,
        this.const.a, this.const.a
      );

      stroke( 0 );
      fill( 0 );
      let txt = this.const.index;
      text( txt, this.const.center.x, this.const.center.y + FONT_SIZE / 3 );
    }
  }
}
