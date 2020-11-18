//
class arena {
  constructor (  ){
    this.const = {
      a: CELL_SIZE * 0.5
    };
    this.var = {
      center: null,
      index: {
        link: 0
      }
    };
    this.array = {
      hall: [],
      corridor: [],
      link: [],
      controversial: {
        hall: [],
        floor: [],
      },
      region: []
    };

    this.init();
  }

  initHalls(){
    let halls = [ 1, 1, 3, 2, 3, 4, 5, 4, 3, 2, 3, 1, 1 ];
    let index = {
      hall: 0,
      floor: 0
    };
    let scale = 1.5;
    let a = this.const.a * 1.5 * scale;
    let r = this.const.r * 2 * scale;

    for( let i = 0; i < halls.length; i++ ){
      this.array.hall.push( [] );

      for( let j = 0; j < halls[i]; j++ ){
        let x = ( -halls.length / 2 + i ) * a;
        let y = ( -halls[i] / 2 + j ) * r;
        let dx = Math.floor( halls.length / 2 ) - i;
        if( Math.abs( dx ) == 4 && j != 1 )
          x -= Math.sign( dx ) * a / 2;
        let center = createVector( x, y );
        let grid = createVector( i, j );
        let floors = 1;
        if( Math.abs( dx ) < 4 ){
          let parity = Math.abs( dx + 1 ) % 2;
          floors = parity + 2;
          this.array.controversial.hall.push( index.hall );
        };

        this.array.hall[i].push( new hall( index , center, grid, floors, this.const.a ) );

        let last = this.array.hall[i].length - 1;

        if( Math.abs( dx ) < 4 )
          for( let j = 0; j < this.array.hall[i][last].array.floor.length; j++ )
            this.array.controversial.floor.push( this.array.hall[i][last].array.floor[j].const.index );

        index.hall++;
        index.floor += floors;
      }
    }
  }

  ininCorridors(){
    let a = {
      i: 0,
      j: 0,
      f: 0
    };
    let b = {
      i: a.i + 1,
      j: 0,
      f: 0
    };
    this.addLink( a, b );
    a.i = 1;
    b.i = a.i + 1;
    this.addLink( a, b );
    b.j = 1;
    this.addLink( a, b );
    b.j = 2;
    this.addLink( a, b );
    a.i = 2;
    a.j = 1;
    b.i = a.i + 1;
    b.j = 0;
    this.addLink( a, b );
    b.f = 1;
    this.addLink( a, b );
    b.j = 1;
    b.f = 0;
    this.addLink( a, b );
    b.f = 1;
    this.addLink( a, b );

    let begin = 3;
    let end = begin + 6;
    let forks = [ [ [ 0, 1 ], [ 0, 1 ] ] ,
                  [ [ 0 ], [ -1, 0 ], [ -1 ] ] ];
    let duo = [ [ 0, 1 ], [ -1, 0 ] ];

    for( let i = begin; i < end; i++ )
      for( let j = 0; j < this.array.hall[i].length; j++ ){
        let parity = this.array.hall[i][j].array.floor.length % 2;
        let d0 = 0;
        let d1 = 0;
        let d2 = duo.length;
        if( i >= Math.floor( this.array.hall.length / 2 ) ){
          d0 = 1;
          switch ( j ) {
            case 0:
              d1 = 1;
              break;
            case this.array.hall[i].length - 1:
              d2 = 1;
              break;
          }
        }

        for( let f = 0; f < this.array.hall[i][j].array.floor.length; f++ ){
          let floor = this.array.hall[i][j].array.floor[f];
          a = {
            i: i,
            j: j,
            f: f
          };

          for( let d = d1; d < d2; d++ )
            for( let p = 0; p < forks[parity][f].length; p++ ){
              let ii = i + 1;
              let jj = duo[d0][d] + j;
              let ff = f + forks[parity][f][p];
              let neighbor = this.array.hall[ii][jj].array.floor[ff];
              b = {
                i: ii,
                j: jj,
                f: ff
              };
              this.addLink( a, b );
            }

        }
      }

    a = {
      i: end,
      j: 0,
      f: 0
    };
    b = {
      i: a.i + 1,
      j: 1,
      f: 0
    };
    this.addLink( a, b );
    a.f = 1;
    this.addLink( a, b );
    a.j = 1;
    a.f = 0;
    this.addLink( a, b );
    a.f = 1;
    this.addLink( a, b );
    a = {
      i: end + 1,
      j: 0,
      f: 0
    };
    b = {
      i: a.i + 1,
      j: 0,
      f: 0
    };
    this.addLink( a, b );
    a.j = 1;
    this.addLink( a, b );
    a.j = 2;
    this.addLink( a, b );
    a = {
      i: end + 2,
      j: 0,
      f: 0
    };
    b = {
      i: a.i + 1,
      j: 0,
      f: 0
    };
    this.addLink( a, b );
  }

  generateBasis(){
    //
    let middle = {
      i: null,
      j: null,
      f: null
    };
    middle.i = Math.floor( this.array.hall.length / 2 );
    /*middle.i = Math.floor( this.array.hall.length / 2 );
    middle.f = Math.floor( this.array.hall[middle.i][middle.j].array.floor.length / 2 );
    let center = this.array.hall[middle.i][middle.j].array.floor[middle.f].const.index;*/

    for( let i = 0; i < this.array.hall[middle.i].length; i++ ){
        let hall = this.array.hall[middle.i][i];
        let rand = Math.floor( Math.random() * hall.array.floor.length );

        this.array.region.push( [ hall.array.floor[rand] ] );
        hall.array.floor[rand].setRegion( i );
        let index = this.array.controversial.floor.indexOf( hall.array.floor[rand].const.index );
        this.array.controversial.floor.splice( index, 1 );
    }

    let k_max = 8;

    for( let k = 0; k < k_max; k++ )
      for( let i = 0; i < this.array.region.length; i++ ){
        let neighbors = [];
        let hall;

        for( let h = 0; h < this.array.region[i].length; h++ ){
          let neighbor = this.array.region[i][h];

          for( let j = 0; j < neighbor.array.link.length; j++ )
            for( let l = 0; l < neighbor.array.link[j].length; l++ ){
            let index = this.array.controversial.floor.indexOf( neighbor.array.link[j][l] );

            if( index != -1 ){
              hall = this.convertFloor( neighbor.array.link[j][l] );
              let shift =  Math.abs( hall.i - middle.i ) + 1;
              let duplicates = Math.pow( shift, 2 );

              for( let d = 0; d < duplicates; d++ )
                neighbors.push( neighbor.array.link[j][l] );
            }
          }
        }

        if( neighbors.length > 0 ){
          let rand = Math.floor( Math.random() * neighbors.length );
          hall = this.convertFloor( neighbors[rand] );
          let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];
          floor.setRegion( i );
          let index = this.array.controversial.floor.indexOf( floor.const.index );
          this.array.controversial.floor.splice( index, 1 );
          this.array.region[i].push( floor );
        }
        else
          console.log( i, 'кончился', this.array.region[i] )
      }
    console.log( this.array.controversial.floor )
    console.log( this.array.region )
  }

  distributeUnselected(){
    let unselected = [ this.array.controversial.floor[0] ];
    let clusters = [ [ this.array.controversial.floor[0] ] ];

    //distribute unselected floors by clusters
    for( let i = 1; i < this.array.controversial.floor.length; i++ ){
      unselected.push( this.array.controversial.floor[i] );

      let hall = this.convertFloor( this.array.controversial.floor[i] );
      let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];
      let flag = false;

      for( let j = 0; j < floor.array.link.length; j++ )
        for( let l = 0; l < floor.array.link[j].length; l++ ){
        let indexFloor = this.array.controversial.floor.indexOf( floor.array.link[j][l] );

        if( indexFloor != -1 ){
          for( let c = 0; c < clusters.length; c++ ){
            let indexCluster = clusters[c].indexOf( floor.array.link[j][l] );

            if( indexCluster != -1 ){
              let duplicateIndex = clusters[c].indexOf( this.array.controversial.floor[i] );

              if( duplicateIndex == -1 ){
                clusters[c].push( this.array.controversial.floor[i] );
                flag = true;
              }
            }
          }
        }
      }

      if( !flag )
        clusters.push( [ this.array.controversial.floor[i] ] );
    }

    //combine clusters with a common part
    for( let i = clusters.length - 1; i > -1; i-- ){
      let common = {
        flag: false,
        index: null
      }

      for( let j = 0; j < clusters[i].length; j++ )
        if( !common.flag )
          for( let c = 0; c < i; c++ )
            if( !common.flag ){
              let index = clusters[c].indexOf( clusters[i][j] );

              if( index != -1 ){
                common.flag = true;
                common.index = c;
              }
        }

      if( common.flag ){
        for( let j = 0; j < clusters[i].length; j++ ){
          let index = clusters[common.index].indexOf( clusters[i][j] );

          if( index == -1 )
            clusters[common.index].push( clusters[i][j] )
        }

        clusters.splice( i, 1 );
      }
    }

    //neighboring regions for clusters
    let regions = [];
    console.log( clusters );

    for( let i = 0; i < clusters.length ; i++ ){
      regions.push( [] );

      for( let j = 0; j < clusters[i].length ; j++ ){
        let hall = this.convertFloor( clusters[i][j] );
        let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];

        for( let j = 0; j < floor.array.link.length; j++ )
          for( let l = 0; l < floor.array.link[j].length; l++ ){
            let neighbor = this.convertFloor( floor.array.link[j][l] );
            let region = this.array.hall[neighbor.i][neighbor.j].array.floor[neighbor.f].var.region;

            if( region != null ){
              let index = regions[i].indexOf( region );

              if( index == -1 )
                regions[i].push( region );
            }
          }
      }
    }

    console.log( regions );

    //unselected floors adjacent to regions
    let frontiers = [];

    for( let i = 0; i < this.array.region.length ; i++ ){
      frontiers.push( [] );

      for( let r = 0; r < regions.length ; r++ ){
        let index = regions[r].indexOf( i );

        if( index != -1 )
          for( let c = 0; c < clusters[r].length ; c++ )
            frontiers[i].push( clusters[r][c] );
      }
    }

    console.log( frontiers );
    let max = {
      a: null,
      b: null,
      length: 0
    }

    //find a pair of two regions covering more floors
    for( let i = 0; i < frontiers.length ; i++ )
      for( let j = i + 1; j < frontiers.length; j++ ){
        let merger = [];

        for( let ii = 0; ii < frontiers[i].length; ii++ )
          merger.push( frontiers[i][ii] );

        for( let jj = 0; jj < frontiers[j].length; jj++ ) {
          let index = merger.indexOf( frontiers[j][jj] );

          if( index == -1 )
            merger.push( frontiers[j][jj] );
        }

        if( merger.length > max.length )
          max = {
            a: i,
            b: j,
            length: merger.length,
            array: merger
          }
      }

    console.log( max )
  }

  initRegions(){
    this.generateBasis();
    this.distributeUnselected();
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHalls();
    this.ininCorridors();
    this.initRegions();
  }

  addLink( objA, objB ){
    let begin = this.array.hall[objA.i][objA.j].array.floor[objA.f];
    let end = this.array.hall[objB.i][objB.j].array.floor[objB.f];
    begin.addLink( end.const.index );
    end.addLink( begin.const.index );
    this.array.link.push( {
      index: this.var.index.link,
      link: [ begin.const.index, end.const.index ],
      a: {
        i: objA.i,
        j: objA.j,
        f: objA.f
      },
      b: {
        i: objB.i,
        j: objB.j,
        f: objB.f
      }
    } );
    this.var.index.link++;
  }



  click(){

  }

  key(){

  }

  convertFloor( floor ){
    //
    let halls = [ 1, 1, 3, 2, 3, 4, 5, 4, 3, 2, 3, 1, 1 ];
    let floors = [ 1, 1, 1, 2, 3, 2, 3, 2, 3, 2, 1, 1, 1 ];
    let number = -1;
    let i = 0;

    while( floor > number && i < halls.length ){
      number += halls[i] * floors[i];
      i++;
    }

    i--;
    number -= halls[i] * floors[i];

    let remainder = floor - number - 1;
    let j = Math.floor( remainder / floors[i] );
    let f = remainder % floors[i];

    return {
      i: i,
      j: j,
      f: f
    };
  }

  draw( offsets ){
    stroke( 0 );
    strokeWeight( 2 );

    for( let i = 0; i < this.array.link.length; i++ ){
      let a = this.array.link[i].a;
      let b = this.array.link[i].b;
      let begin = this.array.hall[a.i][a.j].array.floor[a.f].var.center.copy();
      let end = this.array.hall[b.i][b.j].array.floor[b.f].var.center.copy();
      begin.add(offsets[1]);
      end.add(offsets[1]);
      line( begin.x + this.const.a  /2, begin.y, end.x - this.const.a  /2, end.y )
    }

    noStroke();
    for( let i = 0; i < this.array.hall.length; i++ )
      for( let j = 0; j < this.array.hall[i].length; j++ )
        this.array.hall[i][j].draw( offsets[1] );
  }
}
