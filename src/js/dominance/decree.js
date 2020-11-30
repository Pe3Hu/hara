//
class decree {
  constructor ( index, challenger ){
    this.const = {
      index: index,
      challenger: challenger,
      size: createVector( challenger.const.a * 4.5, challenger.const.a * 3 )
    };
    this.var = {
      center: createVector()
    }
    this.array = {
      clef: []
    };
    this.flag = {
      actived: false,
      selected: false
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
      30,
      270
    ];

    this.color.bg.h = this.array.hue[this.const.challenger.const.index];
  }

  setType(){
    let name, length, array;
    switch ( this.const.index ) {
      case 0:
        length = 3;
        array = [];
        name = 'save';
        break;
      case 1:
        length = 4;
        array = [];
        name = 'drop';
        break;
      case 2:
        length = 8;
        array = [ [], [] ];
        name = 'choice 2';
        break;
      case 3:
        length = 9;
        array = [ [], [], [] ];
        name = 'choice 3';
        break;
      case 4:
        length = 6;
        array = [];
        name = 'choice 4';
        break;
    }

    this.const.name = name;
    this.const.length = length;
    this.array.clef = array;
  }

  setActived( flag ){
    this.flag.actived = flag;
    this.flag.selected = false;

    if( !this.flag.actived )
      this.color.bg = {
        h: this.array.hue[this.const.challenger.const.index],
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    else
      this.color.bg = {
        h: COLOR_MAX * 0,
        s: COLOR_MAX * 0,
        l: COLOR_MAX * 0
      };

    console.log(   this.color.bg )
  }

  setSelected( flag ){
    this.flag.selected = flag;

    if( !this.flag.selected )
      this.color.bg = {
        h: this.array.hue[this.const.challenger.const.index],
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    else
      this.color.bg = {
        h: COLOR_MAX * 1,
        s: COLOR_MAX * 1,
        l: COLOR_MAX * 1
      };
  }

  init(){
    this.setType();
    this.initHues();
  }

  setCenter( center ){
    this.var.center = center;
  }

  draw( offset ){
    let center = offset.copy();
    center.add( this.var.center );

    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    rect( center.x - this.const.size.x / 2, center.y - this.const.size.y / 2, this.const.size.x, this.const.size.y );

    fill( 0 );
    text( this.const.name, center.x, center.y + FONT_SIZE / 3 );
  }
}
