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
      }
    };
    this.array = {
      anchor: anchors
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

  init(){
    let parent = 0;
    this.data.tetrahedron = new tetrahedron( this.const.a, parent );
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
     /*ill( 'blue' )
    ellipse( offset.x, offset.y, 10, 10 )*/
  }
}
