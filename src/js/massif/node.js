//
class node {
  constructor ( index, label, center, grid, a ){
    this.const = {
      index: index,
      label: label,
      i: grid.y,
      j: grid.x,
      n: 4,
      a: a
    };
    this.array = {
      vertex: []
    };
    this.var = {
      center: center.copy()
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

  init(){
    this.const.r =  this.const.a * Math.sqrt( 2 );
    this.initVertexs();
  }

  draw( offset ){
   fill( 210, colorMax * 0.75, colorMax * 0.5 );
   noStroke();

   for( let i = 0; i < this.array.vertex.length; i++ ){
     let ii = ( i + 1 ) % this.array.vertex.length;

     triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
               this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
               this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
   }


    strokeWeight( 1 );
    fill( 0 );
    let txt = this.const.label;
    text( txt, this.var.center.x + offset.x, this.var.center.y + offset.y + fontSize / 3 );
  }
}
