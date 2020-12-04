//
class floor {
  constructor ( index, center, grid, symmetrys, a ){
    this.const = {
      index: index,
      i: grid.x,
      j: grid.y,
      f: grid.z,
      symmetrys: symmetrys,
      a: a
    };
    this.var = {
      center: center.copy(),
      fontSize: 8,
      region: null,
      outflow: 1,
      coverage: 1
    };
    this.array = {
      link: [ [], [] ],
      borderlands: []
    };
    this.color = {
      bg: {
        h: 30,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      challenger: {
        h: COLOR_MAX * 1,
        s: COLOR_MAX * 1,
        l: COLOR_MAX * 1
      },
      owner: {
        h: COLOR_MAX * 1,
        s: COLOR_MAX * 1,
        l: COLOR_MAX * 1
      }
    };
    this.data = {
      banner: {
        current: 0,
        max: 100,
        challenger: null,
        owner: null
      }
    }

    this.init();
  }

  initHues(){
    //0 - region, 1 - banner
    this.array.hue = [ [
      52,
      122,
      192,
      262,
      297,
      210,
      0
    ],
    [
      210,
      0
    ] ];
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

    this.color.bg.h = this.array.hue[0][region];
  }

  captureBanner( challenger, value ){
    //
    if( challenger == null ){
      this.data.banner.current -= value;
      if( this.data.banner.current <= 0 ) {
        this.data.banner.challenger = null;
        this.data.banner.owner = null;
        this.data.banner.current = 0;
        this.color.banner = {
          h: COLOR_MAX * 1,
          s: COLOR_MAX * 1,
          l: COLOR_MAX * 1
        };
        this.color.owner = {
          h: COLOR_MAX * 1,
          s: COLOR_MAX * 1,
          l: COLOR_MAX * 1
        };
      }
    }
    else
      if( this.data.banner.challenger == challenger ){
        this.data.banner.current += value;
        if( this.data.banner.current >= this.data.banner.max ){
          this.data.banner.owner = challenger;
          this.data.banner.current = this.data.banner.max;
          this.color.owner = {
            h: this.array.hue[1][challenger],
            s: COLOR_MAX * 0.75,
            l: COLOR_MAX * 0.5
          };
        }
      }
      else
        if( this.data.banner.challenger != null ){
          this.data.banner.current -= value;
          if( this.data.banner.current < 0 ){
            let value = Math.abs( this.data.banner.current );
            this.data.banner.current = 0;
            this.data.banner.challenger = challenger;
            this.color.challenger = {
              h: this.array.hue[1][challenger],
              s: COLOR_MAX * 0.75,
              l: COLOR_MAX * 0.5
            };
            this.captureBanner( challenger, value );
          }
        }
        else{
          this.data.banner.challenger = challenger;
          this.color.challenger = {
            h: this.array.hue[1][challenger],
            s: COLOR_MAX * 0.75,
            l: COLOR_MAX * 0.5
          };
          this.captureBanner( challenger, value );
        }
  }

  draw( vec ){
    let offset = this.var.center.copy();
    offset.add( vec );

    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    rect( offset.x - this.const.a * 0.5, offset.y - this.const.a * 0.5,
          this.const.a, this.const.a );

    fill( this.color.owner.h, this.color.owner.s, this.color.owner.l );
    ellipse( offset.x + this.const.a * 1, offset.y, this.const.a * 0.6, this.const.a * 0.6 );

    fill( this.color.challenger.h, this.color.challenger.s, this.color.challenger.l );
    ellipse( offset.x + this.const.a * 1, offset.y, this.const.a * 0.3, this.const.a * 0.3 );

    textSize( this.var.fontSize );
    noStroke();
    fill( 0 );
    this.var.txt = this.const.index;
    text( this.var.txt, offset.x, offset.y + FONT_SIZE / 3 );
    textSize( FONT_SIZE );
  }
}
