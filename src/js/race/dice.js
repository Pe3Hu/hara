//
class dice {
  constructor ( index, edges, a ){
    this.const = {
      index: index,
      edges: edges,
      a: a
    };
    this.var = {
      current: {
        edge: null
      }
    };
    this.array = {
      edge: []
    };

    this.init();
  }

  init(){
    for( let i = 0; i < this.const.edges / 2; i++ )
      this.array.edge.push( i );

    for( let i = this.const.edges - 1; i > this.const.edges / 2 - 1; i-- )
      this.array.edge.push( i );
  }

  roll(){
    this.var.current.edge = Math.floor( Math.random() * this.array.edge.length );
  }

  draw( offset ){
    noFill();
    stroke( 0 );
    rect( offset.x - this.const.a / 2, offset.y - this.const.a / 2, this.const.a, this.const.a );

    fill( 0 );
    noStroke();
    let txt = this.array.edge[this.var.current.edge];
    text( txt, offset.x, offset.y + FONT_SIZE / 3 );
  }
}
