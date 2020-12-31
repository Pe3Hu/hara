//
class forge {
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
    };

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
    let imprint = {
      mk: 0,
      weight: weight,
      motion: motion,
      factor: factor
    };
    this.array.mule.push( imprint );
    this.var.index.mule++;
  }

  makeAnImpression( type, index ){
    /*let impression = Object.assign({}, this.array[type][index] );
    console.log( impression )*/

    let imprint = this.array[type][index];

    let weight = {
      own: imprint.weight.own,
      container: imprint.weight.container,
      cargo: imprint.weight.cargo,
      fuel: imprint.weight.fuel
    };
    let motion = {
      acceleration_time: imprint.motion.acceleration_time,
      acceleration: imprint.motion.acceleration,
      deceleration: imprint.motion.deceleration,
      speed: imprint.motion.speed,
      consumption: imprint.motion.consumption
    };
    let factor = {
      safety: imprint.factor.safety,
      efficiency: imprint.factor.efficiency,
      gravity: imprint.factor.gravity
    };

    let impression = {
      mk: imprint.mk,
      weight: weight,
      motion: motion,
      factor: factor,
    };

    this.array[type][index].mk++;

    return impression;
  }
}
