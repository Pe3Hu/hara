//
class tetrahedron {
  constructor ( a, parent ){
    this.const = {
      a: a,
      r: null,
      R: null,
      n: 3,
      faces: 6,
      edges: 4,
      parent: parent
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
    let moves = [];
    switch ( this.const.parent ) {
      case 0:
        moves = [ 1, 0 ]
        break;
      case 1:
        moves = [ 2, 1 ]
        break;
    }
    let parity = 1;
    let index = 0;
    let offset = createVector( -this.const.r, 0 );
    let hue = ( this.const.parent + index * 2 ) * COLOR_MAX / this.const.edges / 2;
    this.array.trigon.push( new trigon( index, offset, parity, this.const.R, hue ) );
    index++;

    let center = this.array.neighbor[parity][moves[0]].copy();
    parity = ( parity + 1 ) % 2;
    center.add( offset );
    hue = ( this.const.parent + index * 2 ) * COLOR_MAX / this.const.edges / 2;
    this.array.trigon.push( new trigon( index, center, parity, this.const.R, hue ) );
    index++;

    offset.add( this.array.neighbor[( parity + 1 ) % 2][0] );
    hue = ( this.const.parent + index * 2 ) * COLOR_MAX / this.const.edges / 2;
    this.array.trigon.push( new trigon( index, offset, parity, this.const.R, hue ) );
    index++;

    parity = ( parity + 1 ) % 2;
    center = this.array.neighbor[( parity + 1 ) % 2][moves[1]].copy();
    center.add( offset );
    hue = ( this.const.parent + index * 2 ) * COLOR_MAX / this.const.edges / 2;
    this.array.trigon.push( new trigon( index, center, parity, this.const.R, hue ) );
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
    for( let i = 0; i < this.array.trigon.length; i++ )
      for( let j = 0; j < this.const.n; j++ ){
        let jj = ( j + 1 ) % this.const.n
        this.addRhomb( i, j, i, jj );
      }

    //0 - core
    //1 - satellite
    let type;
    switch ( this.const.parent ) {
      case 0:
        this.addRhomb( 0, 0, 2, 2 );
        this.addRhomb( 0, 1, 1, 0 );
        this.addRhomb( 0, 2, 3, 2 );
        this.addRhomb( 1, 1, 2, 1 );
        this.addRhomb( 1, 2, 3, 0 );
        this.addRhomb( 2, 0, 3, 1 );
        break;
      case 1:
        this.addRhomb( 0, 0, 2, 2 );
        this.addRhomb( 2, 1, 3, 2 );
        this.addRhomb( 1, 0, 2, 0 );
        this.addRhomb( 0, 1, 3, 1 );
        this.addRhomb( 1, 2, 3, 0 );
        this.addRhomb( 1, 1, 0, 2 );
        break;
    }

    //console.log( this.array.rhomb )
  }

  init(){
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.const.r = this.const.a / ( 2 * Math.tan( Math.PI / this.const.n ) );

    this.initNeighbors();
    this.initTrigons();
    this.connectEdges();
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
  }
}
