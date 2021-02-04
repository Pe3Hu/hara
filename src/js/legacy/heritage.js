//
class heritage {
  constructor (){
    this.const = {
      size: 2,
      a: CELL_SIZE
    };
    this.var = {
    };
    this.data = {
      platform: null
    };

    this.init();
  }

  init(){
    this.data.platform = new platform( this.const.size, this.const.a );
  }

  click( offsets ){
    this.data.platform.click( offsets );
  }

  key(){
    this.data.platform.key();
  }

  moved( offsets ){
  }

  draw( offsets ){
    this.data.platform.draw( offsets );
  }
}
