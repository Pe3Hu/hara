//
class clef {
  constructor ( index, floor ){
    this.const = {
      index: index,
      region: floor.var.region,
      floor: floor,
      size: createVector( floor.const.a * 4, floor.const.a * 4 )
    };
    this.var = {
      center: createVector(),
      state: null,
      shifted: 0,
      zone: null
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
      onScreen: false,
      player: false,
      selected: false
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
      case 7:
        this.var.zone = 2;
        this.flag.onScreen = false;
        break;
      case 1:
      case 2:
      case 5:
      case 6:
        this.var.zone = 3;
        this.flag.onScreen = true;
        break;
      case 3:
        this.var.zone = 4;
        this.flag.onScreen = true;
        break;
      case 4:
        this.var.zone = 5;
        this.flag.onScreen = true;
        break;
    }
    
    this.var.center = createVector();
  }

  setPlayer( flag ){
    this.flag.player = flag;
  }

  setShifted( shifted ){
    this.var.shifted = shifted;
    this.var.center.x += this.var.shifted * this.const.size.x * 0.5;
  }

  setCenter( center ){
    this.var.center = center;
  }

  draw( offsets ){
    if( this.flag.onScreen && this.flag.player ){
      let offset = offsets[this.var.zone];
      let center = offset.copy();
      center.add( this.var.center );
      stroke( 0 );
      fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
      let x = this.const.size.x * 0.5;
      let y = this.const.size.y;
      let shifted = 0;

      if( this.flag.selected )
        x = this.const.size.x;

      rect( center.x - this.const.size.x * 0.5, center.y - this.const.size.y * 0.5, x, y );

      textSize( this.var.fontSize );
      noStroke();
      fill( 0 );
      text( this.const.index, center.x - this.const.size.x * 0.25, center.y + FONT_SIZE / 3 );
      //text( this.const.floor.const.index, center.x, center.y + FONT_SIZE / 3 );
      if( this.flag.selected ){
        text( this.const.floor.const.symmetrys.i, center.x + this.const.size.x * 0.25, center.y - this.const.size.y * 0.25 + FONT_SIZE / 3 );
        text( this.const.floor.const.symmetrys.j, center.x + this.const.size.x * 0.25, center.y + FONT_SIZE / 3 );
        text( this.const.floor.const.symmetrys.f, center.x + this.const.size.x * 0.25, center.y + this.const.size.y * 0.25 + FONT_SIZE / 3 );
      }
      textSize( FONT_SIZE );
    }
  }
}
