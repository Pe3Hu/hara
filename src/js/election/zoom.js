//
class zoom {
  constructor( community, neighbors ){
    this.const = {
      scale: 2,
      n: 6
    };
    this.var = {
    };
    this.data = {
      community: community
    };
    this.array = {
      vertex: [],
      corner: [],
      neighbor: neighbors
    };
    this.color = {
      bg: {
        h: 60,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  initVertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.a * this.const.scale,
        Math.cos( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.a * this.const.scale );
      this.array.vertex.push( vec );

      vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.r * this.const.scale,
        Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.r * this.const.scale );
      this.array.corner.push( vec );
    }
  }

  init(){
    this.const.a =  this.data.community.const.a * this.const.scale / ( Math.tan( Math.PI / this.const.n ) * 2 );
    this.const.r =  this.const.a * this.const.scale / ( Math.tan( Math.PI / this.const.n ) * 2 );

    this.var.offset = createVector(
        this.const.a * this.const.scale + CELL_SIZE,
        this.const.a * this.const.scale + CELL_SIZE );

    this.initVertexs();
  }

  draw( vector ){
    let offset = vector.copy();
    offset.y += this.var.offset.y + CELL_SIZE;
    //this.data.duplicate.draw( offset );
    noStroke();
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );


    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      triangle( offset.x, offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
     }
  }
}
