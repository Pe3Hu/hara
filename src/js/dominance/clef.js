//
class clef {
  constructor ( index, floor ){
    this.const = {
      index: index,
      region: floor.var.region,
      floor: floor,
      size: createVector( floor.const.a * 2, floor.const.a * 4 )
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
    this.flag = {
      onScreen: false
    }

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

  convertFloorConst(){
    this.const.i = 7;
  }

  init(){
    this.initHues();
    this.convertFloorConst();
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
        this.flag.onSreen = false;
        break;
      case 1:
        this.flag.onSreen = true;
        break;
    }
  }

  clean(){
    
  }

  draw(){
    if( this.flag.onScreen ){
      stroke( 0 );
      fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
      rect( this.var.center.x - this.const.a * 0.5, this.var.center.y - this.const.a * 0.5,
            this.const.a, this.const.a );

      textSize( this.var.fontSize );
      noStroke();
      fill( 0 );
      text( this.const.index, this.var.center.x - this.const.a * 0.25, this.var.center.y + FONT_SIZE / 3 );
      //text( this.const.floor.const.index, this.var.center.x, this.var.center.y + FONT_SIZE / 3 );
      text( this.const.floor.const.symmetrys.i, this.var.center.x + this.const.a * 0.25, this.var.center.y - this.const.a * 0.25 + FONT_SIZE / 3 );
      text( this.const.floor.const.symmetrys.j, this.var.center.x + this.const.a * 0.25, this.var.center.y + FONT_SIZE / 3 );
      text( this.const.floor.const.symmetrys.f, this.var.center.x + this.const.a * 0.25, this.var.center.y + this.const.a * 0.25 + FONT_SIZE / 3 );
      textSize( FONT_SIZE );
    }
  }
}
