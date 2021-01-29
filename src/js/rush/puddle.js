//
class puddle {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      i: grid.y,
      j: grid.x,
      n: 6,
      a: a
    };
    this.array = {
      vertex: []
    };
    this.var = {
      center: center.copy(),
      color: {},
      status: {}
    };

    this.init();
  }

  initVertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.a,
        Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.a );
      vec.add( this.var.center );
      this.array.vertex.push( vec );
    }
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

    this.var.color = {
      h: 210,
      s: COLOR_MAX,
      l: COLOR_MAX * 0.5
    };
  }

  init(){
    this.initVertexs();
    this.initHues();
    this.setStatus( 0 );
  }

  setStatus( status ){
    this.var.status.id = status;

    switch ( status ) {
      case 0:
        break;
      case 1:
        break;
    }
  }

  draw( offset, flag ){
    if( this.var.visiable ){
      //stroke( this.var.color.h, this.var.color.s, this.var.color.l );
      strokeWeight( 0.2 );
      stroke( this.var.color.h, this.var.color.s, this.var.color.l );
      fill( this.var.color.h, this.var.color.s, this.var.color.l );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;

        triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
                  this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                  this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
       }
     }
  }
}
