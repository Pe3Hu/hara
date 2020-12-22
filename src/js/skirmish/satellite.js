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

  init(){
    let parent = 1;
    this.data.tetrahedron = new tetrahedron( this.const.a, parent );
      this.updatePosition();
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

  draw( offsets, time ){
    if( time )
      this.update();

    noStroke();
    let offset = this.const.center.copy();
    offset.add( offsets[0] );
    this.data.tetrahedron.draw( offset );

    offset = offsets[0].copy();
    offset.add( this.var.lb );
    ellipse( offset.x, offset.y, 10, 10 );
  }
}
