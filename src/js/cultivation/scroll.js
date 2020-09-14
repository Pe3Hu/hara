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
      index: 0
    };
    this.table = {
      markup: []
    }

    this.init();
  }

  initMarkup(){
    this.table.markup = [ [], [] ];
    let leftBorder = 2.5;
    let rightBorder = canvasGrid.x - 3.5;
    this.const.markup.n = Math.floor( ( rightBorder - leftBorder ) / 3 );
    for( let i = 0; i < this.const.markup.n; i++ )
      this.table.markup[0].push( createVector( ( i * 3 + 1.5 ) * cellSize, 1.5 * cellSize ) );
  }

  initRunes(){
    this.array.rune = [ [], [] ];
    this.array.rune[0].push( new rune( this.var.index ) );
  }

  init(){
    this.initMarkup();
    this.initRunes();
  }


  draw(){
    let offset = null;

    for( let i = 0; i < this.array.rune.length; i++ )
      for( let j = 0; j < this.array.rune[i].length; j++ )
        this.array.rune[i][j].draw( this.table.markup[0][0] );
  }
}
