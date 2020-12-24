//
class core {
  constructor ( index, a, center, anchors, recognition, influence ){
    this.const = {
      index: index,
      a: a,
      center: center,
      type: 1
    };
    this.var = {
      interact: {
        setellite: null
      },
      index: {
        modulus: 0
      }
    };
    this.array = {
      anchor: anchors,
      modulus: []
    };
    this.data = {
      tetrahedron: null,
      interaction: {
        recognition: recognition,
        influence: influence
      }
    };

    this.init();
  }

  initModuluss(){
    let trigons = this.data.tetrahedron.array.trigon;

    for( let trigon of trigons )
      for( let i = 0; i < trigon.const.n; i++ ){
        let ii = ( i + 1 ) % trigon.const.n;
        let center = createVector(
          ( ( trigon.array.vertex[i].x + trigon.array.vertex[ii].x ) / 2 + trigon.const.center.x ) / 2,
          ( ( trigon.array.vertex[i].y + trigon.array.vertex[ii].y ) / 2 + trigon.const.center.y ) / 2 );

        this.array.modulus.push( new modulus( this.var.index.modulus, center, this.const.r ) );
        this.var.index.modulus++;
      }

    let index = 0;
    this.array.modulus[index].setType( 0, 0 );
    index++;
    this.array.modulus[index].setType( 0, 1 );
    index++;
    this.array.modulus[index].setType( 0, 2 );
    index++;
    this.array.modulus[index].setType( 1, 2 );
    index++;
    this.array.modulus[index].setType( 1, 3 );
    index++;
    this.array.modulus[index].setType( 2, 3 );
    index++;
    this.array.modulus[index].setType( 2, 4 );
    index++;
    this.array.modulus[index].setType( 4, 1 );
    index++;
    this.array.modulus[index].setType( 4, 2 );
    index++;
    this.array.modulus[index].setType( 4, 3 );
  }


  init(){
    let parent = 0;
    this.data.tetrahedron = new tetrahedron( this.const.a, parent );

    this.initModuluss();
  }

  setInteract( type, index, anchor ){
    //0 - setellite
    switch ( type ) {
      case -1:
        this.var.interact.setellite = null;
        this.var.interact.anchor = null;
        break;
      case 0:
        this.var.interact.setellite = index;
        this.var.interact.anchor = anchor;
        break;
    }
  }

  draw( offsets ){
    let offset = this.const.center.copy();
    offset.add( offsets[0] );
    noStroke();
    this.data.tetrahedron.draw( offset );

    for( let modulus of this.array.modulus )
      modulus.draw( offset );
  }
}
