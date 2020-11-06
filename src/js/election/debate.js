//
class debate {
  constructor (  ){
    this.const = {
      size: 3
    };
    this.var = {
    };
    this.data = {
      tribune: null
    }

    this.init();
  }

  init(){
    this.data.tribune = new tribune( this.const.size );
  }

  click(){

  }

  draw(){
    this.data.tribune.draw();
  }
}
