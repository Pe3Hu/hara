//
class decree {
  constructor ( index, challenger ){
    this.const = {
      index: index,
      challenger: challenger
    };
    this.array = {
      clef: []
    }

    this.init();
  }

  setType(){
    let name, length, array;
    switch ( this.const.index ) {
      case 0:
        length = 3;
        array = [];
        name = 'save';
        break;
      case 1:
        length = 4;
        array = [];
        name = 'drop';
        break;
      case 2:
        length = 8;
        array = [ [], [] ];
        name = 'give a choice 2';
        break;
      case 3:
        length = 9;
        array = [ [], [], [] ];
        name = 'give a choice 3';
        break;
    }

    this.const.name = name;
    this.const.length = length;
    this.array.clef = array;
  }

  init(){
    this.setType();
  }

  draw(){
  }
}
