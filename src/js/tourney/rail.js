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
    this.initMilestone();
  }

  initMilestone(){
    for( let j = 0; j < this.const.milestones * 2; j++ ){
      let x = this.const.center.x;
      let y = this.const.center.y + ( -this.const.milestones + j + 0.5 ) * this.const.side * this.const.a;
      let center = createVector( x, y );
      let index = j;

      this.array.section.push( new section( index, center, this.const.a ) );
    }
  }

  draw( offsets ){

    for( let section of this.array.section )
      section.draw( offsets );
  }
}
