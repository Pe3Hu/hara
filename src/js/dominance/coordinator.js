//
class coordinator {
  constructor ( arena, offsets ){
    this.const = {
      clefs: 57,
      challengers : 2,
      decrees: 5,
      a: arena.const.a
    };
    this.var = {
      index: {
        clef: 0,
        player: 0
      },
      current: {
        clef: null,
        distribution: null,
        decree: null,
        zone: null
      }
    };
    this.array = {
      challenger: [],
      clef: [],
      distribution: [],
      activation: [],
      selection: [],
      addon: [],
      discard: [],
      decree: []
    };
    this.data = {
      arena: arena
    };
    //detect changing
    this.flag = {
      outline: {
        distribution: false,
        decree: false
      }
    };
    this.table = {
      size: {
        distribution: null,
        decree: null,
        zone: []
      }
    };

    this.init();
  }

  iniClefs(){
    let regions = this.data.arena.array.region;
    console.log( regions );

    for( let i = 0; i < regions.length; i++ )
      for( let j = 0; j < regions[i].length; j++ )
        this.addClef( regions[i][j] );
  }

  iniChallengers(){
    for( let i = 0; i < this.const.challengers; i++ ){
        this.array.challenger.push( new challenger( i, this.const.a ) );
        //0 - before, 1 - during
        this.array.distribution.push( [ [], [] ] );
        //0 - before, 1 - during
        this.array.activation.push( [ [], [] ] );
        this.array.selection.push( [] );
        this.array.decree.push( [] );

        for( let j = 0; j < this.const.decrees; j++ )
          this.array.decree[i].push( new decree( j, this.array.challenger[i] ) );
    }
  }

  initSizes(){
    this.table.size.distribution = this.array.clef[0].const.size;
    this.table.size.decree = this.array.decree[this.var.index.player][0].const.size;

    let size = createVector( this.data.arena.const.a * 61, this.data.arena.const.a * 31 );
    this.table.size.zone.push( size );

    size = createVector( this.array.clef[0].const.size.x * 3, this.array.clef[0].const.size.y * 5 );
    this.table.size.zone.push( size );

    size = createVector( this.array.clef[0].const.size.x * 2, this.array.clef[0].const.size.y * 3 );
    this.table.size.zone.push( size );

    size = createVector( this.array.clef[0].const.size.x * 8, this.array.clef[0].const.size.y * 4.5 );
    this.table.size.zone.push( size );

    size = createVector( this.array.clef[0].const.size.x * 16, this.array.clef[0].const.size.y * 2 );
    this.table.size.zone.push( size );

    size = createVector( this.array.clef[0].const.size.x * 2, this.array.clef[0].const.size.y * 14 );
    this.table.size.zone.push( size );
  }

  initDecrees(){
    let size = this.table.size.decree;
    let scale = 1.25;

    for( let i = 0; i < this.array.decree.length; i++ ){
      for( let j = 0; j < this.array.decree[i].length; j++ ){
        let x = i - this.array.decree.length / 2 + 0.5;
        let y = j - this.array.decree[i].length / 2  + 0.5;
        let vec = createVector( x * size.x * scale, y * size.y * scale );

        this.array.decree[i][j].setCenter( vec );
      }
    }
  }

  init(){
    this.iniClefs();
    this.iniChallengers();
    this.initSizes();
    this.initDecrees();

    this.handOverClefs();
  }

  addClef( floor ){
    this.array.clef.push( new clef( this.var.index.clef,  floor ) );

    this.var.index.clef++;
  }

  //first distribution
  handOverClefs(){
    this.array.addon = [];

    for( let i = 0; i < this.array.clef.length; i++ )
      this.array.addon.push( this.array.clef[i].const.index );

    this.shuffle( this.array.addon );
    let last = this.array.addon.pop();
    this.array.discard.push( last )

    for( let i = 0; i < this.array.challenger.length; i++ )
      this.pickUpClefs( i );

    this.updateDistribution();
    //this.flag.distribution = true;
    console.log( this.array.addon )
    console.log( this.array.distribution )
  }

  pickUpClefs( challenger ){
    for( let i = 0; i < this.array.challenger[challenger].var.addition; i++ ){
      if( this.array.addon.length == 0 )
        this.reshuffle();

      let index = this.array.addon.pop();
      this.array.distribution[challenger][0].push( index );
      this.array.clef[index].setState( 1 );

      if( challenger == this.var.index.player )
        this.array.clef[index].setPlayer( true );
    }
  }

  reshuffle(){
    if( this.array.discard.length == 0 )
        console.log( 'Колода добора пуста' )
    for( let i = 0; i < this.array.discard.length; i++ )
      this.array.addon.push( this.array.discard.pop() );

    this.array.addon.shuffle();
  }

  activeDecree(){
    let distributions = this.array.distribution[this.var.index.player][1];
    let decrees = this.array.decree[this.var.index.player];

    switch ( this.var.current.decree ) {
      case 0:
        this.keep();
        break;
      case 1:
        this.burn();
        break;
      case 2:
      case 3:
      case 4:
        this.give();
        break;
    }

    this.pickUpClefs( this.var.index.player );
  }

  keep(){
    let distributions = this.array.distribution[this.var.index.player][1];
    let activation = this.array.activation[this.var.index.player][0];

    while( distributions.length > 0 )
      activation.push( distributions.pop() );
  }

  burn(){
    let distributions = this.array.distribution[this.var.index.player][1];
    let activation = this.array.activation[this.var.index.player][0];

    while( distributions.length > 0 )
      activation.push( distributions.pop() );
  }

  give(){
    switch ( this.var.current.decree ) {
      case 2:
      case 3:

        break;
    };
  }

  shuffle( array ){
    for( let i = array.length; i > -1; i-- ){
      let shift = Math.floor( Math.random() * i );
      let index = array.pop();
      array.splice( shift, 0, index );
    }
  }

  click( offsets ){
    //
    if( this.var.current.clef != null ){
      let plus, minus, shift;
      let distributions = this.array.distribution[this.var.index.player];
      let offset = offsets[2];
      let clef = this.array.clef[this.var.current.clef];

      switch ( clef.var.state ) {
        case 1:
          plus = 1;
          minus = 0;
          shift = 1;
          break;
        case 2:
          plus = 0;
          minus = 1;
          shift = -1;
          break;
      }

      this.shiftState( clef, shift );
      let index = distributions[minus].indexOf( clef.const.index );
      let add = distributions[minus].splice( index, 1 );
      distributions[plus].push( add.pop() );
      this.array.clef[clef.const.index].flag.selected = false;
      this.update();
      this.moved( offsets );

      this.decectDecree();
    }
  }

  moved( offsets ){
    //
    this.detectZone( offsets );

    if( this.var.current.zone != null )
      switch ( this.var.current.zone ) {
        case 3:
          this.detectDistribution( offsets[this.var.current.zone] );
          break;
      }
  }

  key(){
    switch ( keyCode ) {
      case 32:
        if( this.var.current.decree != null)
          this.activeDecree();
        break;
    }
  }

  updateDecree(){
    if( this.var.current.decree != null ){
      let decrees = this.array.decree[this.var.index.player];

            console.log(decrees, this.var.current.decree)
      for( let i = 0; i < decrees.length; i++ )
        decrees[i].setSelected( false );

      decrees[this.var.current.decree].setSelected( true );
    }
  }

  updateDistribution(){
    //
    this.sortDistribution();
    let distributions = this.array.distribution[this.var.index.player];
    let max = 14;

    for( let i = 0; i < distributions.length; i++ ){
      let index = distributions[i].indexOf( this.var.current.clef );

      for( let j = 0; j < distributions[i].length; j++ ){
        let clef = this.array.clef[distributions[i][j]];
        let size = clef.const.size;
        let l = -distributions[i].length / 2;
        if( distributions[i].length > max )
          l = -max / 2;
        let x = l + j + 0.5;
        let y;
        switch ( clef.var.state ) {
          case 1:
            y = 0.25;
            break;
          case 2:
            y = - 1.25;
            break;
        }
        let shifted = false;
        if( index != -1 )
          shifted = index < j;

        if( j >= max ){
          shifted = false;
          let jj = j - max;
          x = -( distributions[i].length - max ) / 2 + jj + 0.5;
          y++;

          if( index != -1 && index >= max  )
            shifted = index < j;
        }

        let vec = createVector( x * size.x * 0.5, y * size.y );
        clef.setCenter( vec );
        clef.setShifted( shifted );
      }
    }

    this.data.arena.light()
    this.flag.distribution = false;
  }

  update( offsets ){
    //
    if( this.var.current.zone != null )
      switch ( this.var.current.zone ) {
        case 3:
          this.updateDistribution();
          break;
      }
  }

  sortDistribution(){
    //
    let distributions = this.array.distribution[this.var.index.player][0];
    let regions = [];

    for( let i = 0; i < this.data.arena.array.region.length; i++ )
      regions.push( [] );

    for( let i = 0; i < distributions.length; i++ ){
      regions[this.array.clef[distributions[i]].const.region].push( distributions[i] );
    }

    this.array.distribution[this.var.index.player][0] = [];

    for( let i = 0; i < regions.length; i++ ){
      regions[i].sort();

      for( let j = 0; j < regions[i].length; j++ )
        this.array.distribution[this.var.index.player][0].push( regions[i][j] )
    }
  }

  decectDecree(){
    //
    let l = this.array.distribution[this.var.index.player][1].length;

    let decrees = this.array.decree[this.var.index.player];
    this.var.current.decree = null;

    for( let i = 0; i < decrees.length; i++ )
        if( decrees[i].const.length == l )
          this.var.current.decree = i;

    //same but with switch
    /*switch ( l ) {
      case 3:
        this.var.current.decree = 0;
        break;
      case 4:
        this.var.current.decree = 1;
        break;
      case 6:
        this.var.current.decree = 2;
        break;
      case 8:
        this.var.current.decree = 3;
        break;
      case 9:
        this.var.current.decree = 4;
        break;
      default:
        this.var.current.decree = null;
    }*/

    this.updateDecree();

    console.log( this.var.current.decree );
  }

  detectDistribution( offset ){
    //
    let mouse = createVector( mouseX, mouseY );
    let clef = {
      flag: false,
      index: null
    };

    for( let i = 0; i < this.array.clef.length; i++ )
      if( this.array.clef[i].flag.onScreen && this.array.clef[i].flag.player ){
          let vec = mouse.copy();
          vec.sub( this.array.clef[i].var.center );
          vec.sub( offset );
          vec.x += this.array.clef[i].const.size.y / 4;
          let x = this.array.clef[i].const.size.x / 4 - Math.abs( vec.x );
          let y = this.array.clef[i].const.size.y / 2 - Math.abs( vec.y );
          let flag = ( Math.sign( x ) >= 0 && Math.sign( y ) >= 0 );
          this.array.clef[i].flag.selected = false;

          if( flag ){
            clef.flag = true;
            clef.index = i;
            this.array.clef[i].flag.selected = true;
          }
      }

    this.var.current.clef = clef.index;
  }

  detectZone( offsets ){
    this.var.current.zone = null;
    let mouse = createVector( mouseX, mouseY );

    for( let i = 0; i < this.table.size.zone.length; i++ ){
      let vec = offsets[i].copy();
      vec.sub( mouse );
      let x = this.table.size.zone[i].x / 2 - Math.abs( vec.x );
      let y = this.table.size.zone[i].y / 2 - Math.abs( vec.y );
      let flag = ( Math.sign( x ) >= 0 && Math.sign( y ) >= 0 );

      if( flag )
        this.var.current.zone = i;
    }
  }

  shiftState( clef, shift ){
    let state = clef.var.state + shift;
    clef.setState( state );
  }

  clean( obj ){
    switch ( obj ) {
      case 0://'distribution':
      console.log( obj,this.array[obj][0][0][0] )
        for( let i = 0; i < this.array[obj].length; i++ )
          for( let j = 0; j < this.array[obj][i].length; j++ )
            for( let l = 0; l < this.array[obj][i][j].length; l++ )
             this.array[obj][i][j][l].clean();
        break;
      case 'decree':
        for( let i = 0; i < this.array[obj].length; i++ )
          for( let j = 0; j < this.array[obj][i].length; j++ )
             this.array[obj][i][j].clean();
        break;

    }

  }

  compareIndexs( a, b ) {
    return a - b;
  }

  drawZones( offsets ){
    noFill();
    stroke( 0 );
    for( let i = 0; i < this.table.size.zone.length; i++ )
      rect( offsets[i].x - this.table.size.zone[i].x / 2, offsets[i].y - this.table.size.zone[i].y / 2,
        this.table.size.zone[i].x, this.table.size.zone[i].y );
  }

  draw( offsets ){
    this.update( offsets );
    this.drawZones( offsets );

    let offset = offsets[3];

    for( let i = 0; i < this.array.clef.length; i++ )
      this.array.clef[i].draw( offset );

    offset = offsets[1];

    for( let i = 0; i < this.array.decree.length; i++ )
      for( let j = 0; j < this.array.decree[i].length; j++ )
          this.array.decree[i][j].draw( offset );

    textSize( 40 );
    for( let i = 0; i < this.table.size.zone.length; i++ )
      text( i, offsets[i].x, offsets[i].y + 40 / 3 );
  }
}
