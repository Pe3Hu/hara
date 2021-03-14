//
class comb {
  constructor( index, row, col, center, a ){
    this.const = {
      index: index,
      row: row,
      col: col,
      center: center,
      a: a
    };
    this.var = {
      status: 0
    }
    this.flag = {
      ripe: false,
      anchor: false
    };
    this.array = {
      arrow: []
    };
    this.data = {
      honey: null
    };

    this.init();
  }

  init_arrows(){
    let n = 4;
    let angle = Math.atan( 1 / 4 );
    let a = this.const.a / 8;
    let c = this.const.a * 5 / 12;
    let b = ( c - a ) / Math.cos( angle );

    for( let i = 1; i < n + 1; i++ ){
      let point_a = createVector(
        Math.sin( Math.PI * 2 / n * ( - i + n / 2 ) - angle ) * b,
        Math.cos( Math.PI * 2 / n * ( - i + n / 2 ) - angle ) * b ) ;
      let point_b = createVector(
        Math.sin( Math.PI * 2 / n * ( - i + n / 2 ) ) * c,
        Math.cos( Math.PI * 2 / n * ( - i + n / 2 ) ) * c );
      let point_c = createVector(
        Math.sin( Math.PI * 2 / n * ( - i + n / 2 ) + angle ) * b,
        Math.cos( Math.PI * 2 / n * ( - i + n / 2 ) + angle ) * b ) ;

      this.array.arrow.push( [ point_a, point_b, point_c ] );
    }
  }

  init(){
    this.init_arrows();
  }

  set_honey( honey ){
    this.data.honey = honey;
  }

  set_status( status ){
    this.var.status = status;

    switch ( status ) {
      case 0:
        this.flag.ripe = false;
        this.flag.anchor = false;
        break;
      case 1:
        this.flag.ripe = true;
        this.flag.anchor = false;
        break;
      case 2:
        this.flag.ripe = false;
        this.flag.anchor = true;
        break;
    }
  }

  is_movable(){
    return !this.flag.anchor && !this.flag.buoy
  }

  draw_arrow( offset, direction ){
    let points = this.array.arrow[direction];

    noStroke( );
    fill( 0 );
    triangle( offset.x + points[0].x, offset.y + points[0].y,
              offset.x + points[1].x, offset.y + points[1].y,
              offset.x + points[2].x, offset.y + points[2].y );
  }

  draw( offset ){
    let vec = offset.copy();
    vec.add( this.const.center );
    let weight = 1;

    stroke( 0 );
    strokeWeight( weight );
    noFill();
    rect( vec.x - this.const.a / 2 - weight / 2,  vec.y - this.const.a / 2 - weight / 2, this.const.a, this.const.a );
    //ellipse( vec.x,  vec.y, this.const.a / 2, this.const.a / 2 );

    switch ( this.var.status ) {
      case 1:
        this.draw_arrow( vec, 1 );
        this.draw_arrow( vec, 3 );
        break;
      case 2:
        if( this.const.col == 0 )
          this.draw_arrow( vec, 2 );
        else
          this.draw_arrow( vec, 0 );
        break;
    }

    if( this.data.honey != null )
      this.data.honey.draw( vec );

    noStroke();
    fill( 0 );
    /*if( this.const.index == 4 )
    console.log( vec )*/
    text( this.const.index, vec.x, vec.y + FONT_SIZE / 3 );
  }
}
