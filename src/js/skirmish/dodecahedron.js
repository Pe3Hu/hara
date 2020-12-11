//
class dodecahedron {
  constructor ( a ){
    this.const = {
      a: a,
      r: null,
      R: null,
      n: 5,
      faces: 30,
      edges: 12
    };
    this.var = {
      index: {
        rhomb: 0
      }
    };
    this.array = {
      pentahedron: [],
      neighbor: [],
      rhomb: []
    };

    this.init();
  }

  initPentahedrons(){
    let parity = 1;
    let index = 0;
    let offset = createVector();
    this.array.pentahedron.push( new pentahedron( index, offset, parity, this.const.R ) );
    parity = (parity + 1 ) % 2;

    for( let i = 0; i < this.array.neighbor[parity].length; i++ ){
      let center = this.array.neighbor[parity][i].copy();
      center.add( offset );
      index++;
      this.array.pentahedron.push( new pentahedron( index, center, parity, this.const.R ) );
      console.log( this.array.pentahedron[i] )
    }

    offset.add( this.array.neighbor[parity][0] );
    offset.add( this.array.neighbor[(parity + 1 ) % 2][1] );
    offset.add( this.array.neighbor[parity][0] );
    index++;
    this.array.pentahedron.push( new pentahedron( index, offset, parity, this.const.R ) );
    parity = (parity + 1 ) % 2;

    for( let i = 0; i < this.array.neighbor[parity].length; i++ ){
      let center = this.array.neighbor[parity][i].copy();
      center.add( offset );
      index++;
      this.array.pentahedron.push( new pentahedron( index, center, parity, this.const.R ) );
      console.log( this.array.pentahedron[i] )
    }
  }

  initNeighbors(){
    let angle = ( Math.PI - Math.PI * 2 / this.const.n ) - Math.PI / 2;
    this.array.neighbor = [];

    for( let p = 0; p < 2; p++ ){
      this.array.neighbor.push( [] );

      for( let i = 0; i < this.const.n; i++ ){
        let vec = createVector(
          Math.sin( Math.PI * 2 / this.const.n * ( -1 + p - i + this.const.n / 2 - 0.5 * p ) + angle ) * this.const.r * 2,
          Math.cos( Math.PI * 2 / this.const.n * ( -1 + p - i + this.const.n / 2 - 0.5 * p ) + angle ) * this.const.r * 2 );

        this.array.neighbor[p].push( vec );
      }
    }

    console.log( this.array.neighbor )
  }

  connectEdges(){
    let face_a = 0, edge_a = 1, face_b = 3, edge_b = 3;

    while( this.var.index.rhomb < 10 ){
      this.addRhomb( face_a + 1, edge_a, face_b + 7, edge_b );
      if( this.var.index.rhomb % 2 == 1 ){
        face_a = ( face_a + 1 ) % this.const.n;
        edge_b = ( edge_b - 1 + this.const.n ) % this.const.n;
      }
      else{
        edge_a = ( edge_a + 1 ) % this.const.n;
        face_b = ( face_b - 1 + this.const.n ) % this.const.n;
      }
    }

    face_a = 0, edge_a = 0, face_b = 0, edge_b = 3;

    while( this.var.index.rhomb < 15 ){
      this.addRhomb( face_a, edge_a, face_b + 1, edge_b );
      edge_b = ( edge_b + 1 ) % this.const.n;
      edge_a = ( edge_a + 1 ) % this.const.n;
      face_b = ( face_b + 1 ) % this.const.n;
    }

    face_a = 0, edge_a = 0, face_b = 0, edge_b = 2;

    while( this.var.index.rhomb < 20 ){
      this.addRhomb( face_a  + 6, edge_a, face_b + 7, edge_b );
      edge_b = ( edge_b + 1 ) % this.const.n;
      edge_a = ( edge_a + 1 ) % this.const.n;
      face_b = ( face_b + 1 ) % this.const.n;
    }

    face_a = 0, edge_a = 2, face_b = 1, edge_b = 0;

    while( this.var.index.rhomb < 25 ){
      this.addRhomb( face_a + 1, edge_a, face_b + 1, edge_b );
      edge_b = ( edge_b + 1 ) % this.const.n;
      edge_a = ( edge_a + 1 ) % this.const.n;
      face_a = ( face_a + 1 ) % this.const.n;
      face_b = ( face_b + 1 ) % this.const.n;
    }

    face_a = 0, edge_a = 1, face_b = 1, edge_b = 4;

    while( this.var.index.rhomb < 30 ){
      this.addRhomb( face_a + 7, edge_a, face_b + 7, edge_b );
      edge_b = ( edge_b + 1 ) % this.const.n;
      edge_a = ( edge_a + 1 ) % this.const.n;
      face_a = ( face_a + 1 ) % this.const.n;
      face_b = ( face_b + 1 ) % this.const.n;
    }

    console.log( this.array.rhomb )
  }

  fillEdges(){
    let h = COLOR_MAX/ this.array.rhomb.length;
    for( let i = 0; i < this.array.rhomb.length; i++ ){
      let hue = h * i;
      this.array.pentahedron[this.array.rhomb[i].data.face.a].setEdgeHue( this.array.rhomb[i].data.edge.a, hue );
      this.array.pentahedron[this.array.rhomb[i].data.face.b].setEdgeHue( this.array.rhomb[i].data.edge.b, hue );
    }
  }

  init(){
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.const.r = this.const.a / ( 2 * Math.tan( Math.PI / this.const.n ) );

    this.initNeighbors();
    this.initPentahedrons();
    this.connectEdges();
    //    this.fillEdges();
  }

  addRhomb( face_a, edge_a, face_b, edge_b ){
    let a = {
      penta: face_a,
      edge: edge_a
    };
    let b = {
      penta: face_b,
      edge: edge_b
    };
    this.array.rhomb.push( new rhomb( this.var.index.rhomb, a, b ) );
    this.var.index.rhomb++;
  }

  draw( offsets ){
    let offset = offsets[0].copy();
    offset.sub( this.array.neighbor[0][0] );
    offset.x -= this.array.neighbor[1][1].x / 2;
    offset.y -= this.array.neighbor[1][1].y / 2;

    for( let i = 0; i < this.array.pentahedron.length; i++ )
      this.array.pentahedron[i].draw( offset )
  }
}
