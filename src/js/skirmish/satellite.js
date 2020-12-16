//
class satellite {
  constructor ( index, core, a, c, angle ){
    this.const = {
      index: index,
      core: core,
      a: a,
      c: c
    };
    this.var = {
      lb: createVector(),
      t: angle,
      interacts: null
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
    let a =  this.const.c * 0.8 * scale;
    let b =  this.const.c * 0.4 * scale;
    let x = a * Math.cos( t );
    let y = b * Math.sin( t );
    this.var.lb = createVector( x, y );
  }

  detectSegment( segments ){
    let angle = {
      current: ( this.var.t + Math.PI * 2 ) % ( Math.PI * 2 ),
      next: ( this.var.t + this.data.speed.value * this.data.speed.scale + Math.PI * 2 ) % ( Math.PI * 2 ),
    };
    let index = {
      current: -1,
      next: -1
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
  }

  detectTrigon( offsets ){
    let offset = offsets[3 + this.const.index];

    let mouse = createVector( mouseX, mouseY );
    mouse.sub( offset );

    let trigons = this.data.tetrahedron.array.trigon;

    for( let i = 0; i < trigons.length; i++ ){
      
    }

  }

  draw( offsets, time ){
    if( time )
      this.update();

    noStroke();
    this.data.tetrahedron.draw( offsets[3 + this.const.index] );

    let offset = offsets[0].copy();
    offset.add( this.var.lb )
    ellipse( offset.x, offset.y, 10, 10 )
  }
}
