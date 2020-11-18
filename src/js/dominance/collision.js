//
class collision {
  constructor (  ){
    this.const = {
      size: 3
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      arena: null
    }

    this.init();
  }

  init(){
    this.data.arena = new arena( this.const.size );
    this.data.coordinator = new coordinator( this.data.arena );
  }

  click( offset ){
    this.data.arena.click( offset );
  }

  key(){
    this.data.arena.key();
  }

  draw( offset ){
    this.data.arena.draw( offset );
  }
}
