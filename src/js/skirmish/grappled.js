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
      }
    };
    this.array = {
      core: [],
      satellite: [],
      segment: [],
      well: [],
      connection: []
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

  initConnections(){
    //
    let parent, child, begin, end;

    for( let s = 0; s < this.array.satellite.length; s++ ){
      let satellite = this.array.satellite[s];

      for( let c = 0; c < this.array.core.length; c++ ){
        let core = this.array.core[c];

        this.addConnection( satellite, core );
      }

      for( let w = 0; w < this.array.well.length; w++ ){
        let well = this.array.well[w];

        this.addConnection( satellite, well );
      }
    }
  }

  init(){
    //
    this.initSegments();
    this.initCreatures();
    this.initWells();
    this.initConnections();

    console.log( this.array.connection )
  }

  setOffsets( offsets ){
    this.table.offsets = offsets;
  }

  addCreatures(){
    let recognition = 5;
    let influence = 4;
    let angle = Math.PI +  ( this.var.index.core * this.const.cores ) * ( Math.PI / this.const.cores );
    let anchors = [ this.const.l * ( this.var.index.core + 0.5 ) ];
    let scale = 0.55;
    let x = this.const.ellipse.x * Math.cos( angle ) * scale;
    let y = this.const.ellipse.y * Math.sin( angle ) * scale;
    let center = createVector( x, y );

    this.array.core.push( new core( this.var.index.core, this.const.a, center, anchors,
      recognition, influence ) );

    recognition = 3;
    influence = 3;
    angle = ( 1 + this.var.index.core * this.const.cores ) * ( Math.PI / this.const.cores );
    x = this.const.ellipse.x * Math.cos( angle ) * scale;
    y = this.const.ellipse.y * Math.sin( angle ) * scale;
    center = createVector( x, y );
    this.array.satellite.push( new satellite( this.var.index.satellite, this.var.index.core,
      this.const.a, this.const.c, this.const.ellipse, center, angle, recognition, influence ) );

    this.var.index.core++;
    this.var.index.satellite++;
  }

  addConnection( parent, child ){
    this.array.connection.push( new connection( this.var.index.connection, parent, child) );
    this.var.index.connection++;
  }

  ellipse_func( t, scale ){
    //
    let x = this.const.ellipse.x * Math.cos( t ) * scale;
    let y = this.const.ellipse.y * Math.sin( t ) * scale;

    return createVector( x, y );
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
    for( let i = 0; i < this.array.connection.length; i++ )
      this.array.connection[i].flag.enable = false;

    for( let s = 0; s < this.array.satellite.length; s++ ){
      let satellite = this.array.satellite[s];
      satellite.detectSegment( this.array.segment );
      let segment = satellite.var.segment.current;

      for( let c = 0; c < this.array.core.length; c++ ){
        let core = this.array.core[c];

        for( let a = 0; a < core.array.anchor.length; a++ ){
          if( segment < core.array.anchor[a] + core.data.range.influence &&
              segment > core.array.anchor[a] - core.data.range.influence )
            core.setInteract( 0, s, a );

          if( segment < core.array.anchor[a] + satellite.data.range.influence &&
              segment > core.array.anchor[a] - satellite.data.range.influence ){
                satellite.setInteract( 1, c, a );
                this.enableConnection( satellite, core );
              }
        }
      }

      for( let w = 0; w < this.array.well.length; w++ ){
        let well = this.array.well[w];

        for( let a = 0; a < well.array.anchor.length; a++ ){
            if( segment < well.array.anchor[a] + satellite.data.range.influence &&
                segment > well.array.anchor[a] - satellite.data.range.influence ){
                  satellite.setInteract( 0, w, a );
                  this.enableConnection( satellite, well );
                }
        }
      }
    }
  }

  draw( offsets ){
    //
    for( let i = 0; i < this.array.segment.length; i++ )
      this.array.segment[i].draw( offsets );

    for( let i = 0; i < this.array.satellite.length; i++ ){
      if( this.flag.time )
        this.update();

      this.array.satellite[i].draw( offsets, this.flag.time );
    }

    for( let i = 0; i < this.array.core.length; i++ )
     this.array.core[i].draw( offsets );

   for( let i = 0; i < this.array.well.length; i++ )
      this.array.well[i].draw( offsets )

   for( let i = 0; i < this.array.connection.length; i++ )
      this.array.connection[i].draw( offsets )
  }
}
