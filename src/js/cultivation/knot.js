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

  updateType(){
    let type = 0;
    type += this.var.ink * 4;
    type += this.var.stencil * 2;
    type += this.var.gutter;
    this.var.type = type;



    switch ( type ) {
      case 0:
        this.var.color.h = 0;
        this.var.color.s = 0;
        this.var.color.l = colorMax * 0.75;
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        this.var.color.h = 30 * ( type + 1 );
        this.var.color.s = colorMax;
        this.var.color.l = colorMax * 0.5;
        break;
    }
  }

  setStatus( status, sleeve ){
    this.var.status.id = status;

    switch ( status ) {
      //display as
      case 0:
        this.var.status.name = 'far';
        this.var.ink = false;
        this.var.stencil = false;
        this.var.gutter = false;
        this.var.sleeve = 0;
        break;
      //display as an
      case 1:
        this.var.status.name = 'unfilled gutter';
        this.var.ink = false;
        this.var.stencil = false;
        this.var.gutter = true;
        if( sleeve != undefined  )
          this.var.sleeve = sleeve;
        break;
    }

    this.updateType();
  }

  setInk( ink ){
    this.var.ink = ink;
    this.updateType();
  }

  setStencil( stencil ){
    this.var.stencil = stencil;
  }

  setGutter( gutter ){
    this.var.gutter = gutter;
  }

  setLigature( ligature ){
    this.var.ligature = ligature;
  }

  switchOptionLigature(){
    this.var.ligature = 1 + ( this.var.ligature ) % 2;
  }

  switchStencil(){
    this.var.stencil = ( this.var.stencil + 1 ) % 2;

    this.updateType();
  }

  setAsParent( child, way ){
    if( child == undefined ){
      this.var.child = null;
      this.var.parent = null;
    }
    else{
      child.var.parent = ( this.const.n / 2 + way ) % this.const.n;
      this.var.child = way;
    }
}

  draw( offset, flag ){
    if( this.var.visiable ){
      //stroke( this.var.color.h, this.var.color.s, this.var.color.l );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        strokeWeight( this.const.a / 24 );
        stroke( this.var.color.h, this.var.color.s, this.var.color.l );
        fill( this.var.color.h, this.var.color.s, this.var.color.l );

        if( this.var.sleeve != -1 ){
          let hue;
          switch ( this.var.sleeve ) {
            case 0:
            case 3:
              hue = this.array.hue[ this.var.sleeve];
              break;
            case 1:
              hue = this.array.hue[5];
              break;
            case 2:
              hue = this.array.hue[4];
              break;
            case 4:
              hue = this.array.hue[3];
              break;
          }

          if( this.var.child == i ){
            stroke( hue, this.var.color.s, this.var.color.l * 0.5 );
            fill( hue, this.var.color.s, this.var.color.l * 0.5 );
          }
          if( this.var.parent == i ){
            stroke( hue, this.var.color.s, this.var.color.l );
            fill( hue, this.var.color.s, this.var.color.l );
          }
        }

        triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
                  this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                  this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
       }

       stroke( 0 );
       strokeWeight( this.const.a / 12 );
       for( let i = 0; i < this.array.vertex.length; i++ ){
         let ii = ( i + 1 ) % this.array.vertex.length;

         if( this.var.child != i && this.var.parent != i  )
           line( this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                 this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
       }

       noFill();
       let size = this.const.a;
       if( this.var.ligature == 2 )
        size *= 1.25;

       if( this.var.ligature > 0 )
        ellipse( this.var.center.x + offset.x, this.var.center.y + offset.y, size, size )

       strokeWeight( 1 );
       fill( 0 );
       this.var.txt = this.const.index;// +':'+this.var.label;//
       if( flag )
        text( this.var.txt, this.var.center.x + offset.x, this.var.center.y + offset.y + fontSize / 3 );
    }
  }
}
