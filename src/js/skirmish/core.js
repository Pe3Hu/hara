//
class core {
  constructor ( index, a, recognition, influence ){
    this.const = {
      index: index,
      a: a
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      tetrahedron: null,
      range: {
        recognition: recognition,
        influence: influence
      }
    };

    this.init();
  }

  init(){
    let parent = 0;
    this.data.tetrahedron = new tetrahedron( this.const.a, parent );
  }

  draw( offset ){
    noStroke();
    this.data.tetrahedron.draw( offset );
  }
}
