//
class joust {
  constructor (  ){
    this.const = {
      a: CELL_SIZE
    };
    this.var = {
      index: {
        knight: 0
      }
    };
    this.array = {
      knight: []
    };
    this.data = {
      ristaly: null,
      depot: null
    }

    this.init();
  }

  initKnights(){
    for( let side = 1; side >= -1; side-=2 ){
      this.array.knight.push( new knight( this.var.index.knight, side, this.data.ristaly, this.data.depot ) );
      this.var.index.knight++;
    }
  }

  init(){
    this.data.ristaly = new ristaly( this.const.a );
    this.data.depot = new depot();

    this.initKnights();
  }

  click( offsets ){
    //
  }

  key(){
    switch ( keyCode ) {
      case 32:

        break;
    }
  }

  moved( offsets ){
  }

  update(){
  }

  draw( offsets ){
    this.update();
    let offset = offsets[0];

    this.data.ristaly.draw( offset );

    for( let knight of this.array.knight )
      knight.draw( offset );
  }
}
