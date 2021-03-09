//
class womb {
  constructor ( hive ){
    this.var = {
      current: {
        honey: 0
      }
    }
    this.array = {
      trait: []
    };
    this.data = {
      hive: hive
    };

    this.init();
  }

  init_traits(){
    this.array.trait = [
      [ 0, 1, 2, 3 ]
    ];
  }

  init(){
    this.init_traits();
    this.refill();
  }

  refill(){
    while( !this.data.hive.flag.full ){
      this.data.hive.flag.full = true;

      for( let col = 0; col < this.data.hive.array.comb[0].length; col++ ){
        let flag = this.comb_fullness_check( 0, col );
        if( flag )
          this.milk( col );

        this.data.hive.flag.full = this.data.hive.flag.full && !flag;
      }
    }
  }

  comb_fullness_check( row, col ){
    return this.data.hive.array.comb[row][col].data.honey == null;
  }

  milk( col ){
    let count_new_milk = null;

    for( let row = 0; row < this.data.hive.array.comb.length; row++ )
      if( this.comb_fullness_check( row, col ) )
        count_new_milk = row;

    this.add_honey( col );

    if( count_new_milk > 0 )
      this.shift_down( col, count_new_milk );
  }

  add_honey( col ){
    let traits = [];

    for( let array of this.array.trait ){
      let rand = Math.floor( Math.random() * array.length );
      traits.push( array[rand] );
    }

    this.data.hive.array.comb[0][col].set_honey( new honey( this.var.current.honey, this.data.hive.const.a * 0.45, traits ) );
    this.var.current.honey++;
  }

  shift_down( col, count_new_milk ){
    for( let row = count_new_milk; row > 0; row-- ){
      let bot = this.data.hive.array.comb[row][col];
      let top = this.data.hive.array.comb[row - 1][col];
      bot.set_honey( top.data.honey );
      top.set_honey( null );
    }
  }
}
