//
class segment {
  constructor ( index, hue, vertexs, angles, n, l ){
    this.const = {
      index: index,
      center: createVector(),
      n: n,
      l: l,
      scale: 10,
      hue: 45
    };
    this.var = {
    };
    this.array = {
      vertex: vertexs,
      angle: angles
    };
    this.color = {
      recognition: {
        h: this.const.hue,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      influence: {
        h: this.const.hue,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };
    this.data = {
      recognition: [],
      influence: []
    }

    this.init();
  }

  init(){
    this.addVertexs()
  }

  addVertexs(){
    //
    let x = 0, y = 0;

    for( let i = 0; i < this.array.vertex.length; i++ ){
      x += this.array.vertex[i].x / this.array.vertex.length;
      y += this.array.vertex[i].y / this.array.vertex.length;
    }

    this.const.center = createVector( x, y )

    if( this.const.index == 0 || this.const.index == this.const.l / 2 )
      this.const.center.y += this.const.scale / 2;

    if( this.const.index == this.const.l - 1 - 2 * this.const.n ||
        this.const.index == this.const.l / 2 - 1 - 2 * this.const.n )
      this.const.center.y -= this.const.scale / 2;

    for( let i = this.array.vertex.length - 1; i > -1 ; i-- ){
      let vertex = this.array.vertex[i].copy();
      vertex.sub( this.const.center );
      vertex.mult( 0.75 );
      vertex.add( this.const.center )
      this.array.vertex.push( vertex );
    }

  }

  addStatus( who, what ){
    this.data[what].push( who );
  }

  draw( offsets, types, time ){
    let offset = offsets[0].copy();
    this.color.recognition.h = this.const.hue;
    this.color.influence.h = this.const.hue;

    for( let what in this.data )
      for( let who of this.data[what] )
        for( let type of types )
          if( who.const.type == type )
            this.color[what].h = who.data.interaction[what].hue;

    fill( this.color.influence.h, this.color.influence.s, this.color.influence.l );
    stroke( this.color.influence.h, this.color.influence.s, this.color.influence.l );

    strokeWeight( 0.2 );
    let index = 0;
    triangle( this.array.vertex[index].x + offset.x, this.array.vertex[index].y + offset.y,
              this.array.vertex[index + 2].x + offset.x, this.array.vertex[index + 2].y + offset.y,
              this.array.vertex[index + 1].x + offset.x, this.array.vertex[index + 1].y + offset.y );
    triangle( this.array.vertex[index + 3].x + offset.x, this.array.vertex[index + 3].y + offset.y,
              this.array.vertex[index + 2].x + offset.x, this.array.vertex[index + 2].y + offset.y,
              this.array.vertex[index + 1].x + offset.x, this.array.vertex[index + 1].y + offset.y );

    fill( this.color.recognition.h, this.color.recognition.s, this.color.recognition.l );
    stroke( this.color.recognition.h, this.color.recognition.s, this.color.recognition.l );

    strokeWeight( 0.2 );
    index = 4;
    triangle( this.array.vertex[index].x + offset.x, this.array.vertex[index].y + offset.y,
              this.array.vertex[index + 2].x + offset.x, this.array.vertex[index + 2].y + offset.y,
              this.array.vertex[index + 1].x + offset.x, this.array.vertex[index + 1].y + offset.y );
    triangle( this.array.vertex[index + 3].x + offset.x, this.array.vertex[index + 3].y + offset.y,
              this.array.vertex[index + 2].x + offset.x, this.array.vertex[index + 2].y + offset.y,
              this.array.vertex[index + 1].x + offset.x, this.array.vertex[index + 1].y + offset.y );

    fill( 0 );
    text( this.const.index, this.const.center.x+ offset.x, this.const.center.y + offset.y+ FONT_SIZE / 3 );
  }
}
