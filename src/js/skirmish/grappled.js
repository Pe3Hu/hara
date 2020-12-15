//
class grappled {
  constructor (){
    this.const = {
      a: CELL_SIZE * 3,
      c: CELL_SIZE * Math.floor( Math.floor( CANVAS_SIZE.x / CELL_SIZE ) / 4 ) * 2
    };
    this.var = {
      current: {
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

    this.init();
  }

  initCreatures(){
    this.addCreatures();
    this.addCreatures();
  }

  initSegments(){
    let vertexs = [ [], [] ];
    let angles = [];
    let segments = 60;
    let add = Math.PI * 2 / segments;
    let scale = this.const.a / segments * 20 ;
    this.const.n = Math.floor( Math.PI / 4 / add );

    for( let i = 0; i < segments; i++ ){
      let angle = add * ( i + this.const.n ) % ( Math.PI * 2 );
      /*let vec1 = this.LemniscataBernoulli( angle, 1 );
      let vec2 = this.LemniscataBernoulli( angle, 1 );

      vec1.y -= scale;
      vec1.x -= scale;
      vec2.y += scale;
      vec2.x += scale;

      vertexs[0].push( vec1 )
      vertexs[1].push( vec2 )*/

      vertexs[0].push( this.LemniscataBernoulli( angle, 1 ) );
      vertexs[1].push( this.LemniscataBernoulli( angle, 1 ) );
      vertexs[0][i * 2 ].y -= scale;
      vertexs[1][i * 2 ].y += scale;

      vertexs[0].push( this.LemniscataBernoulli( angle, 1 ) );
      vertexs[1].push( this.LemniscataBernoulli( angle, 1 ) );
      vertexs[0][i * 2 + 1].x -= scale;
      vertexs[1][i * 2 + 1].x += scale;
      angles.push( angle )
    }

    let index = 0;

    for( let i = 0; i < vertexs[0].length; i++ ){
      let ii =  ( i + 2 ) % vertexs[0].length;
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
    this.array.core.push( new core( this.const.a ) );
    this.array.satellite.push( new satellite( this.var.current.satellite, this.const.a,  this.const.c ) );
    this.var.current.satellite++;
  }

  LemniscataBernoulli( t, scale ){
    let c =  this.const.c * scale;
    let x = c * Math.sqrt( 2 ) * Math.cos( t ) / ( 1 + Math.pow( Math.sin( t ) ), 2 );
    let y = x * Math.sin( t );

    return createVector( x, y );
  }

  //incorrect work
  LemniscataBouta( t, scale ){
    let c =  this.const.c * scale;
    let etta = Math.PI /16 ;
    let p = Math.sqrt( Math.tan( Math.PI / 4 - etta ) )
    let x = c * Math.sqrt( 2 ) * ( p + Math.pow( p, 3 ) ) / ( 1 + Math.pow( p, 4 ) );
    let y = c * Math.sqrt( 2 ) * ( p - Math.pow( p, 3 ) ) / ( 1 + Math.pow( p, 4 ) );

    return createVector( x, y );
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
        this.data.tetrahedron.var.layer = ( this.data.tetrahedron.var.layer + 1 ) % 2;
        break;
    }
  }

  moved( offsets ){

      this.array.satellite[0].flag.move = true;
  }

  update(){
    for( let i = 0; i < this.array.satellite.length; i++ )
      this.array.satellite[i].detectSegment( this.array.segment );
  }

  draw( offsets ){

    for( let i = 0; i < this.array.segment.length; i++ )
      this.array.segment[i].draw( offsets[0] );

    for( let i = 0; i < this.array.satellite.length; i++ ){

      if( this.array.satellite[i].flag.move )
        this.update();
      this.array.satellite[i].draw( offsets[0] );
    }

    for( let i = 0; i < this.array.core.length; i++ )
     this.array.core[i].draw( offsets[i + 1] );
  }
}
