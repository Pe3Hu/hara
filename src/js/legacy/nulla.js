//
class nulla {
  constructor ( index, input, grid, water_content, target, weather ){
    this.const = {
      index: index,
      cluster: -( index + 1 )
    };
    this.var = {
      current: {
        input: input,
        grid: grid
      },
      water_content: water_content
    };
    this.array = {
      track: []
    }
    this.flag = {
      //0 - border check failed
      //1 - collison check failde
      //2 - keep flowing
      stop: 2
    }
    this.data = {
      headwaters: {
        input: input,
        grid: grid
      },
      target: target,
      weather: weather
    };

    this.init();
  }

  init_flow(){
    if( this.data.target == null )
      this.add_next_reaches( this.data.headwaters.grid, this.data.headwaters.input, 1 );
    else{
      this.var.current.grid = this.data.headwaters.grid.copy();
      this.add_input( this.data.headwaters.input, 2 );
    }

    while( this.flag.stop == 2 )
      this.add_next_reaches( this.var.current.grid, this.var.current.input, 0 );
  }

  init(){
    this.init_flow();
  }

  define_type_and_rule( grid, direction ){
    let type = direction % 2;
    let subtype = Math.floor( direction / 2 );
    let rule = null;
    let n = this.data.weather.array.reaches.length;
    let m = this.data.weather.array.reaches[grid.y].length;
    //0 - right
    //1 - bot
    //2 - left
    //3 - top
    let borders = [ false, false, false, false ];

    if( grid.y == 0 )
      borders[3] = true;
    if( grid.y == n - 1 )
      borders[1] = true;
    if( grid.x == 0 )
      borders[2] = true;
    if( grid.x == n - 1 )
      borders[0] = true;

    let count = 0;

    for( let border of borders )
      if( border )
        count++;

    if( count == 0 )
      rule = 0;

    if( count == 1 )
      for( let i = 0; i < borders.length; i++ )
        if( borders[i] )
          rule = Math.abs( subtype - ( i + borders.length ) ) % borders.length;

    if( count == 2 ){
      let avg = 0;

      for( let i = 0; i < borders.length; i++ )
        if( borders[i] )
          avg += Math.abs( subtype - i + borders.length ) % borders.length;

      avg /= count;

      switch ( type ) {
        case 0:
          if( avg == 2.5 )
            rule = 3;
          if( avg == 0.5 )
            rule = 4;
            break;
          break;
        case 1:
          if( avg == 1.5 )
            rule = 4;
          if( avg == 2.5 )
            rule = 5;
            break;
          break;
      }
    }

    let result = {
      type: type,
      rule: rule
    }
    return result;
  }

  generate_new_way( grid, direction, type, rule ){
    let weather = this.data.weather;
    let reachess = weather.array.reaches;
    //not fixed error
    if( weather.table.probabilities != undefined ){
      let table = weather.table.probabilities[type][rule];
      let probabilities = [];
      let heights = [];
      let convergences = [];
      let shift = direction;
      let origin_height = reachess[grid.y][grid.x].var.height;
      let min = this.data.weather.const.peak + this.data.weather.const.seabed;
      let max = 0;
      let current_distance;

      if( this.data.target != null )
        current_distance = this.data.target.dist( grid );

      for( let i = 0; i < weather.table.neighbors.length; i++ ){
        let neighbor = grid.copy();
        neighbor.add( weather.table.neighbors[i] );
        let neighbor_height = this.data.weather.const.peak + this.data.weather.const.seabed * 2;

        if( weather.check_border( neighbor ) )
          neighbor_height = reachess[neighbor.y][neighbor.x].var.height;
        if( neighbor_height > max )
          max = neighbor_height;
        if( neighbor_height < min )
          min = neighbor_height;

        heights.push( neighbor_height );

        if( this.data.target != null ){
          let d = this.data.target.dist( neighbor );
          let convergence = current_distance - d;
          convergences.push( convergence );
        }
      }

      for( let i = 0; i < heights.length; i++ ){
        let sign = Math.sign( origin_height - heights[i] );
        heights[i] = ( 1 + sign * ( max - heights[i] ) / ( max - min ) );
      }

      for( let i = 0; i < table.length; i++ )
        probabilities.push( 0 );

      for( let i = 0; i < table.length; i++ ){
        let ii = ( i + shift ) % table.length;
        let scale = 4;
        let sign = 1;
        if( table[i] == 1 )
          scale = 1;

        if( this.data.target != null ){
          if( convergences[ii] < -1 )
            sign = 1/5;
          if( convergences[ii] > 1 )
            sign = 5;
        }

        probabilities[ii] = Math.floor( table[i] * heights[ii] * scale * sign );
      }

      let outcomes = [];
      //console.log( this.var.current.grid.y * 10 + this.var.current.grid.x, probabilities )

      for( let i = 0; i < probabilities.length; i++ )
        for( let j = 0; j < probabilities[i]; j++ )
          outcomes.push( i );

      let rand = Math.floor( Math.random() * outcomes.length );
      return outcomes[rand];
    }
  }

  add_output( grid, way ){
    let weather = this.data.weather;
    this.var.current.grid = grid.copy();
    this.var.current.grid.add( weather.table.neighbors[way] );
    this.flag.stop = weather.check_way( this.var.current.grid );
    /*if( this.flag.stop == 0 )
      console.log( grid.y * 10 + grid.x, this.flag.stop, way )*/

    let type;

    switch ( this.flag.stop ) {
      case 0:
        type = 6;
        break;
      case 1:
        type = 5;
        break;
      case 2:
        type = 4;
        break;
    }

    let obj = {
      way: way,
      type: type,
      in_out: 'out'
    };

    weather.array.reaches[grid.y][grid.x].add_way( obj );

    /*if( this.data.target != null )
      if( this.var.current.grid.x == this.data.target.x &&
          this.var.current.grid.y == this.data.target.y )
        this.flag.stop = 1;*/
  }

  add_input( way, type ){
    let reaches = this.data.weather.array.reaches[this.var.current.grid.y][this.var.current.grid.x];
    let l = 8;
    this.var.current.input = ( way + l / 2 ) % l;

    let obj = {
      way: this.var.current.input,
      type: type,
      in_out: 'in',
      cluster: this.const.cluster,
      water_content: this.var.water_content
    };
    reaches.add_way( obj );
  }

  add_next_reaches( grid, input, type ){
    let reaches = this.data.weather.array.reaches[grid.y][grid.x];
    let obj = {
      way: input,
      type: type,
      in_out: 'in',
      cluster: this.const.cluster,
      water_content: this.var.water_content
    };
    reaches.add_way( obj );

    this.array.track.push( reaches.const.index );
    obj = this.define_type_and_rule( grid, input );
    let way = this.generate_new_way( grid, input, obj.type, obj.rule );

    this.add_output( grid, way );

    if( this.flag.stop == 2 )
      this.add_input( way, 0 );
  }

  draw( offset ){
  }
}
