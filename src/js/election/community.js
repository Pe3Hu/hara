//
class community {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      i: grid.y,
      j: grid.x,
      n: 6,
      a: a
    };
    this.array = {
      vertex: []
    };
    this.var = {
      center: center.copy(),
      visiable: false,
      temp: {
        remoteness: null,
        path: []
      },
      remoteness: null
    };
    this.color = {
      bg:{
        h: 45,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  setRemoteness( remoteness, path, flag ){
    if( flag )
      this.var.remoteness = remoteness;
    else{
      this.var.temp.remoteness = remoteness;

      for( let i = 0; i < path.length; i++ )
        this.var.temp.path.push( path[i] );
    }
    console.log( this.var.temp.path )
  }

  initVertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.a,
        Math.cos( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.a );
      vec.add( this.var.center );
      this.array.vertex.push( vec );
    }
  }

  init(){
    this.const.r =  this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );
    this.initVertexs();
  }

  draw( gap ){
    if( this.var.visiable ){
      noStroke();
      fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        triangle( this.var.center.x, this.var.center.y,
                  this.array.vertex[i].x, this.array.vertex[i].y,
                  this.array.vertex[ii].x, this.array.vertex[ii].y );
       }

       //stroke( 0 );
       fill( 0 );
       this.var.txt = this.const.index + '_' + this.var.temp.path;
       text( this.var.txt, this.var.center.x, this.var.center.y + FONT_SIZE / 3 );
    }
  }
}
