//
class knight {
  constructor ( index, side, ristaly, forge ){
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
      forge: forge,
      depot: null
    };

    this.init();
  }

  initMules(){
    this.data.depot = new depot( this.data.forge );
    this.data.depot.forgeBaseTransport( this.data.ristaly.const.rails );
  }

  initTrolleys(){
    let ristaly = this.data.ristaly;
    let index = 0;
    if( this.const.side > 0 )
      index = ristaly.const.rails;

    for( let i = 0; i < ristaly.const.rails; i++ ){
      let mules = this.data.depot.array.mule.garage.splice( 0, 1 );
      let mule = mules[0];
      let rail = ristaly.array.rail[index + i];
      this.array.trolley.push( new trolley( this.var.index.trolley, this, rail, mule ) );
      this.array.trolley[this.var.index.trolley].data.mule.var.current.speed += i * 5;
      this.var.index.trolley++;

      this.data.depot.array.mule.stand.push( mule );
    }
  }

  init(){

    this.initMules();
    this.initTrolleys();
  }

  draw( offset ){
    for( let trolley of this.array.trolley )
      trolley.draw( offset );
  }
}
