//
class hive {
  constructor ( n, m, a ){
    this.const = {
      n: n,
      m: m,
      a: a
    };
    this.flag = {
      full: false
    };
    this.array = {
      comb: []
    };
    this.data = {
      womb: null
    };

    this.init();
  }

  init_combs(){
    for( let i = 0; i < this.const.n; i++ ){
      this.array.comb.push( [] );

      for( let j = 0; j < this.const.m; j++ ){
        let index = i * this.const.m + j;
        let center = createVector( ( j + 0.5 ) * this.const.a, ( i + 0.5 ) * this.const.a );
        this.array.comb[i].push( new comb( index, center, this.const.a ) )
      }
    }
  }

  init_womb(){
    this.data.womb = new womb( this );
  }

  init(){
    this.init_combs();
    this.init_womb();
  }

  key(){

  }

  click(){

  }

  draw( offset ){
    offset = createVector();

    for( let combs of this.array.comb )
      for( let comb of combs )
        comb.draw( offset );
  }
}
