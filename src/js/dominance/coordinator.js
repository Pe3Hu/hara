//
class coordinator {
  constructor ( arena ){
    this.const = {
    };
    this.var = {
    };
    this.array = {
      challenger: [],
      clef: []
    };
    this.data = {
      arena: arena
    }

    this.init();
  }

  iniClefs(){
    let regions = this.data.arena.array.region;
    for( let i = 0; i < regions.length; i++ )
      for( let j = 0; j < regions[i].length; j++ )
        this.array.clef.push( new clef( regions[i][j] ) );
  }

  init(){
    this.iniClefs();
  }

  draw(  ){

    /*for( let i = 0; i < this.array.clef.length; i++ ){

    }*/
  }
}
