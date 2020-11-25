//
class coordinator {
  constructor ( arena ){
    this.const = {
      clefs: 57,
      challengers : 2,
      decrees: 4,
      a: arena.const.a
    };
    this.var = {
      index: {
        clef: 0,
        player: 0
      },
      current: {
        decree: null,
        outline: null
      },
      flag: {
        outline: false
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
      decree: [],
      outline: {
        distribution: []
      }
    };
    this.data = {
      arena: arena
    }

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
        this.array.challenger.push( new challenger() );
        //0 - before, 1 - during
        this.array.distribution.push( [ [], [] ] );
        //0 - before, 1 - during
        this.array.activation.push( [ [], [] ] );
        this.array.selection.push( [] );
        //0 - active, 1 - not active
        this.array.decree.push( [ [], [] ] );

        for( let j = 0; j < this.const.decrees; j++ )
          this.array.decree[i][0].push( new decree( j, i ) );
    }
  }

  init(){
    this.iniClefs();
    this.iniChallengers();

    this.handOverClefs();
  }

  addClef( floor ){
    this.array.clef.push( new clef( this.var.index.clef,  floor ) );

    this.var.index.clef++;
  }

  handOverClefs(){
    for( let i = 0; i < this.array.clef.length; i++ )
      this.array.addon.push( this.array.clef[i].const.index );

    this.shuffle( this.array.addon );
    let last = this.array.addon.pop();
    this.array.discard.push( last )

    for( let i = 0; i < this.array.challenger.length; i++ )
      this.pickUpClefs( i );

    this.var.flag.outline = true;
    console.log( this.array.addon )
    console.log( this.array.distribution )
  }

  pickUpClefs( challenger ){
    for( let i = 0; i < this.array.challenger[challenger].var.addition; i++ ){
      let index = this.array.addon.pop();
      this.array.distribution[challenger][0].push( index );
      this.array.clef[index].setState( 1 );
    }
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
        this.give();
        break;
    }

    let decree = decrees[0].splice( this.var.current.decree, 1 );
    decrees[1].push( decree.pop() );
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
    let offset = offsets[2];
    let current = {
      clef: null,
      d: INFINITY
    };
    let mouse = createVector( mouseX, mouseY );
    let distributions = this.array.distribution[this.var.index.player];

    for( let i = 0; i < distributions.length; i++ )
      for( let j = 0; j < distributions[i].length; j++ ){
        let clef = this.array.clef[distributions[i][j]];
        let x = 0.5 - distributions[i].length / 2 + j;
        let y = 1.25 * ( 1 - clef.var.state );
        let a = clef.const.a;
        let vec = createVector( x * a, y * a );
        vec.add( offset );
        let d = mouse.dist( vec );

        if( d < current.d && d < a / Math.sqrt( 2 ) )
          current = {
            clef: clef,
            d: d
          }
      }


    if( current.clef != null ){
      let plus, minus, shift;

      switch ( current.clef.var.state ) {
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

      this.shiftState( current.clef, shift );
      let index = distributions[minus].indexOf( current.clef.const.index );
      let clef = distributions[minus].splice( index, 1 );
      distributions[plus].push( clef.pop() );

      this.updateDecree();
      this.var.flag.outline = true;
    }
  }

  moved( offsets ){
    if( this.var.flag.outline )
      this.updateOutline( offsets );

    let mouse = createVector( mouseX, mouseY );
    let outlines = this.array.outline.distribution;
    let distributions = this.array.distribution[this.var.index.player];
    let a = this.array.clef[0].const.a;
    let size = createVector( a / 4, a / 2 );
    this.var.current.outline = null;

    for( let i = 0; i < outlines.length; i++ )
      for( let j = 0; j < outlines[i].length; j++ ){
        let vec = mouse.copy();
        vec.sub( outlines[i][j] );
        let x = size.x - Math.abs( vec.x );
        let y = size.y - Math.abs( vec.y );
        let flag = ( Math.sign( x ) >= 0 && Math.sign( y ) >= 0 );

        if( flag ){
          this.var.current.outline = createVector( i, j )
        }
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
    let distributions = this.array.distribution[this.var.index.player][1];
    let decrees = this.array.decree[this.var.index.player][0];
    this.var.current.decree = null;

    for( let i = 0; i < decrees.length; i++ )
      if( decrees[i].const.length == distributions.length )
        this.var.current.decree = i;
  }

  updateOutline( offsets ){
    //
    let offset = offsets[2];
    let distributions = this.array.distribution[this.var.index.player];
    this.array.outline.distribution = [];
    let outlines = this.array.outline.distribution;

    for( let i = 0; i < distributions.length; i++ ){
      outlines.push( [] );
      for( let j = 0; j < distributions[i].length; j++ ){
        let clef = this.array.clef[distributions[i][j]];
        let a = clef.const.a;
        let x = 0.5 - distributions[i].length / 2 + j - 0.5;
        let y = 1.25 * ( 1 - clef.var.state );
        let vec = createVector( x * a * 0.5, y * a );
        vec.add( offset );
        outlines[i].push( vec );
      }
    }

    console.log( outlines )
    this.data.arena.light(  )
    this.var.flag.outline = false;
  }

  shiftState( clef, shift ){
    let state = clef.var.state + shift;
    clef.setState( state );
  }

  draw( offsets ){
    let offset = offsets[2];
    let distributions = this.array.distribution[this.var.index.player];

    for( let i = 0; i < distributions.length; i++ )
      for( let j = 0; j < distributions[i].length; j++ ){
        let clef = this.array.clef[distributions[i][j]];
        let x = 0.5 - distributions[i].length / 2 + j;
        let y = 1.25 * ( 1 - clef.var.state );
        let a = clef.const.a;
        let vec = createVector( x * a * 0.5, y * a );
        vec.add( offset );

        //move over
        if( this.var.current.outline != null ){
          if( this.var.current.outline.y < j && this.var.current.outline.x == i )
            vec.x += a * 0.5;
        }

        clef.draw( vec );
      }


    //fill( 0 );
    //ellipse( offset.x, offset.y, this.const.a, this.const.a );
  }
}
