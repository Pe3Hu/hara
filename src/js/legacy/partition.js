//
class partition  {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      center: center.copy(),
      i: grid.x,
      q: grid.y,
      j: grid.z,
      n: 4,
      a: a
    };
    this.array = {
      vertex: [],
      trigon: []
    };
    this.var = {
      color: {},
    };

    this.init();
  }

  init_vertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( -0.5 - i + this.const.n / 2 ) ) * this.const.r,
        Math.cos( Math.PI * 2 / this.const.n * ( -0.5 - i + this.const.n / 2 ) ) * this.const.r );

      vec.add( this.const.center );

      this.array.vertex.push( vec );
      this.array.trigon.push( {
        visiable: false,
        status: {},
        color: {
          h: 210,
          s: COLOR_MAX,
          l: COLOR_MAX * 0.5
        }
      } );

      this.set_status( i, 1 );
    }
  }

  init_hues(){
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
    this.const.r = this.const.a * Math.sqrt( 2 );

    this.init_hues();
    this.init_vertexs();
  }

  set_status( index, status ){
    this.array.trigon[index].status.id = status;
    this.array.trigon[index].visiable = true;

    switch ( status ) {
      case 0:
        this.array.trigon[index].visiable = false;
        break;
      case 1:
        this.array.trigon[index].color.h = this.array.hue[2];
        break;
      case 2:
        this.array.trigon[index].color.h = this.array.hue[0];
        break;
      case 3:
        this.array.trigon[index].color.h = this.array.hue[4];
        break;
    }
  }

  set_doublet( index, status ){
    let i = ( index + this.const.n ) % this.const.n;
    let ii = ( 3 + index + this.const.n ) % this.const.n;
    this.set_status( i, status );
    this.set_status( ii, status );
  }

  set_all( status ){
    for( let i = 0; i < this.array.trigon.length; i++ )
      this.set_status( i, status );
  }

  draw( offset){
      //stroke( this.var.color.h, this.var.color.s, this.var.color.l );
      strokeWeight( 0.2 );
      stroke(0 );

      for( let i = 0; i < this.array.trigon.length; i++ )
      if( this.array.trigon[i].visiable ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        fill( this.array.trigon[i].color.h, this.array.trigon[i].color.s, this.array.trigon[i].color.l );

        triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                  this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                  this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
       }

  }
}
