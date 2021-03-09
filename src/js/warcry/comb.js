//
class comb {
  constructor( index, center, a ){
    this.const = {
      index: index,
      center: center,
      a: a
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      honey: null
    };

    this.init();
  }

  init(){
  }

  set_honey( honey ){
    this.data.honey = honey;
  }

  draw( offset ){
    let vec = offset.copy();
    vec.add( this.const.center );

    stroke( 0 );
    strokeWeight( 1 );
    noFill();
    rect( vec.x - this.const.a / 2,  vec.y - this.const.a / 2, this.const.a, this.const.a  );

    if( this.data.honey != null )
      this.data.honey.draw( vec );
  }
}
