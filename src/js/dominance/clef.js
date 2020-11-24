//
class clef {
  constructor ( index, floor ){
    this.const = {
      index: index,
      region: floor.var.region,
      floor: floor,
      a: floor.const.a * 4
    };
    this.var = {
      center: createVector(),
      state: null
    };
    this.array = {
    };
    this.color = {
      bg: {
        h: 210,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  initHues(){
    this.array.hue = [
      52,
      122,
      192,
      262,
      297,
      332
    ];

    this.color.bg.h = this.array.hue[this.const.region];
  }

  init(){
    this.initHues();
  }

  setState( state ){
    //0 - add-on
    //1 - before distribution
    //2 - during distribution
    //3 - during selection
    //4 - after selection
    //5 - before activation
    //6 - during activation
    //7 - discard
    this.var.state = state;

    switch ( state ) {
      case 0:

        break;
    }
  }

  draw( offset ){
    stroke(0);
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    rect( offset.x - this.const.a * 0.5, offset.y - this.const.a * 0.5,
          this.const.a, this.const.a );

      textSize( this.var.fontSize );
      noStroke();
      fill( 0 );
      text( this.const.index, offset.x, offset.y + FONT_SIZE / 3 );
      textSize( FONT_SIZE );
  }
}
