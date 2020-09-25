//
class blend {
  constructor (){
    this.const = {
      a: cellSize * 2,
      field:{
        count: 3,
        size: 4,
      }
    };
    this.array = {
      node: [],
      shred: [],
      value: []
    };
    this.var = {
      shred: 0
    };
    this.table = {
      shred: []
    }

    this.init();
  }

  initTables(){
    this.table.shred = [
      [ 5, 10, 15 ],
      [ 5, 7, 10, 14, 15 ],
      [ 5, 7, 10, 11, 13, 14, 15 ]
    ];
  }

  initMap(){
    let table = this.table.shred[this.var.shred];
    let copys = Math.pow( this.const.field.size, 2 ) * this.const.field.count - table.length + 1;
    this.array.value = [];

    for( let i = 0; i < table.length; i++ )
      for( let j = 0; j <copys; j++ )
        this.array.value.push( table[i] );

    this.shuffle( this.array.value );
  }

  initNodes(){
    let a = this.const.a / 4;
    let index = 0;
    let label = 0;

    for( let field = 0; field < this.const.field.count; field++ ){
      this.array.node.push( [] );
      for( let i = 0; i < this.const.field.size + 1; i++ ){
        this.array.node[field].push( [] );
        for( let j = 0; j < this.const.field.size + 1; j++ ){
          let grid = createVector( j, i );
          let vec = createVector( this.const.a * ( i + field * ( this.const.field.size + 1 ) ), this.const.a * j );
          let l = label;
          let flag = ( field > 0 && i == 0 );
          if( flag )
            l = this.array.node[field - 1][this.array.node[field - 1].length - 1][j].const.label;
          else
            label++;
          flag = ( field == this.const.field.count - 1 && i == this.const.field.size );
          if( flag )
            l = this.array.node[0][0][j].const.label;
          this.array.node[field][i].push( new node( index, l, vec, grid, a ) );
          index++;
        }
      }
    }
  }

  initShreds(){
    let a = this.const.a / 2;
    let index = 0;

    for( let field = 0; field < this.const.field.count; field++ ){
      this.array.shred.push( [] );
      for( let i = 0; i < this.const.field.size; i++ ){
        this.array.shred[field].push( [] );
        for( let j = 0; j < this.const.field.size; j++ ){
          //let rand = Math.floor( Math.random() * this.table.shred[this.var.shred].length );
          //let value =  this.table.shred[this.var.shred][rand];
          let value = this.array.value.pop();
          let kind = 0;
          let grid = createVector( j, i );
          let vec = createVector( this.const.a * ( j + 0.5 + field * ( this.const.field.size + 1 ) ), this.const.a * ( i + 0.5 ) );
          this.array.shred[field][i].push( new shred( index, value, kind, vec, grid,  a ) );
          index++;
        }
      }
    }
  }

  findConnections(){
    let charges = [];
    let groups = [];

    for( let i = 0; i < this.const.field.size; i++ ){
      charges.push( [] );
      groups.push( [] );
    }

    for( let f = 0; f < this.array.shred.length; f++ )
      for( let i = 0; i < this.array.shred[f].length; i++ )
        for( let j = 0; j < this.array.shred[f][i].length; j++ ){
          let charge = this.array.shred[f][i][j].const.value.id;
          charges[i].push( charge );
          groups[i].push( [] );
        }

    let group = 0;
    groups[0][0] = [ group ];

    for( let i = 0; i < charges.length; i++ )
      for( let j = 0; j < charges[i].length; j++ ){
        if( groups[i][j].length == 0 ){
          let flag = true;

          if( i > 0 )
            if( charges[i - 1][j] == charges[i][j] ){
              for( let g = 0; g < groups[i - 1][j].length; g++ )
                groups[i][j].push( groups[i - 1][j][g] )
              flag = false;

              if( j == charges[i].length - 1 )
                if( charges[i][j] == charges[i][0] )
                  for( let g = 0; g < groups[i][0].length; g++ )
                    groups[i][j].push( groups[i][0][g] );
            }

          if( j > 0 )
            if( charges[i][j - 1] == charges[i][j] ){
              for( let g = 0; g < groups[i][j - 1].length; g++ )
                groups[i][j].push( groups[i][j - 1][g] );
              flag = false;
            }

          if( flag ){
            group++;
            groups[i][j].push( group );
          }
        }
      }


    let result = this.unification( groups );
    console.log( result )
    let extent = [];
    group = -1;

    for( let i = 0; i < result.length; i++ )
      for( let j = 0; j < result[i].length; j++ )
        if( result[i][j] > group ){
          group = result[i][j];
          extent.push( 1 );
        }
        else
          extent[result[i][j]]++;

    this.sortGroupsByExtent( result, extent );
  }

  sortGroupsByExtent( groups, extent ){
    console.log( groups[0], groups[1], extent )
    let longest = {
      group: null,
      extent: 0,
      unique: true
     };
    let shortest = {
      group: null,
      extent: Math.pow( this.const.field.size, 2 ) * this.const.field.count - this.table.shred[this.var.shred].length + 1,
      unique: true
     };

    for( let i = 0; i < extent.length; i++ ){
      if( extent[i] == shortest.extent )
        shortest.unique = false;
      if( extent[i] < shortest.extent ){
        shortest.extent = extent[i];
        shortest.group = i;
        shortest.unique = true;
      }

      if( extent[i] == longest.extent )
        longest.unique = false;
      if( extent[i] > longest.extent ){
        longest.extent = extent[i];
        longest.group = i;
        longest.unique = true;
      }
    }

    if( shortest.unique )
      for( let i = 0; i < groups.length; i++ )
        for( let j = 0; j < groups[i].length; j++ ){
          if( groups[i][j] == shortest.group ){
            let brick = createVector( j, i );
            let shred = this.convertBrick( brick );
            this.array.shred[shred.f][shred.i][shred.j].setGroup( -1 );
          }
        }

    if( longest.unique )
      for( let i = 0; i < groups.length; i++ )
        for( let j = 0; j < groups[i].length; j++ ){
          if( groups[i][j] == longest.group ){
            let brick = createVector( j, i );
            let shred = this.convertBrick( brick );
            this.array.shred[shred.f][shred.i][shred.j].setGroup( 1 );
          }
        }


  }

  init(){
    this.initTables();
    this.initMap();
    this.initNodes();
    this.initShreds();
    this.findConnections();
  }

  click(){

  }

  shuffle( array ){
    for( let i = array.length; i > -1; i-- ){
      let shift = Math.floor( Math.random() * i );
      let index = array.pop();
      array.splice( shift, 0, index );
    }
  }

  unification( array ){
    let result = [];

    for( let i = 0; i < array.length; i++ )
      for( let j = 0; j < array[i].length; j++ )
        if( array[i][j].length > 1 ){
          for( let g = array[i][j].length - 1; g > 0; g-- ){
            let group = array[i][j][g];
            for( let ii = 0; ii < array.length; ii++ )
              for( let jj = 0; jj < array[ii].length; jj++ )
                for( let gg = 1; gg < array[ii][jj].length; gg++ )
                  if( array[ii][jj][gg] == group ){
                    array[ii][jj].splice( gg, 1 );
                    array[ii][jj].push( array[i][j][0] );
                  }
          }
        }

    for( let i = 0; i < array.length; i++ ){
      result.push( [] );
      for( let j = 0; j < array[i].length; j++ )
        result[i].push( array[i][j][0] );

    }

    return result;
  }

  convertBrick( brick ){
    let result = {
      f: Math.floor( brick.x / this.const.field.size ),
      i: brick.y,
      j: brick.x % this.const.field.size
    };
    return result;
  }

  draw(){
    let offset = createVector( cellSize * 2, cellSize * 2 );

    for( let f = 0; f < this.array.shred.length; f++ )
      for( let i = 0; i < this.array.shred[f].length; i++ )
        for( let j = 0; j < this.array.shred[f][i].length; j++ )
          this.array.shred[f][i][j].draw( offset );

    for( let f = 0; f < this.array.node.length; f++ )
      for( let i = 0; i < this.array.node[f].length; i++ )
        for( let j = 0; j < this.array.node[f][i].length; j++ )
          this.array.node[f][i][j].draw( offset );
  }
}
