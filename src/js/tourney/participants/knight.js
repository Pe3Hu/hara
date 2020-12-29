//
class knight {
  constructor ( index, side, ristaly, depot ){
    this.const = {
      index: index,
      side: side
    };
    this.var = {
      index: {
        trolley: 0
      }
    };
    this.array = {
      trolley: []
    };
    this.data = {
      ristaly: ristaly,
      depot: depot
    }

    this.init();
  }

  initTrolleys(){
    let mule = this.data.depot.array.mule[0];
    let ristaly = this.data.ristaly;
    let index = 0;
    if( this.const.side > 0 )
      index = ristaly.const.rails;

    for( let i = 0; i < ristaly.const.rails; i++ ){
      let rail = ristaly.array.rail[index + i];
      this.array.trolley.push( new trolley( this.var.index.trolley, this, rail, mule ) );
      this.var.index.trolley++;
    }
  }

  init(){

    this.initTrolleys();
  }

  draw( offset ){
    for( let trolley of this.array.trolley )
      trolley.draw( offset );
  }
}
