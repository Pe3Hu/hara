//
class dodecahedron {
  constructor ( a ){
    this.const = {
      a: a,
      r: null,
      R: null,
      n: 5
    };
    this.var = {
    };
    this.array = {
      pentahedron: [],
      neighbor: []
    };

    this.init();
  }

  initPentahedrons(){
    let parity = 0;
    let index = 0;
    let center = createVector();
    this.array.pentahedron.push( new pentahedron( index, center, parity, this.const.R ) );
    parity++;

    for( let i = 0; i < this.array.neighbor[parity].length; i++ ){
      center = this.array.neighbor[parity][i].copy();
      index++;
      this.array.pentahedron.push( new pentahedron( index, center, parity, this.const.R ) );
      console.log( this.array.pentahedron[i] )
    }
  }

  initNeighbors(){
    this.array.neighbor = [];

    for( let p = 0; p < 2; p++ ){
      this.array.neighbor.push( [] );

      for( let i = 0; i < this.const.n; i++ ){
        let vec = createVector(
          Math.sin( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 - 0.5 * p ) ) * this.const.r * 2,
          Math.cos( Math.PI * 2 / this.const.n * ( - i + this.const.n / 2 - 0.5 * p ) ) * this.const.r * 2 );

        this.array.neighbor[p].push( vec );
      }
    }

    console.log( this.array.neighbor )
  }

  init(){
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.const.r = this.const.a / ( 2 * Math.tan( Math.PI / this.const.n ) );


    this.initNeighbors();
    this.initPentahedrons();
  }

  draw( offsets ){
    for( let i = 0; i < this.array.pentahedron.length; i++ )
      this.array.pentahedron[i].draw( offsets )
  }
}
