//
class connection {
  constructor ( index, parent, child ){
    this.const = {
      index: index,
      parent: parent,
      child: child,
      begin: null,
      end: null
    };
    this.var = {
    };
    this.array = {
    };
    this.flag = {
      enable: false
    };
    this.color = {
      bg: {
        h: 210,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      }
    };

    this.init();
  }

  init(){
    this.initVertexs();
  }

  initVertexs(){
    let x = ( this.const.parent.const.center.x + this.const.child.const.center.x ) / 2;
    let y = ( this.const.parent.const.center.y + this.const.child.const.center.y ) / 2;
    let scale = 4;
    let middle = createVector( x, y );
    let begin = this.const.parent.const.center.copy();
    begin.sub( middle );
    begin.div( scale );
    begin.add( middle );
    this.const.begin = begin.copy();
    let end = this.const.child.const.center.copy();
    end.sub( middle );
    end.div( scale );
    end.add( middle );
    this.const.end = end.copy();
  }

  draw( offsets ){
    if( this.flag.enable ){
      let offset = offsets[0];
      strokeWeight( 10 );
      stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l )
      //ellipse( this.const.begin.x + offset.x, this.const.begin.y + offset.y, 10, 10 );
      line( this.const.begin.x + offset.x, this.const.begin.y + offset.y,
            this.const.end.x + offset.x, this.const.end.y + offset.y );
    }
  }
}
