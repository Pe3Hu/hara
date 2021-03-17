//
class drone_v2 {
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
        tempo: FRAME_RATE / hive.const.tempo,
        crank: null
      },
      swap: {
        end: Math.PI,
        clockwise: true,
        center: null,
        tempo: FRAME_RATE / hive.const.tempo,
        crank: null,
        neighbor: null,
        r: null
      },
      impact: {
        begin: null,
        end: null,
        slip: null,
        direction: null,
        tempo: FRAME_RATE / hive.const.tempo,
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
        stopper: 1
      },
      trait: {
        origin: null
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
      stop: false,
      enegry: false
    };
    this.array = {
      vertex: [],
      track: [],
      turn: [],
      task_list: [],
      lodestar: [],
      ripe_trait: [],
      act: []
    };
    this.data = {
      hive: hive,
      comb: hive.array.comb[row][col],
      set: null,
      cargo: null
    };

    this.init();
  }

  init(){
    //
    this.const.b = this.const.a * 0.25;
    this.const.d = this.const.a * 0.4;

    this.reset();
  }

  find_cargo(){
    let hive = this.data.hive;
    let options = [];
    //console.log( '_0', hive.array.cluster )

    for( let ripe of hive.array.ripe ){
      let ripe_grid = hive.convert_index( ripe );

      if( !hive.check_corners( ripe_grid ) ){
        let ripe_comb = hive.array.comb[ripe_grid.y][ripe_grid.x];
        let traits = ripe_comb.data.honey.array.trait;
        //console.log(traits[0].name, traits[1].name  )

        for( let cluster of hive.array.cluster ){
          let ripe_index = cluster.array.comb.indexOf( ripe );

          if( ripe_index != -1 ){
            let combs = [];

            for( let comb of cluster.array.comb ){
               let comb_index = hive.array.ripe.indexOf( comb );

               if( comb_index == -1 )
                 combs.push( comb );
            }

            if( combs.length > 1 )
              options.push( {
                ripe: ripe,
                traits: cluster.array.trait,
                destinations: [
                  ripe - this.data.hive.const.m,
                  ripe + this.data.hive.const.m ],
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
    //console.log(hive.array.ripe )
    //console.log( '_1',options )
    /*

    let comb_grid = hive.convert_index( comb );
    let trait_neighbor = Math.abs( ripe_grid.y - comb_grid.y );

    if( index == -1 && trait_neighbor != - 1 )
    */

    let min_distances = [];

    for( let option of options ){
      let distances = [];

      for( let i = option.destinations.length - 1; i > -1; i-- ){
        let ds = [];
        let destination = option.destinations[i];
        let destination_grid = hive.convert_index( destination );
        let destination_traits = hive.array.comb[destination_grid.y][destination_grid.x].data.honey.array.trait;

        let trait_flag = false;

        for( let ripe_trait of option.traits ){
          let index = destination_traits.indexOf( ripe_trait );

          if( index != -1 )
            trait_flag = true;
        }

        if( !trait_flag ){
          for( let comb of option.combs ){
            let challenger_grid = hive.convert_index( comb );
            let y = Math.abs( destination_grid.y - challenger_grid.y );
            let x = 1;
            if( destination_grid.x % 2 == challenger_grid.x % 2 )
              x = 2;
            let d = x + y;

            if( destination_grid.x == challenger_grid.x ){
              if( destination_grid.y == challenger_grid.y )
                d = 0;

              //checking the use of honey already near the ripe
              let ripe_y = ( destination_grid.y + challenger_grid.y ) / 2;
              let ripe_grid = hive.convert_index( option.ripe );

              if( ripe_y == ripe_grid.y )
                d = hive.const.n + hive.const.m;
            }

            ds.push( d );
          }

          distances.push( ds );
        }
        else{
          option.destinations.splice( i, 1 );
        }
      }

      min_distances.push( {
        distances: distances,
        departures: option.combs,
        destinations: option.destinations,
        traits: option.traits
      } );
    }

    let all_sets = [];
    //console.log( '_2', min_distances  )

    for( let min_distance of min_distances ){
      let sets = [];
      let l = min_distance.distances[0].length;
      let max = Math.pow( l, min_distance.distances.length );
      let counter = 0;
      if( min_distance.distances.length > 1 )
        counter = 1;

      while( counter < max ){
        let set = [];
        let index = counter;

        for( let i = 0; i < min_distance.distances.length; i++ )
          set.push( 0 );

        let digit = min_distance.distances.length - 1;

        while( index > 0 ){
          let value = index % l;
          let value_index = set.indexOf( value );
          let flag_add = false;

          if( value_index == - 1 ){
            //check for uniqueness
            /*let ascending_flag = true;
            let min = value;

            for( let i = digit + 1; i < min_distance.distances.length; i++ )
              min = Math.min( set[i], value );

            if( min == value ){*/
              set[digit] = value;
              index = Math.floor( index / l );
              digit--;
              flag_add = true;
            /*}
            else
              flag_add = false;*/
          }
          else
            flag_add = false;

          if( !flag_add ){
            index = 0;
            set = [];
          }
        }

        if( set.length > 0 )
          sets.push( {
            distances: min_distance.distances,
            departures: min_distance.departures,
            destinations: min_distance.destinations,
            traits: min_distance.traits,
            set: set,
            sum: 0 } );

        counter++;
      }

      all_sets.push( sets );
    }

    for( let sets of all_sets )
      for( let set of sets )
        for( let i = 0; i < set.set.length; i++ )
          set.sum += set.distances[set.set.length - 1 -i][set.set[i]];


    for( let sets of all_sets )
      sets = hive.bubble_sort( sets, 'sum' );

    //console.log( '_3', all_sets )

    let min_sum = all_sets[0][0].sum;

    for( let i = 0; i < all_sets.length; i++ )
      if( all_sets[i][0].sum < min_sum )
        min_sum = all_sets[i][0].sum;

    let nearest_sets = [];

    for( let i = 0; i < all_sets.length; i++ )
      for( let sets of all_sets[i] )
        if( sets.sum == min_sum ){
          let departures = [];

          for( let j = 0; j < sets.set.length; j++ )
            departures.push( sets.departures[sets.set[j]] );

          nearest_sets.push( {
            traits: sets.traits,
            set: sets.set,
            departures: departures,
            destinations: sets.destinations } );
        }

    let dists = [];
    let closest_to_drone = [];
    let min_dist = hive.const.m + hive.const.n;
    let drone_grid = createVector( this.var.col, this.var.row );
    //console.log( '_4',nearest_sets  )

    for( let nearest_set of nearest_sets ){
      let ds = [];

      for( let departure of nearest_set.departures ){
        let departure_grid = hive.convert_index( departure );
        let x = Math.abs( departure_grid.x - drone_grid.x );
        let y = Math.abs( departure_grid.y - drone_grid.y );
        let dist = x + y;

        if( dist < min_dist )
          min_dist = dist;

        ds.push( dist );
      }

      dists.push( ds );
    }
    //console.log( '_5',min_dist  )

    for( let i = 0; i < dists.length; i++ )
      for( let j = 0; j < dists[i].length; j++ )
        if( dists[i][j] == min_dist )
          closest_to_drone.push( {
            traits: nearest_sets[i].traits,
            set: nearest_sets[i].set,
            departure:  nearest_sets[i].departures[j],
            destination: nearest_sets[i].destinations[j]
          } );



    let rand = Math.floor( Math.random() * closest_to_drone.length );
    this.data.cargo = closest_to_drone[rand];
    let departure_grid = hive.convert_index( this.data.cargo.departure );
    let honey = hive.array.comb[departure_grid.y][departure_grid.x].data.honey;
    this.data.cargo.honey = honey.const.index;
    this.data.cargo.stage = -1;

    let trait_match = false;

    for( let trait of honey.array.trait ){
      let index = this.data.cargo.traits.indexOf( trait );

      if( index != - 1)
        trait_match = true;
    }

    if( trait_match )
      this.detect_cargo_stage();
    else{
      this.flag.error = true;
      console.log( 'cargo trait error' )
    }
    console.log( this.data.cargo )
  }

  detect_cargo_stage(){
    let hive = this.data.hive;
    let stage = -1;
    let departure = hive.convert_index( this.data.cargo.departure );
    let destination = hive.convert_index( this.data.cargo.destination );
    //console.log( this.data.comb.data.honey.const.index, this.data.cargo.honey )
    if( this.data.comb.data.honey.const.index != this.data.cargo.honey ){
      stage = 0;

      if( departure.y == this.var.row )
        stage = 1;
    }
    else {
      stage = 2;

      if( destination.y == this.var.row )
        stage = 3;
    }


    if( hive.array.comb[destination.y][destination.x].data.honey.const.index == this.data.cargo.honey )
      stage = 4;

    if( stage >  this.data.cargo.stage )
     this.data.cargo.stage = stage;
  }

  play_it_by_ear(){
    let hive = this.data.hive;
    let direction = null;
    let sign = null;
    this.detect_cargo_stage();


    switch( this.data.cargo.stage ) {
      case 0:
        sign = Math.sign( this.data.cargo.departure - this.data.comb.const.index );

        if(  sign > 0 )
          direction = 1;
        if(  sign < 0 )
          direction = 3;
        break;
      case 1:
        sign = Math.sign( this.data.cargo.departure - this.data.comb.const.index );
        direction = null;

        if(  sign > 0 )
          direction = 0;
        if(  sign < 0 )
          direction = 2;
        break;
      case 2:
        sign = Math.sign( this.data.cargo.destination - this.data.comb.const.index );
        direction = null;

        if(  sign > 0 )
          direction = 1;
        if(  sign < 0 )
          direction = 3;
        break;
      case 3:
        sign = Math.sign( this.data.cargo.destination - this.data.comb.const.index );
        direction = null;

        if(  sign > 0 )
          direction = 0;
        if(  sign < 0 )
          direction = 2;
        break;
    }

    if( this.data.cargo.stage < 4 )
      this.turn_to( direction );

    switch( this.data.cargo.stage ) {
      case 0:
        this.add_task( 'swap' );
        break;
      case 1:
      case 2:
      case 3:
        this.add_task( 'impact', 1 );
        this.add_task( 'exchange_begin' );
        this.add_task( 'impact', -1 );
        this.add_task( 'swap' );
        this.add_task( 'impact', -2 );
        this.add_task( 'exchange_end' );
        this.add_task( 'impact', 2 );
        break;
    }

    if( this.data.cargo.stage == 0 || this.data.cargo.stage == 2 )
      this.add_task( 'slide' );

    if( this.data.cargo.stage == 1 || this.data.cargo.stage == 3 )
      this.add_task( 'swap' );

    this.add_task( 'reset' );
  }

  turn_to( direction ){
    let turns = direction - this.var.sight;

    if(  Math.abs( turns ) > 0 ){
      if( Math.abs( turns ) > this.const.sides / 2 )
        turns = turns - Math.sign( turns ) * this.const.sides;

      this.add_task( 'rotate', turns );
    }
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

  reset(){
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
    this.var.impact.vector = createVector(),
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
      this.flag.impact = false;
      this.flag.last_animation = true;
      this.var.impact.begin = null;
      this.var.impact.end = null;
      this.var.impact.slip = null;
      this.var.impact.direction = null;
    }
  }

  update(){
    let hive = this.data.hive;

    if( hive.flag.full && this.flag.enegry && !this.flag.error){
      if( this.data.cargo == null ){
        //console.log( 'find cargo' )
        hive.update_clusters();
        this.find_cargo();
        this.play_it_by_ear();
        return;
      }

      if( this.flag.last_animation && this.flag.slide )
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

      if( this.flag.slide ){
        this.var.sight = ( this.var.sight + this.const.sides / 2 ) % this.const.sides;
        this.var.col = this.var.swap.tandem.x;
        this.var.row = this.var.swap.tandem.y;
        this.data.comb = hive.array.comb[this.var.row][this.var.col];
        this.reset();
      }

      if( this.flag.wait )
        if( this.array.task_list.length > 0 ){
          this.array.task_list[0].execute();
          this.array.task_list.splice( 0, 1 );
        }
        else{
          this.play_it_by_ear();
        }

      if( this.data.cargo.stage == 4 ){
        //hive.array.ripe
        //this.find_cargo();
        hive.check_ripes();
        this.data.cargo = null;
      }


      this.update_arc();
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

      this.var.arc.center.add( this.var.impact.vector );

      if( this.var.arc.between != null ){
        let tandem_mirror = this.var.arc.between.copy();
        tandem_mirror.sub( this.var.arc.center );
        tandem_mirror.mult( 2 );
        this.var.arc.tandem = this.var.arc.center.copy();
        this.var.arc.tandem.add( tandem_mirror );
      }

      if( this.flag.exchange ){
        this.data.comb.data.honey.var.impact = this.var.arc.center.copy();
        this.data.comb.data.honey.var.impact.add( this.data.comb.const.center );
        this.data.tandem.data.honey.var.impact = this.var.arc.tandem.copy();
        this.data.tandem.data.honey.var.impact.add( this.data.comb.const.center );
      }

      if( this.flag.last_animation ){
        this.flag.wait = true;
        this.flag.last_animation = false;
      }

      if( Math.abs( this.var.angle.rotate ) > Math.PI * 2 )
        this.var.angle.rotate = Math.sign( this.var.angle.rotate ) * ( Math.abs( this.var.angle.rotate ) - Math.PI * 2 );
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

    if( !this.flag.stop )
      this.draw_tandem( vec );

    noFill();
    stroke( 360 );
    strokeWeight( 6 );
    ellipse( this.data.comb.const.center.x, this.data.comb.const.center.y, 27, 27  )
  }
}
