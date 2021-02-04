//
class platform {
  constructor ( size, a ){
    this.const = {
      size: size,
      n: 4,
      m: 6,
      a: a
    };
    this.var = {
      index: {
        compartment: 0
      }
    };
    this.array = {
      neighbor: [],
      partition: [],
      compartment: [],
      shift: []
    };

    this.init();
  }

  init_neighbors(){
    this.array.neighbor = [
    ];
  }

  init_shifts(){
    this.array.shift = [ [], [] ];

    for( let quarter = 0; quarter < this.const.n; quarter++ ){
      let vec = createVector(
        Math.sin( ( -quarter - 2.5 ) * this.var.angle ) * this.const.r * 0.5,
        Math.cos( ( -quarter - 2.5 ) * this.var.angle ) * this.const.r * 0.5 );

      this.array.shift[0].push( vec.copy() );

      vec = createVector(
        Math.sin( ( -quarter - 3.5 ) * this.var.angle ) * this.const.r,
        Math.cos( ( -quarter - 3.5 ) * this.var.angle ) * this.const.r );

      this.array.shift[1].push( vec.copy() );
    }
  }

  init_hues(){
    this.array.hue = [
      52,
      122,
      192,
      262,
      297,
      332
    ];
  }

  init_partitions(){
    //
    for( let i = 0; i < this.const.m * this.const.size; i++ ){
      this.array.partition.push( [] );

      for( let quarter = 0; quarter < this.const.n; quarter++ ){
        this.array.partition[i].push( [] );

        let vec = createVector(
          Math.sin( -quarter * this.var.angle + Math.PI ) * this.const.a * i,
          Math.cos( -quarter * this.var.angle + Math.PI ) * this.const.a * i );

        vec.add( this.array.shift[0][quarter] );

          for( let j = 0; j < i + 1; j++ ){
            let index = i * this.const.m * this.const.size + quarter * i + j;
            let grid = createVector( i, quarter, j );
            if( j > 0 )
              vec.add( this.array.shift[1][quarter] );

            this.array.partition[i][quarter].push( new partition( index, vec, grid, this.const.a * 0.5 ) );

            if( i == this.const.m * this.const.size - 1 )
              this.array.partition[i][quarter][j].set_doublet( quarter, 0 );
          }
        }
    }


  }

  init_compartments(){
    let type = 0;
    let subtype = 0;
    let anchor = createVector( 2, 0, 2 );
    let x = 3;
    let y = 3;

    this.add_compartment( type, subtype, anchor, x, y );
    subtype++;
    anchor = createVector( 2, 1, 0 );
    this.add_compartment( type, subtype, anchor, x, y );
    subtype++;
    anchor = createVector( 2, 2, 0 );
    this.add_compartment( type, subtype, anchor, x, y );
    subtype++;
    anchor = createVector( 2, 3, 2 );
    this.add_compartment( type, subtype, anchor, x, y );
  }

  init(){
    this.var.angle = Math.PI * 2 / this.const.n;
    this.const.r = this.const.a * Math.sqrt( 2 );

    this.init_hues();
    this.init_neighbors();
    this.init_shifts();
    this.init_partitions();
    this.init_compartments();
  }

  add_compartment( type, subtype, anchor, x, y ){
  console.log(subtype)
    this.array.compartment.push( new compartment( this.var.index.compartment, this, type, subtype, anchor, x, y ) );
    this.var.index.compartment++;
  }

  key(){
  }

  click( offsets ){

  }

  draw( offsets ){
    let offset = offsets[0];

    for( let rows of this.array.partition )
      for( let quarters of rows )
        for( let partition of quarters )
          partition.draw( offset, true );
          fill(0)
          ellipse(offset.x, offset.y, 10,10)
  }
}
