//
class weather {
  constructor ( n, m, a ){
    this.const = {
      n: n,
      m: m,
      a: a
    };
    this.var = {
      index: {
        nulla: 0
      }
    };
    this.array = {
      reaches: [],
      nulla: []
    };

    this.init();
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
  }

  init_nulla(){
    let headwaters = createVector( 0, 0 );
    let water_content = 100;
    let direction = 6;

    this.add_nulla( direction, headwaters, water_content );
  }

  init(){
    this.init_reachess();
    this.init_nulla();
  }

  add_nulla( direction, headwaters, water_content ){
    this.array.nulla.push( new nulla( this.var.index.nulla, direction, headwaters, water_content, this ) );
    this.var.index.nulla++;
  }

  key(){
  }

  click( offsets ){

  }

  check_way( grid ){
    let flag = this.check_border( grid );

    if( flag ){
      let reaches = this.array.reaches[grid.x][grid.y];
      let sum = 0;

      for( let way of reaches.array.way )
        sum += way;

      if( sum > 0 )
        flag = false;
    }

    return flag;
  }

  check_border( grid ){
    let flag = ( grid.x >= this.const.m ) || ( grid.x < 0 ) || ( grid.y >= this.const.n ) || ( grid.y < 0 );

    return !flag;
  }


  draw( offset ){
    offset = createVector( this.const.a, this.const.a );

    for( let reachess of this.array.reaches )
      for( let reaches of reachess )
        reaches.draw( offset );
  }
}
