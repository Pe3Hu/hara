//
class honey {
  constructor ( index, a, traits, womb ){
    this.const = {
      index: index,
      n: 8,
      a: a,
      d: a * 2
    }
    this.array = {
      trait: traits,
      vertex: []
    };
    this.color = {
      bg: {
        h: 0,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };
    this.data = {
      womb: womb
    }

    this.init();
  }

  init(){
    this.set_hue();
    this.init_vertexs();
  }

  set_hue(){
    this.color.bg.h = COLOR_MAX / this.data.womb.array.trait[0].length * this.array.trait[0].id + 45;
  }

  init_vertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.a,
        Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.a );

      this.array.vertex.push( vec.copy() );
    }
  }

  draw( offset ){
    let vec = offset.copy();
    noStroke();
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    //ellipse( vec.x, vec.y, this.const.d, this.const.d );

    stroke( 0 );
    strokeWeight( 0.5 );
    let i = this.array.trait[1].id;
    let ii = ( i + this.const.n / 2 ) % this.const.n;
    /*line( this.array.vertex[i].x + vec.x, this.array.vertex[i].y + vec.y,
          this.array.vertex[ii].x + vec.x, this.array.vertex[ii].y + vec.y );*/
    line( this.array.vertex[i].x + vec.x, this.array.vertex[i].y + vec.y,
          vec.x,  vec.y );
  }
}
