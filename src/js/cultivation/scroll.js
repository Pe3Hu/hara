//
class scroll {
  constructor (){
    this.const = {
      a: cellSize * 0.2,
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
      ism: null
    };
    this.table = {
      markup: [],
      totem: []
    };

    this.init();
  }

  initMarkup(){
    //0 - knots
    //1 - ism
    this.table.markup = [ [], [] ];
    let size = 10 * this.const.a;
    let leftBorder = 2 * cellSize;
    let rightBorder = ( canvasGrid.x - 3.5 ) * cellSize;
    this.const.markup.n = Math.floor( ( rightBorder - leftBorder ) / size );
    let topBorder = 2 * cellSize;
    let botBorder = ( canvasGrid.y - 1 ) * cellSize;
    this.const.markup.m = 3;//Math.floor( ( botBorder - topBorder ) / size );

    for( let i = 0; i < this.const.markup.m; i++ ){
      this.table.markup[0].push( [] );

      for( let j = 0; j < this.const.markup.n; j++ )
        this.table.markup[0][i].push( createVector( leftBorder + j * size, topBorder + i * size ) );

    let x = leftBorder + ( rightBorder - leftBorder ) / 2;
    let y = topBorder + ( botBorder - topBorder ) / 2;
    this.table.markup[1].push( createVector( x, y ) )
    }
  }

  initTotems(){
    this.table.totem = [ 'A', 'J', 'B', 'D', 'V', 'O', 'F', 'M', 'Q', 'G', 'N', 'L', 'C', 'E', 'R', 'U', 'X', 'Z', 'W', 'Y', 'S', 'K', 'T', 'P', 'H', 'I' ]
  }

  initRunes(){
    this.array.rune = [ [], [] ];

    for( let i = 0; i < this.table.totem.length; i++ )
      this.addRune( this.table.totem[i] );
  }

  initIsm(){
    let size = 9;
    let a = this.const.a * 5;
    this.var.ism = new ism( a, size );
  }

  init(){
    this.initMarkup();
    this.initTotems();
    this.initRunes();
    this.initIsm();
  }

  addRune( totem ){
    this.array.rune[0].push( new rune( this.var.index, this.const.a, totem ) );
    this.var.index++;
  }

  draw(){
    for( let i = 0; i < this.array.rune.length; i++ )
      for( let j = 0; j < this.array.rune[i].length; j++ ){
        let index = this.array.rune[i][j].const.index;
        let y = Math.floor( index / this.table.markup[0][0].length );
        let x = index % this.table.markup[0][0].length;
        this.array.rune[i][j].draw( this.table.markup[0][y][x].copy() );
      }

    this.var.ism.draw( this.table.markup[1][0].copy() );
  }
}
