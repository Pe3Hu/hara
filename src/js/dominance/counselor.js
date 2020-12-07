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
    let index = 0;
    let challenger = this.data.coordinator.array.challenger[index];
    this.getFloors( challenger );
    this.getBorderlands( challenger );
    this.getCorridors( challenger );
  }

  getFloors( challenger ){
    //
    for( let i = 0; i < this.data.arena.array.hall.length; i++ )
      for( let j = 0; j < this.data.arena.array.hall[i].length; j++ )
        for( let f = 0; f < this.data.arena.array.hall[i][j].array.floor.length; f++ ){
          let floor = this.data.arena.array.hall[i][j].array.floor[f];

          if( floor.data.banner.owner == challenger.const.index )
            challenger.array.floor.push( floor.const.index );
        }

      console.log( challenger.array.floor )
    }

  getBorderlands( challenger ){
    //
    for( let i = 0; i < this.data.arena.array.corridor.length; i++ ){
      let corridor = this.data.arena.array.corridor[i];
      let k_index = corridor.array.knowledgeable.indexOf( challenger.const.index );

      if( k_index != -1 && corridor.var.state == 0 )
        for( let j = 0; j < corridor.array.floor.length; j++ ){
          let floor = corridor.array.floor[j];
          let f_index = challenger.array.floor.indexOf( floor.const.index );
          let b_index = challenger.array.borderlands.indexOf( floor.const.index );

          if( f_index == -1 && b_index == -1 )
            challenger.array.borderlands.push( floor.const.index );
        }
    }

    //console.log( challenger.array.borderlands )
  }

  getCorridors( challenger ){
    for( let i = 0; i < this.data.arena.array.corridor.length; i++ ){
      let corridor = this.data.arena.array.corridor[i];
      let k_index = corridor.array.knowledgeable.indexOf( challenger.const.index );

      if( k_index == -1 && corridor.var.state == 0 )
        for( let j = 0; j < corridor.array.floor.length; j++ ){
          let floor = corridor.array.floor[j];
          let f_index = challenger.array.floor.indexOf( floor.const.index );
          let b_index = challenger.array.borderlands.indexOf( floor.const.index );

          if( f_index != -1 || b_index != -1 )
            challenger.array.corridor.push( corridor.const.index );
        }
    }

    console.log( challenger.array.corridor )
  }

  nextDecision(){
    this.choseCorridor();
  }

  choseCorridor(){
    let index = 0;
    let challenger = this.data.coordinator.array.challenger[index];
    if( challenger.array.corridor.length == 0  )
      return;

    let rand = Math.floor( Math.random() * challenger.array.corridor.length );
    let corridor = this.data.arena.array.corridor[challenger.array.corridor[rand]];
    let parents = [];

    for( let i = 0; i < corridor.array.floor.length; i++ ){
      let b_index = challenger.array.borderlands.indexOf( corridor.array.floor[i].const.index );
      let f_index = challenger.array.floor.indexOf( corridor.array.floor[i].const.index );

      if( b_index != -1 || f_index != -1 )
        parents.push( i );
    }

    let parent = parents[Math.floor( Math.random() * parents.length )];
    let child = ( parent + 1 ) % corridor.array.floor.length;
    let floor = corridor.array.floor[child];
    challenger.array.borderlands.push( floor.const.index );
    corridor.addKnowledgeable( challenger.const.index );

    for( let i = 0; i < floor.array.link.length; i++ )
      for( let j = 0; j < floor.array.link[i].length; j++ ){
        let c = this.data.arena.convertLink( floor.const.index, floor.array.link[i][j] );
        let l_index = challenger.array.corridor.indexOf( c.const.index );
        let k_index = this.data.arena.array.corridor[c.const.index].array.knowledgeable.indexOf( challenger.const.index );
        let state = this.data.arena.array.corridor[c.const.index].var.state;

        if( l_index == -1 && k_index == -1 && state == 0 )
          challenger.array.corridor.push( c.const.index );
      }

    challenger.array.corridor.splice( rand, 1 );
    this.getBorderlands( challenger )
  }

  choseBlur(){
    let index = 0;
    let challenger = this.data.coordinator.array.challenger[index];
    if( challenger.var.banner == null ){
      let rand = Math.floor( Math.random() * challenger.array.borderlands.length );
      let hall = this.convertFloor( challenger.array.borderlands[rand] );
      let floor = this.data.arena.array.hall[hall.i][hall.j].array.floor[hall.f];
      challenger.var.banner = floor;
      challenger.var.growth = 0;


      for( let i = 0; i < challenger.array.floor.length; i++ )
      outflow
    }
  }

  draw(  ){
  }
}
