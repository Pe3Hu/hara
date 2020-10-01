class button {
  constructor ( index, layer, name, type, center ){
    this.layer = layer;
    this.name = name;
    this.type = type;
    this.center = center;
    this.color = color( COLOR_MAX / 2 );
    this.const = {
      index: index,
      a: CELL_SIZE,
      d: CELL_SIZE * 1,
      r: CELL_SIZE * 0.4,
      n: 5,
      m: 8
    };
    this.array = {
      vertex: []
    }
    this.description = null;
    this.onScreen = true;
    this.pressed = false;

    this.initVertexs();
  }

  initVertexs(){
    for( let i = 0; i < this.const.m; i ++ ){
      this.array.vertex.push([]);
      for( let j = 0; j < this.const.n; j ++ ){
        let angle = Math.PI * 2 / this.const.n *  j - Math.PI - Math.PI/4 * i;
        let r = this.const.a / 4;
        if ( j == 0 )
          r *= 2;
        let x = this.center.x + Math.sin( angle ) * r;
        let y = this.center.y + Math.cos( angle ) * r;
        let vec = createVector( x, y );
        this.array.vertex[i].push( vec.copy() );
      }
    }
  }

  setDescription( txt ){
    this.description = txt;
  }

  press(){
    this.pressed = !this.pressed;
  }

  draw( layer ){
    if ( ( this.layer == layer || this.layer == 99 ) && this.onScreen ){
      let d = null;

      //draw layer change buttons
      if ( this.type > -1 && this.type < 10 ){
        noStroke();
        switch ( this.type ) {
          case 0:
            fill( 340, COLOR_MAX * 1, COLOR_MAX * 0.5 );
            break;
          case 1:
            fill( 150, COLOR_MAX * 1, COLOR_MAX * 0.5 );
            break;
          case 2:
            fill( 50, COLOR_MAX * 1, COLOR_MAX * 0.5 );
            break;
          case 3:
            fill( 220, COLOR_MAX * 1, COLOR_MAX * 0.5 );
            break;
          case 4:
            fill( 300, COLOR_MAX * 1, COLOR_MAX * 0.5 );
            break;
        }
        rect(
          this.center.x - this.const.a / 2,
          this.center.y - this.const.a / 2,
          this.const.a, this.const.a
        );
      }

      if( this.type > 9 && this.type < 12  ){
        switch ( this.type ) {
          case 10:
            fill('purple');
            break;
          case 11:
            fill('purple');
            break;
          }
          noStroke();
          rect(
            this.center.x - this.const.a / 2,
            this.center.y - this.const.a / 2,
            this.const.a, this.const.a
          );
      }

      if( this.type == 12 ){
        if( this.pressed )
          fill( 120, COLOR_MAX * 1, COLOR_MAX * 0.5 );
        else
          fill( 60, COLOR_MAX * 1, COLOR_MAX * 0.5 );
        noStroke();
        rect(
          this.center.x - this.const.a / 2,
          this.center.y - this.const.a / 2,
          this.const.a, this.const.a
        );
      }
    }
  }
}
