//
class rollercoaster {
  constructor ( milestones, gap, spread, a ){
    this.const = {
      milestones: milestones,
      gap: gap,
      spread: spread,
      a: a
    };
    this.var = {
      index: {
        route: 0
      }
    };
    this.array = {
      route: []
    };

    this.init();
  }

  initRoutes(){
    let sections = [];
    let section = {
      slope: 0,
      extent: 1,
      index: null,
      y: null,
      spread: null
    };
    sections.push( section );
    /*section = {
      slope: 0,
      extent: 5,
      index: null,
      y: null,
      spread: null
    };
    sections.push( section );*/

    this.addRoute( sections );
  }

  addRoute( sections ){
    let sum = 0;
    let total = this.const.milestones * this.const.gap * this.const.a;

    for( let section of sections )
      sum += section.extent;

    console.log( sum )

    let unit = total / sum;
    let index = 0;

    for( let section of sections ){
      section.index = index;
      section.y = section.extent * unit;
      section.spread = section.extent / sum * this.const.spread;
      index++;
    }

    this.array.route.push( new route( this.var.index.route, sections ) );
    this.var.index.route++;
  }

  init(){
    this.initRoutes();
  }

  draw(){
  }
}
