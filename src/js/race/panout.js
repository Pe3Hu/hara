//
class panout {
  constructor ( sponsor, dices ){
    this.const = {
    };
    this.var = {
    };
    this.array = {
      dice: dices
    };
    this.data = {
      sponsor: sponsor
    };

    this.init();
  }

  identifyResult(){
    for( let criterion of this.data.sponsor.array.criterion ){
      let sum, max, avg, middle, flag = true;

      if( criterion.data.branch.id > 0 )  {
        sum = 0;
        max = 0;

        for( let dice of this.array.dice ){
          let value = dice.array.edge[dice.var.current.edge];
          sum += value;
          max += dice.const.edges;
        }

        avg = sum / this.array.dice;
        middle = max / this.array.dice;

      switch ( criterion.data.type.name ) {
        case 'reflection':
          let origin = this.array.dice[0];
          let reflection = origin.array.edge[origin.var.current.edge];

          for( let dice of this.array.dice ){
            let value = dice.array.edge[dice.var.current.edge];
            flag = ( flag && value == reflection )
          }
          break;
        case 'distortion':
          flag = false;

          if( this.array.dice.length == 2 ){
            let origin = this.array.dice[0];
            let distortion = this.array.dice[1];

            if( origin.const.edges == distortion.const.edges ){
              let d = Math.abs( distortion.var.current.edge - origin.var.current.edge );

              if( d == distortion.const.edges / 2 )
                flag = true;
            }
          }
          break;
        case 'echelon':
          //
          let values = [];

          for( let dice of this.array.dice ){
            let value = dice.array.edge[dice.var.current.edge];
            values.push( value );
          }

          values.sort( this.compare );

          for( let i = 1; i < values.length; i ++ ){
            let d = Math.abs( values[i] - values[i - 1] );

            if( d != 1 )
              flag = false;
          }
          break;
        case 'even':
          flag = ( sum % 2 == 0 );
          break;
        case 'odd':
          flag = ( sum % 2 == 1 );
          break;
        case 'min':
          let min = 1 / this.array.dice;
          flag = ( avg <= min );
          break;
        case 'max':
          max = ( max - 1 ) / this.array.dice;
          flag = ( avg <= max );
          break;
        case 'less':
          flag = ( avg < middle );
          break;
        case 'more':
          flag = ( avg > middle );
          break;
      }

      if( flag )
        console.log( criterion.data.type.name, this.data.sponsor.const.index, this.array.dice );
      }
    }
  }

  init(){
    this.identifyResult();
  }

  compare( a, b ){
    if( a > b ) return 1;
    if( a == b) return 0;
    if( a < b ) return -1;
  }

  draw( offset ){
  }
}
