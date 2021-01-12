//
class mechanism {
  constructor (  ){
    this.const = {
      option: {
        base: 10,
        unique: true,
        length: 4
      }
    };
    this.var = {
      index: {
        guess: 0,
        fact: 0
      }
    };
    this.array = {
      guess: [],
      option: [],
      input: [],
      fact: [],
      hypothesis: [],
      correct: []
    };
    this.data = {
      answer: null
    }

    this.init();
  }

  initOptions(){
    for( let option = 0; option < this.const.option.base; option++ )
      this.array.option.push( option );
  }

  initAnswers(){
    this.data.answer = new answer( this.const.option );
    console.log( this.data.answer.array.value )

    let max = Math.pow( this.const.option.base, this.const.option.length );

    for( let result = 0; result < max; result++ ){
        let a = new answer( this.const.option, result );
        let flag = true;

        if( this.const.option.unique ){
          let previous = [];

          for( let value of a.array.value ){
            let index = previous.indexOf( value );

            if( index != -1 )
              flag = false;

            previous.push( value );
          }
        }
        if( flag )
          this.array.correct.push( a );
    }
  }

  init(){
    this.initOptions();
    this.initAnswers();

    this.startGuessing();
  }

  startGuessing(){
  }

  enterGuess(){
    this.array.guess.push( new guess( this.var.index.guess, this.array.input ) );
    this.var.index.guess++;
    console.log( this.array.input )
    this.array.input = [];

    this.updateGuess();
    this.addFacts();
    this.updateHypothesis();
  }

  addFacts(){
    let guess = this.array.guess[this.array.guess.length - 1];
    let values = [];
    //console.log( guess.data )
    let data = {
      ss: null,
      bs: null,
      s: this.const.option.length - guess.data.s,
      f: this.const.option.base - this.const.option.length - guess.data.f
    };

    for( let option of this.array.option ){
      let index = guess.array.value.indexOf( option );

      if( index == -1 )
        values.push( option );
    }

    this.array.fact.push( new fact( this.var.index.fact, guess.array.value, guess.data ) );
    this.var.index.fact++;
    this.updateCorrects( this.array.fact[this.array.fact.length - 1] );
    this.array.fact.push( new fact( this.var.index.fact, values, data ) );
    this.var.index.fact++;
    //this.updateCorrects( this.array.fact[this.array.fact.length - 1] );
    //console.log( this.array.fact )
    console.log( this.array.correct );
    /*if( this.array.correct.length > 0 );
      console.log( this.array.correct[this.array.correct.length - 1].array.value )*/
  }

  updateGuess(){
    let small_successes = 0;
    let big_successes = 0;
    let successes = 0;
    let fails = 0;
    let guess = this.array.guess[this.array.guess.length - 1];

    for( let i = 0; i < guess.array.value.length; i++ )
      if( guess.array.value[i] == this.data.answer.array.value[i] )
          big_successes++;
      else{
        let index = this.data.answer.array.value.indexOf( guess.array.value[i] );

        if( index != -1 )
          small_successes++;
        else
          fails++;
      }

    guess.data.ss = small_successes;
    guess.data.bs = big_successes;
    guess.data.s = small_successes + big_successes;
    guess.data.f = fails;
  }

  updateHypothesis(){
    if( this.array.hypothesis.length == 0 ){
      //this.array.guess[0]
    }
  }

  updateCorrects( fact ){
    //
    for( let i = this.array.correct.length - 1; i > -1; i-- ){
      let answer = this.array.correct[i];
      let s = 0;
      let flag = false;

      for( let value of answer.array.value ){
        let index = fact.array.value.indexOf( value );

        if( index != -1 )
          s++;
      }

      if( fact.data.s == s && fact.data.ss != null && fact.data.bs != null ){
        let bs = 0;
        let ss = 0;

        for( let j = 0; j < answer.array.value.length; j++ ){
          let value = answer.array.value[j];
          let index = this.data.answer.array.value.indexOf( value );

          if( index != -1 )
            if( index == j )
              bs++;
            else
              ss++;
        }

        flag = ( ss == fact.data.ss ) && ( bs == fact.data.bs );
        if( i > 4000 )
        console.log( answer.array.value, fact.data.ss, ss,fact.data.bs, bs, flag  )
      }

      if( !flag )
        this.array.correct.splice( i, 1 );
    }
  }

  compareAnswers( guess ){

  }

  click( offsets ){
    //
  }

  key(){
    switch ( keyCode ) {
      //backspace
      case 8:
        this.array.input.pop();
        break;
      //space
      case 32:
        break;
      //numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        this.array.input.push( keyCode - 48 );

        if( this.array.input.length == this.const.option.length )
          this.enterGuess();
        break;
      //numpad
      case 96:
      case 97:
      case 98:
      case 99:
      case 100:
      case 101:
      case 102:
      case 103:
      case 104:
      case 105:
        this.array.input.push( keyCode - 96 );

        if( this.array.input.length == this.const.option.length )
          this.enterGuess();
        break;
    }
  }

  moved( offsets ){
  }

  draw( offsets ){
    let offset = offsets[0].copy();

    this.data.answer.draw( offset );

    noStroke();
    fill( 0 );
    for( let guess of this.array.guess )
      guess.draw( offset );


    for( let i = 0; i < this.array.input.length; i++ ){
      let x = -this.array.input.length / 2 + i + 0.5;
      let txt = this.array.input[i];
      text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 - CELL_SIZE );
    }
  }
}
