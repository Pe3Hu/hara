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
      }
    };
    this.flag = {
      left: false,
      right: false,
      wait: true,
      rotate: false,
      swap: false,
      reset: false,
      impact: false

    };
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

  init(){
    this.reset();
    //this.set_rotate( 1, true );
    //this.set_swap();
    this.set_impulse();
  }

  set_rotate( turns, clockwise ){
    if( this.flag.wait ){
      this.flag.rotate = true;
      this.flag.wait = false;

      if( clockwise )
        this.var.rotate.clockwise = 1;
      else
        this.var.rotate.clockwise = -1;

      this.var.rotate.crank = this.var.rotate.clockwise * Math.PI / 2 / this.var.rotate.tempo;
      this.var.rotate.end = ( this.var.sight + this.var.rotate.clockwise * turns ) % 4 * Math.PI / 2;
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
            top: options[i].combs[couple.top],
            bot: options[i].combs[couple.bot],
          } );


    let rand = Math.floor( Math.random() * nearest_couples.length );
    let result = nearest_couples[rand];
    return result;
  }

  check_corners( grid ){
    let x = grid.x == 0 || grid.x == this.data.hive.const.m - 1;
    let y = grid.y == 0 || grid.y == this.data.hive.const.n - 1;
    return x && y;

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

    if( d > this.var.rotate.crank )
      this.var.angle.rotate += this.var.rotate.crank;
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
