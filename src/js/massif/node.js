//
class node {
  constructor ( index, label, center, grid, neighbors, a ){
    this.const = {
      index: index,
      label: label,
      i: grid.x,
      j: grid.y,
      f: grid.z,
      n: 4,
      a: a
    };
    this.array = {
      vertex: [],
      neighbors: neighbors
    };
    this.var = {
      center: center.copy(),
      status: 2
    };
    this.color = {
      bg:{
        h: 60,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  init_vertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.a,
        Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.a );
      vec.add( this.var.center );
      this.array.vertex.push( vec );
    }
  }

  init(){
    this.const.r =  this.const.a * Math.sqrt( 2 );
    this.init_vertexs();
  }

  press( status ){
    switch ( this.var.status ) {
      case 0:
      case 1:
        this.var.status = 2;
        break;
      case 2:
        this.var.status = status;
        break;
    }

    switch ( this.var.status ) {
      case 0:
        this.color.bg.h = 120;
        break;
      case 1:
        this.color.bg.h = 30;
        break;
      case 2:
        this.color.bg.h = 60;
        break;
    }
  }

  draw( offset ){
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    noStroke();

    for( let i = 0; i < this.array.vertex.length; i++ ){
    let ii = ( i + 1 ) % this.array.vertex.length;

    triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
             this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
             this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
   }

    textSize( this.const.a );
    strokeWeight( 1 );
    fill( 0 );
    let txt = this.const.label;
    text( txt, this.var.center.x + offset.x, this.var.center.y + offset.y + this.const.a / 3 );
    textSize( FONT_SIZE );
  }
}
