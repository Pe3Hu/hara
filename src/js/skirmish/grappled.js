//
class grappled {
  constructor (){
    this.const = {
      a: CELL_SIZE * 3,
      c: CELL_SIZE * Math.floor( Math.floor( CANVAS_SIZE.x / CELL_SIZE ) / 4 ) * 2,
      cores: 2,
      segments: 32,
      l: null,
      ellipse: {
        x: null,
        y: null
      }
    };
    this.var = {
      index: {
        core: 0,
        satellite: 0,
        connection: 0
      },
      layer: 0
    };
    this.array = {
      core: [],
      satellite: [],
      segment: [],
      well: [],
      hue: []
    };
    this.data = {
      dodecahedron: null,
      tetrahedron: null,
    };
    this.flag = {
      time: true
    };
    this.table = {
      offsets: null
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
    let add = Math.PI * 2 / this.const.segments;
    let scale = this.const.a / this.const.segments * 20;
    this.const.n = Math.floor( Math.PI / 4 / add );
    this.const.l = this.const.segments / this.const.cores;
    this.const.ellipse.x =  this.const.c * 0.8;
    this.const.ellipse.y =  this.const.c * 0.4;

    for( let i = 0; i < this.const.segments; i++ ){
      let angle = ( Math.PI/ 4 + add * ( -0.5 + i + this.const.n ) ) % ( Math.PI * 2 );

      vertexs[0].push( this.ellipse_func( angle, 0.9 ) );
      vertexs[1].push( this.ellipse_func( angle, 1.1 ) );
      angles.push( angle )
    }

    for( let i = 0; i < vertexs[0].length; i++ ){
      let ii =  ( i + 1 ) % vertexs[0].length;
      let array_v = [ vertexs[0][i], vertexs[0][ii], vertexs[1][i], vertexs[1][ii] ];
      let array_a = [ angles[i], angles[ii] ];
      let h = i * COLOR_MAX / vertexs[0].length;

      this.array.segment.push( new segment( i, h, array_v, array_a, this.const.n, this.const.segments ) );
    }

  }

  initWells(){
    //
    let anchors = [];
    let center = createVector();
    let n = 2;

    for( let i = 0; i < n; i++ )
      anchors.push( this.const.l * i );

    this.array.well.push( new well( this.var.index.well, center, anchors ) );
    this.var.index.well++;
  }

  initHues(){
    this.array.hue = [
      60,
      120,
      210,
      225,
      0,
      15
    ]
  }

  init(){
    //
    this.initHues();
    this.initSegments();
    this.initCreatures();
    this.initWells();
    this.determineSegmentsStatus();

    console.log( this.array.connection )
  }

  setOffsets( offsets ){
    this.table.offsets = offsets;
  }

  addCreatures(){
    let index = this.var.index.core * this.const.cores + 2;
    let recognition = {
      range: 1,
      hue: this.array.hue[index]
    };
    let influence = {
      range: 3,
      hue: this.array.hue[index + 1]
    };
    let angle = Math.PI +  ( this.var.index.core * this.const.cores ) * ( Math.PI / this.const.cores );
    let anchors = [ this.const.l * ( this.var.index.core + 0.5 ) ];
    let scale = 0.55;
    let x = this.const.ellipse.x * Math.cos( angle ) * scale;
    let y = this.const.ellipse.y * Math.sin( angle ) * scale;
    let center = createVector( x, y );

    this.array.core.push( new core( this.var.index.core, this.const.a, center, anchors,
      recognition, influence ) );

    recognition = {
      range: 3,
      hue: this.array.hue[0]
    };
    influence = {
      range: 2,
      hue: this.array.hue[1]
    };
    angle = ( 1 + this.var.index.core * this.const.cores ) * ( Math.PI / this.const.cores );
    x = this.const.ellipse.x * Math.cos( angle ) * scale;
    y = this.const.ellipse.y * Math.sin( angle ) * scale;
    center = createVector( x, y );

    this.array.satellite.push( new satellite( this.var.index.satellite, this.var.index.core,
      this.const.a, this.const.c, this.const.ellipse, center, angle, recognition, influence ) );

    this.var.index.core++;
    this.var.index.satellite++;
  }

  addConnection( parent, child, what ){
    this.array.connection.push( new connection( this.var.index.connection, parent, child, what ) );
    this.var.index.connection++;
  }

  ellipse_func( t, scale ){
    //
    let x = this.const.ellipse.x * Math.cos( t ) * scale;
    let y = this.const.ellipse.y * Math.sin( t ) * scale;

    return createVector( x, y );
  }

  determineSegmentsStatus(){
    //
    for( let segment of this.array.segment ){
      for( let core of this.array.core )
        for( let anchor of core.array.anchor ){
          for( let satellite of this.array.satellite )
            for( let what in core.data.interaction ){

              if( segment.const.index < anchor + core.data.interaction[what].range &&
                  segment.const.index > anchor - core.data.interaction[what].range )
                    segment.addStatus( core, what );


              for( let satellite of this.array.satellite )
                if( segment.const.index < anchor + satellite.data.interaction[what].range &&
                    segment.const.index > anchor - satellite.data.interaction[what].range )
                      segment.addStatus( satellite, what );

          }
        }

      for( let well of this.array.well )
        for( let anchor of well.array.anchor )
          for( let satellite of this.array.satellite )
            for( let what in satellite.data.interaction ){
              let max = segment.const.index + satellite.data.interaction[what].range;
              let min = segment.const.index - satellite.data.interaction[what].range;

              if( max > this.array.segment.length ){
                max -= this.array.segment.length;
                min -= this.array.segment.length;
              }

              if( anchor < max && anchor > min )
                segment.addStatus( satellite, what );
          }
    }

    //this.flag.time = false;
  }

  enableConnection( parent, child ){
    for( let i = 0; i < this.array.connection.length; i++ ){
      let connection = this.array.connection[i];
      let c = ( child.const.index == connection.const.child.const.index &&
                child.const.type == connection.const.child. const.type );
      let p = ( parent.const.index == connection.const.parent.const.index &&
                parent.const.type == connection.const.parent.const.type );

      if( c && p )
        connection.flag.enable = true;
    }
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
    if( this.flag.time )
      this.updateConnections();
  }

  updateConnections(){

    for( let satellite of this.array.satellite ){
      satellite.detectSegment( this.array.segment );
      let segment = this.array.segment[satellite.var.segment.current];

      /*for( let connection of this.array.connection )
        if( satellite.const.index == connection.const.parent.const.index )
          for( let what in connection.data.segments ){
            console.log( connection.const.index, connection.data.segments[what]  )
              if( connection.data.interaction[what] )
                for( let index of connection.data.segments[what] )
                  if( index == segment.const.index )
                  console.log( satellite.const.index, connection.const.index, what, segment.const.index, satellite.const.index )

          }*/
        }
    this.flag.time = false;
  }

  draw( offsets ){
    //
    this.update();
    let types = [ 0 ];

    for( let i = 0; i < this.array.segment.length; i++ )
      this.array.segment[i].draw( offsets, types, this.flag.time );

    for( let i = 0; i < this.array.satellite.length; i++ )
      this.array.satellite[i].draw( offsets, this.flag.time );

    for( let i = 0; i < this.array.core.length; i++ )
     this.array.core[i].draw( offsets );

   for( let i = 0; i < this.array.well.length; i++ )
      this.array.well[i].draw( offsets )
  }
}
