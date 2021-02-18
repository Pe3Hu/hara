//
class reaches {
  constructor ( index, altitude, center, grid, r ){
    this.const = {
      index: index,
      altitude: altitude,
      center: center,
      grid: grid,
      n: 8,
      a: null,
      r: r,
      circumradius: null
    };
    this.var = {
      cluster: 0,
      water_content: 0,
      height: null
    };
    this.array = {
      vertex: [],
      way: [],
      input: [],
      output: [],
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
    this.array.vertex = [ [], [], [], [] ];
    let scale = 1/3;

    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( -0.5 - i + this.const.n / 2 ) ) * this.const.circumradius,
        Math.cos( Math.PI * 2 / this.const.n * ( -0.5 - i + this.const.n / 2 ) ) * this.const.circumradius );

      let vertex = vec.copy();
      vertex.add( this.const.center );
      this.array.vertex[0].push( vertex.copy() );

      vertex = vec.copy();
      vertex.mult( scale );
      vertex.add( this.const.center );
      this.array.vertex[1].push( vertex.copy() );

      vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.r,
        Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 ) ) * this.const.r );
      vec.mult( 1 - scale );
      vec.add( vertex );
      this.array.vertex[2].push( vec.copy() );

      vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( -1 - i + this.const.n / 2 ) ) * this.const.r,
        Math.cos( Math.PI * 2 / this.const.n * ( -1 - i + this.const.n / 2 ) ) * this.const.r );
      vec.mult( 1 - scale );
      vec.add( vertex );
      this.array.vertex[3].push( vec.copy() );


      this.array.way.push( 0 );
    }
  }

  init(){
    this.const.a =  this.const.r * Math.tan( Math.PI / this.const.n ) * 2 ;
    this.const.circumradius =  this.const.r / Math.cos( Math.PI / this.const.n );
    this.init_vertexs();
  }

  add_input( way, first, cluster, water_content ){
    this.var.cluster = cluster;
    this.var.water_content = water_content;
    this.array.way[way] = 1 + first;
    let index = this.array.input.indexOf( way );
    if( index == - 1 )
      this.array.input.push( way );
  }

  add_output( way, last ){
    this.array.way[way] = 3 + last;
    let index = this.array.output.indexOf( way );
    if( index == - 1 )
      this.array.output.push( way );
  }

  set_height( height ){
    this.var.height = height;
    this.color.bg.h = 240 - height
  }

  draw( offset ){
    strokeWeight( 0.25 );
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l );

    for( let i = 0; i < this.array.vertex[0].length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex[0].length;

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[0][i].x + offset.x, this.array.vertex[0][i].y + offset.y,
                this.array.vertex[0][ii].x + offset.x, this.array.vertex[0][ii].y + offset.y );
    }

    stroke( 0 );
    strokeWeight( 0.5 );

    if( this.var.cluster < 0 )
      for( let i = 0; i < this.array.vertex[0].length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex[0].length;

        switch ( this.array.way[i] ) {
          case 0:
          case 4:
            line( this.array.vertex[1][i].x + offset.x, this.array.vertex[1][i].y + offset.y,
                  this.array.vertex[1][ii].x + offset.x, this.array.vertex[1][ii].y + offset.y );
            break;
          case 1:
          case 2:
          case 3:
          case 5:
            line( this.array.vertex[1][ii].x + offset.x, this.array.vertex[1][ii].y + offset.y,
                  this.array.vertex[2][ii].x + offset.x, this.array.vertex[2][ii].y + offset.y );
            line( this.array.vertex[1][i].x + offset.x, this.array.vertex[1][i].y + offset.y,
                  this.array.vertex[3][i].x + offset.x, this.array.vertex[3][i].y + offset.y );
            break;
        }
      }



  noStroke();
  fill( 0 );
  let txt = this.const.index;// Math.floor( this.var.height)
  text( txt, this.const.center.x + offset.x, this.const.center.y + offset.y + FONT_SIZE / 3 );

  }
}
