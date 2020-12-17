//
class satellite {
  constructor ( index, core, a, c, ellipse, center, angle, recognition, influence ){
    this.const = {
      index: index,
      core: core,
      a: a,
      c: c,
      ellipse: {
        x: ellipse.x,
        y: ellipse.y
      },
      center: center,
      type: 2
    };
    this.var = {
      lb: createVector(),
      t: angle,
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
    };
    this.flag = {
      move: true
    }
    this.data = {
      tetrahedron: null,
      speed: {
        value: 0.005,
        scale: 1
      },
      range: {
        recognition: recognition,
        influence: influence
      }
    };

    this.init();
  }

  init(){
    let parent = 1;
    this.data.tetrahedron = new tetrahedron( this.const.a, parent );
      this.updatePosition();
  }

  update(){
    this.updatePosition();
    this.var.t += this.data.speed.value * this.data.speed.scale;
  }

  updatePosition(){
    this.ellipse_func( this.var.t, 1 );
  }

  ellipse_func( t, scale ){
    //
    let x = this.const.ellipse.x * Math.cos( t ) * scale;
    let y = this.const.ellipse.y * Math.sin( t ) * scale;
    this.var.lb = createVector( x, y );
  }

  detectSegment( segments ){
    let angle = {
      current: ( this.var.t + Math.PI * 2 ) % ( Math.PI * 2 ),
      next: ( this.var.t + this.data.speed.value * this.data.speed.scale + Math.PI * 2 ) % ( Math.PI * 2 ),
    };
    let index = {
      current: null,
      next: null
    };

    for( let i = 0; i < segments.length; i++ ){
      if( segments[i].array.angle[0] < angle.current && segments[i].array.angle[1] >= angle.current )
        index.current = i;
      if( segments[i].array.angle[0] < angle.next && segments[i].array.angle[1] >= angle.next )
        index.next = i;

      //processing the transition to a new round
      if( segments[i].array.angle[0] > Math.PI && segments[i].array.angle[1] < Math.PI ){
        if( ( segments[i].array.angle[0] < angle.current && Math.PI * 2 >= angle.current ) || segments[i].array.angle[1] >= angle.current )
          index.current = i;
        if( ( segments[i].array.angle[0] < angle.next && Math.PI * 2 >= angle.next ) || segments[i].array.angle[1] >= angle.next )
          index.next = i;
      }
    }

    this.var.segment.current = index.current;
  }

  detectTrigon( offsets ){
    let offset = offsets[3 + this.const.index];

    let mouse = createVector( mouseX, mouseY );
    mouse.sub( offset );

    let trigons = this.data.tetrahedron.array.trigon;

    for( let i = 0; i < trigons.length; i++ ){

    }

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

  draw( offsets, time  ){
    if( time )
      this.update();

    noStroke();
    let offset = this.const.center.copy();
    offset.add( offsets[0] );
    this.data.tetrahedron.draw( offset );
    /*
    fill( 'white' )
    ellipse( offset.x, offset.y, 10, 10 )

    fill( 'black' )
    text( this.const.index,offset.x, offset.y + FONT_SIZE / 3 );
    fill( 'white' )*/

    offset = offsets[0].copy();
    offset.add( this.var.lb );
    ellipse( offset.x, offset.y, 10, 10 )
    /*fill( 'black' )
    text( this.const.index, offset.x, offset.y + FONT_SIZE / 3 );*/
  }
}
