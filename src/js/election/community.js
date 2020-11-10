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
      vertex: [],
      parent: [],
      child: []
    };
    this.var = {
      center: center.copy(),
      visiable: false,
      temp: {
        remoteness: null,
        path: []
      },
      scale: 1,
      fontSize: FONT_SIZE,
      remoteness: null
    };
    this.color = {
      bg: {
        h: 45,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  setRelations( remoteness, parent ){
    this.var.remoteness = remoteness;
    parent.addChild( this.const.index );
    this.addParent( parent.const.index );
  }

  addParent( parent ){
    let index = this.array.parent.indexOf( parent );

    if( index == - 1 )
      this.array.parent.push( parent );
  }

  addChild( child ){
    let index = this.array.child.indexOf( child );

    if( index == - 1 )
      this.array.child.push( child );
  }

  initVertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.a * this.var.scale,
        Math.cos( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.a * this.var.scale );
      vec.add( this.var.center );
      this.array.vertex.push( vec );
    }
  }

  init(){
    this.const.r =  this.const.a * this.var.scale / ( Math.tan( Math.PI / this.const.n ) * 2 );
    this.initVertexs();
  }

  draw( offset ){
    if( this.var.visiable ){
      noStroke();
      fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );

      for( let i = 0; i < this.array.vertex.length; i++ ){
        let ii = ( i + 1 ) % this.array.vertex.length;
        triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
                  this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                  this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
       }

       textSize( this.var.fontSize );
       //stroke( 0 );
       fill( 0 );
       this.var.txt = this.const.index;
       text( this.var.txt, this.var.center.x + offset.x, this.var.center.y + offset.y + FONT_SIZE / 3 );
       textSize( FONT_SIZE );
    }
  }
}
