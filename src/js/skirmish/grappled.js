//
class grappled {
  constructor (){
    this.const = {
      a: CELL_SIZE * 3,
      c: CELL_SIZE * Math.floor( Math.floor( CANVAS_SIZE.x / CELL_SIZE ) / 4 ) * 2,
      cores: 2,
      l: null
    };
    this.var = {
      index: {
        core: 0,
        satellite: 0
      }
    };
    this.array = {
      core: [],
      satellite: [],
      segment: []
    };
    this.data = {
      dodecahedron: null,
      tetrahedron: null
    };
    this.flag = {
      time: true
    }

    this.init();
  }

  initCreatures(){
    //
    for( let i = 0; i < this.const.cores; i++ )
      this.addCreatures();
  }

  initSegments(){
    let vertexs = [ [], [] ];
    let angles = [];
    let segments = 30;
    let add = Math.PI * 2 / segments;
    let scale = this.const.a / segments * 20 ;
    this.const.n = Math.floor( Math.PI / 4 / add );
    this.const.l = segments / this.const.cores;

    for( let i = 0; i < segments; i++ ){
      let angle = ( Math.PI/ 4 + add * ( 0.25 + i + this.const.n ) ) % ( Math.PI * 2 );

      vertexs[0].push( this.ellipse_func( angle, 0.9 ) );
      vertexs[1].push( this.ellipse_func( angle, 1.1 ) );
      angles.push( angle )
    }

    let index = 0;

    for( let i = 0; i < vertexs[0].length; i++ ){
      let ii =  ( i + 1 ) % vertexs[0].length;
      let array_v = [ vertexs[0][i], vertexs[0][ii], vertexs[1][i], vertexs[1][ii] ];
      let array_a = [ angles[i], angles[ii] ];
      let h = i * COLOR_MAX / vertexs[0].length;

      this.array.segment.push( new segment( i, h, array_v, array_a, this.const.n, segments ) );
    }

  }

  init(){
    this.initCreatures();
    this.initSegments();
  }

  addCreatures(){
    let recognition = 5;
    let influence = 3;
    let anchor = this.const.l * this.var.index.core;
    let angle =  Math.PI / 2 + this.var.index.core * 2 * ( Math.PI / this.const.cores );
    this.array.core.push( new core( this.var.index.core, this.const.a, anchor,
      recognition, influence ) );
    this.array.satellite.push( new satellite( this.var.index.satellite, this.var.index.core,
      this.const.a, this.const.c, angle ) );
    this.var.index.core++;
    this.var.index.satellite++;
  }

  ellipse_func( t, scale ){
    let a =  this.const.c * 0.8 * scale;
    let b =  this.const.c * 0.4 * scale;
    let x = a * Math.cos( t );
    let y = b * Math.sin( t );

    return createVector( x, y );
  }

  click( offsets ){
    //
      this.array.satellite[0].flag.move = true;
  }

  key(){
    switch ( keyCode ) {
      case 32:
        this.flag.time = !this.flag.time;
        break;
    }
  }

  moved( offsets ){
    //let offset = offsets[1];

    for( let i = 0; i < this.array.satellite.length; i++ )
      this.array.satellite[i].detectTrigon( offsets );
  }

  update(){
    for( let i = 0; i < this.array.satellite.length; i++ )
      this.array.satellite[i].detectSegment( this.array.segment );
  }

  draw( offsets ){
    //
    for( let i = 0; i < this.array.segment.length; i++ )
      this.array.segment[i].draw( offsets[0] );

    for( let i = 0; i < this.array.satellite.length; i++ ){
      if( this.flag.time )
        this.update();

      this.array.satellite[i].draw( offsets, this.flag.time );
    }

    for( let i = 0; i < this.array.core.length; i++ )
     this.array.core[i].draw( offsets[i + 1] );
  }
}
