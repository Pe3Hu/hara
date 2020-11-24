//
class floor {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      i: grid.x,
      j: grid.y,
      f: grid.z,
      a: a
    };
    this.var = {
      center: center.copy(),
      fontSize: 8,
      region: null
    };
    this.array = {
      link: [ [], [] ]
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
  }

  init(){
    this.initHues();
  }

  addLink( link ){
    let j = 0;
    if( link > this.const.index  )
      j = 1;

    this.array.link[j].push( link );
  }

  setRegion( region ){
    this.var.region = region;

    this.color.bg.h = this.array.hue[region];
  }

  draw( vec ){
    let offset = this.var.center.copy();
    offset.add( vec );

    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    rect( offset.x - this.const.a * 0.5, offset.y - this.const.a * 0.5,
          this.const.a, this.const.a );

    textSize( this.var.fontSize );
    fill( 0 );
    this.var.txt = this.const.index;
    text( this.var.txt, offset.x, offset.y + FONT_SIZE / 3 );
    textSize( FONT_SIZE );
  }
}
