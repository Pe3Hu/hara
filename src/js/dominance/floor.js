//
class floor {
  constructor ( index, center, grid, a ){
    this.const = {
      index: index,
      i: grid.x,
      j: grid.y,
      f: grid.z,
      a: a
    };
    this.var = {
      center: center.copy(),
      fontSize: 8
    };
    this.array = {
      link: [ [], [] ]
    };


    this.init();
  }

  init(){
  }

  addLink( link ){
    let j = 0;
    if( link > this.const.index  )
      j = 1;

    this.array.link[j].push( link );
  }

  draw( vec ){
    let offset = this.var.center.copy();
    offset.add( vec );

    fill( 210, COLOR_MAX , COLOR_MAX / 2 );
    rect( offset.x - this.const.a / 2, offset.y - 0.5 * this.const.a,
          this.const.a, this.const.a );

    textSize( this.var.fontSize );
    //stroke( 0 );
    fill( 0 );
    this.var.txt = this.const.index;
    text( this.var.txt, offset.x, offset.y + FONT_SIZE / 3 );
    textSize( FONT_SIZE );
  }
}
