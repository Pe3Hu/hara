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
        tempo: FRAME_RATE  / 10,
        crank: null
      },
      swap: {
        end: Math.PI,
        clockwise: true,
        center: null,
        tempo: FRAME_RATE  / 10,
        crank: null,
        neighbor: null,
        r: null
      },
      impact: {
        begin: null,
        end: null,
        slip: null,
        direction: null,
        tempo: FRAME_RATE  / 10,
        vector: null,
        stage: 0
      },
      arc: {
        center: null,
        begin: null,
        between: null,
        tandem: null,
        center_swap: null
      },
      index: {
        task: 0
      },
      cut_frame: {
        counter: 0,
        stopper: 0
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
      transfer: false,
      cargo: false,
      last_animation: false,
      slide: false,
      stop: false
    };
    this.array = {
      vertex: [],
      track: [],
      turn: [],
      task_list: [],
      lodestar: []
    };
    this.data = {
      hive: hive,
      comb: hive.array.comb[row][col],
      couple: null
    };

    this.init();
  }

  init(){
    this.const.b = this.const.a * 0.25;
    this.const.d = this.const.a * 0.4;

    this.reset();
  }

  start(){
    this.find_promising_ripe();
    //this.add_task( 'rotate', 2 )
  }

  find_promising_ripe(){
    let hive = this.data.hive;
    let options = [];

    for( let ripe of hive.array.ripe ){
      let grid = hive.convert_index( ripe );

      if( !hive.check_corners( grid ) ){
        let comb = hive.array.comb[grid.y][grid.x];
        let traits = comb.data.honey.array.trait;

        for( let cluster of hive.array.cluster ){
          let index = cluster.array.comb.indexOf( ripe );

          if( index != -1 ){
            let combs = [];

            for( let comb of cluster.array.comb ){
               let index = hive.array.ripe.indexOf( comb );

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
      //if(  )
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

    this.array.lodestar = [];
    if( this.data.couple.top.stage == -1 )
      this.array.lodestar.push( this.data.couple.top );
    if( this.data.couple.bot.stage == -1 )
      this.array.lodestar.push( this.data.couple.bot );
  }

  move_func(){
    let hive = this.data.hive;

    if( this.array.lodestar.length > 0 && !this.flag.transfer ){
      this.flag.transfer = true;
      this.array.track = [];
      this.array.turn = [];
      this.array.task_list = [];
      let nearest = this.select_nearest_honey( this.array.lodestar );
      let lodestar = this.array.lodestar[nearest.index];
      console.log( this.array.lodestar[0], this.array.lodestar[1] )
      console.log( lodestar )

      if( lodestar.begin != lodestar.end ){
        this.go_to_nearest_honey( lodestar );
        this.get_directions( lodestar );
      }
      else{
        lodestar.start = 3;
        this.flag.transfer = false;
      }

      this.array.lodestar.splice( nearest.index, 1 );
    }
    else
      this.find_promising_ripe();
  }

  select_nearest_honey(){
    let hive = this.data.hive;
    let nearest = {
      grid: null,
      d: hive.const.m + hive.const.n
    };
    let current = createVector( this.var.col, this.var.row );

    for( let i = 0; i < this.array.lodestar.length; i++ ){
      let grid = hive.convert_index( this.array.lodestar[i] );
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

    //console.log( 'iter', iteration )
    this.turn_to( direction );

    for( let i = 0; i < Math.abs( iteration - 1 ); i++ )
      this.slide();

    if( Math.abs( iteration ) > 0 )
      this.add_task( 'swap', true );
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
    //console.log( this.array.turn )
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

  reset(){
    //
    this.var.angle.rotate = this.var.sight * Math.PI / 2;
    this.var.angle.swap = 0;

    this.var.arc.center = createVector(
      Math.sin( Math.PI / 2 - this.var.angle.rotate ) * this.const.b ,
      Math.cos( Math.PI / 2 - this.var.angle.rotate ) * this.const.b );

    this.var.arc.begin = -Math.PI / 2 + this.var.angle.rotate;

    this.var.arc.between = null;
    this.var.arc.tandem = null;
    this.var.arc.center_swap = null;

    this.var.rotate.end = null;
    this.var.rotate.clockwise = null;
    this.var.rotate.crank = null;

    this.var.impact.begin = null;
    this.var.impact.end = null;
    this.var.impact.slip = null;
    this.var.impact.direction = null;
    this.var.impact.vector = null,
    this.var.impact.stage = 0;

    this.var.swap.end = null;
    this.var.swap.crank = null;
    this.var.swap.center = null;
    this.var.swap.crank = null;
    this.var.swap.neighbor = null;
    this.var.swap.r = null;

    this.flag.reset = false;
    this.flag.swap = false;
    this.flag.rotate = false;
    this.flag.impact = false;
    this.flag.cargo = false;
    this.flag.last_animation = false;
    this.flag.slide = false;
    this.flag.transfer = false;
    this.flag.wait = true;

    this.update_tandem();
  }

  rotate(){
    let d = Math.abs( this.var.angle.rotate - this.var.rotate.end );
    //console.log( this.var.angle.rotate, this.var.rotate.end )

    if( d > Math.abs( this.var.rotate.crank ) ){
      this.var.angle.rotate += this.var.rotate.crank;
      if( this.var.angle.rotate < 0 )
        this.var.angle.rotate += Math.PI * 2;
    }
    else {
      this.var.angle.rotate = this.var.rotate.end;
      this.flag.rotate = false;
      this.flag.last_animation = true;
      this.var.sight = Math.round( this.var.angle.rotate / Math.PI * 2 );
      this.update_tandem();
    }
  }

  swap(){
    let d = Math.abs( this.var.angle.swap - this.var.swap.end );
    //console.log(this.flag.swap, d, this.var.swap.crank )

    if( d > this.var.swap.crank ){
      this.var.angle.swap += this.var.swap.crank;
      this.var.arc.center_swap = createVector(
        Math.sin( ( this.var.sight + 1 ) * Math.PI / 2 - this.var.angle.swap ) * this.var.swap.r,
        Math.cos( ( this.var.sight + 1 ) * Math.PI / 2 - this.var.angle.swap ) * this.var.swap.r );
    }
    else {
      this.flag.swap = false;
      this.flag.last_animation = true;
      this.var.angle.swap = Math.round( this.var.angle.swap / Math.PI ) * Math.PI;

      this.var.arc.center_swap = createVector(
        Math.sin( ( this.var.sight + 1 ) * Math.PI / 2 - this.var.angle.swap ) * this.var.swap.r,
        Math.cos( ( this.var.sight + 1 ) * Math.PI / 2 - this.var.angle.swap ) * this.var.swap.r );
    }
  }

  impact(){
    //
    let end = this.var.impact.end.copy();
    let d = this.var.impact.vector.dist( end );

    if( d >= this.var.impact.slip.mag() ){
      let slip = this.var.impact.slip.copy();
      slip.mult( this.var.impact.direction );
      this.var.impact.vector.add( slip );
    }
    else {
      this.var.impact.end = this.var.impact.begin.copy();
      this.var.impact.direction *= -1;
      this.var.impact.stage++;

      if(  this.var.impact.stage == 1 )
        this.flag.cargo = !this.flag.cargo;
    }

    if( this.var.impact.stage == 2 ){
      this.var.impact.vector = end;

      this.flag.impact = false;
      this.flag.wait = true;
      this.var.impact.begin = null;
      this.var.impact.end = null;
      this.var.impact.slip = null;
      this.var.impact.direction = null;
      this.var.impact.vector = null;
      this.var.impact.stage = 0;
    }
  }

  turn_to( direction ){
    let turns = direction - this.var.sight;

    if(  Math.abs( turns ) > 0 ){
      if( Math.abs( turns ) > this.const.sides / 2 )
        turns = turns - Math.sign( turns ) * this.const.sides;

      //console.log( 'truns', direction, this.var.sight, turns )
      this.add_task( 'rotate', turns );
    }
  }

  slide(){
    this.add_task( 'swap', true );
    this.add_task( 'rotate', 2 );
  }

  exchange( comb_swap ){
    //
    this.add_task( 'impact', 1 );
    this.add_task( 'swap', false );
    this.add_task( 'impact', -1 );
    this.add_task( 'exchange', comb_swap );

    if( !comb_swap )
      this.add_task( 'swap', false );

    this.add_task( 'reset' );
  }

  add_task( task, detail ){
    let error = false;

    if( task == 'swap' && this.data.tandem != null ){
      if( detail == true && this.var.sight % 2 == 0 ){
        error = true;
        console.log( 'slide_error' )
      }

      if( this.data.tandem.flag.anchor == true ){
        error = true;
        console.log( 'anchor_error' )
      }
    }

    if( !error ){
      this.array.task_list.push( new basic_operation( this.var.index.task, task, detail, this ) );
      this.var.index.task++;
    }
  }

  check_ripe(){
    if( this.data.couple != null ){
      if( this.data.couple.top.begin == this.data.couple.top.end )
        this.data.couple.top.stage = 3;
      if( this.data.couple.bot.begin == this.data.couple.bot.end )
        this.data.couple.bot.stage = 3;

      if( this.data.couple.bot.stage == 3 && this.data.couple.top.stage == 3 ){

        this.data.hive.check_ripes();
        this.data.couple = null;
      }
    }
  }

  update(){
    if( this.flag.last_animation && this.flag.slide || this.flag.reset )
      this.flag.stop = true;

    if( this.flag.stop )
      if( this.var.cut_frame.counter < this.var.cut_frame.stopper )
        this.var.cut_frame.counter++;
      else {
        this.var.cut_frame.counter = 0;
        this.flag.stop = false;
      }

    if( this.flag.reset )
      this.reset();
    if( this.flag.rotate )
      this.rotate();
    if( this.flag.swap )
      this.swap();
    if( this.flag.impact )
      this.impact();

    this.update_arc();

    if( this.flag.wait )
      if( this.array.task_list.length > 0 ){
        this.array.task_list[0].execute();
        this.array.task_list.splice( 0, 1 );
      }
      else
        if( this.array.turn.length > 0 )
          this.add_task( 'trace' );
        else{
          this.flag.transfer = false;

          if( this.data.hive.flag.full ){
            this.check_ripe();
            this.move_func();
          }
        }
  }

  update_arc(){
    if( !this.flag.wait || this.flag.last_animation ){
      this.var.arc.center = createVector(
        Math.sin( Math.PI / 2 - this.var.angle.rotate ) * this.const.b ,
        Math.cos( Math.PI / 2 - this.var.angle.rotate ) * this.const.b );

      this.var.arc.begin = -Math.PI / 2 + this.var.angle.rotate + this.var.angle.swap;
      /*if( this.var.sight % 2 == 0 )
        this.var.arc.begin += Math.PI;*/

      if( this.var.arc.center_swap != null ){
        this.var.arc.center = this.var.arc.between.copy();
        let swap = this.var.arc.center_swap.copy();
        let parity = this.var.sight % 2;
        if( parity == 0)
          parity = -1;

        swap.mult( parity )
        this.var.arc.center.add( swap );
      }

      if( this.flag.impact )
        this.var.arc.center.add( this.var.impact.vector );

      if( this.var.arc.between != null ){
        let tandem_mirror = this.var.arc.between.copy();
        tandem_mirror.sub( this.var.arc.center );
        tandem_mirror.mult( 2 );
        this.var.arc.tandem = this.var.arc.center.copy();
        this.var.arc.tandem.add( tandem_mirror );
      }

      if( this.flag.cargo ){
        this.data.comb.data.honey.var.impact = this.var.arc.center.copy();
        this.data.tandem.data.honey.var.impact = this.var.arc.tandem.copy();
        this.data.tandem.data.honey.var.impact.add( this.data.comb.const.center );
      }

      if( Math.abs( this.var.angle.rotate ) > Math.PI * 2 )
        this.var.angle.rotate = Math.sign( this.var.angle.rotate ) * ( Math.abs( this.var.angle.rotate ) - Math.PI * 2 );

      if( this.flag.last_animation ){
        if( this.flag.slide ){
          this.var.sight = ( this.var.sight + this.const.sides / 2 ) % this.const.sides;
          this.var.col = this.var.swap.tandem.x;
          this.var.row = this.var.swap.tandem.y;
          this.data.comb = this.data.hive.array.comb[this.var.row][this.var.col];

          this.reset();
        }
        else{
          this.flag.wait = true;
          this.flag.last_animation = false;
        }
      }
    }
  }

  update_tandem(){
    this.update_arc();
    let hive = this.data.hive;
    let neighbor = hive.array.neighbor[this.var.sight].copy();
    let d = 2 * Math.abs( this.const.a / 2 - this.const.b );
    let shift = createVector( neighbor.x * d, neighbor.y * d );
    neighbor.x += this.var.col;
    neighbor.y += this.var.row;

    if( hive.check_border( neighbor ) ){
      this.var.swap.tandem = neighbor.copy();
      this.var.arc.tandem = createVector( this.var.arc.center.x + shift.x, this.var.arc.center.y + shift.y );
      this.data.tandem = hive.array.comb[neighbor.y][neighbor.x];
      this.var.arc.between = createVector(
        ( this.var.arc.center.x + this.var.arc.tandem.x ) / 2,
        ( this.var.arc.center.y + this.var.arc.tandem.y ) / 2 );
    }
    else
      this.var.arc.tandem = null;
  }

  arc_check( vec ){
    let arc = this.data.comb.const.center.copy();
    arc.sub( vec );
    let d = arc.dist( this.var.arc.center );
    return d > this.data.hive.const.a;
  }

  draw_tandem( vec ){
    if( ( this.flag.wait || this.flag.rotate || this.flag.swap || this.flag.impact || this.flag.last_animation ) &&
      !this.arc_check( vec ) ){
      let hive = this.data.hive;
      let weight = 0.5;
      stroke( 0 );
      strokeWeight( weight );
      fill( 0 );
      arc( this.var.arc.center.x + vec.x, this.var.arc.center.y + vec.y,
          this.const.d, this.const.d, this.var.arc.begin, this.var.arc.begin + Math.PI, CHORD );

      stroke( 360 );
      fill( 360 );
      if( !this.flag.rotate && this.var.arc.tandem != null )
        arc( this.var.arc.tandem.x + vec.x, this.var.arc.tandem.y + vec.y,
            this.const.d, this.const.d, this.var.arc.begin + Math.PI, this.var.arc.begin, CHORD );
    }

  }

  draw( offset ){
    let vec = offset.copy();
    vec.add( this.data.comb.const.center );

    if( !this.flag.error )
      this.update( vec );

    if( !this.flag.stop )
      this.draw_tandem( vec );

    noFill();
    stroke( 360 );
    strokeWeight( 6 );
    ellipse( this.data.comb.const.center.x, this.data.comb.const.center.y, 27, 27  )
    //console.log( this.flag.impact )
  }
}
