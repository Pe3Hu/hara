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
    this.table = {
      ramus: [],
      growth: []
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

    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.cos( angle * i - Math.PI / 2 ) * scale,
        Math.sin( angle * i - Math.PI / 2 ) * scale
      );

      let pedigree = this.setPedigree();

      this.array.dice[1].push( new dice( i, edges, this.const.a / 2 ) );
      this.array.sponsor.push( new sponsor( i, vec, this.array.dice[1][i], pedigree ) );

      for( let criterion of this.array.criterion )
        this.array.sponsor[i].addCriterion( criterion );
    }

    this.array.dice[0].push( new dice( this.const.n, edges, this.const.a / 2 ) );
    this.array.dice[0].push( new dice( this.const.n, edges, this.const.a / 2 ) );
  }

  initCriterions(){
    this.table.ramus = [ [ 0, 1, 2 ], [ 0, 1, 2, 3 ], [ 0, 1, 2 ] ];

    for( let branch = 0; branch < this.table.ramus.length; branch++ )
      for( let ramus of this.table.ramus[branch] ){
        let data = {
          branch: {
            id: branch,
            name: null
          },
          ramus: {
            id: ramus,
            name: null
          },
          chance: {
            value: null,
            growth: null
          }
        };

        this.updateData( data );
        this.array.criterion.push( new criterion( this.var.index.criterion, data, this.array.promotion ) );
        this.var.index.criterion++;
      }
  }

  initPromotions(){
    this.array.promotion = [];
    let steps = [ 0.08, 2 ];
    let counter = 1;
    let fibonacci = [ 1, 1, 2, 3, 5, 8 ];
    let begin = 0;
    let end = 0.01;

    do{
      let growth = Math.pow( steps[1], fibonacci[fibonacci.length - counter] );
      this.array.promotion.push( new promotion( begin, end, growth ) );
      begin = end;
      end += steps[0] * counter;
      counter++;
    }
    while ( begin < 0.5 )
  }

  initGrowth(){
    let max = 50;
    let counter = 3;

    for( let counter = 3; counter < max; counter++ ){
      let value = Math.pow( counter, 2 );
      this.table.growth.push( value );
    }
  }

  init(){
    this.const.R = this.const.a / ( 2 * Math.sin( Math.PI / this.const.n ) );
    this.array.edge = [ 4, 6, 8, 10, 12, 20 ];

    this.initGrowth();
    this.initPromotions();
    this.initCriterions();
    this.initDices();
    this.rollDices();
    this.rollDices();
    this.rollDices();

    for( let sponsor of this.array.sponsor )
      console.log( sponsor.data.pedigree.data.branch )
  }

  setPedigree(){
    let branchs = {};

    for( let branch = 0; branch < this.table.ramus.length; branch++ ){
      let ramuss = [];

      for( let ramus of this.table.ramus[branch] ){
        let data = {
          branch: {
            id: branch,
            name: null
          },
          ramus: {
            id: ramus,
            name: null
          },
          growth: {
            value: null
          }
        };

        this.updateData( data );
        ramuss.push( data );
      }

      let b = {
        growth: {
          current: 0,
          max: 4,
          stage: 0
        },
        ramus: {}
      };

      for( let ramus of ramuss )
        b.ramus[ramus.ramus.name] = {
          growth: {
            current: 0,
            max: this.table.growth[0],
            stage: 0
          }
        }

      branchs[ramuss[0].branch.name] = b;
    }
    return new pedigree( branchs, this.table.growth );
  }

  rollDices(){
    for( let dices of this.array.dice )
      for( let dice of dices )
        dice.roll();


    for( let sponsor of this.array.sponsor ){
      sponsor.array.panout = [];

      for( let dice1 of sponsor.array.dice )
        //for( let dice2 of this.array.dice[0] )
          sponsor.array.panout.push( new panout( sponsor, [ dice1, this.array.dice[0][0], this.array.dice[0][1] ] ) );
    }
  }

  updateData( data ){
    switch ( data.branch.id ) {
      case 0:
        data.branch.name = '-';
        switch ( data.ramus.id ) {
          case 0:
            data.ramus.name = 'iteration';
            break;
          case 1:
            data.ramus.name = 'reverse';
            break;
          case 2:
            data.ramus.name = 'echelon';
            break;
        }
        break;
      case 1:
        data.branch.name = '=';
        switch ( data.ramus.id ) {
          case 0:
            data.ramus.name = 'even';
            break;
          case 1:
            data.ramus.name = 'odd';
            break;
          case 2:
            data.ramus.name = 'min';
            break;
          case 3:
            data.ramus.name = 'max';
            break;
        }
        break;
      case 2:
        data.branch.name = '+';
        switch ( data.ramus.id ) {
          case 0:
            data.ramus.name = 'less';
            break;
          case 1:
            data.ramus.name = 'balance';
            break;
          case 2:
            data.ramus.name = 'more';
            break;
        }
        break;
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

    for( let i = 0; i < this.array.dice[0].length; i++ ){
      let vec = offset.copy();
      vec.x += ( -this.array.dice[0].length / 2 + 0.5 + i ) * this.const.a;

      this.array.dice[0][i].draw( vec );
    }

    for( let sponsor of this.array.sponsor ){
      let vec = offset.copy();
      vec.add( sponsor.const.center );
      vec.x += ( -sponsor.array.dice.length / 2 - 0.5 ) * this.const.a;

      for( let i = 0; i < sponsor.array.dice.length; i++ ){
        vec.x += this.const.a;
        sponsor.array.dice[i].draw( vec );
      }
    }

    offset = offsets[1];

    for( let i = 0; i < this.array.criterion.length; i++ ){
      let vec = offset.copy();
      vec.y += i * FONT_SIZE * 1.5;

      this.array.criterion[i].draw( vec );
    }

    fill( 0 );
    noStroke();

    for( let i = 0; i < this.array.sponsor.length; i++ ){
      let vec = offset.copy();
      vec.x += ( i + 2 ) * CELL_SIZE;
      vec.y -= 2 * FONT_SIZE;
      let txt = this.array.sponsor[i].const.index;
      text( txt, vec.x, vec.y + FONT_SIZE / 3 );
      vec.y += 2 * FONT_SIZE;

      let pedigree = this.array.sponsor[i].draw( vec );
    }

  }
}
