//
class answer {
  constructor ( option, result ){
    this.const = {
      option: option
    };
    this.var = {
      value: null
    };
    this.array = {
      value: []
    };

    this.init( result );
  }

  init( result ){
    this.generateAnswer( result );
  }

  generateAnswer( result ){
    let flag = false;
    let counter = 0;
    let stop = 100;

    while( !flag && counter < stop ){
      let value = 0;

      if( result == undefined ){
        let digit = 1;
        let options = [];

        for( let i = 0; i < this.const.option.base; i++ )
          options.push( i );

        for( let i = 0; i < this.const.option.length; i++ ){
          let rand = Math.floor( Math.random() * options.length );
          value += options[rand] * digit;
          digit *= this.const.option.base;

          if( this.const.option.unique == true )
            options.splice( rand, 1 );
        }
      }
      else
        value = result;

      if( this.var.value != value ){
        this.var.value = value;
        this.array.value = [];

        do{
          let remainder = value % this.const.option.base;
          this.array.value.push( remainder );
          value = Math.floor( value / this.const.option.base );
        }
        while( value >= 1 )

        while( this.const.option.length > this.array.value.length )
          this.array.value.push( 0 );
        return;
      }

      counter++;
    }
  }

  draw( offset ){
    noStroke();
    fill( 0 );

    for( let i = 0; i < this.array.value.length; i++ ){
      let x = -this.array.value.length / 2 + i + 0.5;
      let txt = this.array.value[i];
      text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 );
    }
  }
}
