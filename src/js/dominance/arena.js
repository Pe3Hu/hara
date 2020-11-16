//
class arena {
  constructor (  ){
    this.const = {
      a: CELL_SIZE * 0.5
    };
    this.var = {
      center: null,
      index: {
        link: 0
      }
    };
    this.array = {
      hall: [],
      corridor: [],
      link: []
    };

    this.init();
  }

  initHalls(){
    let halls = [ 1, 1, 3, 2, 3, 4, 5, 4, 3, 2, 3, 1, 1 ];
    let index = {
      hall: 0,
      floor: 0
    };
    let scale = 1.5;
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
        let center = createVector( x, y );
        let grid = createVector( i, j );
        let floors = 1;
        if( Math.abs( dx ) < 4 ){
          let parity = Math.abs( dx + 1 ) % 2;
          floors = parity + 2;
        };

        this.array.hall[i].push( new hall( index , center, grid, floors, this.const.a ) );

        index.hall++;
        index.floor += floors;
      }
    }
  }

  ininCorridors(){
    let a = {
      i: 0,
      j: 0,
      f: 0
    };
    let b = {
      i: a.i + 1,
      j: 0,
      f: 0
    };
    this.addLink( a, b );
    a.i = 1;
    b.i = a.i + 1;
    this.addLink( a, b );
    b.j = 1;
    this.addLink( a, b );
    b.j = 2;
    this.addLink( a, b );
    a.i = 2;
    a.j = 1;
    b.i = a.i + 1;
    b.j = 0;
    this.addLink( a, b );
    b.f = 1;
    this.addLink( a, b );
    b.j = 1;
    b.f = 0;
    this.addLink( a, b );
    b.f = 1;
    this.addLink( a, b );

    let begin = 3;
    let end = begin + 6;
    let forks = [ [ [ 0, 1 ], [ 0, 1 ] ] ,
                  [ [ 0 ], [ -1, 0 ], [ -1 ] ] ];
    let duo = [ [ 0, 1 ], [ -1, 0 ] ];

    for( let i = begin; i < end; i++ )
      for( let j = 0; j < this.array.hall[i].length; j++ ){
        let parity = this.array.hall[i][j].array.floor.length % 2;
        let d0 = 0;
        let d1 = 0;
        let d2 = duo.length;
        if( i >= Math.floor( this.array.hall.length / 2 ) ){
          d0 = 1;
          switch ( j ) {
            case 0:
              d1 = 1;
              break;
            case this.array.hall[i].length - 1:
              d2 = 1;
              break;
          }
        }

        for( let f = 0; f < this.array.hall[i][j].array.floor.length; f++ ){
          let floor = this.array.hall[i][j].array.floor[f];
          a = {
            i: i,
            j: j,
            f: f
          };

          for( let d = d1; d < d2; d++ )
            for( let p = 0; p < forks[parity][f].length; p++ ){
              let ii = i + 1;
              let jj = duo[d0][d] + j;
              let ff = f + forks[parity][f][p];
              let neighbor = this.array.hall[ii][jj].array.floor[ff];
              b = {
                i: ii,
                j: jj,
                f: ff
              };
              this.addLink( a, b );
            }

        }
      }

    a = {
      i: end,
      j: 0,
      f: 0
    };
    b = {
      i: a.i + 1,
      j: 1,
      f: 0
    };
    this.addLink( a, b );
    a.f = 1;
    this.addLink( a, b );
    a.j = 1;
    a.f = 0;
    this.addLink( a, b );
    a.f = 1;
    this.addLink( a, b );
    a = {
      i: end + 1,
      j: 0,
      f: 0
    };
    b = {
      i: a.i + 1,
      j: 0,
      f: 0
    };
    this.addLink( a, b );
    a.j = 1;
    this.addLink( a, b );
    a.j = 2;
    this.addLink( a, b );
    a = {
      i: end + 2,
      j: 0,
      f: 0
    };
    b = {
      i: a.i + 1,
      j: 0,
      f: 0
    };
    this.addLink( a, b );
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initHalls();
    this.ininCorridors();
  }

  addLink( objA, objB ){
    let begin = this.array.hall[objA.i][objA.j].array.floor[objA.f];
    let end = this.array.hall[objB.i][objB.j].array.floor[objB.f];
    begin.addLink( end.const.index );
    end.addLink( begin.const.index );
    this.array.link.push( {
      index: this.var.index.link,
      link: [ begin.const.index, end.const.index ],
      a: {
        i: objA.i,
        j: objA.j,
        f: objA.f
      },
      b: {
        i: objB.i,
        j: objB.j,
        f: objB.f
      }
    } );
    this.var.index.link++;
  }

  click(){

  }

  key(){

  }

  draw( offsets ){
    stroke( 0 );
    strokeWeight( 2 );

    for( let i = 0; i < this.array.link.length; i++ ){
      let a = this.array.link[i].a;
      let b = this.array.link[i].b;
      let begin = this.array.hall[a.i][a.j].array.floor[a.f].var.center.copy();
      let end = this.array.hall[b.i][b.j].array.floor[b.f].var.center.copy();
      begin.add(offsets[1]);
      end.add(offsets[1]);
      line( begin.x + this.const.a  /2, begin.y, end.x - this.const.a  /2, end.y )
    }

    noStroke();
    for( let i = 0; i < this.array.hall.length; i++ )
      for( let j = 0; j < this.array.hall[i].length; j++ )
        this.array.hall[i][j].draw( offsets[1] );
  }
}
