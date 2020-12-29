//
class trolley {
  constructor( index, knight, rail, mule ){
    this.const = {
      index: index
    };
    this.var = {
      current: {
        section: null
      },
      position: null,
      passed: null
    };
    this.array = {
    };
    this.flag = {
      acceleration: false,
      maintaining: false,
      braking: false,
      rest: true
    };
    this.data = {
      knight: knight,
      rail: rail,
      mule: mule,
      compressor: null
    };

    this.init();
  }

  init(){
    this.onYourMark();
  }

  onYourMark(){
    this.var.current.section = this.data.rail.array.section.length;
    this.nextSection( 0 );

    this.data.mule.onYourMark();
    this.flag.rest = false;
    this.flag.maintaining = true;
  }

  updatePosition(){
    let section = this.data.rail.array.section[this.var.current.section];

    if( this.flag.rest )
      return;

    if( this.const.index == 0 && this.data.knight.const.index == 0 )
      console.log( this.var.current.section )

    let v = this.data.mule.var.current.speed / this.data.rail.const.zoom;
    this.var.position.y -= this.data.rail.const.side * v;
    this.var.passed += this.data.mule.var.current.speed;
    if( this.var.passed > section.const.spread ){
      let inertia = ( this.var.passed - section.const.spread ) / this.data.rail.const.zoom;
      this.nextSection( inertia );
    }
  }

  nextSection( inertia ){
    this.var.current.section--;

    if( this.var.current.section < 0 ){
      this.flag.rest = true;
      return;
    }

    this.var.passed = 0;
    let section = this.data.rail.array.section[this.var.current.section];
    this.var.position = section.const.center.copy();
    this.var.position.y += this.data.rail.const.side * section.const.dimensions.y / 2;
    this.var.position.y -= inertia;
  }

  updateConsumption(){
    //this.data.mule.data.motion.consumption = this
  }

  draw( offset ){

    this.updatePosition();
    fill(COLOR_MAX);
    ellipse( this.var.position.x + offset.x, this.var.position.y + offset.y, 10, 10 );
  }
}
