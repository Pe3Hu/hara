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
      sponsor: sponsor,
      primary:{
      }
    };

    this.init();
  }

  primaryData(){
    //
    this.data.primary.sum = 0;
    this.data.primary.max = 0;

    for( let dice of this.array.dice ){
      let value = dice.array.edge[dice.var.current.edge];
      this.data.primary.sum += value;
      this.data.primary.max += ( dice.const.edges - 1 );
    }

    this.data.primary.avg = this.data.primary.sum / this.array.dice.length;
    this.data.primary.mid = this.data.primary.max / this.array.dice.length / 2;
    this.data.primary.min = 1 / this.array.dice.length;
    this.data.primary.max = ( this.data.primary.max - 1 ) / this.array.dice.length;
  }

  identifyResult(){
    for( let criterion of this.data.sponsor.array.criterion ){
      let degree, chance, factorial, flag = true;

      switch ( criterion.data.type.name ) {
        case 'reflection':
          let origin = this.array.dice[0];
          let reflection = origin.array.edge[origin.var.current.edge];
          chance = 1 / origin.const.edges;
          let sets = origin.const.edges;

          for( let dice of this.array.dice ){
            let value = dice.array.edge[dice.var.current.edge];
            flag = ( flag && value == reflection )

            chance /= dice.const.edges;
            if( dice.const.edges < sets )
              sets = dice.const.edges;
          }

          criterion.data.chance.value = chance * sets;
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

              criterion.data.chance.value = 2 / origin.const.edge;
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

          /*degree = this.array.dice.length;
          chance = Math.pow( 1 / dice.const.edges, degree );
          factorial = this.factorial( this.array.dice.length );
          criterion.data.chance.value = chance * factorial;*/
          break;
        case 'even':
          flag = ( this.data.primary.sum % 2 == 0 );
          criterion.data.chance.value = 1 / 2;
          break;
        case 'odd':
          flag = ( this.data.primary.sum % 2 == 1 );
          criterion.data.chance.value = 1 / 2;
          break;
        case 'min':
          flag = ( this.data.primary.avg <= this.data.primary.min );
          /*degree = this.array.dice.length;
          chance = Math.pow( 1 / dice.const.edges, degree - 1 );
          chance *= 2 / dice.const.edges;*/
          break;
        case 'max':
          //
          flag = ( this.data.primary.avg >= this.data.primary.max );
          /*degree = this.array.dice.length;
          chance = Math.pow( 1 / dice.const.edges, degree - 1 );
          chance *= 2 / dice.const.edges;*/
          break;
        case 'less':
          flag = ( this.data.primary.avg < this.data.primary.mid );
          break;
        case 'balance':
          flag = ( this.data.primary.avg == this.data.primary.mid );
          break;
        case 'more':
          flag = ( this.data.primary.avg > this.data.primary.mid );
          break;
      }

      if( flag )
        this.data.sponsor.contribute( criterion, panout );
    }
  }

  init(){
    this.primaryData();
    this.identifyResult();
  }

  compare( a, b ){
    if( a > b ) return 1;
    if( a == b) return 0;
    if( a < b ) return -1;
  }

  number_of_k_combinations( n, k ){
    let result = 1;

    for( let i =  1; i < n + 1; i++ )
        result *= i;

    for( let i = 1; i < n - k + 1; i++ )
        result /= i;

    for( let i = 1; i < k + 1; i++ )
        result /= i;

    return result;
  }

  factorial( n ){
    let result = 1;

    for( let i = 2; i < n; i++ )
      result *= n;

    return result;
  }

  draw( offset ){
  }
}
