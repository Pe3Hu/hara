//
class rail {
  constructor ( index, center, side, milestones, spread, zoom, a ){
    this.const = {
      index: index,
      center: center,
      milestones: milestones,
      spread: spread,
      side: side,
      zoom: zoom,
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
    //console.log( obj )
      y += this.const.side * obj.y / 2;
      let center = createVector( x, y );
      let dimensions = createVector( this.const.a, obj.y );

      this.array.section.push( new section( obj.index, center.copy(), dimensions.copy(), this.const.side, obj.extent, obj.spread, obj.slope ) );

      y += this.const.side * obj.y / 2;
    }
  }

  draw( offset ){

    for( let section of this.array.section )
      section.draw( offset );
  }
}
