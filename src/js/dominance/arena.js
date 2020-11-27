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
      region: [],
      clef: [],
      seal: []
    };

    this.init();
  }

  initHalls(){
    let halls = [ 1, 1, 3, 2, 3, 4, 5, 4, 3, 2, 3, 1, 1 ];
    let index = {
      hall: 0,
      floor: 0
    };
    let scale = 2;
    let a = this.const.a * 1.5 * scale;
    let r = this.const.r * 2 * scale;

    for( let i = 0; i < halls.length; i++ ){
      this.array.hall.push( [] );

      for( let j = 0; j < halls[i]; j++ ){
        let x = ( -halls.length / 2 + i + 0.5 ) * a;
        let y = ( -halls[i] / 2 + j + 0.5 ) * r + this.const.a / 4;
        let dx = Math.floor( halls.length / 2 ) - i;
        if( Math.abs( dx ) == 4 && j != 1 )
          x -= Math.sign( dx ) * a / 4;
        let center = createVector( x, y );
        let grid = createVector( i, j );
        let floors = 1;
        if( Math.abs( dx ) < 4 ){
          let parity = Math.abs( dx + 1 ) % 2;
          floors = parity + 2;
          this.array.controversial.hall.push( index.hall );
        }
        let dy = halls[i] / 2 - j;
        switch ( floors ) {
          case 1:
            dy = null;
            break;
          case 2:
          case 3:
            dy -= 0.5;
            break;
        }

        if( Math.abs( dx ) > 4 )
          center.x += Math.sign( dx ) * ( Math.abs( dx ) - 4 ) * a / 2;

        let symmetrys = {
          i: -dx,
          j: dy
        };

        this.array.hall[i].push( new hall( index , center, grid, floors, symmetrys, this.const.a ) );

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
    this.addLink( a, b, 0 );
    a.i = 1;
    b.i = a.i + 1;
    this.addLink( a, b, 2 );
    b.j = 1;
    this.addLink( a, b, 0 );
    b.j = 2;
    this.addLink( a, b, 1 );
    a.i = 2;
    a.j = 1;
    b.i = a.i + 1;
    b.j = 0;
    this.addLink( a, b, 0 );
    b.f = 1;
    this.addLink( a, b, 0 );
    b.j = 1;
    b.f = 0;
    this.addLink( a, b, 0 );
    b.f = 1;
    this.addLink( a, b, 0 );

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
              this.addLink( a, b, 0 );
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
    this.addLink( a, b, 0 );
    a.f = 1;
    this.addLink( a, b, 0 );
    a.j = 1;
    a.f = 0;
    this.addLink( a, b, 0 );
    a.f = 1;
    this.addLink( a, b, 0 );
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
    this.addLink( a, b, 1 );
    a.j = 1;
    this.addLink( a, b, 0 );
    a.j = 2;
    this.addLink( a, b, 2 );
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
    this.addLink( a, b, 0 );
  }

  generateBasis(){
    //
    let middle = {
      i: null,
      j: null,
      f: null
    };
    middle.i = Math.floor( this.array.hall.length / 2 );
    middle.j = Math.floor( this.array.hall[middle.i].length / 2 );
    middle.f = Math.floor( this.array.hall[middle.i][middle.j].array.floor.length / 2 );
    let center = this.array.hall[middle.i][middle.j].array.floor[middle.f].const.index;

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
              //the top and bottom floor of the center
              let d_center = center - neighbor.array.link[j][l];
              let d = this.array.hall[middle.i][middle.j].array.floor.length * middle.j +  middle.f;
              if( d_center == d )
                shift = d;
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
  }

  distributeUnselected(){
    let clusters = [ [ this.array.controversial.floor[0] ] ];

    //distribute unselected floors by clusters
    for( let i = 1; i < this.array.controversial.floor.length; i++ ){
      //
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

    for( let i = 0; i < clusters.length; i++ ){
      regions.push( [] );

      for( let j = 0; j < clusters[i].length; j++ ){
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

    //unselected floors adjacent to regions
    let frontiers = [];

    for( let i = 0; i < this.array.region.length; i++ ){
      frontiers.push( [] );

      for( let r = 0; r < regions.length; r++ ){
        let index = regions[r].indexOf( i );

        if( index != -1 )
          for( let c = 0; c < clusters[r].length; c++ )
            frontiers[i].push( clusters[r][c] );
      }
    }

    let association = {
      a: null,
      b: null,
      array: []
    }

    //find a pair of two regions covering more floors
    for( let i = 0; i < frontiers.length; i++ )
      for( let j = i + 1; j < frontiers.length; j++ ){
        let merger = [];

        for( let ii = 0; ii < frontiers[i].length; ii++ )
          merger.push( frontiers[i][ii] );

        for( let jj = 0; jj < frontiers[j].length; jj++ ) {
          let index = merger.indexOf( frontiers[j][jj] );

          if( index == -1 )
            merger.push( frontiers[j][jj] );
        }

        let min_length = i;
        let max_length = j;

        if( frontiers[i].length > frontiers[j].length ){
          min_length = j;
          max_length = i;
        }

        if( merger.length > association.array.length )
          association = {
            a: min_length,
            b: max_length,
            array: merger
          }
      }

    //distribute isolated floors between completed regions (region overload)
    let overloads = [];

    if( association.array.length < 12 ){
      let lefts = [];

      for( let i = 0; i < this.array.controversial.floor.length; i++ ){
        let index = association.array.indexOf( this.array.controversial.floor[i] );
        if( index == -1 )
          lefts.push( this.array.controversial.floor[i] );
      }

      for( let i = 0; i < lefts.length; i++ ){
        let hall = this.convertFloor( lefts[i] );
        let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];
        let neighbors = [];

        for( let j = 0; j < floor.array.link.length; j++ )
          for( let l = 0; l < floor.array.link[j].length; l++ ){
            let index = this.array.controversial.floor.indexOf( floor.array.link[j][l] );

            neighbors.push( floor.array.link[j][l] );
          }

        let rand = Math.floor( Math.random() * neighbors.length );
        let hall_rand = this.convertFloor( neighbors[rand] );
        let floor_rand = this.array.hall[hall_rand.i][hall_rand.j].array.floor[hall_rand.f];
        let region = floor_rand.var.region;
        this.array.region[region].push( floor_rand );
        floor.setRegion( region );
        overloads.push( region );
      }
    }

    //distribute most of the floors
    for( let i = 0; i < frontiers[association.b].length; i++ ){
      let hall = this.convertFloor( frontiers[association.b][i] );
      let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];
      this.array.region[association.b].push( floor );
      floor.setRegion( association.b );

      let index = frontiers[association.a].indexOf( frontiers[association.b][i] );
      if( index != -1 )
        frontiers[association.a].splice( index, 1 );
    }

    //distribute less of the floors
    for( let i = 0; i < frontiers[association.a].length; i++ ){
      let hall = this.convertFloor( frontiers[association.a][i] );
      let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];
      this.array.region[association.a].push( floor );
      floor.setRegion( association.a );
    }

    //align the number of floors between dominant regions
    let hegemon_size = 15;
    let surplus = this.array.region[association.b].length - hegemon_size;
    this.balanceTwoRegion( association.a, association.b, surplus );

    //unloading floors from overloaded regions to understaffed
    for( let o = 0; o < overloads.length; o++ )
      this.balanceTwoRegion( association.a, overloads[o], 1 );

    //final check length of regions
    let suzerain_size = 9;

    for( let i = 0; i < this.array.region.length; i++ )
     if( this.array.region[i].length != hegemon_size &&
         this.array.region[i].length != suzerain_size )
       this.restart();

  }

  collapseGraph(){
    //find the foundation of the regions
    let offshoots = [];
    let neighbors = {
      index: [],
      count: []
    };

    for( let i = 0; i < this.array.region.length; i++ ){
      let region = this.array.region[i];
      offshoots.push( [] );
      neighbors.index.push( [] );
      neighbors.count.push( [] );

      for( let j = 0; j < region.length; j++ ){
        neighbors.index[i].push( [] );
        neighbors.count[i].push( 0 );
        offshoots[i].push( region[j].const.index );
      }

      for( let j = 0; j < region.length; j++ )
        for( let jj = j + 1; jj < region.length; jj++ )
          for( let l = 0; l < region[jj].array.link.length; l++ ){
            let index = region[jj].array.link[l].indexOf( region[j].const.index );

            if( index != -1 ){
              let duplicate_index = neighbors.index[i][j].indexOf( region[jj].array.link[l][index] );
              if( true ){
                neighbors.index[i][j].push( region[jj].const.index );
                neighbors.index[i][jj].push( region[j].const.index );
              }
            }
          }
    }

    for( let i = 0; i < this.array.region.length; i++ ){
      let flag = false;
      let counter = 0;
      let stopper = 100;

      while( !flag && counter < stopper ){
        flag = true;

        for( let n = 0; n < neighbors.index[i].length; n++ )
          if( neighbors.index[i][n].length == 1 ){
            let index = offshoots[i].indexOf( neighbors.index[i][n][0] );
            let index_splice = neighbors.index[i][index].indexOf( offshoots[i][n] );
            neighbors.index[i][index].splice( index_splice, 1 );
            neighbors.index[i][n].pop();
            neighbors.count[i][index]++;
            if( neighbors.count[i][n] != 0 )
              neighbors.count[i][index] += neighbors.count[i][n];
            flag = false;
          }

        counter++;
      }
    }

    return {
      neighbors: neighbors,
      offshoots: offshoots
    }
  }

  findUnfixed( graph, a, b ){
    let unfixed_floors = [ [], [] ];
    for( let i = 0; i < graph.neighbors.index[b].length; i++ )
      switch ( graph.neighbors.index[b][i].length ) {
        case 0:
        unfixed_floors[0].push( graph.offshoots[b][i] );
          break;
        case 2:
        unfixed_floors[1].push( graph.offshoots[b][i] );
          break;
      }

    //small hegemon frontier
    let frontier_sh = [];
    //frontier between small and large hegemon
    let frontier_bslh = [];
    let small_region = this.array.region[a];
    let large_region = this.array.region[b];

    //including floors of own region
    //this is mistake
    for( let i = 0; i < small_region.length; i++ )
      for( let l = 0; l < small_region[i].array.link.length; l++ )
        for( let ll = 0; ll < small_region[i].array.link[l].length; ll++ ){
          let index = frontier_sh.indexOf( small_region[i].array.link[l][ll] );

          if( index == -1 )
            frontier_sh.push( small_region[i].array.link[l][ll] );
        }

    //
    for( let i = 0; i < large_region.length; i++ ){
      let index = frontier_sh.indexOf( large_region[i].const.index );

      if( index != -1 )
        for( let j = 0; j < unfixed_floors.length; j++ ){
          let unfixed_index = unfixed_floors[j].indexOf( large_region[i].const.index )

          if( unfixed_index != -1 )
            frontier_bslh.push( large_region[i].const.index );
        }
    }

    if( frontier_bslh.length == 0 )
      this.restart();

    return frontier_bslh;
  }

  balanceTwoRegion( a, b, surplus ){
    let graph = this.collapseGraph();
    //shaky rontier between two regions
    let frontier = this.findUnfixed( graph, a, b );

    while( surplus > 0 && frontier.length > 0 ){
      let rand = Math.floor( Math.random() * frontier.length );
      let hall = this.convertFloor( frontier[rand] );
      let floor = this.array.hall[hall.i][hall.j].array.floor[hall.f];
      floor.setRegion( a );

      let index = graph.offshoots[b].indexOf( frontier[rand] );
      graph.offshoots[b].splice( index, 1 );
      this.array.region[b].splice( index, 1 );
      this.array.region[a].push( floor );
      frontier.splice( rand, 1 );
      surplus--;

      if( surplus > 0 ){
        graph = this.collapseGraph();
        frontier = this.findUnfixed( graph, a, b );
      }
    }
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

  addLink( objA, objB, type ){
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

    let floors = [ begin, end ];

    this.array.corridor.push( new corridor( floors, type, this.const.a ) );
  }

  click(){

  }

  key(){

  }

  light(){

  }

  restart(){
    this.var.index.link = 0;

    this.array = {
      hall: [],
      corridor: [],
      link: [],
      controversial: {
        hall: [],
        floor: [],
      },
      region: [],
      clef: [],
      seal: []
    };

    console.log('restarted')

    this.init();

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
    let offset = offsets[0];

    for( let i = 0; i < this.array.corridor.length; i++ )
      this.array.corridor[i].draw( offset );

    noStroke();
    for( let i = 0; i < this.array.hall.length; i++ )
      for( let j = 0; j < this.array.hall[i].length; j++ )
        this.array.hall[i][j].draw( offset );
  }
}
