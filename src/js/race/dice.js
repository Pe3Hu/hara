//
class dice {
  constructor ( index, edges, a ){
    this.const = {
      index: index,
      edges: edges,
      a: a
    };
    this.var = {
      edge: {
        current: null
      }
    };
    this.array = {
      edge: []
    };

    this.init();
  }

  init(){
    for( let i = 0; i < this.const.edges; i ++ )
      this.array.edge.push( i );
  }

  roll(){
    this.var.edge.current = Math.floor( Math.random() * this.array.edge.length );
  }

  draw( offset ){
    noFill();
    stroke( 0 );
    rect( offset.x - this.const.a / 2, offset.y - this.const.a / 2, this.const.a, this.const.a );

    fill( 0 );
    noStroke();
    let txt = this.array.edge[this.var.edge.current];
    text( txt, offset.x, offset.y + FONT_SIZE / 3 );
  }
}
