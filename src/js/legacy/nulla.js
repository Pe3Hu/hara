//
class nulla {
  constructor ( index, input, grid, water_content, weather ){
    this.const = {
      index: index
    };
    this.var = {
      current: {
        input: input,
        grid: grid
      }
    };
    this.flag = {
      stop: false
    }
    this.data = {
      weather: weather,
      headwaters: {
        input: input,
        grid: grid
      },
      water_content: water_content
    };
    this.table = {
      probabilities: [],
      neighbors: []
    };

    this.init();
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

  init_neighbors(){
    this.table.neighbors = [
      createVector( -1, 1 ),
      createVector( 0, 1 ),
      createVector( 1, 1 ),
      createVector( 1, 0 ),
      createVector( 1, -1 ),
      createVector( 0, -1 ),
      createVector( -1, -1 ),
      createVector( -1, 0 )
    ];
  }

  init_flow(){
    this.add_next_reaches( this.data.headwaters.grid, this.data.headwaters.input, true );

    while( !this.flag.stop )
      this.add_next_reaches( this.var.current.grid, this.var.current.input, false );
  }

  init(){
    this.init_probabilities();
    this.init_neighbors();
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

  generate_new_way( type, rule, direction ){
    let table = this.table.probabilities[type][rule];
    let probabilities = [];
    let shift = direction;//( direction + table.length * 1.5 ) % table.length;

    for( let i = 0; i < table.length; i++ )
      probabilities.push( 0 );

    for( let i = 0; i < table.length; i++ ){
      let ii = ( i + shift ) % table.length;

      probabilities[ii] = table[i];
    }

    let outcomes = [];

    for( let i = 0; i < probabilities.length; i++ )
      for( let j = 0; j < probabilities[i]; j++ )
        outcomes.push( i );

    let rand = Math.floor( Math.random() * outcomes.length );
    return outcomes[rand];
  }

  continue_flow( grid, way ){
    let l = 8;
    this.var.current.grid = grid.copy();
    this.var.current.grid.add( this.table.neighbors[way] );
    this.flag.stop = !this.data.weather.check_way( this.var.current.grid );
    this.data.weather.array.reaches[grid.x][grid.y].add_output( way, this.flag.stop );

    if( !this.flag.stop ){
      this.var.current.input = ( way + l / 2 ) % l;
      this.data.weather.array.reaches[this.var.current.grid.x][this.var.current.grid.y].add_input( this.var.current.input );
    }
  }

  add_next_reaches( grid, input, first ){
    this.data.weather.array.reaches[grid.x][grid.y].add_input( input, first );
    let obj = this.define_type_and_rule( grid, input );
    let way = this.generate_new_way( obj.type, obj.rule, input );
    this.continue_flow( grid, way );
  }

  draw( offset ){
  }
}
