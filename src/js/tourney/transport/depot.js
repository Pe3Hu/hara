//
class depot {
  constructor (  ){
    this.const = {
    };
    this.var = {
      index: {
        mule: 0,
        compressor: 0
      }
    };
    this.array = {
      mule: [],
      compressor: []
    };

    this.init();
  }

  initMules(){
    //meters per second to kilometers per hour
    let k = 60 * 60 / 1000;
    let weight = {
      own: null,
      container: null,
      cargo: null,
      fuel: null
    };
    let motion = {
      acceleration_time: null,
      acceleration: null,
      deceleration: null,
      speed: null,
      consumption: null
    };
    let factor = {
      safety: null,
      efficiency: null,
      gravity: 9.8
    }

    //weight in tons
    weight.own = 140;
    weight.container = 20;
    weight.cargo = 70;
    weight.fuel = 10;

    //speed in meters per second
    motion.acceleration_time = 60;
    motion.speed = 120 / k;
    motion.acceleration = motion.speed / motion.acceleration_time;
    motion.deceleration = 300;

    factor.safety = 1.3;
    factor.efficiency = 0.7;

    this.addMule( weight, motion, factor );
  }

  init(){
    this.initMules();

  }

  addMule( weight, motion, factor ){
    this.array.mule.push( new mule( this.var.index.mule, weight, motion, factor ) );
    this.var.index.mule++;
  }
}
