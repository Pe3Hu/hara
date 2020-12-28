//
class altar {
  constructor ( index, center, milestones, a ){
    this.const = {
      index: index,
      center: center,
      milestones: milestones,
      a: a
    };
    this.var = {
      index: {
        port: index * milestones * 4
      },
      vec:null
    };
    this.array = {
      vertex: [],
      port: []
    };
    this.color = {
      bg: {
        h: 120,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    }

    this.init();
  }

  initVertexs(){
    let vertex = this.const.center.copy();
    vertex.x += this.const.a / 2;
    vertex.y -= ( this.const.milestones * 2 + 1 ) * this.const.a;
    this.array.vertex.push( vertex.copy() );
    vertex.y += ( this.const.milestones * 4 + 2 ) * this.const.a;
    this.array.vertex.push( vertex.copy() );
    vertex.x -= this.const.a;
    this.array.vertex.push( vertex.copy() );
    vertex.y -= ( this.const.milestones * 4 + 2 ) * this.const.a;
    this.array.vertex.push( vertex.copy() );
  }

  initPorts(){
    for( let side = 1; side >= -1; side-=2 ){
      let a;
      switch ( side ) {
        case -1:
          a = 1;
          break;
        case 1:
          a = 0;
          break;
      }
      let vec = this.array.vertex[a].copy();
      vec.x -= this.const.a * 0.5;

      for( let i = 0; i < this.const.milestones; i++ ){
        vec.y += side  * 2 * this.const.a;
        vec.x -= this.const.a * 1.25;
        this.addPort( vec );
        vec.x += this.const.a * 2.5;
        this.addPort( vec );
        vec.x -= this.const.a * 1.25;
      }
    }
  }

  init(){
    this.initVertexs();
    this.initPorts();
  }

  addPort( center ){
    this.array.port.push( new port( this.var.index.port, center.copy(), this.const.a ) );
    this.var.index.port++;
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


    for( let port of this.array.port )
      port.draw( offsets );
  }
}
