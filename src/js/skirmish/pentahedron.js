//
class pentahedron {
  constructor ( index, center, parity, R ){
    this.const = {
      index: index,
      center: center,
      R: R,
      n: 5
    };
    this.var = {
      parity: parity
    };
    this.array = {
      vertex: []
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

  init(){
    this.setParity( this.var.parity );
  }

  setParity( parity ){
    let n = 0.5 * parity;
    let angle = -n * Math.PI * 2 / this.const.n;
    this.array.vertex = [];

    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) + angle ) * this.const.R,
        Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) + angle ) * this.const.R );
      vec.add( this.const.center );

      this.array.vertex.push( vec );
    }
  }

  draw( offsets ){
    let offset = offsets[0];

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      fill( this.color.bg.h + 10 * i, this.color.bg.s, this.color.bg.l );

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
    }

  }
}
