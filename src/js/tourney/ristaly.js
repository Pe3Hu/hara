//
class ristaly {
  constructor ( a ){
    this.const = {
      a: a,
      rails: 3,
      milestones: 3,
      spread: 1200
    };
    this.var = {
      index: {
        rail: 0
      }
    };
    this.array = {
      rail: [],
      altar: []
    };

    this.init();
  }

  initRails(){
    for( let side = 1; side >= -1; side-=2 )
      for( let i = 0; i < this.const.rails; i++ ){
        let x = ( -this.const.rails / 2 + i + 0.5 ) * this.const.a * 1.5;
        let y = ( this.const.milestones + 1 ) * side * this.const.a;
        let center = createVector( x, y );

        this.array.rail.push( new rail( this.var.index.rail, center, this.const.milestones, this.const.spread, side, this.const.a ) );
        this.var.index.rail++;
      }
  }

  initAltars(){
    let altars = this.const.rails - 1;

    for( let i = 0; i < altars; i++ ){
      let x = ( -altars / 2 + i + 0.5 ) * this.const.a * 1.5;
      let y = 0;
      let center = createVector( x, y );
      let index = i;

      this.array.altar.push( new altar( index, center, this.const.a ) );
    }
  }

  init(){
    this.initRails();
    this.initAltars();
  }

  draw( offsets ){

    for( let rail of this.array.rail )
      rail.draw( offsets );


    for( let altar of this.array.altar )
      altar.draw( offsets );
  }
}
