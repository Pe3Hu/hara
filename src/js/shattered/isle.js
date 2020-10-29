//
class isle {
  constructor (  ){
    this.const = {
      size: 4
    };
    this.var = {
    };
    this.part = {
      underworld: null,
      surface: null
    }

    this.init();
  }

  init(){
    this.part.underworld = new underworld( this.const.size );
  }

  click(){

  }

  draw(){
    this.part.underworld.draw();
  }
}
