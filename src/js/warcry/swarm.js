//
class swarm {
  constructor (){
    this.const = {
      size: 2,
      n: 10,
      m: 3,
      a: CELL_SIZE
    };
    this.var = {
      layout: 0
    };
    this.data = {
      platform: null
    };
    this.array = {
      layout: []
    }

    this.init();
  }

  init(){
    this.array.layout.push( new hive( this.const.n, this.const.m, this.const.a ) );
  }

  click( offsets ){
    this.array.layout[this.var.layout].click( offsets );
  }

  key(){
    this.array.layout[this.var.layout].key();
  }

  moved( offsets ){
  }

  draw( offsets ){
    this.array.layout[this.var.layout].draw( offsets );
  }
}
