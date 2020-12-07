//
class grappled {
  constructor (){
    this.const = {
      a: CELL_SIZE
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      dodecahedron: null
    };

    this.init();
  }

  init(){
    this.data.dodecahedron = new dodecahedron( this.const.a );
  }

  click( offsets ){
  }

  key(){
  }

  moved( offsets ){
  }

  update(){
  }

  draw( offsets ){
    this.data.dodecahedron.draw( offsets );
  }
}
