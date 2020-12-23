//
class satellite {
  constructor ( index, core, a, c, ellipse, center, angle, recognition, influence ){
    this.const = {
      index: index,
      core: core,
      a: a,
      c: c,
      n: 3,
      ellipse: {
        x: ellipse.x,
        y: ellipse.y
      },
      center: center,
      type: 2
    };
    this.var = {
      lb: createVector(),
      index: {
        modulus: 0
      },
      angle: {
        current: 0,
        start: angle
      },
      time: 0,
      interact: {
        core: null,
        well: null,
        anchor: null
      },
      segment: {
        current: null,
        next: null
      }
    };
    this.array = {
      modulus: []
    };
    this.flag = {
    }
    this.data = {
      tetrahedron: null,
      speed: {
        value: 0.0015,
        scale: 1
      },
      interaction: {
        recognition: recognition,
        influence: influence
      }
    };

    this.init();
  }

  initModuluss(){
    let trigons = this.data.tetrahedron.array.trigon;

    for( let trigon of trigons )
      for( let i = 0; i < trigon.const.n; i++ ){
        let ii = ( i + 1 ) % trigon.const.n;
        let center = createVector(
          ( ( trigon.array.vertex[i].x + trigon.array.vertex[ii].x ) / 2 + trigon.const.center.x ) / 2,
          ( ( trigon.array.vertex[i].y + trigon.array.vertex[ii].y ) / 2 + trigon.const.center.y ) / 2 );

        this.array.modulus.push( new modulus( this.var.index.modulus, center, this.const.r ) );
        this.var.index.modulus++;
      }

    let index = 0;
    this.array.modulus[index].setType( 0, 0 );
    index++;
    this.array.modulus[index].setType( 0, 1 );
    index++;
    this.array.modulus[index].setType( 0, 2 );
    index++;
    this.array.modulus[index].setType( 1, 0 );
    index++;
    this.array.modulus[index].setType( 1, 1 );
    index++;
    this.array.modulus[index].setType( 2, 0 );
    index++;
    this.array.modulus[index].setType( 2, 1 );
    index++;
    this.array.modulus[index].setType( 3, 0 );
  }

  init(){
    let parent = 1;
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.const.r = this.const.a / ( 2 * Math.tan( Math.PI / this.const.n ) );

    this.data.tetrahedron = new tetrahedron( this.const.a, parent );
    this.updatePosition();
    this.initModuluss();
  }

  update(){
    this.updatePosition();
    this.var.time++;
  }

  updatePosition(){
    let t = this.var.time * this.data.speed.value * this.data.speed.scale;
    this.var.angle.current =  ( this.var.angle.start + t ) % ( Math.PI * 2 );
    this.ellipse_func( this.var.angle.current, 1 );
  }

  ellipse_func( t, scale ){
    //
    let x = this.const.ellipse.x * Math.cos( t ) * scale;
    let y = this.const.ellipse.y * Math.sin( t ) * scale;
    this.var.lb = createVector( x, y );
  }

  detectSegment( segments ){
    for( let i = 0; i < segments.length; i++ ){
      if( segments[i].array.angle[0] < this.var.angle.current && segments[i].array.angle[1] >= this.var.angle.current ){
        this.var.segment.current = i;
        break;
      }
      //processing the transition to a new round
      /*if( Math.PI && i == segments.length - 1 )
        if( ( segments[i].array.angle[0] < this.var.angle.current && Math.PI * 2 >= this.var.angle.current ) || segments[i].array.angle[1] >= this.var.angle.current )
          index = i;*/

    }
  }

  detectModulus( offsets ){
    let min = {
      d: INFINITY,
      index: null
    };
    let offset = offsets[0];
    let mouse = createVector( mouseX, mouseY );
    mouse.sub( offset );
    mouse.add( this.const.center );

    //console.log( '___', mouse.x ,mouse.y )

    for( let modulus of this.array.modulus )
      if( !modulus.flag.free ){
        let d = modulus.const.center.dist( mouse );
        //console.log( this.const.index,   modulus.const.index, d, modulus.const.center.x ,modulus.const.center.y )

        if( d < this.const.R && d < min.d )
          min = {
            d: d,
            index: modulus.const.index
          }
      }

    if( min.index != null )
      console.log( min.index )
  }

  setInteract( type, index, anchor ){
    //0 - well
    //1 - core
    switch ( type ) {

      case -1:
        this.var.interact.well = null;
        this.var.interact.core = null;
        this.var.interact.anchor = null;
        break;
      case 0:
        this.var.interact.well = index;
        this.var.interact.anchor = anchor;
        break;
      case 1:
        this.var.interact.core = index;
        this.var.interact.anchor = anchor;
        break;
    }
  }

  draw( offsets, time ){
    if( time )
      this.update();

    noStroke();
    let offset = this.const.center.copy();
    offset.add( offsets[0] );
    this.data.tetrahedron.draw( offset );

    for( let modulus of this.array.modulus )
      modulus.draw( offset );

    offset = offsets[0].copy();
    offset.add( this.var.lb );
    ellipse( offset.x, offset.y, 10, 10 );
  }
}
