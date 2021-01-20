//
class sponsor {
  constructor ( index, center, dice, pedigree ){
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
      pedigree: pedigree
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
    criterion.updateGrowth();

    for( let branch in this.data.pedigree.data.branch )
        for( let ramus in this.data.pedigree.data.branch[branch].ramus )
          if( criterion.data.ramus.name == ramus )
            this.data.pedigree.addGrowth( branch, ramus, criterion.data.chance.growth );
  }

  draw( offset ){
    this.data.pedigree.draw( offset );
  }
}
