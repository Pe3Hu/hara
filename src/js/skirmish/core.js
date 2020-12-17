//
class core {
  constructor ( index, a, anchors, recognition, influence ){
    this.const = {
      index: index,
      a: a
    };
    this.var = {
      interact: {
        setellite: null
      }
    };
    this.array = {
      anchor: anchors
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

  setInteract( type, index ){
    //0 - setellite
    switch ( type ) {
      case -1:
        this.var.interact.setellite = null;
        break;
      case 0:
        this.var.interact.setellite = index;
        break;
    }
  }

  draw( offset ){
    noStroke();
    this.data.tetrahedron.draw( offset );
  }
}
