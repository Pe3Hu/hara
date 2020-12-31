//
class mule {
  constructor ( imprint ){
    this.const = {
      mk: imprint.mk
    };
    this.var = {
      current: {
        acceleration: 0,
        speed: 0,
        weight: 0,
      }
    };
    this.array = {
    };
    this.data = {
      weight: imprint.weight,
      motion: imprint.motion,
      factor: imprint.factor,
    };

    this.init();
  }

  func1( mass, slope, sliding_friction, acceleration, speed ){
    let ponderosity = mass * this.data.factor.gravity;
    let f_friction = ponderosity * Math.cos( slope ) * sliding_friction;
    let f_acceleration = mass * acceleration;
    let f_total = ponderosity + f_friction + f_acceleration;
    let power = this.data.factor.safety * f_total * speed / this.data.factor.efficiency;
  }

  init(){
  }

  onYourMark(){
    this.var.current.speed = this.data.motion.speed;
    this.var.current.weight = 0;

    for( let weight in this.data.weight )
      this.var.current.weight += this.data.weight[weight];

  }
}
