//
class ristaly {
  constructor ( a ){
    this.const = {
      rails: 3,
      milestones: 3,
      gap: 2,
      spread: 12000,
      zoom: null,
      a: a
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
    this.data = {
      rollercoaster: null,
      depot: null
    }

    this.init();
  }

  initRails(){
    let route = this.data.rollercoaster.array.route[0];

    for( let side = 1; side >= -1; side-=2 )
      for( let i = 0; i < this.const.rails; i++ ){
        let x = ( -this.const.rails / 2 + i + 0.5 ) * this.const.a * 5;
        let y = ( this.const.milestones + 1 ) * side * this.const.a;
        let center = createVector( x, y );

        this.array.rail.push( new rail( this.var.index.rail, center, side, this.const.milestones, this.const.spread, this.const.zoom, this.const.a ) );
        this.array.rail[this.var.index.rail].setRoute( route );
        this.var.index.rail++;
      }
  }

  initAltars(){
    let altars = this.const.rails - 1;

    for( let i = 0; i < altars; i++ ){
      let x = ( -altars / 2 + i + 0.5 ) * this.const.a * 5;
      let y = 0;
      let center = createVector( x, y );
      let index = i;

      this.array.altar.push( new altar( index, center, this.const.milestones, this.const.a ) );
    }
  }

  init(){
    this.const.zoom = this.const.spread / ( this.const.milestones * this.const.gap * this.const.a );
    this.data.rollercoaster = new rollercoaster( this.const.milestones, this.const.gap, this.const.spread, this.const.zoom, this.const.a );

    this.initAltars();
    this.initRails();
  }

  draw( offset ){

    for( let rail of this.array.rail )
      rail.draw( offset );

    for( let altar of this.array.altar )
      altar.draw( offset );
  }
}
