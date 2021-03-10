//
class drone {
  constructor ( index, row, col, sight, a, hive ){
    this.const = {
      index: index,
      sides: 4,
      a: a
    };
    this.var = {
      row: row,
      col: col,
      sight: sight
    };
    this.flag = {
      left: false,
      right: false
    }
    this.array = {
      vertex: [],
      ripe: []
    };
    this.data = {
      hive: hive,
      comb: hive.array.comb[row][col]
    };

    this.init();
  }

  init_vertexs(){
    for( let i = 0; i < this.const.sides; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.sides * ( -0.5 - i + this.const.sides / 2 ) ) * this.const.b,
        Math.cos( Math.PI * 2 / this.const.sides * ( -0.5 - i + this.const.sides / 2 ) ) * this.const.b );

      this.array.vertex.push( vec.copy() );
    }
  }

  init(){
    this.const.b = this.const.a * Math.sqrt( 2 );

    this.init_vertexs();
  }

  selection_of_variants(){
    let hive = this.data.hive;
    let options = [];

    for( let ripe of this.array.ripe ){
      let grid = hive.convert_index( ripe );

      if( !this.check_corners( grid ) ){
        let comb = hive.array.comb[grid.y][grid.x];
        let traits = comb.data.honey.array.trait;

        for( let cluster of hive.array.cluster ){
          let index = cluster.array.comb.indexOf( ripe );

          if( index != -1 ){
            let combs = [];

            for( let index of cluster.array.comb )
              combs.push( index );

            combs.splice( index, 1 );

            if( combs.length > 1 )
              options.push( {
                ripe: ripe,
                top: ripe - 3,
                bot: ripe + 3,
                combs: combs
              } );
          }
        }
      }
    }

    console.log( options );
  }

  check_corners( grid ){
    let x = grid.x == 0 || grid.x == this.data.hive.const.m - 1;
    let y = grid.y == 0 || grid.y == this.data.hive.const.n - 1;
    return x && y;

  }

  draw( offset ){
    let weight = 0.5;
    let vec = offset.copy();
    vec.add( this.data.comb.const.center );

    stroke( 0 );
    strokeWeight( weight );

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;

      if( this.var.sight != i )
        line( this.array.vertex[i].x + vec.x - weight / 2, this.array.vertex[i].y + vec.y - weight / 2,
              this.array.vertex[ii].x + vec.x - weight / 2, this.array.vertex[ii].y + vec.y - weight / 2 );
      }
  }
}
