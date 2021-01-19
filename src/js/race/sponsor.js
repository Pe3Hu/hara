//
class sponsor {
  constructor ( index, center, dice ){
    this.const = {
      index: index,
      center: center
    };
    this.var = {
    };
    this.array = {
      panout: [],
      dice: [ dice ],
      criterion: []
    };
    this.data = {
    };

    this.init();
  }

  init(){
  }

  cleanCriterions(){
    this.array.criterion = [];
  }

  addCriterion( criterion ){
    this.array.criterion.push( criterion.duplicate() );
  }

  contribute( criterion, panout ){

  }

  draw( offset ){
  }
}
