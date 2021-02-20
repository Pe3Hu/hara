//
class weather {
  constructor ( n, m, a ){
    this.const = {
      n: n,
      m: m,
      a: a,
      seabed: 20,
      peak: 200
    };
    this.var = {
      index: {
        nulla: 0,
        cluster: 0
      },
      water_content: {
        max: 100
      },
      peak: null,
      biggest_cluster: {
        index: null,
        length: 0
      },
      layout: 2
    };
    this.array = {
      reaches: [],
      nulla: [],
      cluster: []
    };
    this.table = {
      probabilities: [],
      neighbors: []
    };

    this.init();
  }

  init_neighbors(){
    this.table.neighbors = [
      createVector( 1, -1 ),
      createVector( 1, 0 ),
      createVector( 1, 1 ),
      createVector( 0, 1 ),
      createVector( -1, 1 ),
      createVector( -1, 0 ),
      createVector( -1, -1 ),
      createVector( 0, -1 )
    ];
  }

  init_probabilities(){
    this.table.probabilities = [ [
      [ 0, 2, 1, 8, 6, 5, 1, 2 ],
      [ 0, 4, 1, 1, 1, 11, 3, 4 ],
      [ 0, 4, 11, 3, 1, 1, 1, 4 ],
      [ 0, 10, 1, 1, 1, 1, 1, 10 ],
      [ 0, 0, 0, 9, 7, 9, 0, 0 ],
    ],
    [
      [ 0, 1, 3, 5, 7, 5, 3, 1 ],
      [ 0, 1, 1, 1, 9, 4, 7, 2 ],
      [ 0, 2, 9, 1, 1, 1, 9, 2 ],
      [ 0, 2, 7, 4, 9, 1, 1, 1 ],
      [ 0, 1, 1, 1, 1, 1, 15, 5 ],
      [ 0, 5, 15, 1, 1, 1, 1, 1 ]
    ] ];
  }

  init_reachess(){
    let a = this.const.a / 2;
    let index = 0;

    for( let i = 0; i < this.const.n; i++ ){
      this.array.reaches.push( [] );

      for( let j = 0; j < this.const.m; j++ ){
        let altitude = 1000;
        let grid = createVector( j, i );
        let vec = createVector( this.const.a * ( j + 0.5 ), this.const.a * ( i + 0.5 ) );

        this.array.reaches[i].push( new reaches( index, altitude, vec, grid, a ) );
        index++;
      }
    }

    this.generateNoise();
  }

  init_nulla(){
    this.find_peak();
    let headwaters = this.var.peak;
    let direction = this.define_direction_at_border( headwaters );

    this.add_nulla( direction, headwaters, this.var.water_content.max, null );

    this.demarcate_clusters();

    do{
      this.split_large_cluster();
      this.demarcate_clusters();
    }
    while( this.var.biggest_cluster.length > this.const.m )

    for( let i = 0; i < this.array.cluster.length; i++ )
      for( let index of this.array.cluster[i] ){
        let grid = this.convert_index( index );
        this.array.reaches[grid.y][grid.x].var.cluster = i;
      }

    console.log( this.array.cluster )
  }

  init(){
    this.init_probabilities();
    this.init_neighbors();
    this.init_reachess();
    this.init_nulla();
  }

  generateNoise(){
    let inc = createVector( 20 / COLOR_MAX, 20 / COLOR_MAX );
    let xoff = 0;
    let heights = [];
    let min = 1;
    let max = 0;

    for( let i = 0; i < this.array.reaches.length; i++ ){
      let yoff = 0;
      heights.push( [] );

      for( let j = 0; j < this.array.reaches[i].length; j++ ){
        let n = noise( xoff, yoff )
        heights[i].push( n );

        if( n > max )
          max = n;
        if( n < min )
          min = n;

        yoff += inc.y;
      }

      xoff += inc.x;
    }

    let scatter = max - min;

    for( let i = 0; i < this.array.reaches.length; i++ )
      for( let j = 0; j < this.array.reaches[i].length; j++ ){
        let height = Math.floor( this.const.seabed + this.const.peak * ( heights[i][j] - min ) / scatter );
        this.array.reaches[i][j].set_height( height );
      }
  }

  find_peak(){
    let max = 0;

    for( let i = 0; i < this.array.reaches.length; i++ )
      for( let j = 0; j < this.array.reaches[i].length; j++ ){
        if( this.array.reaches[i][j].var.height > max ){
          if( i == 0 || j == 0 || i == this.array.reaches.length - 1 || j == this.array.reaches[i].length - 1 )
          max = this.array.reaches[i][j].var.height;
          this.var.peak = createVector( j, i );
        }
      }
  }

  define_direction_at_border( grid ){
    let borders = [ false, false, false, false, false, false, false, false ];

    if( grid.y == 0 )
      borders[7] = true;
    if( grid.y == this.const.n - 1 )
      borders[3] = true;
    if( grid.x == 0 )
      borders[5] = true;
    if( grid.x == this.const.m - 1 )
      borders[1] = true;

    let avg = 0;
    let count = 0;

    for( let i = 0; i < borders.length; i++ )
      if( borders[i] ){
        let exception = i == 7 && borders[1];

        if( !exception )
          avg += i;
        else
          avg += i - borders.length;
        count++;
      }

    avg /= count;
    return avg;
  }

  add_nulla( direction, headwaters, water_content, target, weather  ){
    this.array.nulla.push( new nulla( this.var.index.nulla, direction, headwaters, water_content, target, this ) );
    this.var.index.nulla++;
  }

  demarcate_clusters(){
    this.array.cluster = [];
    this.var.index.cluster = 0;
    let unlabeled = [];

    for( let reachess of this.array.reaches )
      for( let reaches of reachess )
        if( reaches.var.cluster >= 0 ){
          reaches.var.cluster = 0;
          unlabeled.push( reaches.const.index );
        }

    while( unlabeled.length > 0 ){
      let origin_index = unlabeled.pop();
      let previous = [ origin_index ];
      this.array.cluster.push( [] );
      this.array.cluster[this.var.index.cluster].push( origin_index );

      while( previous.length > 0 ){
        let next = [];

        for( let i = 0; i < previous.length; i++ ){
          let grid = this.convert_index( previous[i] );

          //only adjacent faces
          for( let i = 1; i < this.table.neighbors.length; i += 2 ){
            let neighbor = grid.copy();
            neighbor.add( this.table.neighbors[i] );
            let status = this.check_way( neighbor );

            if( status == 2 ){
              let index = this.array.reaches[neighbor.y][neighbor.x].const.index;
              let cluster_index = this.array.cluster[this.var.index.cluster].indexOf( index );

              if( cluster_index == -1 ){
                let next_index = next.indexOf( index );

                if( next_index == -1 )
                  next.push( index );

                let unlabeled_index = unlabeled.indexOf( index );
                unlabeled.splice( unlabeled_index, 1 );
                this.array.cluster[this.var.index.cluster].push( index );
              }
            }
          }
        }

        previous = [];

        for( let i = 0; i < next.length; i++ )
          previous.push( next[i] );
      }

      this.var.index.cluster++;
    }
  }

  split_large_cluster(){
    this.var.biggest_cluster = {
      index: -1,
      length: 0
    };

    for( let i = 0; i < this.array.cluster.length; i++ )
      if( this.array.cluster[i].length > this.var.biggest_cluster.length )
        this.var.biggest_cluster = {
          index: i,
          length: this.array.cluster[i].length
        }

    let center = createVector();

    for( let index of this.array.cluster[this.var.biggest_cluster.index] ){
      let grid = this.convert_index( index );
      center.add( grid );
    }


    center.x =  center.x / this.array.cluster[this.var.biggest_cluster.index].length ;
    center.y =  center.y / this.array.cluster[this.var.biggest_cluster.index].length ;

    let nearest = {
      grid: null,
      dist: this.const.m + this.const.n
    };

    for( let reachess of this.array.reaches )
      for( let reaches of reachess )
        if( reaches.var.cluster < 0 ){
          let d = center.dist( reaches.const.grid )

          if ( d < nearest.dist )
          nearest = {
            grid: reaches.const.grid.copy(),
            dist: d
          };
        }


    let spreader = center.copy();
    spreader.sub( nearest.grid );

    let border_dist = nearest.grid.copy();
    if( Math.sign( spreader.x ) == 1 )
       border_dist.x = this.const.m - 1 - nearest.grid.x;
    if( Math.sign( spreader.y ) == 1 )
       border_dist.y = this.const.n - 1 - nearest.grid.y;

    let steps = createVector( border_dist.x / spreader.x, border_dist.y / spreader.y );
    let scale = Math.min( Math.abs( steps.x ), Math.abs( steps.y ) );
    let target = nearest.grid.copy();
    spreader.mult( scale );

    target.add( spreader );

    let l = Math.max( Math.abs( spreader.x ), Math.abs( spreader.y ) );
    spreader.div( l );
    let neighbor = {
      index: null,
      dist: this.const.n + this.const.m
    };

    for( let i = 0; i < this.table.neighbors.length; i++ ){
      let grid = nearest.grid.copy();
      grid.add( this.table.neighbors[i] );

      if( this.check_way( grid ) == 2 ){
        let d = spreader.dist( this.table.neighbors[i] );

        if( neighbor.dist > d )
          neighbor = {
            index: i,
            dist: d
          }
      }
    }

    target.x = Math.round( target.x );
    target.y = Math.round( target.y );

    let grid = nearest.grid.copy();
    grid.add( this.table.neighbors[neighbor.index] )
    let water_content = this.array.reaches[nearest.grid.y][nearest.grid.x].var.water_content / 2;

    let obj = {
      way: neighbor.index,
      type: 3,
      in_out: 'out'
    };

    this.array.reaches[nearest.grid.y][nearest.grid.x].add_way( obj );
    this.add_nulla( neighbor.index, grid, water_content, target );
  }

  key(){
    switch ( keyCode ) {
      case 32:
        this.var.layout = ( this.var.layout + 1 ) % 3;
        break;
    }
  }

  click( offsets ){

  }

  //find the grid coordinates by index
  convert_index( index ){
    if( index == undefined )
      return null;

    let i = Math.floor( index / this.const.n );
    let j = index % this.const.m;
    return createVector( j, i );
  }

  //find the index coordinates by grid coordinates
  convert_grid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.m + vec.x;
  }

  check_way( grid ){
    let status = 0;
    let flag = this.check_border( grid );

    //border flag
    if( flag )
      status = 1;

    //unlabeled flag
    if( flag )
      flag = this.array.reaches[grid.y][grid.x].var.cluster == 0;

    //deadlock flag
    if( flag )
      status = 2;

    return status;
  }

  check_border( grid ){
    let flag = ( grid.x >= this.const.m ) || ( grid.x < 0 ) || ( grid.y >= this.const.n ) || ( grid.y < 0 );

    return !flag;
  }

  draw( offset ){
    offset = createVector( this.const.a, this.const.a );

    for( let reachess of this.array.reaches )
      for( let reaches of reachess )
        reaches.draw( offset, this.var.layout );
  }
}
