//
class debate {
  constructor (  ){
    this.const = {
      size: 5
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

  click( offset ){
    this.data.tribune.click( offset );
  }

  draw( offset ){
    this.data.tribune.draw( offset );
  }
}
