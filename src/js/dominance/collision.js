//
class collision {
  constructor (){
    this.const = {
      size: 3
    };
    this.var = {
      timer: 0
    };
    this.array = {
    };
    this.data = {
      arena: null,
      coordinator: null
    };
    this.table = {
    };

    //this.init();
  }

  init(){
    this.data.arena = new arena( this.const.size );
    this.data.coordinator = new coordinator( this.data.arena );
    this.data.counselor = new counselor( this.data.coordinator );

    this.start();
  }

  start(){
    this.data.arena = new arena( this.const.size );
    this.data.coordinator = new coordinator( this.data.arena );
    this.data.counselor = new counselor( this.data.coordinator );
  }

  click( offsets ){
    /*this.data.arena.click( offsets );
    this.data.coordinator.click( offsets );*/
  }

  key(){
    this.data.coordinator.key();
  }

  moved( offsets ){
    //this.data.coordinator.moved( offsets );
  }

  update(){
    this.var.timer++;

    if( this.var.timer % FRAME_RATE == 0 )
      this.data.counselor.nextDecision();
  }

  draw( offsets ){
    /*this.update();
    this.data.arena.draw( offsets );
    this.data.coordinator.draw( offsets );*/
  }
}
