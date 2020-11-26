//
class collision {
  constructor (){
    this.const = {
      size: 3
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      arena: null,
      coordinator: null
    };
    this.table = {
    };

    this.init();
  }

  init(){

      console.log( this.table )
    this.data.arena = new arena( this.const.size );
    this.data.coordinator = new coordinator( this.data.arena );
  }

  click( offsets ){
    this.data.arena.click( offsets );
    this.data.coordinator.click( offsets );
  }

  key(){
    this.data.coordinator.key();
  }

  moved( offsets ){
    this.data.coordinator.moved( offsets );
  }

  draw( offsets ){
    this.data.arena.draw( offsets );
    this.data.coordinator.draw( offsets );
  }
}
