//
class section {
  constructor ( index, center, a ){
    this.const = {
      index: index,
      center: center,
      a: a
    };
    this.var = {
    };
    this.array = {
      vertex: []
    };
    this.color = {
      bg: {
        h: 160,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    }

    this.init();
  }

  initVertexs(){
    let vertex = this.const.center.copy();
    vertex.x += this.const.a / 2;
    vertex.y -= this.const.a / 2;
    this.array.vertex.push( vertex.copy() );
    vertex.y += this.const.a;
    this.array.vertex.push( vertex.copy() );
    vertex.x -= this.const.a;
    this.array.vertex.push( vertex.copy() );
    vertex.y -= this.const.a;
    this.array.vertex.push( vertex.copy() );
  }

  init(){
    this.initVertexs();
  }

  draw( offsets ){
    let offset = offsets[0];
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    strokeWeight( 0.2 );

    let index = 0;
    triangle( this.array.vertex[index].x + offset.x, this.array.vertex[index].y + offset.y,
              this.array.vertex[index + 2].x + offset.x, this.array.vertex[index + 2].y + offset.y,
              this.array.vertex[index + 1].x + offset.x, this.array.vertex[index + 1].y + offset.y );
    triangle( this.array.vertex[index + 3].x + offset.x, this.array.vertex[index + 3].y + offset.y,
              this.array.vertex[index + 2].x + offset.x, this.array.vertex[index + 2].y + offset.y,
              this.array.vertex[index].x + offset.x, this.array.vertex[index].y + offset.y );
  }
}
