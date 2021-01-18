//
class rialto {
  constructor (  ){
    this.const = {
      n: 5,
      dices: 1,
      a: CELL_SIZE * 2
    };
    this.var = {
      index: {
        criterion: 0
      }
    };
    this.array = {
      sponsor: [],
      dice: [],
      edge: [],
      criterion: []
    };
    this.data = {
    };

    this.init();
  }

  initDices(){
    let angle = Math.PI * 2 / this.const.n;
    let scale = this.const.a * ( this.const.n / 2 + 1 );
    let edges = this.array.edge[0];
    //0 - shared pool
    //1 - personal
    this.array.dice = [ [], [] ];

    for( let i = 0; i < this.const.n; i ++ ){
      let vec = createVector(
        Math.cos( angle * i - Math.PI / 2 ) * scale,
        Math.sin( angle * i - Math.PI / 2 ) * scale
      );

      this.array.dice[1].push( new dice( i, edges, this.const.a / 2 ) );
      this.array.sponsor.push( new sponsor( i, vec, this.array.dice[1][i] ) );

      for( let criterion of this.array.criterion )
        this.array.sponsor[i].addCriterion( criterion );
    }

    this.array.dice[0].push( new dice( this.const.n, edges, this.const.a / 2 ) );
  }

  initCriterions(){
    let types = [ [ 0, 1, 2 ], [ 0, 1, 2, 3 ], [ 0, 1 ] ];

    for( let branch = 0; branch < types.length; branch++ )
      for( let type of types[branch] ){
        this.array.criterion.push( new criterion( this.var.index.criterion, branch, type ) );
        this.var.index.criterion++;
      }
  }

  init(){
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.array.edge = [ 4, 6, 8, 10, 12, 20 ];

    this.initCriterions();
    this.initDices();
    this.rollDices();
  }

  rollDices(){
    for( let dices of this.array.dice )
      for( let dice of dices )
        dice.roll();


    for( let sponsor of this.array.sponsor ){
      sponsor.array.panout = [];

      for( let dice1 of sponsor.array.dice )
        for( let dice2 of this.array.dice[0] )
          sponsor.array.panout.push( new panout( sponsor, [ dice1, dice2 ] ) );
    }
  }

  click( offsets ){
    //
  }

  key(){
    switch ( keyCode ) {
      //backspace
      case 8:
        break;
      //space
      case 32:
        break;
    }
  }

  moved( offsets ){
  }

  draw( offsets ){
    let offset = offsets[0];

    for( let i = 0; i < this.array.dice[0].length; i ++ ){
      let vec = offset.copy();
      vec.x += ( -this.array.dice[0].length / 2 + 0.5 + i ) * this.const.a;

      this.array.dice[0][i].draw( vec );
    }

    for( let sponsor of this.array.sponsor ){
      let vec = offset.copy();
      vec.add( sponsor.const.center );
      vec.x += ( -sponsor.array.dice.length / 2 - 0.5 ) * this.const.a;

      for( let i = 0; i < sponsor.array.dice.length; i ++ ){
        vec.x += this.const.a;
        sponsor.array.dice[i].draw( vec );
      }
    }

    offset = offsets[1];

    for( let i = 0; i < this.array.criterion.length; i ++ ){
      let vec = offset.copy();
      vec.y += i * FONT_SIZE * 1.5;

      this.array.criterion[i].draw( vec );
    }
  }
}
