//
class grappled {
  constructor (){
    this.const = {
      a: CELL_SIZE * 3
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      dodecahedron: null,
      tetrahedron: null
    };

    this.init();
  }

  init(){
    //this.data.dodecahedron = new dodecahedron( this.const.a );
    this.data.tetrahedron = new tetrahedron( this.const.a );
  }

  click( offsets ){
  }

  key(){
    switch ( keyCode ) {
      case 32:
        this.data.tetrahedron.var.layer = ( this.data.tetrahedron.var.layer + 1 ) % 2;
        break;
    }
  }

  moved( offsets ){

  }

  update(){
  }

  draw( offsets ){
    //this.data.dodecahedron.draw( offsets );
    this.data.tetrahedron.draw( offsets );
  }
}
