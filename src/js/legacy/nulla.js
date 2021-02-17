//
class nulla {
  constructor ( index, input, grid, water_content, weather ){
    this.const = {
      index: index,
      cluster: -( index + 1 )
    };
    this.var = {
      current: {
        input: input,
        grid: grid
      }
    };
    this.flag = {
      //0 - border check failed
      //1 - collison check failde
      //2 - keep flowing
      stop: null
    }
    this.data = {
      weather: weather,
      headwaters: {
        input: input,
        grid: grid
      },
      water_content: water_content
    };

    this.init();
  }

  init_flow(){
    this.add_next_reaches( this.data.headwaters.grid, this.data.headwaters.input, 1 );

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
    let m = this.data.weather.array.reaches[grid.x].length;
    //0 - right
    //1 - bot
    //2 - left
    //3 - top
    let borders = [ false, false, false, false ];

    if( grid.x == 0 )
      borders[3] = true;
    if( grid.x == n - 1 )
      borders[1] = true;
    if( grid.y == 0 )
      borders[2] = true;
    if( grid.y == n - 1 )
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
    let table = weather.table.probabilities[type][rule];
    let probabilities = [];
    let shift = direction;//( direction + table.length * 1.5 ) % table.length;
    let neighbors = [];
    let origin_height = reachess[grid.x][grid.y].data.height;
    let min = this.data.weather.const.peak + this.data.weather.const.seabed;
    let max = 0;

    for( let i = 0; i < weather.table.neighbors.length; i++ ){
      let neighbor = grid.copy();
      neighbor.add( weather.table.neighbors[i] );
      let neighbor_height = this.data.weather.const.peak + this.data.weather.const.seabed * 2;

      if( weather.check_border( neighbor ) )
        neighbor_height = reachess[neighbor.x][neighbor.y].data.height;
      if( neighbor_height > max )
        max = neighbor_height;
      if( neighbor_height < min )
        min = neighbor_height;

      neighbors.push( neighbor_height );
    }

    for( let i = 0; i < neighbors.length; i++ ){
      let sign = Math.sign( origin_height - neighbors[i] );
        neighbors[i] = ( 1 + sign * ( max - neighbors[i] ) / ( max - min ) );
    }

    for( let i = 0; i < table.length; i++ )
      probabilities.push( 0 );

    for( let i = 0; i < table.length; i++ ){
      let ii = ( i + shift ) % table.length;
      let scale = 4;
      if( table[i] == 1 )
        scale = 1;

      probabilities[ii] = Math.floor( table[i] * neighbors[ii] * scale );
    }

    let outcomes = [];

    for( let i = 0; i < probabilities.length; i++ )
      for( let j = 0; j < probabilities[i]; j++ )
        outcomes.push( i );

    let rand = Math.floor( Math.random() * outcomes.length );
    return outcomes[rand];
  }

  continue_flow( grid, way ){
    let weather = this.data.weather;
    let l = 8;
    this.var.current.grid = grid.copy();
    this.var.current.grid.add( weather.table.neighbors[way] );
    this.flag.stop = weather.check_way( this.var.current.grid );
    weather.array.reaches[grid.x][grid.y].add_output( way, this.flag.stop );

    if( this.flag.stop == 2 ){
      this.var.current.input = ( way + l / 2 ) % l;
      weather.array.reaches[this.var.current.grid.x][this.var.current.grid.y].add_input( this.var.current.input, 0, this.const.cluster );
    }
  }

  add_next_reaches( grid, input, first ){
    this.data.weather.array.reaches[grid.x][grid.y].add_input( input, first, this.const.cluster );
    let obj = this.define_type_and_rule( grid, input );
    let way = this.generate_new_way( grid, input, obj.type, obj.rule );
    this.continue_flow( grid, way );
  }

  draw( offset ){
  }
}
