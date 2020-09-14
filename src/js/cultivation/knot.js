//the basic element of rune
class knot {
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
      type: null,
      visiable: false,
      child: null,
      parent: null,
      label: null
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

  initLabel(){
    let shift = null;
    switch ( this.const.i ) {
      case 0:
      case 1:
      case 2:
      case 4:
        shift = -this.const.i;
        break;
      case 3:
        shift = -this.const.i + 1;
        break;
    }
    this.var.label = this.const.index + shift;
  }

  init(){
    this.const.r =  this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );
    this.initVertexs();
    this.initLabel();
    this.setStatus( 0 );
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
      //display as a knot that cannot be reached
      case 0:
        this.var.status = 'far';
        this.var.free = true;
        this.var.hue = 0;
        this.var.saturation = 0;
        this.var.lightness = colorMax * 0.75;
        break;
      //display as a considered option
      case 1:
        this.var.status = 'option';
        this.var.free = true;
        this.var.hue = 120;
        this.var.saturation = colorMax * 1;
        this.var.lightness = colorMax * 0.5;
        break;
      //display as an involved knot
      case 2:
        this.var.status = 'involved';
        this.var.free = false;
        this.var.hue = 60;
        this.var.saturation = colorMax * 1;
        this.var.lightness = colorMax * 0.5;
        break;
    }
  }

  draw( offset ){
    if( this.var.visiable ){
      noStroke();
      //stroke( this.var.hue, this.var.saturation, this.var.lightness );
      fill( this.var.hue, this.var.saturation, this.var.lightness );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
                  this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                  this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
       }

       stroke( 0 );
       fill( 0 );
       this.var.txt = this.const.index;// +':'+this.var.label;//
       text( this.var.txt, this.var.center.x + offset.x, this.var.center.y + offset.y + fontSize / 3 );
    }
  }
}
