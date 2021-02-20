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
      entry: {
        h: 0,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      exit: {
        h: 0,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      deadlock: {
        h: 270,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

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

  add_way( obj ){
    let status, array;

    switch ( obj.in_out ) {
      case 'in':
        array = this.array.input;
        status = 1 + obj.type;
        this.var.cluster = obj.cluster;
        this.var.water_content = obj.water_content;
        break;
      case 'out':
        array = this.array.output;
        status = obj.type;
        break;
    }

    this.array.way[obj.way] = status;

    let index = array.indexOf(  obj.way );
    if( index == - 1 )
      array.push( obj.way );
  }

  set_height( height ){
    this.var.height = height;
    this.color.bg.h = 240 - height
  }

  draw( offset, layout ){
    let txt = '';
    let bg = {
      h: 300,
      s: COLOR_MAX * 0.25,
      l: COLOR_MAX * 0.75
    };
    switch ( layout ) {
      case 0:
      case 1:
        bg = {
          h: 300,
          s: COLOR_MAX * 0.25,
          l: COLOR_MAX * 0.75
        };
        break;
      case 2:
        txt = Math.floor( this.var.height);
        bg = this.color.bg;
        break;
    }

    strokeWeight( 0.25 );
    fill( bg.h, bg.s, bg.l );
    stroke( bg.h, bg.s, bg.l );

    for( let i = 0; i < this.array.vertex[0].length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex[0].length;

      triangle( this.const.center.x + offset.x, this.const.center.y + offset.y,
                this.array.vertex[0][i].x + offset.x, this.array.vertex[0][i].y + offset.y,
                this.array.vertex[0][ii].x + offset.x, this.array.vertex[0][ii].y + offset.y );
    }

    switch ( layout ) {
      case 0:
        txt = this.const.index;

        for( let i = 0; i < this.array.vertex[0].length; i++ ){
          let ii = ( i + 1 ) % this.array.vertex[0].length;

          switch ( this.array.way[i] ) {
              case 2:
                stroke( 120, this.color.bg.s, this.color.bg.l );
                fill( 120, this.color.bg.s, this.color.bg.l );
                break;
              case 3:
                stroke( 60, this.color.bg.s, this.color.bg.l );
                fill( 60, this.color.bg.s, this.color.bg.l );
                break;
              case 6:
                stroke( 270, this.color.bg.s, this.color.bg.l );
                fill( 270, this.color.bg.s, this.color.bg.l );
                break;
              case 1:
                stroke( 210, this.color.bg.s, this.color.bg.l );
                fill( 210, this.color.bg.s, this.color.bg.l );
                break;
              case 4:
                stroke( 0, this.color.bg.s, this.color.bg.l );
                fill( 0, this.color.bg.s, this.color.bg.l );
                break;
          }
          switch ( this.array.way[i] ) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 6:
              triangle( this.array.vertex[1][ii].x + offset.x, this.array.vertex[1][ii].y + offset.y,
                        this.array.vertex[2][ii].x + offset.x, this.array.vertex[2][ii].y + offset.y,
                        this.array.vertex[1][i].x + offset.x, this.array.vertex[1][i].y + offset.y );
              triangle( this.array.vertex[2][ii].x + offset.x, this.array.vertex[2][ii].y + offset.y,
                        this.array.vertex[3][i].x + offset.x, this.array.vertex[3][i].y + offset.y,
                        this.array.vertex[1][i].x + offset.x, this.array.vertex[1][i].y + offset.y );
              break;
          }
        }
        break;
      case 1:
        txt = this.var.cluster;
        break;
      case 2:
        txt = Math.floor( this.var.height);
        break;
    }

    stroke( 0 );
    strokeWeight( 0.5 );

    if( this.var.cluster < 0 ){
      for( let i = 0; i < this.array.vertex[0].length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex[0].length;

        //0 - no input & no output
        //1 - regular input
        //2 - headwaters input
        //3 - distributary input
        //4 - regular output
        //5 - output deadlock
        //6 - delta output
        switch ( this.array.way[i] ) {
          case 0:
          case 5:
            line( this.array.vertex[1][i].x + offset.x, this.array.vertex[1][i].y + offset.y,
                  this.array.vertex[1][ii].x + offset.x, this.array.vertex[1][ii].y + offset.y );
            break;
          case 1:
          case 2:
          case 3:
          case 4:
          case 6:
            line( this.array.vertex[1][ii].x + offset.x, this.array.vertex[1][ii].y + offset.y,
                  this.array.vertex[2][ii].x + offset.x, this.array.vertex[2][ii].y + offset.y );
            line( this.array.vertex[1][i].x + offset.x, this.array.vertex[1][i].y + offset.y,
                  this.array.vertex[3][i].x + offset.x, this.array.vertex[3][i].y + offset.y );
            break;
        }
      }
    }

  noStroke();
  fill( 0 );
  text( txt, this.const.center.x + offset.x, this.const.center.y + offset.y + FONT_SIZE / 3 );

  }
}
