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
        h: 120,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      input: {
        h: 240,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      output: {
        h: 210,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      begin: {
        h: 60,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      end: {
        h: 0,
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
      this.array.way.push( 0 );
    }
  }

  init(){
    this.const.r =  this.const.a / ( Math.cos( Math.PI / this.const.n ) );
    this.init_vertexs();
  }

  add_input( way, first ){
    this.array.way[way] = 1;
    if( first )
      this.array.way[way] = 2;
    this.array.input.push( way );
  }

  add_output( way, last ){
    this.array.way[way] = 3;
    if( last )
      this.array.way[way] = 4;
    this.array.output.push( way );
  }

  draw( offset ){
    let size = this.const.a * 1.75;

    strokeWeight( 0.2 );

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      switch ( this.array.way[i] ) {
        case 0:
          fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
          stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l );
          break;
        case 1:
          fill( this.color.input.h, this.color.input.s, this.color.input.l );
          stroke( this.color.input.h, this.color.input.s, this.color.input.l );
          break;
        case 2:
          fill( this.color.begin.h, this.color.begin.s, this.color.begin.l );
          stroke( this.color.begin.h, this.color.begin.s, this.color.begin.l );
          break;
        case 3:
          fill( this.color.output.h, this.color.output.s, this.color.output.l );
          stroke( this.color.output.h, this.color.output.s, this.color.output.l );
          break;
        case 4:
          fill( this.color.end.h, this.color.end.s, this.color.end.l );
          stroke( this.color.end.h, this.color.end.s, this.color.end.l );
          break;
      }

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
    }


  noStroke();
  fill( 0 );
  text( this.const.index, this.const.center.x + offset.x, this.const.center.y + offset.y + FONT_SIZE / 3 );
  }
}
