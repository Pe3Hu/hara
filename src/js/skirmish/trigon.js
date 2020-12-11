//
class trigon {
  constructor ( index, center, parity, R ){
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
      hue: []
    };
    this.color = {
      bg: {
        h: COLOR_MAX / 12 * index,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  init(){
    this.setParity( this.var.parity );
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

  setEdgeHue( edge, hue ){
    if( edge < this.array.hue.length )
      this.array.hue[edge] = hue;
  }

  draw( offset, layer ){

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      let h;
      switch ( layer ) {
        case 0:
          h = this.array.hue[i];
          break;
        case 1:
          h = this.color.bg.h;
          break;
      }
      fill( h, this.color.bg.s, this.color.bg.l );

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );


       fill( 0 );
       text( i, ( ( this.array.vertex[i].x +this.array.vertex[ii].x ) / 2 + this.const.center.x ) / 2 + offset.x,
                ( ( this.array.vertex[i].y +this.array.vertex[ii].y ) / 2 + this.const.center.y ) / 2 + offset.y + FONT_SIZE / 3 );
    }

   fill( 0 );
   text( this.const.index, this.const.center.x + offset.x, this.const.center.y + offset.y + FONT_SIZE / 3 );

  }
}
