//
class hive {
  constructor ( n, m, a ){
    this.const = {
      n: n,
      m: m,
      a: a
    };
    this.var = {
      current: {
        cluster: 0
      }
    }
    this.flag = {
      full: false,
      ripe: {
        left: false,
        right: false
      }
    };
    this.array = {
      neighbor: [],
      comb: [],
      drone: [],
      cluster: []
    };
    this.data = {
      womb: null
    };

    this.init();
  }

  init_neighbors(){
    this.array.neighbor = [
      createVector( 1, 0 ),
      createVector( 0, 1 ),
      createVector( -1, 0 ),
      createVector( 0, -1 )
    ]
  }

  init_combs(){
    for( let i = 0; i < this.const.n; i++ ){
      this.array.comb.push( [] );

      for( let j = 0; j < this.const.m; j++ ){
        let index = i * this.const.m + j;
        let center = createVector( ( j + 0.5 ) * this.const.a, ( i + 0.5 ) * this.const.a );
        this.array.comb[i].push( new comb( index, i, j, center, this.const.a ) );
      }
    }
  }

  init_womb(){
    this.data.womb = new womb( this );
  }

  init_drones(){
    if( this.const.m % 2 == 1 ){
      let count = ( this.const.m - 1 ) / 2;

      for( let i = 0; i < count; i++ ){
        let col = i * 2 + 1;
        let row = 0;
        let sight = 1;
        this.array.drone.push( new drone( i, row, col, sight, this.const.a * 0.3, this ) );
      }
    }

    this.array.drone[0].flag.left = true;
    this.array.drone[this.array.drone.length - 1].flag.right = true;
  }

  init_clusters(){
    this.array.cluster = [];

    for( let traits of this.data.womb.array.trait )
      for( let trait of traits )
        this.add_cluster( [ trait ] );

    for( let combs of this.array.comb )
      for( let comb of combs ){
        let traits = comb.data.honey.array.trait;


        for( let trait of traits )
          for( let cluster of this.array.cluster ){
            let index = cluster.array.trait.indexOf( trait );

            if( index != -1 )
              cluster.array.comb.push( comb.const.index );
          }
      }
  }

  init(){
    this.init_neighbors();
    this.init_combs();
    this.init_womb();
    this.init_drones();
    this.init_clusters();
    this.update_ripes();

    let drone = this.array.drone[0];
    drone.find_promising_ripe();
  }

  add_cluster( traits ){
    this.array.cluster.push( new cluster( this.var.current.cluster, traits ) )
    this.var.current.cluster++;
  }

  update_ripes(){
    while( !this.flag.ripe.left || !this.flag.ripe.right )
      this.define_ripe();
  }

  define_ripe(){
    let indexs = [];

    for( let combs of this.array.comb )
      for( let comb of combs )
        if( ( comb.const.col == 0 && !this.flag.ripe.left ) || ( comb.const.col == this.const.m - 1 && !this.flag.ripe.right ) )
          indexs.push( comb.const.index );

    let border_clusters = [];

    for( let cluster of this.array.cluster ){
      let count = 0;

      for( let comb of cluster.array.comb ){
        let index = indexs.indexOf( comb );

        if( index != -1 )
          count++;
      }

      if( count > 0 )
        //for( let i = 0; i < count; i++ )
          border_clusters.push( cluster.const.index );
    }

    let distribution = [];

    for( let i = 0; i < border_clusters.length; i++ ){
      let length = this.array.cluster[border_clusters[i]].array.comb.length;

      for( let j = 0; j < length; j++ )
        distribution.push( i );
    }

    let rand = Math.floor( Math.random() * distribution.length );
    let index = border_clusters[distribution[rand]]
    let rand_cluster = this.array.cluster[index];
    let indexs_cluster = [];

    for( let comb of rand_cluster.array.comb ){
      let index = indexs.indexOf( comb );
      let grid = this.convert_index( comb );

      if( index != -1 && this.array.comb[grid.y][grid.x].is_movable() )
        indexs_cluster.push( comb )
    }

    let corner = true;
    while( corner ){
      rand = Math.floor( Math.random() * indexs_cluster.length );
      let comb = indexs_cluster[rand];
      let grid = this.convert_index( comb );
      corner = this.check_corners( grid );

      if( corner )
        indexs_cluster.splice( rand, 1 );
      //upgradeability
      //elimination of a cluster consisting of corner honey
      if( indexs_cluster.length == 0 ){
        this.define_ripe();
        return;
      }
    }

    let rand_comb = indexs_cluster[rand];
    let grid = this.convert_index( rand_comb );
    this.array.comb[grid.y][grid.x].set_status( 1 );

    if( grid.x == 0 ){
      this.flag.ripe.left = true;
      this.array.drone[0].array.ripe.push( rand_comb );
    }
    if( grid.x == this.const.m - 1 ){
      this.flag.ripe.right = true;
      this.array.drone[this.array.drone.length - 1].array.ripe.push( rand_comb );
    }
  }

  key(){

  }

  click(){

  }

  //find the grid coordinates by index
  convert_index( index ){
    if( index == undefined )
      return null;

    let row = Math.floor( index / this.const.m );
    let col = index % this.const.m;
    return createVector( col, row );
  }

  //find the index coordinates by grid coordinates
  convert_grid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.m + vec.x;
  }

  check_corners( grid ){
    let x = grid.x == 0 || grid.x == this.const.m - 1;
    let y = grid.y == 0 || grid.y == this.const.n - 1;
    return x && y;
  }

  check_border( grid ){
    let flag = ( grid.x >= this.const.m ) || ( grid.x < 0 ) || ( grid.y >= this.const.n ) || ( grid.y < 0 );

    return !flag;
  }

  bubble_sort( arr, key ){
    for( let i = 0; i < arr.length - 1; i++ ){
      let flag = false;

      for( let j = 0; j < arr.length - 1 - i; j++ )
        if( arr[j][key] > arr[j + 1][key] ){
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          flag = true;
        }

      if ( !flag ) break;
    }

    return arr;
  }

  draw( offset ){
    offset = createVector();

    for( let combs of this.array.comb )
      for( let comb of combs )
        comb.draw( offset );

    for( let drone of this.array.drone )
      drone.draw( offset );
  }
}
