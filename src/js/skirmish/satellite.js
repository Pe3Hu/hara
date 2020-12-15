//
class satellite {
  constructor ( index, a, c ){
    this.const = {
      index: index,
      a: a,
      c: c
    };
    this.var = {
      lb: createVector(),
      t: Math.PI / 4
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
    if( this.const.index == 1 )
      this.var.t = Math.PI;
  }

  update(){
    this.updatePosition();
    this.var.t += this.data.speed.value * this.data.speed.scale;

    /*if( this.var.t > 1 )*/
    //  this.flag.move = false;

    let segment = 0;
  }

  updatePosition(){
    this.LemniscataBernoulli( this.var.t );
  }

  LemniscataBernoulli( t, scale ){
    let x = this.const.c * Math.sqrt( 2 ) * Math.cos( t ) / ( 1 + Math.pow( Math.sin( t ) ), 2 );
    let y = x * Math.sin( t );
    this.var.lb = createVector( x, y );
  }

  detectSegment( segments ){
    let angle = {
      current: this.var.t % ( Math.PI * 2 ),
      next: ( this.var.t + this.data.speed.value * this.data.speed.scale ) % ( Math.PI * 2 ),
    };
    let index = {
      current: -1,
      next: -1
    };

    for( let i = 0; i < segments.length; i++ ){
      if( segments[i].array.angle[0] < angle.current && segments[i].array.angle[1] >= angle.current )
        index.current = i;
      if( segments[i].array.angle[0] < angle.next && segments[i].array.angle[1]  >= angle.next )
        index.next = i;
    }
    //console.log( index.current )
  }

  draw( vec ){
    if( this.flag.move )
      this.update();
    let offset = vec.copy();
    fill( COLOR_MAX )
    ellipse( vec.x, vec.y, 10, 10 )
    offset.add( this.var.lb )
    ellipse( offset.x, offset.y, 10, 10 )
  }
}
