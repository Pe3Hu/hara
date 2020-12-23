//
class well {
  constructor ( index, center, anchors, eradiation ){
    this.const = {
      index: index,
      center: center,
      type: 0
    };
    this.var = {
    };
    this.array = {
      anchor: anchors
    };
    this.data = {
      interaction: {
        eradiation: eradiation
      }
    }

    this.init();
  }

  init(){
  }

  draw( offsets ){
    let offset = this.const.center.copy();
    offset.add( offsets[0] );

    fill( 'green' )

    ellipse( offset.x, offset.y, 10, 10 );
  }
}
