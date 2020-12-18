//
class trigon {
  constructor ( index, center, parity, R, hue ){
    this.const = {
      index: index,
      center: center.copy(),
      R: R,
      n: 3
    };
    this.var = {
      parity: parity
    };
    this.array = {
      vertex: [],
      hue: [],
      modulus: []
    };
    this.color = {
      bg: {
        h: hue,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  init(){
    this.setParity( this.var.parity );
    this.initModuluss();
  }

  setParity( parity ){
    let n = 0.5 * parity;
    let angle = ( 7/4 - n ) * Math.PI * 2 / this.const.n;
    this.array.vertex = [];

    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i  ) + angle ) * this.const.R,
        Math.cos( Math.PI * 2 / this.const.n * ( - i  ) + angle ) * this.const.R );
      vec.add( this.const.center );

      this.array.vertex.push( vec );
      this.array.hue.push( 0 );
    }
  }

  initModuluss(){
    for( let i = 0; i < this.const.n; i++ ){
      let ii = ( i + 1 ) % this.const.n;

      let center = createVector(
        ( ( this.array.vertex[i].x +this.array.vertex[ii].x ) / 2 + this.const.center.x ) / 2,
        ( ( this.array.vertex[i].y +this.array.vertex[ii].y ) / 2 + this.const.center.y ) / 2 );

      let index = this.const.index * this.const.n + i;
      this.array.modulus.push( new modulus( index, center ) );
    }
  }

  draw( offset ){
    layer = 0;

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      let h = this.color.bg.h;
      fill( h, this.color.bg.s, this.color.bg.l );
      stroke( h, this.color.bg.s, this.color.bg.l );
      strokeWeight( 0.3 );

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
    }

    fill( 0 );

    for( let i = 0; i < this.array.modulus.length; i++ )
      text( i, this.array.modulus[i].const.center.x + offset.x,
               this.array.modulus[i].const.center.y + offset.y + FONT_SIZE / 3 );

    text( this.const.index, this.const.center.x + offset.x, this.const.center.y + offset.y + FONT_SIZE / 3 );

  }
}
