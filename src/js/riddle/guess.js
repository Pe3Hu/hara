//
class guess {
  constructor ( index, values ){
    this.const = {
      index: index
    };
    this.var = {
    };
    this.array = {
      value: values
    };
    this.data = {
      ss: null,
      bs: null,
      f: null
    }

    this.init();
  }

  init(){
  }

  draw( offset ){

    let txt = this.data.f;
    let x = this.array.value.length / 2 + 1;
    text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 + ( 1 + this.const.index ) * CELL_SIZE );
    x++;
    txt = this.data.ss;
    text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 + ( 1 + this.const.index ) * CELL_SIZE );
    x++;
    txt = this.data.bs;
    text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 + ( 1 + this.const.index ) * CELL_SIZE );

    for( let i = 0; i < this.array.value.length; i++ ){
      x = this.array.value.length / 2 - i - 0.5;
      txt = this.array.value[i];
      text( txt, offset.x + x * CELL_SIZE, offset.y + FONT_SIZE / 3 + ( 1 + this.const.index ) * CELL_SIZE );
    }
  }
}
