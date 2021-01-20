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
    this.data.primary.total = 1;

    for( let dice of this.array.dice ){
      let value = dice.array.edge[dice.var.current.edge];
      this.data.primary.sum += value;
      this.data.primary.max += ( dice.const.edges - 1 );
      this.data.primary.total *= dice.const.edges;
    }

    this.data.primary.avg = this.data.primary.sum / this.array.dice.length;
    this.data.primary.mid = this.data.primary.max / this.array.dice.length;
    this.data.primary.min = 1 / this.array.dice.length;
    this.data.primary.max = ( this.data.primary.max - 1 ) / this.array.dice.length;
    this.data.primary.critical = this.array.dice.length / this.data.primary.total;

    if( this.data.primary.mid * 2 % 2 == 0 ){
      let sums = [ [0] ];
      for( let dice of this.array.dice ){
        let sum = sums[sums.length - 1];
        let arrs = [];

        for( let s of sum )
          for( let edge of dice.array.edge ){
            let amount = edge + s;
            arrs.push( amount );
          }

        sums.push( arrs );
      }

      let count = 0;
      for( let sum of sums[sums.length - 1] )
        if( sum == this.data.primary.mid )
          count++;

      this.data.primary.balance = count / sums[sums.length - 1].length;
    }
    else
      this.data.primary.balance = 0;

    let values = [ [ [-1] ] ];
    for( let dice of this.array.dice ){
      let value = values[values.length - 1];
      let arrs = [];

      for( let v of value ){
        for( let edge of dice.array.edge ){
          let arr = v.slice();
          let index = arr.indexOf( edge );

          if( index == -1 ){
            arr.push( edge );
            arrs.push( arr );
          }
        }
      }

      values.push( arrs );
    }

    let sets = values[values.length - 1];
    let result= [];

    for( let set of sets )
      set.splice( 0, 1 );

    let count = 0;
    for( let set of sets ){
      let sum = 0;

      for( let value of set )
        sum += value;

      let avg = sum / set.length;
      let dist = set.length / 2;
      let flag = true;

      for( let value of set ){
        let d = Math.abs( avg - value );
        if( d > dist )
          flag = false;
      }

      if( flag )
        count++;
    }

    this.data.primary.echelon = count / this.data.primary.total;

    this.data.primary.imbalance = ( 1 - this.data.primary.balance ) / 2;
  }

  identifyResult(){
    for( let criterion of this.data.sponsor.array.criterion ){
      let degree, chance, factorial, flag = true;

      switch ( criterion.data.ramus.name ) {
        case 'iteration':
          let origin = this.array.dice[0];
          let iteration = origin.array.edge[origin.var.current.edge];
          chance = 1;
          let sets = origin.const.edges;

          for( let dice of this.array.dice ){
            let value = dice.array.edge[dice.var.current.edge];
            flag = ( flag && value == iteration )

            chance /= dice.const.edges;
            if( dice.const.edges < sets )
              sets = dice.const.edges;
          }
          criterion.data.chance.value = chance * sets;
          break;
        case 'reverse':
          flag = false;

          if( this.array.dice.length == 2 ){
            let origin = this.array.dice[0];
            let reverse = this.array.dice[1];

            if( origin.const.edges == reverse.const.edges ){
              let d = Math.abs( reverse.var.current.edge - origin.var.current.edge );

              if( d == reverse.const.edges / 2 )
                flag = true;

              criterion.data.chance.value = 1 / origin.const.edges;
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

          for( let i = 1; i < values.length; i++ ){
            let d = Math.abs( values[i] - values[i - 1] );

            if( d != 1 )
              flag = false;
          }

          criterion.data.chance.value = this.data.primary.echelon;
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
          criterion.data.chance.value = this.data.primary.critical;
          break;
        case 'max':
          //
          flag = ( this.data.primary.avg >= this.data.primary.max );
          criterion.data.chance.value = this.data.primary.critical;
          break;
        case 'less':
          flag = ( this.data.primary.sum < this.data.primary.mid );
          criterion.data.chance.value = this.data.primary.imbalance;
          break;
        case 'balance':
          flag = ( this.data.primary.sum == this.data.primary.mid );
          criterion.data.chance.value = this.data.primary.balance;
          break;
        case 'more':
          flag = ( this.data.primary.sum > this.data.primary.mid );
          criterion.data.chance.value = this.data.primary.imbalance;
          break;
      }
      
      if( flag )
        this.data.sponsor.contribute( criterion, this );
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
