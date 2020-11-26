//
class decree {
  constructor ( index, challenger ){
    this.const = {
      index: index,
      challenger: challenger,
      size: createVector( challenger.const.a * 4.5, challenger.const.a * 3 )
    };
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

  switchActivion(){
    this.flag.actived = !this.flag.actived;

    if( this.flag.active ){
      if( this.array.hue.length > this.const.challenger.const.index )
        this.color.b = {
          h: this.array.hue[this.const.challenger.const.index],
          s: COLOR_MAX * 0.75,
          l: COLOR_MAX * 0.5
        }
      else
        this.color.bg = {
          h: 0,
          s: 0,
          l: 0
        };
    }
    else
      this.color.bg = {
        h: COLOR_MAX * 0.5,
        s: COLOR_MAX * 0.5,
        l: COLOR_MAX * 0.5
      };
  }

  switchSelection(){
    this.flag.selected = !this.flag.selected;

    if( !this.flag.selected )
      if( this.array.hue.length > this.const.challenger.const.index )
        this.color.b = {
          h: this.array.hue[this.const.challenger.const.index],
          s: COLOR_MAX * 0.75,
          l: COLOR_MAX * 0.5
        }
      else
        this.color.bg = {
          h: 0,
          s: 0,
          l: 0
        };
    else
      this.color.bg = {
        h: COLOR_MAX * 1,
        s: COLOR_MAX * 1,
        l: COLOR_MAX * 1
      };
  }

  clean(){
    if( this.flag.selected )
     this.switchSelection();
  }

  init(){
    this.setType();
    this.initHues();
  }

  draw( offset ){

    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    rect( offset.x - this.const.size.x / 2, offset.y - this.const.size.y / 2, this.const.size.x, this.const.size.y );


    fill( 0 );
    text( this.const.name, offset.x, offset.y + FONT_SIZE / 3 );
  }
}
