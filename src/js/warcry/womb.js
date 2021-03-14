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
      [
        {
          id: 0,
          name: 'yellow'
        },
        {
          id: 1,
          name: 'green'
        },
        {
          id: 2,
          name: 'blue'
        },
        {
          id: 3,
          name: 'red'
        }
      ],
      [
        {
          id: 0,
          name: 'diag-0'
        },
        {
          id: 1,
          name: 'horizon'
        },
        {
          id: 2,
          name: 'diag-1'
        },
        {
          id: 3,
          name: 'vertical'
        },
        {
          id: 4,
          name: 'diag-0'
        },
        {
          id: 5,
          name: 'horizon'
        },
        {
          id: 6,
          name: 'diag-1'
        },
        {
          id: 7,
          name: 'vertical'
        }
      ]
    ];
  }

  init(){
    this.init_traits();
    this.refill();
  }

  refill(){
    let hive = this.data.hive;
    //console.log( hive.flag.full, hive )

    while( !hive.flag.full ){
      hive.flag.full = true;

      for( let col = 0; col < hive.array.comb[0].length; col++ ){
        let flag = this.col_fullness_check( col );
          //  console.log( 'col_flag', flag )

        if( !flag )
          this.milk( col );

        hive.flag.full = hive.flag.full && flag;
      }
    }

    //console.log( this.data.hive.array.comb[0][0].data.honey )
  }

  milk( col ){
    //console.log( 'milk', col )
    let hive = this.data.hive;

    //while( !this.comb_fullness_check( col ) ){
    if( true ){
      let count_new_milk = -1;

      for( let row = 0; row < hive.array.comb.length; row++ )
        if( !this.comb_fullness_check( row, col ) )
          count_new_milk = row;

      this.add_honey( col );

      if( count_new_milk > 0 )
        this.shift_down( col, count_new_milk );
    //console.log( count_new_milk )
    }
  }

  add_honey( col ){
    let hive = this.data.hive;
    let traits = [];

    for( let array of this.array.trait ){
      let rand = Math.floor( Math.random() * array.length );
      traits.push( array[rand] );
    }

    hive.array.comb[0][col].set_honey( new honey( this.var.current.honey, hive.const.a * 0.2, traits, this ) );
    this.var.current.honey++;
  }

  shift_down( col, count_new_milk ){
    let hive = this.data.hive;

    for( let row = count_new_milk; row > 0; row-- ){
      let bot = hive.array.comb[row][col];
      let top = hive.array.comb[row - 1][col];
      bot.set_honey( top.data.honey );
      top.set_honey( null );
    }
  }

  comb_fullness_check( row, col ){
    //console.log( row, col, this.data.hive.array.comb[row][col].data.honey)
    return this.data.hive.array.comb[row][col].data.honey != null;
  }

  col_fullness_check( col ){
    let hive = this.data.hive;
    let flag = true;

    for( let row = 0; row < hive.array.comb.length; row++ )
      flag = flag && this.comb_fullness_check( row, col )

    return flag;
  }
}
