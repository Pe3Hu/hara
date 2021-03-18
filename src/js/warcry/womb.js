//
class womb {
  constructor ( hive ){
    this.var = {
      current: {
        honey: 0
      },
      milk: {
        slip: null,
        tempo: FRAME_RATE / hive.const.tempo,
        vector: createVector(),
        end: null
      }
    };
    this.flag = {
      milk: false,
      wait: true
    };
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
        }/*,
        {
          id: 2,
          name: 'blue'
        },
        {
          id: 3,
          name: 'red'
        }*/
      ],
      [
        {
          id: 0,
          name: 'diag-0'
        },
        {
          id: 1,
          name: 'horizon-0'
        }/*,
        {
          id: 2,
          name: 'diag-1'
        },
        {
          id: 3,
          name: 'vertical-0'
        },
        {
          id: 4,
          name: 'diag-2'
        },
        {
          id: 5,
          name: 'horizon-1'
        },
        {
          id: 6,
          name: 'diag-3'
        },
        {
          id: 7,
          name: 'vertical-1'
        }*/
      ]
    ];
  }

  init(){
    this.var.milk.slip = createVector( 0, this.data.hive.const.a / this.var.milk.tempo );
    this.var.milk.end = createVector( 0, this.data.hive.const.a  );

    this.init_traits();
    this.refill();
  }

  refill(){
    let hive = this.data.hive;

    if( !hive.flag.full ){
      hive.flag.full = true;
      this.flag.milk = true;
      this.var.milk.vector = createVector();

      for( let col = 0; col < hive.const.m; col++ ){
        let flag = this.col_fullness_check( col );

        if( !flag )
          this.add_honey( col );

        hive.flag.full = hive.flag.full && flag;
      }
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

  shift_down(){
    let hive = this.data.hive;

    for( let col = 0; col < hive.const.m; col++ ){
      let count_new_milk = -1;

      for( let row = 0; row < hive.const.n; row++ )
          if( !this.comb_fullness_check( row, col ) )
            count_new_milk = row;

      for( let row = count_new_milk; row > 0; row-- ){
        let bot = hive.array.comb[row][col];
        let top = hive.array.comb[row - 1][col];
        bot.set_honey( top.data.honey );
        top.set_honey( null );
      }
    }
  }

  comb_fullness_check( row, col ){
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
