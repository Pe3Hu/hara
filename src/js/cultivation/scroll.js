//
class scroll {
  constructor (){
    this.const = {
      a: cellSize,
      markup:{
        n: null,
        m: null
      }
    };
    this.array = {
      rune: []
    };
    this.var = {
      index: 0,
      stage: null
    };
    this.table = {
      markup: [],
      ramification: [],
      index: []
    }

    this.init();
    console.log(  )
  }

  initMarkup(){
    this.table.markup = [ [], [] ];
    let size = 5;
    let leftBorder = 2.5;
    let rightBorder = canvasGrid.x - 3.5;
    this.const.markup.n = Math.floor( ( rightBorder - leftBorder ) / size );
    let topBorder = 2.5;
    let botBorder = canvasGrid.y - 2.5;
    this.const.markup.m = Math.floor( ( botBorder - topBorder ) / size );

    for( let i = 0; i < this.const.markup.n; i++ ){
      this.table.markup.push( [] );

      for( let j = 0; j < this.const.markup.m; j++ )
        this.table.markup[i].push( createVector( ( j * size + 2.5 ) * cellSize, ( i * size + 2.5 ) * cellSize ) );
    }
  }

  initRunes(){
    this.array.rune = [ [], [] ];
    let moves = [ 1, 3, 3, 1 ];
    this.var.stage = 0;
    this.table.ramification = [ [] ];
    this.table.index = [ [ 0 ] ];
    this.addRune( moves );
    /*this.nextStage();



    while( this.var.stage < 1 ){
      for( let r = 0; r < this.table.index[this.var.stage - 1].length; r++ ){
        let index = this.table.index[this.var.stage - 1][r];

        for( let i = 0; i < this.array.rune[0][index].array.way.length; i++ ){
          this.table.ramification[this.var.stage].push( [] );
          this.table.ramification[this.var.stage][i].push( this.array.rune[this.var.stage - 1][r].array.way[i] )
        }

        for( let i = 0; i < this.table.ramification[this.var.stage].length; i++ ){
          moves = this.table.ramification[this.var.stage][i];
          this.table.index[this.var.stage].push( this.var.index );
          this.addRune( moves );
        }
      }
    }*/
  }

  init(){
    this.initMarkup();
    this.initRunes();
  }

  addRune( moves ){
    this.array.rune[0].push( new rune( this.var.index, moves ) );
    this.var.index++;
  }

  nextStage(){
    this.var.stage++;
    this.table.ramification .push( [] );
    this.table.index.push( [] );
  }

  draw(){
    let offset = null;

    for( let i = 0; i < this.array.rune.length; i++ )
      for( let j = 0; j < this.array.rune[i].length; j++ ){
        let index = this.array.rune[i][j].const.index;
        let y = Math.floor( index / this.table.markup.length );
        let x = index % this.table.markup.length;
        this.array.rune[i][j].draw( this.table.markup[y][x] );
      }
  }
}
