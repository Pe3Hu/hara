//
class rail {
  constructor ( index, center, milestones, spread, side, a ){
    this.const = {
      index: index,
      center: center,
      milestones: milestones,
      spread: spread,
      side: side,
      a: a
    };
    this.var = {
    };
    this.array = {
      section: []
    };

    this.init();
  }

  init(){

  }

  setRoute( route ){
    let sections = route.array.section;
    let x = this.const.center.x;
    let y = this.const.center.y + ( -this.const.milestones ) * this.const.side * this.const.a;

    for( let obj of route.array.section ){
      y += this.const.side * obj.y / 2;
      let center = createVector( x, y );
      let dimensions = createVector( this.const.a, obj.y );

      this.array.section.push( new section( obj.index, center.copy(), dimensions.copy(), obj.extent, obj.slope ) );

      y += this.const.side * obj.y / 2;
    }
  }

  draw( offsets ){

    for( let section of this.array.section )
      section.draw( offsets );
  }
}
