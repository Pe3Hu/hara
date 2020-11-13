//
class arena {
  constructor (  ){
    this.const = {
      a: CELL_SIZE * 0.5
    };
    this.var = {
      center: null
    };
    this.array = {
      hall: [],
      corridor: []
    };

    this.init();
  }

  initHalls(){
    let halls = [ 1, 1, 3, 2, 3, 4, 5, 4, 3, 2, 3, 1, 1 ];
    let index = 0;
    let scale = 2;
    let a = this.const.a * 1.5 * scale;
    let r = this.const.r * 2 * scale;

    for( let i = 0; i < halls.length; i++ ){
      this.array.hall.push( [] );

      for( let j = 0; j < halls[i]; j++ ){
        let x = ( -halls.length / 2 + i ) * a;
        let y = ( -halls[i] / 2 + j ) * r;
        let dx = Math.floor( halls.length / 2 ) - i;
        if( Math.abs( dx ) == 4 && j != 1 )
          x -= Math.sign( dx ) * a / 2;
        let vec = createVector( x, y );
        let floors = 1;
        if( Math.abs( dx ) < 4 ){
          let parity = Math.abs( dx + 1 ) % 2;

          floors = parity + 2;
        }

        this.array.hall[i].push( new hall( index, vec, floors, this.const.a ) );

        index++;
      }
    }
  }

  ininCorridors(){
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHalls();
    this.ininCorridors();
  }

  click(){

  }

  key(){

  }

  draw( offsets ){
    for( let i = 0; i < this.array.hall.length; i++ )
      for( let j = 0; j < this.array.hall[i].length; j++ )
        this.array.hall[i][j].draw( offsets[1] );
  }
}
