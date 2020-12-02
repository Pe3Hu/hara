//
class corridor {
  constructor ( index, floors, type, a ){
    this.const = {
      index: index,
      a: a
    };
    this.var = {
      type: type,
      state: 0
    };
    this.array = {
      floor: floors,
      shift: [],
      knowledgeable: []
    }

    this.init();
  }

  initShifts(){
    let a = this.array.floor[0].var.center.copy();
    let b = this.array.floor[1].var.center.copy();

    switch ( this.var.type ) {
      case 0:
        a.x += this.const.a / 2;
        b.x -= this.const.a / 2;
        break;
      case 1:
        a.y += this.const.a / 2;
        b.y -= this.const.a / 2;
        break;
      case 2:
        a.y -= this.const.a / 2;
        b.y += this.const.a / 2;
        break;
    }

    this.array.shift = [ a, b ];
  }

  initHues(){
    this.array.hue = [
      210,
      0
   ];
  }

  init(){
    this.initShifts();
    this.initHues();
  }

  setState( state ){
    //0 - clear passage
    //1 - password pass
    //2 - collapsed
    this.var.state = state;
  }

  addKnowledgeable( challenger ){
    this.array.knowledgeable.push( challenger );
  }

  draw( offset ){
    let begin = this.array.shift[0].copy();
    let end = this.array.shift[1].copy();
    begin.add( offset );
    end.add( offset );
    stroke( 0 );
    //weight = 1
    strokeWeight( 1 )
    line( begin.x, begin.y, end.x, end.y );

    for( let i = 0; i < this.array.knowledgeable.length; i++ ){
      let superstructure = createVector( 0, i * 1 );
      begin.add( superstructure );
      end.add( superstructure );
      stroke( this.array.hue[this.array.knowledgeable[i]], COLOR_MAX * 0.75, COLOR_MAX * 0.5 )
      line( begin.x, begin.y, end.x, end.y );
    }
  }
}
