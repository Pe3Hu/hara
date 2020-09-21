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
      center: center.copy(),
      status: {},
      color: {},
      type: null,
      visiable: false,
      label: null,
      parent: null,
      child: null,
      sleeve: 0
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

  initHues(){
    this.array.hue = [
      52,
      122,
      192,
      262,
      297,
      332
    ];
  }

  init(){
    this.const.r =  this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );
    this.initVertexs();
    this.initLabel();
    this.initHues();
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

  setStatus( status, sleeve ){
    this.var.status.id = status;

    switch ( status ) {
      //display as a knot that cannot be reached
      case 0:
        this.var.status.name = 'far';
        this.var.free = true;
        this.var.color.hue = 0;
        this.var.color.saturation = 0;
        this.var.color.lightness = colorMax * 0.75;
        this.var.sleeve = 0;
        break;
      //display as a considered option
      case 1:
        this.var.status.name = 'option';
        this.var.free = true;
        this.var.color.hue = 120;
        this.var.color.saturation = colorMax * 1;
        this.var.color.lightness = colorMax * 0.5;
        this.var.sleeve = 0;
        break;
      //display as an involved knot
      case 2:
        this.var.status.name = 'involved';
        this.var.free = false;
        this.var.covered = false;
        this.var.color.hue = 60;
        this.var.color.saturation = colorMax * 1;
        this.var.color.lightness = colorMax * 0.5;
        if( sleeve != undefined  )
          this.var.sleeve = sleeve;
        break;
      //display as an a pivot point knot
      case 3:
        this.var.status.name = 'pivot point';
        this.var.covered = true;
        this.var.color.hue = 90;
        this.var.color.saturation = colorMax * 1;
        this.var.color.lightness = colorMax * 0.5;
        break;
      //display as an attached knot
      case 4:
        this.var.status.name = 'attached';
        this.var.covered = true;
        this.var.color.hue = 150;
        this.var.color.saturation = colorMax * 1;
        this.var.color.lightness = colorMax * 0.5;
        break;
      //display as an fixed knot
      case 5:
        this.var.status.name = 'fixed';
        this.var.covered = true;
        this.var.color.hue = 180;
        this.var.color.saturation = colorMax * 1;
        this.var.color.lightness = colorMax * 0.5;
        break;
    }
  }

  setAsParent( child, way ){
    child.var.parent = ( this.const.n / 2 + way ) % this.const.n;
    this.var.child = way;
}

  draw( offset, flag ){
    if( this.var.visiable ){
      //stroke( this.var.color.hue, this.var.color.saturation, this.var.color.lightness );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        strokeWeight( this.const.a / 12 )
        stroke( this.var.color.hue, this.var.color.saturation, this.var.color.lightness );
        fill( this.var.color.hue, this.var.color.saturation, this.var.color.lightness );

        if( this.var.sleeve != -1 ){
          let hue;
          switch ( this.var.sleeve ) {
            case 0:
            case 3:
              hue = this.array.hue[ this.var.sleeve];
              break;
            case 1:
              hue = this.array.hue[2];
              break;
            case 2:
              hue = this.array.hue[4];
              break;
            case 4:
              hue = this.array.hue[3];
              break;
          }

          if( this.var.child == i ){
            stroke( hue, this.var.color.saturation, this.var.color.lightness * 0.5 );
            fill( hue, this.var.color.saturation, this.var.color.lightness * 0.5 );
          }
          if( this.var.parent == i ){
            stroke( hue, this.var.color.saturation, this.var.color.lightness );
            fill( hue, this.var.color.saturation, this.var.color.lightness );
          }
        }

        noStroke();
        triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
                  this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                  this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );


        stroke( 0 );
        if( this.var.child != i && this.var.parent != i  )
          line( this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
        noStroke();
       }

       stroke( 0 );
       strokeWeight( 1 )
       fill( 0 );
       this.var.txt = this.const.index;// +':'+this.var.label;//
       if( flag )
        text( this.var.txt, this.var.center.x + offset.x, this.var.center.y + offset.y + fontSize / 3 );
    }
  }
}
