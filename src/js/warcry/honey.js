//
class honey {
  constructor ( index, a, traits ){
    this.const = {
      index: index,
      a: a
    }
    this.array = {
      trait: traits
    };
    this.color = {
      bg: {
        h: 0,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    }

    this.init();
  }

  init(){
    this.set_hue();
  }

  set_hue(){
    this.color.bg.h = COLOR_MAX / 4 * this.array.trait[0] + 45;
  }

  draw( offset ){
    noStroke();
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    ellipse( offset.x, offset.y, this.const.a, this.const.a );
  }
}
