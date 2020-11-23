//
class clef {
  constructor ( floor ){
    this.const = {
      index: floor.const.index,
      region: floor.var.region,
      floor: floor,
      a: floor.const.a
    };
    this.var = {
      state: null
    };
    this.array = {
    };

    this.init();
  }

  init(){
  }

  setState( state ){
    //0 - not taken yet
    //1 - before distribution
    //2 - during distribution
    //3 - after distribution
    //4 - before activation
    //5 - during activation
    //6 - after activation
    this.var.state = state;

    switch ( state ) {
      case 0:

        break;
    }
  }

  draw(  ){
  }
}
