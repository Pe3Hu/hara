//
class reaches {
  constructor ( index, altitude, center, grid, a ){
    this.const = {
      index: index,
      altitude: altitude,
      center: center,
      i: grid.y,
      j: grid.x,
      n: 8,
      a: a
    };
    this.array = {
      vertex: [],
      way: [],
      input: [],
      output: [],
    };
    this.data = {
      water_content: 0
    };
    this.color = {
      bg: {
        h: 210,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      flow: {
        h: 120,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    }

    this.init();
  }

  init_vertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( -0.5 - i + this.const.n / 2 ) ) * this.const.r,
        Math.cos( Math.PI * 2 / this.const.n * ( -0.5 - i + this.const.n / 2 ) ) * this.const.r );
      vec.add( this.const.center );

      this.array.vertex.push( vec );
      this.array.way.push( false );
    }
  }

  init(){
    this.const.r =  this.const.a / ( Math.cos( Math.PI / this.const.n ) );
    this.init_vertexs();
  }

  add_input( way ){
    this.array.way[way] = true;
    this.array.input.push( way );
  }

  add_output( way ){
    this.array.way[way] = true;
    this.array.output.push( way );
  }

  draw( offset ){
    let size = this.const.a * 1.75;

    strokeWeight( 0.2 );

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      if( this.array.way[i] ){
        fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
        stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l );
      }
      else{
        fill( this.color.flow.h, this.color.flow.s, this.color.flow.l );
        stroke( this.color.flow.h, this.color.flow.s, this.color.flow.l );
      }

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
    }
  }
}
