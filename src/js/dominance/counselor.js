//
class counselor {
  constructor ( coordinator ){
    this.const = {
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      coordinator: coordinator,
      arena: coordinator.data.arena
    }

    this.init();
  }

  init(){

    let challenger = 1;
    this.getCorridors( challenger );
  }

  getCorridors( challenger ){
    let floors = [];
    //console.log( this.data.arena.array.corridor )
    for( let i = 0; i < this.data.arena.array.hall.length; i++ )
      for( let j = 0; j < this.data.arena.array.hall[i].length; j++ )
        for( let f = 0; f < this.data.arena.array.hall[i][j].array.floor.length; f++ ){
          let floor = this.data.arena.array.hall[i][j].array.floor[f];
          if( floor.data.banner.owner == challenger )
            floors.push( floor.const.index );
        }

    console.log( floors )
    let corridors = [];

    for( let i = 0; i < this.data.arena.array.corridor.length; i++ ){
      let corridor = this.data.arena.array.corridor[i];
      let k_index = corridor.array.knowledgeable.indexOf( challenger );

      if( k_index == -1 && corridor.var.state == 0 )
        for( let j = 0; j < corridor.array.floor.length; j++ ){
          let floor = corridor.array.floor[j].const.index;
          let f_index = floors.indexOf( floor );

          if( f_index != -1 )
            corridors.push( corridor.const.index );
      }
    }

    console.log( corridors )
  }

  draw(  ){
  }
}
