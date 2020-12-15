//
class tetrahedron {
  constructor ( a ){
    this.const = {
      a: a,
      r: null,
      R: null,
      n: 3,
      faces: 6,
      edges: 4
    };
    this.var = {
      index: {
        rhomb: 0
      },
      layer: 0
    };
    this.array = {
      trigon: [],
      neighbor: [],
      rhomb: []
    };

    this.init();
  }

  initTrigons(){
    let parity = 1;
    let index = 0;
    let offset = createVector( -this.const.r, 0 );
    this.array.trigon.push( new trigon( index, offset, parity, this.const.R ) );

    let center = this.array.neighbor[parity][1].copy();
    parity = ( parity + 1 ) % 2;
    center.add( offset );
    index++;
    this.array.trigon.push( new trigon( index, center, parity, this.const.R ) );

    offset.add( this.array.neighbor[( parity + 1 ) % 2][0] );
    index++;
    this.array.trigon.push( new trigon( index, offset, parity, this.const.R ) );

    parity = ( parity + 1 ) % 2;
    center = this.array.neighbor[( parity + 1 ) % 2][0].copy();
    center.add( offset );
    index++;
    this.array.trigon.push( new trigon( index, center, parity, this.const.R ) );
  }

  initNeighbors(){
    //
    this.array.neighbor = [];

    for( let parity = 0; parity < 2; parity++ ){
      let n = 0.5 * parity;
      let angle = ( 7/4 - n ) * Math.PI * 2 / this.const.n;
      this.array.neighbor.push( [] );

      for( let i = 0; i < this.const.n; i++ ){
        let vec = createVector(
          Math.sin( Math.PI * 2 / this.const.n * ( - i - 0.5 ) + angle ) * this.const.r * 2,
          Math.cos( Math.PI * 2 / this.const.n * ( - i - 0.5 ) + angle ) * this.const.r * 2 );

        this.array.neighbor[parity].push( vec );
      }
    }
  }

  connectEdges(){
    //
    this.addRhomb( 0, 0, 2, 2 );
    this.addRhomb( 0, 1, 1, 0 );
    this.addRhomb( 0, 2, 3, 2 );
    this.addRhomb( 1, 1, 2, 1 );
    this.addRhomb( 1, 2, 3, 0 );
    this.addRhomb( 2, 0, 3, 1 );
  }

  fillEdges(){
    let h = COLOR_MAX/ this.array.rhomb.length;
    for( let i = 0; i < this.array.rhomb.length; i++ ){
      let hue = h * i;
      this.array.trigon[this.array.rhomb[i].data.face.a].setEdgeHue( this.array.rhomb[i].data.edge.a, hue );
      this.array.trigon[this.array.rhomb[i].data.face.b].setEdgeHue( this.array.rhomb[i].data.edge.b, hue );
    }
  }

  init(){
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.const.r = this.const.a / ( 2 * Math.tan( Math.PI / this.const.n ) );

    this.initNeighbors();
    this.initTrigons();
    this.connectEdges();
    this.fillEdges();
  }

  addRhomb( face_a, edge_a, face_b, edge_b ){
    let a = {
      face: face_a,
      edge: edge_a
    };
    let b = {
      face: face_b,
      edge: edge_b
    };
    this.array.rhomb.push( new rhomb( this.var.index.rhomb, a, b ) );
    this.var.index.rhomb++;
  }

  draw( vec ){
    let offset = vec.copy();

    for( let i = 0; i < this.array.trigon.length; i++ )
      this.array.trigon[i].draw( offset, this.var.layer )

    ellipse( offset.x, offset.y, 10, 10 )
  }
}
