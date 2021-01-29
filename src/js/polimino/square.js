//
class square{
  constructor( size ){
    this.const = {
      a: CELL_SIZE * 2,
      n: size * 2 + 1,
      size: size
    };
    this.var = {
      distributionLength: 0,
      handSize: 4,
      currentPrivateCard: null,
      previousCard: null
    }
    this.array = {
      //
      distribution: [],
      offset: [],
      card: [],
      privateCardIndex: [
        //notTaken cards
        [],
        //waiting cards
        [],
        //involved cards
        []
      ],
      neutralCardIndex: [
        //notTaken cards
        [],
        //involved cards
        []
      ],
      cell: []
    }

    this.init();
  }

  init(){
    this.initOffsets();
    this.initNeighbors();
    this.initCells();
    this.initDistribution();
    this.initCards();
    this.nextCell();
    //this.initPenta();
  }

  initOffsets(){
  //indent for the grid
    let offsets = [];
    let vec = createVector( this.const.a * 1, this.const.a * 1 )
    offsets.push( vec.copy() );
    this.array.offset.push( offsets );

    //indent for the grid
    offsets = [];
    vec.add( createVector( 0.5 * this.const.a, this.const.a * ( this.const.n + 0.5 ) ) );
    for ( let i = 0; i < this.var.handSize; i++){
      offsets.push( vec.copy() );
      vec.x += 1.5 * this.const.a;
    }
    this.array.offset.push( offsets );
  }

  initNeighbors(){
    this.array.neighbor = [
      createVector( 0, -1 ),
      createVector( 1, 0 ),
      createVector( 0, 1 ),
      createVector( -1, 0 )
    ];
  }

  initCells(){
    for( let i = 0; i < this.const.n; i++ ){
      this.array.cell.push( [] );
      for( let j = 0; j < this.const.n; j++ ){
          let index = i * this.const.n + j;
          let vec = this.array.offset[0][0].copy();
          let grid = createVector( j, i );
          vec.x += this.const.a * j;
          vec.y += this.const.a * i;
          this.array.cell[i].push( new cell( index, vec, grid, this.const.a ) );
      }
    }
  }

  initPenta(){
    this.penta = new pentamino();

    for( let i = 0; i < this.penta.array.mask.length; i++ ){
      let grid = this.convertIndex( this.penta.array.mask[i] );
      this.array.cell[grid.y][grid.x].setStatus( 1 );
    }
  }

  initCards(){
    this.array.card = [];
    this.initNeutralCards();
    this.initPlayerCards();
  }

  initNeutralCards(){
    this.array.card.push( [] );
    let predisposition;
    let utensils = 0;
    let sin = null;
    let grade = null;
    let n = 12;
    let bigIncrease = 3;
    let smallIncrease = 1;

    for( let i = 0; i < n; i++ ){
      predisposition = [];
      let distributionSmall = [];
      let distributionBig = [];
      let caste = Math.floor( Math.random() * 13 );

      //distribution algorithm for predisposition
      for( let j = 0; j < 7; j++ ){
        //base value
        predisposition.push( 1 );
        //possible increase
        distributionSmall.push( j );
        distributionBig.push( j );
      }

      let rand = Math.floor( Math.random() * distributionBig.length );
      let value = distributionBig[rand];
      let index = distributionSmall.indexOf( value );
      predisposition[value] += bigIncrease;
      distributionSmall.splice( index, 1 );

      rand = Math.floor( Math.random() * distributionSmall.length );
      value = distributionSmall[rand];
      index = distributionSmall.indexOf( value );
      predisposition[value] += smallIncrease;
      distributionSmall.splice( index, 1 );

      rand = Math.floor( Math.random() * distributionSmall.length );
      value = distributionSmall[rand];
      predisposition[value] += smallIncrease;

      this.array.card[0].push( new card( i, this.const.a, utensils, caste, sin, grade, predisposition ) );
      this.array.neutralCardIndex[0].push( i );
    }

/*
    let n = 4;
    for ( let i = 0; i < n; i++){
      caste = i;
      predisposition = [];

      for ( let j = 0; i < 7; j++){
        let rand = j;
        predisposition.push( rand );
      }

      this.array.card[0].push( new card( i, this.const.a, utensils, caste, null, null, predisposition ) );
    }*/
  }

  initPlayerCards(){
    this.array.card.push( [] );
    let index;
    let caste;
    let sin;
    let utensils = 1;
    let grade = 0;
    let predisposition = null;
    let a = this.const.a;

    let n = 7;
    for ( let i = 0; i < n; i++){
      index = i;
      caste = i;
      sin = i;
      this.array.card[1].push( new card( index, a, utensils, caste, sin, grade, predisposition ) );
      this.array.privateCardIndex[0].push( i );
    }

    let size = this.var.handSize;
    if( this.array.privateCardIndex[0].length < this.var.handSize )
      size = this.array.privateCardIndex[0].length;

    for ( let i = size - 1; i >= 0; i-- ){
      let index = this.array.privateCardIndex[0][i];
      this.array.privateCardIndex[1].push( index );
      this.array.privateCardIndex[0].splice( i, 1 );
    }

    this.updateWaitingCards();
  }

  initDistribution(){
    let indexs = [];
    let oldAdjacency = [];
    let newAdjacency = [];
    let allCells = [];
    let count = 0;
    let d = this.const.n;

    //start distribution from the center
    let grid = createVector( this.const.size, this.const.size );
    let index = this.convertGrid( grid );
    indexs.push( index );
    this.array.distribution.push( [] );

    for( let i = 0; i < d; i++ )
      this.array.distribution[count].push( index );

    //set all not distributed cells
    for( let i = 0; i < this.array.cell.length; i++ )
      for( let j = 0; j < this.array.cell[i].length; j++ )
        if( this.array.cell[i][j].const.index != index )
          allCells.push( this.array.cell[i][j].const.index );

    //сalculate first neighbors
    oldAdjacency.push( index );
    while( allCells.length > 0 && count < d ){
      count++;
      newAdjacency = [];

      for( let i = 0; i < oldAdjacency.length; i++ )
        for( let j = 0; j < this.array.neighbor.length; j++ ){
          let newGrid = this.convertIndex( oldAdjacency[i] );
          newGrid.add( this.array.neighbor[j] );
          //validation check
          if( this.checkGrid( newGrid ) ){
            let newIndex = this.convertGrid( newGrid );
            let idAll = allCells.indexOf( newIndex);
            let idNew = indexs.indexOf( newIndex);
            //console.log( newIndex, idAll, idNew );
            //add only missing indexes
            if( idAll != -1 && idNew == -1 ){
              newAdjacency.push( newIndex );
              indexs.push( newIndex );
              allCells.splice( idAll, 1 );
            }
          }
        }

      oldAdjacency =  [];
      this.array.distribution.push( [] );

      for( let i = 0; i < newAdjacency.length; i++ ){
        for( let j = 0; j < d - count; j++ )
          this.array.distribution[count].push( newAdjacency[i] );
        oldAdjacency.push( newAdjacency[i] );
      }
    }

    //sort and length
    for( let i = 0; i < this.array.distribution.length; i++ ){
      this.array.distribution[i].sort(
        function(a, b) {
          if ( a > b )
            return 1;
          if ( a < b )
            return -1;
          return 0;
        }
       );
      this.var.distributionLength += this.array.distribution[i].length;
    }
  }

  nextCell( round ){
    if( this.array.neutralCardIndex[0].length == 0 )
      return;

    if( this.var.distributionLength == 0 )
      return;

    let index = null;
    let grid = null;
    let count = null;
    let id = null;
    let l = 0;
    let rand = Math.floor( Math.random() * this.var.distributionLength );

    for( let i = 0; i < this.array.distribution.length; i++ ){
      l += this.array.distribution[i].length;
      if( l > rand ){
        //this.array.distribution[i].length
        id = l - rand;
        if( id == this.array.distribution[i].length )
           id = 0;

        index = this.array.distribution[i][id];
        count = i;
        grid = this.convertIndex( index );
        for( let j = this.array.distribution[i].length - 1; j >= 0; j-- )
          if( this.array.distribution[i][j] == index )
            this.array.distribution[i].splice( j, 1 );

        this.var.distributionLength -= this.const.n - count;
        break;
      }
    }

    let currentNeutralCard = this.array.neutralCardIndex[0].pop();
    let card = this.array.card[0][currentNeutralCard];
    this.array.cell[grid.y][grid.x].setStatus( 2, card );
    this.array.card[0][currentNeutralCard].setStatus( 2, null, this.array.cell[grid.y][grid.x] );
    this.array.neutralCardIndex[1].push( currentNeutralCard );
  }

  playCardFromHand( grid ){
    this.array.cell[grid.y][grid.x].setStatus( 1, this.array.card[1][this.var.currentPrivateCard] );
    this.array.card[1][this.var.currentPrivateCard].setStatus( 2, null, this.array.cell[grid.y][grid.x] );
    let index =  this.array.privateCardIndex[1].indexOf( this.var.currentPrivateCard );
    this.array.privateCardIndex[1].splice( index, 1 );
    this.array.privateCardIndex[2].push( this.var.currentPrivateCard );
    this.var.previousCard = this.array.card[1][this.var.currentPrivateCard];
    this.var.currentPrivateCard = null;

    this.updateWaitingCards();
  }

  returnCard(){
    if( this.var.previousCard == null )
      return;

    let index = this.array.privateCardIndex[2].pop();
    let center = this.array.offset[1][this.array.privateCardIndex[1].length];
    let cell = this.var.previousCard.var.cell;
    this.array.privateCardIndex[1].push( index );

    for( let i = 0; i < this.array.card[1].length; i++ )
      if( this.array.card[1][i].const.index == index ){
        this.array.card[1][i].setStatus( 1, center );
        break;
      }

    cell.setStatus( 0 );
    this.var.previousCard = null;

  }

  updateWaitingCards(){
    for( let i = 0; i < this.array.privateCardIndex[1].length; i++ ){
      let index = this.array.privateCardIndex[1][i];
      for( let j = 0; j < this.array.card[1].length; j++ )
        if( this.array.card[1][j].const.index == index ){
          this.array.card[1][j].setStatus( 1, this.array.offset[1][i] );
        }
    }
  }

  //find the grid coordinates by index
  convertIndex( index ){
    if( index == undefined )
      return null;

    let i = Math.floor( index / this.const.n );
    let j = index % this.const.n;
    return createVector( j, i );
  }

  //find the index coordinates by grid coordinates
  convertGrid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.n + vec.x;
  }

  checkGrid( vec ){
    let flag = true;
    if( vec.x >= this.const.n || vec.x < 0 ||
        vec.y >= this.const.n || vec.y < 0 )
      flag = false;
    return flag;
  }

  compareNumbers(a, b) {
    if ( a > b )
      return 1;
    if ( a < b )
      return -1;
    return 0;
  }

  lips(){
    stroke( 0 );
    let offset = createVector( 0.25 * this.const.a, 0.25  * this.const.a );
    noFill();
    rect( offset.x, offset.y, this.const.a, this.const.a );

    let vertex = [];

    let center = offset.copy();
    let d = this.const.a / 12;
    center.x += this.const.a / 2;
    center.y += this.const.a / 2;
    let point = center.copy();
    point.x -= 1.5 * d;
    point.y -= 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 1.5 * d;
    point.y -= 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= 6 * d;
    point.y -= 0.5 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 6 * d;
    point.y -= 0.5 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x -= 2.5 * d;
    point.y += 2 * d;
    vertex.push( point.copy() );

    point = center.copy();
    point.x += 2.5 * d;
    point.y += 2 * d;
    vertex.push( point.copy() );

    line( vertex[0].x, vertex[0].y, vertex[1].x, vertex[1].y );
    line( vertex[0].x, vertex[0].y, vertex[2].x, vertex[2].y );
    line( vertex[3].x, vertex[3].y, vertex[2].x, vertex[2].y );
    line( vertex[3].x, vertex[3].y, vertex[2].x, vertex[2].y );
    line( vertex[0].x, vertex[0].y, vertex[4].x, vertex[4].y );
    line( vertex[5].x, vertex[5].y, vertex[1].x, vertex[1].y );
    line( vertex[3].x, vertex[3].y, vertex[6].x, vertex[6].y );
    line( vertex[6].x, vertex[6].y, vertex[7].x, vertex[7].y );
    line( vertex[1].x, vertex[1].y, vertex[7].x, vertex[7].y );
    line( vertex[6].x, vertex[6].y, vertex[7].x, vertex[7].y );
    line( vertex[8].x, vertex[8].y, vertex[2].x, vertex[2].y );
    line( vertex[3].x, vertex[3].y, vertex[8].x, vertex[8].y );
    line( vertex[6].x, vertex[6].y, vertex[9].x, vertex[9].y );
    line( vertex[9].x, vertex[9].y, vertex[7].x, vertex[7].y );
    line( vertex[9].x, vertex[9].y, vertex[8].x, vertex[8].y );
  }

  detectGrid(){
    let x = mouseX + this.const.a / 2;
    let y = mouseY + this.const.a / 2;
    let mouse = createVector( x, y );
    mouse.sub( this.array.offset[0][0] );
    let grid = createVector(
      Math.floor( mouse.x / this.const.a ),
      Math.floor( mouse.y / this.const.a )
    );

    if( !this.checkGrid( grid ) || this.var.currentPrivateCard == null )
      return;

    this.playCardFromHand( grid );
  }

  detectCard(){
    let x = mouseX;
    let y = mouseY;
    let mouse = createVector( x, y );

    for( let i = 0; i < this.array.card[1].length; i++ ){
      let vec = mouse.copy();
      vec.sub( this.array.card[1][i].const.center );
      if( vec.x > -0.5 * this.const.a && vec.x < 0.5 * this.const.a &&
          vec.y > -0.5 * this.const.a && vec.y < 0.5 * this.const.a ){
            this.var.currentPrivateCard = i;
            return;
          }
    }
  }

  click(){
    this.detectCard();
    this.detectGrid();
  }  

  moved( offsets ){
  }

  draw(){
    for( let i = 0; i < this.array.cell.length; i++ )
      for( let j = 0; j < this.array.cell[i].length; j++ )
        this.array.cell[i][j].draw();

    for( let i = 0; i < this.array.card.length; i++ )
      for( let j = 0; j < this.array.card[i].length; j++ )
        this.array.card[i][j].draw();
    //this.lips();
  }
}
