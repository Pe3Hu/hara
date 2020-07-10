//the basic element of Settlement
class area {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      i: grid.y,
      j: grid.x,
      n: 6,
      a: a
    };
    this.array = {
      vertex: [],
      dot: []
    };
    this.var = {
      lightness: colorMax * 0.75,
      center: center.copy(),
      status: 'empty',
      saturation: 0,
      type: null,
      visiable: false,
      hue: 0
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
    this.const.r =  this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );
    this.initVertexs();
  }

  setType( type ){
    this.array.dot = [];
    let add = [];
    let center = null;
    this.var.type = type;
    this.var.l = type / 2;;

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;
      let vec = this.array.vertex[ii].copy();
      vec.x -= this.array.vertex[i].x;
      vec.y -= this.array.vertex[i].y;
      vec.x /= this.var.l;
      vec.y /= this.var.l;
      add.push( vec.copy() );
    }

    for( let i = 0; i < this.array.vertex.length; i++ ){
      this.array.dot.push( [] );
      center = this.array.vertex[i].copy();
      this.array.dot[i].push( center.copy() );
      for( let j = 0; j < this.var.l; j++ ){
        center.add( add[i] );
        this.array.dot[i].push( center.copy() );
      }
    }
  }

  setStatus( status ){
    switch ( status ) {
      //show free
      case 0:
        this.var.status = 'empty';
        this.var.free = true;
        this.var.hue = 0;
        this.var.saturation = 0;
        this.var.lightness = colorMax * 0.75;
        break;
      //show free
      case 1:
        this.var.status = 'center';
        this.var.free = false;
        this.var.hue = 60;
        this.var.saturation = colorMax * 1;
        this.var.lightness = colorMax * 0.5;
        break;
    }
  }

  draw( gap ){
    if( this.var.visiable ){
      noStroke();
      //stroke( this.var.hue, this.var.saturation, this.var.lightness );
      fill( this.var.hue, this.var.saturation, this.var.lightness );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        triangle( this.var.center.x, this.var.center.y,
                  this.array.vertex[i].x, this.array.vertex[i].y,
                  this.array.vertex[ii].x, this.array.vertex[ii].y );
       }

       stroke( 0 );
       fill( 0 );
       this.var.txt = this.const.index;
       text( this.var.txt, this.var.center.x, this.var.center.y + fontSize / 3 );
    }
  }
}
