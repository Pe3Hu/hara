//
class core {
  constructor ( a ){
    this.const = {
      a: a
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      tetrahedron: null
    };

    this.init();
  }

  init(){
    this.data.tetrahedron = new tetrahedron( this.const.a );
  }

  draw( offset ){
    noStroke();
    this.data.tetrahedron.draw( offset );
  }
}
