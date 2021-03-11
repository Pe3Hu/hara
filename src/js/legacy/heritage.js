//
class heritage {
  constructor (){
    this.const = {
      size: 2,
      n: 10,
      m: 10,
      a: CELL_SIZE
    };
    this.var = {
      layout: 1
    };
    this.data = {
      platform: null
    };
    this.array = {
      layout: []
    }

    //this.init();
  }

  init(){
    this.array.layout.push( new platform( this.const.size, this.const.a ) );
    this.array.layout.push( new weather( this.const.n, this.const.m, this.const.a * 2 ) );
  }

  click( offsets ){
    //this.array.layout[this.var.layout].click( offsets );
  }

  key(){
    this.array.layout[this.var.layout].key();
  }

  moved( offsets ){
  }

  draw( offsets ){
    //this.array.layout[this.var.layout].draw( offsets );
  }
}
