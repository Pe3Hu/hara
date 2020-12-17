//
class well {
  constructor ( index, anchors ){
    this.const = {
      index: index
    };
    this.var = {
    };
    this.array = {
      anchor: anchors
    };

    this.init();
  }

  init(){
  }

  draw( offset ){
    ellipse( offset.x, offset.y, 10, 10 )
  }
}
