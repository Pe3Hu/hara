//
class segment {
  constructor ( index, hue, vertexs, angles, n, l ){
    this.const = {
      index: index,
      center: createVector(),
      n: n,
      l: l,
      scale: 10
    };
    this.var = {
    };
    this.array = {
      vertex: vertexs,
      angle: angles
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
    let x = 0, y = 0;

    for( let i = 0; i < this.array.vertex.length; i++ ) {
      x += this.array.vertex[i].x / this.array.vertex.length;
      y += this.array.vertex[i].y / this.array.vertex.length;
    }

    this.const.center = createVector( x, y )

    if( this.const.index == 0 || this.const.index == this.const.l / 2 )
      this.const.center.y += this.const.scale/2;

    if(this.const.index == this.const.l - 1 - 2 * this.const.n || this.const.index == this.const.l / 2 - 1 - 2 * this.const.n )
      this.const.center.y -= this.const.scale/2;
  }

  draw( offsets ){
    let offset = offsets[0].copy();
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    strokeWeight( 0.2 );
    stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l );

    triangle( this.array.vertex[0].x + offset.x, this.array.vertex[0].y + offset.y,
              this.array.vertex[2].x + offset.x, this.array.vertex[2].y + offset.y,
              this.array.vertex[1].x + offset.x, this.array.vertex[1].y + offset.y );
    triangle( this.array.vertex[3].x + offset.x, this.array.vertex[3].y + offset.y,
              this.array.vertex[2].x + offset.x, this.array.vertex[2].y + offset.y,
              this.array.vertex[1].x + offset.x, this.array.vertex[1].y + offset.y );

    fill(0)
    text( this.const.index, this.const.center.x+ offset.x, this.const.center.y + offset.y+ FONT_SIZE / 3 );
  }
}
