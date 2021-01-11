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
        guess: 0
      }
    };
    this.array = {
      guess: [],
      option: [],
      value: []
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

  initAnswer(){
    this.data.answer = new answer( this.const.option );
  }

  init(){
    this.initOptions();
    this.initAnswer();

    this.startGuessing();
  }

  startGuessing(){

  }

  enterGuess(){
    this.array.guess.push( new guess( this.var.index.guess, this.array.value ) );
    this.var.index.guess++;
    this.array.value = [];

    this.checkGuess();
  }

  checkGuess(){
    let small_successes = 0;
    let big_successes = 0;
    let fails = 0;
    let guess = this.array.guess[this.array.guess.length - 1];

            console.log( guess.array.value, this.data.answer.array.value )

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
    guess.data.f = fails;
  }


  click( offsets ){
    //
  }

  key(){
    switch ( keyCode ) {
      case 32:
        break;
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
        this.array.value.push( keyCode - 48 );
        if( this.array.value.length == this.const.option.length )
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


    for( let i = 0; i < this.array.value.length; i++ ){
      let x = -this.array.value.length / 2 + i + 0.5;
      let txt = this.array.value[i];
      text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 - CELL_SIZE );
    }
  }
}
