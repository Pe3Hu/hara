//
class tide {
  constructor (){
    this.const = {
      size: 7,
      a: null
    };
    this.var = {
    };
    this.data = {
      pond: null
    };

    this.init();
  }

  init(){
    let y = CANVAS_GRID.y;
    this.const.a = Math.floor( CANVAS_SIZE.y / this.const.size / 2 );

    this.data.pond = new pond( this.const.size, this.const.a );
  }

  click( offsets ){
    this.data.pond.click( offsets );
  }

  key(){
    this.data.pond.key();
  }

  moved( offsets ){
  }

  draw( offsets ){
    this.data.pond.draw( offsets );
  }
}
