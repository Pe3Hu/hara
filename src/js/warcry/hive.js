//
class hive {
  constructor ( n, m, a ){
    this.const = {
      n: n,
      m: m,
      a: a,
      tempo: 10
    };
    this.var = {
      current: {
        cluster: 0,
        score: 0
      }
    }
    this.flag = {
      full: false,
      ripe: {
        left: false,
        right: false
      },
      check_ripes: false,
      piping_hot: false
    };
    this.array = {
      neighbor: [],
      comb: [],
      drone: [],
      cluster: [],
      ripe: []
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
        this.array.drone.push( new drone_v2( i, row, col, sight, this.const.a, this ) );
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

    this.update_clusters();
  }

  init(){
    this.init_neighbors();
    this.init_combs();
    this.init_womb();
    this.init_drones();
    this.init_clusters();

    let drone = this.array.drone[0];
    //drone.flag.enegry = true;
  }

  add_cluster( traits ){
    this.array.cluster.push( new cluster( this.var.current.cluster, traits ) )
    this.var.current.cluster++;
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

    if( border_clusters.length > 0 ){
      let distribution = [];

      for( let i = 0; i < border_clusters.length; i++ ){
        let length = this.array.cluster[border_clusters[i]].array.comb.length;

        for( let j = 0; j < length; j++ )
          distribution.push( i );
      }

      let rand = Math.floor( Math.random() * distribution.length );
      let index = border_clusters[distribution[rand]];
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
        this.array.ripe.push( rand_comb );
      }
      if( grid.x == this.const.m - 1 ){
        this.flag.ripe.right = true;
        this.array.ripe.push( rand_comb );
      }
    }
    //console.log(  '!!!!!!!!!!!!!', this.array.ripe)
  }

  reap_ripe(){
    //
    //console.log(  '!!!!!!!!!!!!!' )
    this.var.current.score++;
    this.flag.full = false;
    this.data.womb.refill();
  }

  key(){

  }

  click(){
    this.array.drone[0].flag.error = !this.array.drone[0].flag.error;
  }

  compare_traits( combs ){
    let traits = [];
    let flag = false;
    let coincided = [];

    for( let comb of combs )
      if( comb.data.honey != null )
        traits.push( comb.data.honey.array.trait );


    if( traits.length == combs.length )
      for( let origin of traits[0] ){
        let origin_flag = true;

        for( let i = 1; i < traits.length; i++ ){
          let index = traits[i].indexOf( origin );

          origin_flag = origin_flag && index != -1;
        }

        flag = flag || origin_flag;
        if( origin_flag )
          coincided.push( origin );
      }

    /*if( coincided.length>0 )
      console.log( coincided[0].name )*/
    return flag;
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

  check_ripes(){
    for( let ripe of this.array.ripe ){
      let grid = this.convert_index( ripe );
      let combs = [
        this.array.comb[grid.y - 1][grid.x],
        this.array.comb[grid.y][grid.x],
        this.array.comb[grid.y + 1][grid.x] ];

      if( this.compare_traits( combs ) ){
        this.array.comb[grid.y - 1][grid.x].data.honey = null;
        this.array.comb[grid.y][grid.x].data.honey = null;
        this.array.comb[grid.y][grid.x].set_status( 0 );
        this.array.comb[grid.y + 1][grid.x].data.honey = null;

        this.reap_ripe();
        let index = this.array.ripe.indexOf( ripe );
        this.array.ripe.splice( index, 1 );

        if( grid.x == 0 )
          this.flag.ripe.left = false;

        if( grid.x == this.const.m - 1 )
          this.flag.ripe.right = false;
      }

    }
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

  update_clusters(){
    for( let cluster of this.array.cluster )
      cluster.array.comb = [];

    for( let combs of this.array.comb )
      for( let comb of combs )
        if( comb.data.honey != null ){
          let traits = comb.data.honey.array.trait;

          for( let trait of traits )
            for( let cluster of this.array.cluster ){
              let index = cluster.array.trait.indexOf( trait );

              if( index != -1 )
                cluster.array.comb.push( comb.const.index );
            }
        }
  }

  update_ripes(){
    //
    if( this.flag.full ){
      while( !this.flag.ripe.left || !this.flag.ripe.right )
        this.define_ripe();

      if( this.flag.piping_hot ){
        this.flag.piping_hot = false;
        this.flag.check_ripes = true;
        return;
      }

      if( this.flag.check_ripes )
        this.check_ripes();

      if( this.flag.full )
        this.activate_drones();
    }
  }

  update_honeys(){
    let womb = this.data.womb;
    //console.log( this.flag.full, womb.flag.milk )

    if( womb.flag.milk ){
      this.milk();

      for( let col = 0; col < this.const.m; col++ ){
        let count_new_milk = -1;

        for( let row = 0; row < this.const.n; row++ )
            if( !womb.comb_fullness_check( row, col ) )
              count_new_milk = row;


      if( count_new_milk > 0 )
        if( womb.flag.milk )
          for( let row = count_new_milk; row > -1; row-- )
            this.array.comb[row][col].milk( womb.var.milk.vector );
      }
    }
  }

  milk(){
    let womb = this.data.womb;
    let end = womb.var.milk.end.copy();
    let d = womb.var.milk.vector.dist( end );

    if( d > womb.var.milk.slip.mag() ){
      let slip = womb.var.milk.slip.copy();
      womb.var.milk.vector.add( slip );
      //console.log( womb.var.milk.vector)
    }
    else
      this.end_milk_func();
  }

  end_milk_func(){
    let womb = this.data.womb;
    womb.shift_down();

    for( let combs of this.array.comb )
      for( let comb of combs )
        comb.reset();

    womb.flag.milk = false;
    womb.refill();

    if( this.flag.full )
      this.flag.check_ripes = true;

    if( this.flag.full )
      this.update_clusters();
  }

  activate_drones(){
    for( let drone of this.array.drone ){
      let enegry = false;

      if( this.flag.ripe.left && drone.var.col == 1 )
        enegry = true;

      if( this.flag.ripe.right && drone.var.col == this.const. m - 2 )
        enegry = true;

      drone.flag.enegry = enegry || drone.flag.enegry;
    }
  }

  update( offset ){
    //console.log( this.flag.piping_hot  )
    this.update_honeys();

    if( this.flag.full )
      this.update_ripes();

    for( let drone of this.array.drone )
      if( drone.flag.enegry )
        drone.update( offset );
  }

  draw( offset ){
    offset = createVector();
    this.update( offset );

    for( let combs of this.array.comb )
      for( let comb of combs )
        comb.draw( offset );

    for( let drone of this.array.drone )
      drone.draw( offset );

    noStroke();
    fill( 0 );
    text( 'score: ' + this.var.current.score, ( this.const.m + 0.5 ) * this.const.a, this.const.a / 2 + FONT_SIZE / 3 );
  }
}
