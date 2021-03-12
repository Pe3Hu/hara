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
      sight: sight,
      angle: {
        rotate: sight * Math.PI / 2,
        swap: 0
      },
      rotate: {
        end: null,
        clockwise: null,
        tempo: FRAME_RATE,
        crank: null
      },
      swap: {
        end: Math.PI,
        clockwise: true,
        center: null,
        tempo: FRAME_RATE,
        crank: null,
        neighbor: null,
        r: null
      },
      impact:{
        begin: null,
        end: null,
        slip: null,
        direction: 1,
        tempo: FRAME_RATE,
        vector: null,
        stage: 0
      },
      arc: {
        center: null,
        between: null,
        tandem: null
      },
      index: {
        task: 0
      }
    };
    this.flag = {
      left: false,
      right: false,
      wait: true,
      rotate: false,
      swap: false,
      reset: false,
      impact: false,
      transfer: false
    };
    this.array = {
      vertex: [],
      ripe: [],
      track: [],
      turn: [],
      task_list: []
    };
    this.data = {
      hive: hive,
      comb: hive.array.comb[row][col],
      couple: null
    };

    this.init();
  }

  init(){
    this.reset();
    //this.set_rotate( -1 );
    //this.set_swap();
    //this.set_impulse();
  }

  set_rotate( turns ){
    if( this.flag.wait ){
      this.flag.rotate = true;
      this.flag.wait = false;
      this.var.rotate.clockwise = Math.sign( turns );

      this.var.rotate.crank = this.var.rotate.clockwise * Math.PI / 2 / this.var.rotate.tempo;
      this.var.rotate.end = ( this.var.sight + turns + this.const.sides ) % this.const.sides * Math.PI / 2;
    }
  }

  set_swap(){
    if( this.flag.wait && this.var.arc.tandem != null ){
      this.var.angle.swap = 0;
      this.flag.swap = true;
      this.flag.wait = false;
      this.var.swap.crank = this.var.swap.clockwise * Math.PI / 2 / this.var.swap.tempo;
      this.var.swap.r = Math.abs( this.var.arc.center.x - this.var.arc.tandem.x ) / 2 + Math.abs( this.var.arc.center.y - this.var.arc.tandem.y ) / 2;
    }
  }

  set_impulse(){
    if( this.flag.wait && this.var.arc.tandem != null ){
      this.flag.impact = true;
      this.var.impact.slip = createVector();
      this.var.impact.slip.sub( this.var.arc.center );
      this.var.impact.end = this.var.impact.slip.copy();
      this.var.impact.slip.div( this.var.impact.tempo );
      this.var.impact.begin = createVector();
      this.var.impact.vector = createVector();
    }
  }

  find_promising_ripe(){
    let hive = this.data.hive;
    let options = [];

    for( let ripe of this.array.ripe ){
      let grid = hive.convert_index( ripe );

      if( !hive.check_corners( grid ) ){
        let comb = hive.array.comb[grid.y][grid.x];
        let traits = comb.data.honey.array.trait;

        for( let cluster of hive.array.cluster ){
          let index = cluster.array.comb.indexOf( ripe );

          if( index != -1 ){
            let combs = [];

            for( let comb of cluster.array.comb ){
               let index = this.array.ripe.indexOf( comb );

               if( index == -1 )
                 combs.push( comb );
            }

            combs.splice( index, 1 );

            if( combs.length > 1 )
              options.push( {
                ripe: ripe,
                top: ripe - this.data.hive.const.m,
                bot: ripe + this.data.hive.const.m,
                combs: combs
              } );
          }
        }
      }
    }

    if( options.length == 0 ){
      console.log( 'empty options' )
      return;
    }

    let min_distances = [];

    for( let option of options ){
      let top_grid = hive.convert_index( option.top );
      let bot_grid = hive.convert_index( option.bot );
      let neighbors = [ top_grid, bot_grid ];
      let distances = [];

      for( let neighbor of neighbors ){
        let ds = [];

        for( let comb of option.combs ){
          let challenger_grid = hive.convert_index( comb );

            //let d = Math.abs( ripe_grid.x - challenger_grid.x ) + Math.abs( ripe_grid.y - challenger_grid.y );
            let y = Math.abs( neighbor.y - challenger_grid.y );
            let x = 1;
            if( neighbor.x % 2 == challenger_grid.x % 2 )
              x = 2;
            let d = x + y;

            if( neighbor.x == challenger_grid.x && neighbor.y== challenger_grid.y )
              d = 0;

            ds.push( d );
          }

          distances.push( ds );
        }

      min_distances.push( distances );
    }

    let all_couples = [];

    for( let top_bots of min_distances ){
      let couples = [];
      let tops = top_bots[0];
      let bots = top_bots[1];

      for( let i = 0; i < tops.length; i++ )
        for( let j = 0; j < bots.length; j++ )
          if( i != j )
          couples.push( {
            'top': i,
            'bot': j,
            'sum': tops[i] + bots[j]
          } );

      all_couples.push( couples );
    }

    for( let couples of all_couples )
      couples = hive.bubble_sort( couples, 'sum' );

    let min_sum = all_couples[0][0].sum;

    for( let i = 0; i < all_couples.length; i++ )
      if( all_couples[i][0].sum < min_sum )
        min_sum = all_couples[i][0].sum;

    let nearest_couples = [];

    for( let i = 0; i < all_couples.length; i++ )
      for( let couple of all_couples[i] )
        if( couple.sum == min_sum )
          nearest_couples.push( {
            trait: i,
            ripe: options[i].ripe,
            top: {
              begin: options[i].combs[couple.top],
              end: options[i].top,
              stage: -1
            },
            bot: {
              begin: options[i].combs[couple.bot],
              end: options[i].bot,
              stage: -1
            }
          } );


    let rand = Math.floor( Math.random() * nearest_couples.length );
    this.data.couple = nearest_couples[rand];
    this.move_func();
  }

  move_func(){
    let hive = this.data.hive;
    let lodestars = [];
    if( this.data.couple.top.stage == -1 )
      lodestars.push( this.data.couple.top );
    if( this.data.couple.bot.stage == -1 )
      lodestars.push( this.data.couple.bot );

    while( lodestars.length > 0 && !this.flag.transfer ){
      this.flag.transfer = true;
      this.array.track = [];
      this.array.turn = [];
      this.array.task_list = [];
      let nearest = this.select_nearest_honey( lodestars );
      let lodestar = lodestars[nearest.index];
      console.log( lodestar  )

      if( lodestar.begin != lodestar.end ){
        this.go_to_nearest_honey( lodestar );
        this.get_directions( lodestar );
      }

      lodestars.splice( nearest.index, 1 );

      console.log( this.array.task_list )
    }

  }

  select_nearest_honey( lodestars ){
    let hive = this.data.hive;
    let nearest = {
      grid: null,
      d: hive.const.m + hive.const.n
    };
    let current = createVector( this.var.col, this.var.row );

    for( let i = 0; i < lodestars.length; i++ ){
      let grid = hive.convert_index( lodestars[i] );
      let d = current.dist( grid );

      if( d < nearest.d )
        nearest = {
          index: i,
          d: d
        };
    }

    return nearest;
  }

  go_to_nearest_honey( lodestar ){
    let hive = this.data.hive;
    let grid = hive.convert_index(  lodestar.begin  )
    let iteration = grid.y - this.var.row;
    /*console.log( slides, lodestar.begin )
    console.log( this.var.col, this.var.row, grid.x, grid.y )*/
    let direction = null;

    if( iteration > 0 )
      direction = 1;
    if( iteration < 0 )
      direction = 3;

    console.log( 'iter', iteration )
    this.turn_to( direction );

    for( let i = 0; i < Math.abs( iteration ); i++ )
      this.add_task( 'slide', false );
  }

  get_directions( obj ){
    //
    let hive = this.data.hive;
    let indexs = [ obj.begin, obj.end ];
    let grids = [ hive.convert_index( obj.begin ), hive.convert_index( obj.end ) ];
    let finish = 3;
    let counter = 0;
    this.array.track.push( grids[0].copy() );
    obj.stage = this.detect_stage( grids[0], grids[1] );

    while( obj.stage < finish && counter < 10 ){
      this.transfer_honey( grids[1], obj.stage );
      obj.stage = this.detect_stage( this.array.track[this.array.track.length - 1], grids[1] );
      counter++;
    }
    console.log( this.array.track, this.array.turn )

    this.trace();
  }

  detect_stage( current, end ){
    let stage = 0;

    //console.log( this.var.col == current.x, current.x == end.x, current.y == end.y )
    //console.log( this.var.col,  current.x, end.x, current.y,  end.y )

    if( current.x == this.var.col && current.y != end.y )
      stage = 1;
    if( current.x == this.var.col && current.y == end.y )
      stage = 2;
    if( current.x == end.x && current.y == end.y )
      stage = 3;

    //console.log( 'stage', stage )

    return stage;
  }

  transfer_honey( end, stage ){
    let hive = this.data.hive;
    let current = this.array.track[this.array.track.length - 1].copy();
    let next = {
      direction: null,
      grid: null,
      d: hive.const.m + hive.const.n
    };
    let parity = 0;
    if( stage == 1 )
      parity = 1;
    console.log( stage, parity )
    let target = end.copy();
    target.x = ( target.x + this.var.col ) / 2;

    for( let i = parity; i < hive.array.neighbor.length; i += 2 ){
      let grid = current.copy();
      grid.add( hive.array.neighbor[i] );
      let d = grid.dist( target );

      if( d < next.d )
        next = {
          direction: i,
          grid: grid,
          d: d
        };
    }

    this.array.track.push( next.grid );
    this.array.turn.push( {
      direction: next.direction,
      stage: stage
    } );
  }

  trace(){
    for( let turn of this.array.turn ){
      let direction = turn.direction;
      if( turn.stage == 0 )
        direction = this.const.sides - direction;

      console.log( this.const.sides, direction)
      this.turn_to( direction );
      this.add_task( 'exchange', null );
    }

    this.flag.transfer = false;
    /**/
  }

  reset(){
    //
    this.var.arc.center = createVector(
      Math.sin( Math.PI / 2 - this.var.angle.rotate ) * this.const.a,
      Math.cos( Math.PI / 2 - this.var.angle.rotate ) * this.const.a );

    this.var.arc.begin = -Math.PI / 2 + this.var.angle.rotate;
    this.var.arc.end = Math.PI / 2 + this.var.angle.rotate;

    let hive = this.data.hive;
    let neighbor = hive.array.neighbor[this.var.sight].copy();
    let d = 2 * Math.abs( hive.const.a / 2 - this.const.a );
    let shift = createVector( neighbor.x * d, neighbor.y * d );
    neighbor.x += this.var.col;
    neighbor.y += this.var.row;

    if( hive.check_border( neighbor ) ){
      this.var.swap.tandem = neighbor.copy();
      this.var.arc.tandem = createVector( this.var.arc.center.x + shift.x, this.var.arc.center.y + shift.y );
      this.var.arc.between = createVector(
        ( this.var.arc.center.x + this.var.arc.tandem.x ) / 2,
        ( this.var.arc.center.y + this.var.arc.tandem.y ) / 2 );
    }

    this.flag.swap = false;
    this.flag.rotate = false;
    this.flag.reset = false;
    this.flag.wait = true;
  }

  rotate(){
    let d = Math.abs( this.var.angle.rotate - this.var.rotate.end );

    if( d > Math.abs( this.var.rotate.crank ) ){
      this.var.angle.rotate += this.var.rotate.crank;
      if( this.var.angle.rotate < 0 )
        this.var.angle.rotate += Math.PI * 2;
    }
    else {
      this.var.angle.rotate = this.var.rotate.end;
      this.flag.rotate = false;
      this.flag.reset = true;
    }

    this.var.sight = Math.floor( this.var.angle.rotate / Math.PI * 2 );
  }

  swap(){
    let d = Math.abs( this.var.angle.swap - this.var.swap.end );

    if( d > this.var.swap.crank )
      this.var.angle.swap += this.var.swap.crank;
    else {
      this.var.col = this.var.swap.tandem.x;
      this.var.row = this.var.swap.tandem.y;
      this.data.comb = this.data.hive.array.comb[this.var.row][this.var.col];
      this.var.sight = ( this.var.sight + this.const.sides / 2 ) % this.const.sides;
      this.var.angle.rotate = this.var.sight * Math.PI / 2;
      this.var.angle.swap = 0;
      this.flag.swap = false;
      this.flag.reset = true;
    }
  }

  impact(){
    let d = this.var.impact.vector.dist( this.var.impact.end );

    if( d > this.var.impact.slip.mag() ){
      let slip = this.var.impact.slip.copy();
      slip.mult( this.var.impact.direction )
      this.var.impact.vector.add( slip );
    }
    else {
      this.var.impact.end = this.var.impact.begin.copy();
      this.var.impact.direction *= -1;
      this.var.impact.stage++;
    }

    if( this.var.impact.stage == 2 ){
      this.flag.impact = false;
      this.flag.reset = true;
    }
  }

  turn_to( direction ){
    let turns = direction - this.var.sight;
    console.log( 'truns', direction, turns )

    if(  Math.abs( turns ) > 0 ){
      if( Math.abs( turns ) > this.const.sides / 2 )
        turns = turns - Math.sign( turns ) * this.const.sides;

      this.add_task( 'rotate', turns );
    }
  }

  exchange(){

  }

  add_task( task, detail ){
    this.array.task_list.push( new basic_operation( this.var.index.task, task, detail ) );
    this.var.index.task++;
  }

  update(){
    this.update_arc();

    if( this.flag.reset )
      this.reset();
    if( this.flag.rotate )
      this.rotate();
    if( this.flag.swap )
      this.swap();
    if( this.flag.impact )
      this.impact();
  }

  update_arc(){
    this.var.arc.center = createVector(
      Math.sin( Math.PI / 2 - this.var.angle.rotate ) * this.const.a,
      Math.cos( Math.PI / 2 - this.var.angle.rotate ) * this.const.a );

    this.var.arc.begin = -Math.PI / 2 + this.var.angle.rotate + this.var.angle.swap;
    this.var.arc.end = Math.PI / 2 + this.var.angle.rotate + this.var.angle.swap;

    if( this.flag.swap ){
      this.var.arc.center = this.var.arc.between.copy();

      let center_swap = createVector(
        Math.sin( Math.PI - this.var.angle.swap ) * this.var.swap.r,
        Math.cos( Math.PI - this.var.angle.swap ) * this.var.swap.r );

      this.var.arc.center.add( center_swap );
    }

    if( this.flag.impact )
      this.var.arc.center.add( this.var.impact.vector );

    let tandem_mirror = this.var.arc.between.copy();
    tandem_mirror.sub( this.var.arc.center );
    tandem_mirror.mult( 2 );

    this.var.arc.tandem = this.var.arc.center.copy();
    this.var.arc.tandem.add( tandem_mirror );

    if( Math.abs( this.var.angle.rotate ) > Math.PI * 2 )
      this.var.angle.rotate = Math.sign( this.var.angle.rotate ) * ( Math.abs( this.var.angle.rotate ) - Math.PI * 2 );
  }

  draw_tandem( vec ){
    let hive = this.data.hive;
    let weight = 0.5;
    stroke( 0 );
    strokeWeight( weight );
    fill( 0 )
    arc( this.var.arc.center.x + vec.x, this.var.arc.center.y + vec.y,
        this.const.a, this.const.a, this.var.arc.begin, this.var.arc.end, CHORD );

    stroke( 360 );
    fill( 360 )
    if( ( this.flag.wait || this.flag.swap ) && this.var.arc.tandem != null )
      arc( this.var.arc.tandem.x + vec.x, this.var.arc.tandem.y + vec.y,
          this.const.a, this.const.a, this.var.arc.begin + Math.PI, this.var.arc.end + Math.PI, CHORD );
  }

  draw( offset ){
    let vec = offset.copy();
    vec.add( this.data.comb.const.center );

    this.update( vec );
    this.draw_tandem( vec );
    //console.log( this.flag.impact )
  }
}
