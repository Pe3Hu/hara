//
class blend {
  constructor (){
    this.const = {
      a: cellSize * 2,
      field:{
        count: 3,
        size: 3,
      }
    };
    this.array = {
      node: [],
      shred: [],
      value: []
    };
    this.var = {
      shred: 0,
      kind: 0
    };
    this.table = {
      shred: []
    };
    this.obj = {
      laws: null
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

    let exmaple = [ 10, 5, 5, 5, 5, 5, 15, 15, 5, 5, 5, 15 ];
    let count = 0;


    for( let field = 0; field < this.const.field.count; field++ ){
      this.array.shred.push( [] );
      for( let i = 0; i < this.const.field.size; i++ ){
        this.array.shred[field].push( [] );
        for( let j = 0; j < this.const.field.size; j++ ){
          let rand = Math.floor( Math.random() * this.array.value.length );
          let value = this.array.value[rand];// exmaple[count];//this.table.shred[0][field%2]//
          count++;
          this.array.value.splice( rand, 1 );
          let kind = this.var.kind;
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
            }

          if( j > 0 )
            if( charges[i][j - 1] == charges[i][j] ){
              for( let g = 0; g < groups[i][j - 1].length; g++ ){
                let index = groups[i][j].indexOf( groups[i][j - 1][g] )
                if( index == -1 )
                  groups[i][j].push( groups[i][j - 1][g] );
              }
              flag = false;
            }

          if( flag ){
            group++;
            groups[i][j].push( group );
          }
        }
      }


    for( let i = 0; i < charges.length; i++ )
      if( charges[i][0] == charges[i][charges[i].length - 1] )
        for( let g = 0; g < groups[i][0].length; g++ )
          groups[i][charges[i].length - 1].push( groups[i][0][g] );



    this.unification( groups );
    let extent = [];
    let values = [];
    group = -1;

    for( let i = 0; i < groups.length; i++ )
      for( let j = 0; j < groups[i].length; j++ )
        if( groups[i][j] > group ){
          group = groups[i][j];
          extent.push( 1 );
          values.push( charges[i][j] )
        }
        else
          extent[groups[i][j]]++;

    this.sortGroupsByExtent( groups, extent, values );
  }

  sortGroupsByExtent( groups, extent, values ){
    let table = this.table.shred[this.var.shred];
    let shreds = [];

    for( let s = 0; s < table.length; s++ ){
      shreds.push( [] );

      for( let i = 0; i < extent.length; i++ )
            if( table[s] == values[i] )
              shreds[s].push( {
                group: i,
                extent: extent[i],
              } );
    }

    let shortest, longest;

    for( let s = 0; s < shreds.length; s++ ){
      longest = {
        group: null,
        extent: 0,
        unique: true
       };
      shortest = {
        group: null,
        extent: Math.pow( this.const.field.size, 2 ) * this.const.field.count - this.table.shred[this.var.shred].length + 1,
        unique: true
       };

      for( let j = 0; j < shreds[s].length; j++ ){
        if( shreds[s][j].extent == shortest.extent )
          shortest.unique = false;
        if( shreds[s][j].extent < shortest.extent ){
          shortest.extent = shreds[s][j].extent;
          shortest.group = shreds[s][j].group;
          shortest.unique = true;
        }

        if( shreds[s][j].extent == longest.extent )
          longest.unique = false;
        if( shreds[s][j].extent > longest.extent ){
          longest.extent = shreds[s][j].extent;
          longest.group = shreds[s][j].group;
          longest.unique = true;
        }
      }

      if( shortest.group != longest.group ){
        if( shortest.unique )
          for( let i = 0; i < groups.length; i++ )
            for( let j = 0; j < groups[i].length; j++ ){
              if( groups[i][j] == shortest.group ){
                let brick = createVector( j, i );
                let shred = this.convertBrick( brick );
                this.array.shred[shred.f][shred.i][shred.j].setGroup( -1, groups[i][j] );
              }
            }

        if( longest.unique )
          for( let i = 0; i < groups.length; i++ )
            for( let j = 0; j < groups[i].length; j++ ){
              if( groups[i][j] == longest.group ){
                let brick = createVector( j, i );
                let shred = this.convertBrick( brick );
                this.array.shred[shred.f][shred.i][shred.j].setGroup( 1, groups[i][j] );
              }
            }
      }

      if( shreds[s].length == 1 )
        for( let i = 0; i < groups.length; i++ )
          for( let j = 0; j < groups[i].length; j++ ){
            if( groups[i][j] == longest.group ){
              let brick = createVector( j, i );
              let shred = this.convertBrick( brick );
              this.array.shred[shred.f][shred.i][shred.j].setSingle( true );
            }
          }
    }

    longest = {
      group: null,
      extent: 0,
      unique: true
     };
    shortest = {
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
            this.array.shred[shred.f][shred.i][shred.j].setGroup( -2, groups[i][j] );
          }
        }

    if( longest.unique )
      for( let i = 0; i < groups.length; i++ )
        for( let j = 0; j < groups[i].length; j++ ){
          if( groups[i][j] == longest.group ){
            let brick = createVector( j, i );
            let shred = this.convertBrick( brick );
            this.array.shred[shred.f][shred.i][shred.j].setGroup( 2, groups[i][j] );
          }
        }
  }

  init(){
    this.initTables();
    this.initMap();
    this.initNodes();
    this.initShreds();
    this.findConnections();
    this.defineLaws();
  }

  click(){

  }

  key(){

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
    let synonyms = [];
    for( let i = 0; i < array.length; i++ )
      for( let j = 0; j < array[i].length; j++ )
        synonyms.push( [] );


    for( let i = 0; i < synonyms.length; i++ )
      synonyms[i].push( i );

    for( let i = 0; i < array.length; i++ )
      for( let j = 0; j < array[i].length; j++ )
        if(  array[i][j].length > 1 )
          for( let g = 0; g < array[i][j].length; g++ ){
            let group = array[i][j][g];

            for( let gg = g + 1; gg < array[i][j].length; gg++ ){

              let index = synonyms[group].indexOf( array[i][j][gg] );
              if( index == -1 ){
                synonyms[group].push( array[i][j][gg] );
                synonyms[array[i][j][gg]].push( group );
              }
            }
          }


    for( let i = 0; i < synonyms.length; i++ )
        synonyms[i].sort();


    this.supplementWithSynonyms( array, synonyms );

    for( let i = 0; i < array.length; i++ )
      for( let j = 0; j < array[i].length; j++ )
        array[i][j] = array[i][j][0];

    let max = -1;
    let displaced = [];

    for( let i = 0; i < array.length; i++ )
      for( let j = 0; j < array[i].length; j++ ){
        let index = displaced.indexOf( array[i][j] );
        if( index == -1 )
          displaced.push( array[i][j] );
      }

    for( let d = 0; d < displaced.length; d++ )
      if( d != displaced[d] )
        for( let i = 0; i < array.length; i++ )
          for( let j = 0; j < array[i].length; j++ )
            if( array[i][j] == displaced[d] )
              array[i][j] = d;

  }

  supplementWithSynonyms( groups, synonyms ){
    for( let i = 0; i < groups.length; i++ )
      for( let j = 0; j < groups[i].length; j++ ){
        groups[i][j] = synonyms[groups[i][j][0]];
      }
  }

  defineLaws(){
    let table = this.table.shred[this.var.shred];
    this.obj.laws = new laws( table );
    let subtypes = [ 'single', 'shortest', 'longest' ];
    let location = 'on';


      for( let f = 0; f < this.array.shred.length; f++ )
        for( let i = 0; i < this.array.shred[f].length; i++ )
          for( let j = 0; j < this.array.shred[f][i].length; j++ ){
              let shred = this.array.shred[f][i][j];

              for( let s = 0; s < subtypes.length; s++ ){
                  if( shred.var.value[subtypes[s]] )
                    this.obj.laws.updateInfluence( subtypes[s], location, shred.const.value.id, shred.const.index );

                  if( shred.var.group[subtypes[s]] && subtypes[s] != 'single' )
                    this.obj.laws.updateInfluence( subtypes[s], location, 0, shred.const.index );
              }
            }

      let neighbors = [
        createVector( 0, -1 ),
        createVector( 1, 0 ),
        createVector( 0, 1 ),
        createVector( -1, 0 ),
      ];
      let size = this.const.field.size;

      for( let subtype in this.obj.laws.obj )
        for( let value in this.obj.laws.obj[subtype]['on'] )
          if( this.obj.laws.obj[subtype]['on'][value].length > 0 ){
          let on = this.obj.laws.obj[subtype]['on'][value];
          let near = [];

          for( let i = 0; i < on.length; i++ ){
            let index = on[i];
            let result = this.convertIndex( index );

            for( let j = 0; j < neighbors.length; j++ ){
              let neighbor = createVector( result.j, result.i, result.f );
              let z = result.f;
              let y = ( neighbor.y + neighbors[j].y + size ) % size;
              let x = ( neighbor.x + neighbors[j].x + size ) % size;

              if( ( ( neighbor.x == 0 && neighbors[j].x == -1 ) ) ||
                    ( neighbor.x == size - 1 && neighbors[j].x == 1 ) )
                      z = ( result.f + neighbors[j].x + this.const.field.count ) % this.const.field.count;

              if( this.array.shred[z][y][x].var.group.id !=
                  this.array.shred[result.f][result.i][result.j].var.group.id )
                if( near.indexOf( this.array.shred[z][y][x].const.index ) == -1 )
                  near.push( this.array.shred[z][y][x].const.index );
            }
          }

          let a, b;
          near.sort( this.compare );
          this.obj.laws.obj[subtype]['near'][value] = near;
        }
  }

  convertBrick( brick ){
    let result = {
      f: Math.floor( brick.x / this.const.field.size ),
      i: brick.y,
      j: brick.x % this.const.field.size
    };
    return result;
  }

  convertIndex( index ){
    let f = Math.floor( index / this.const.field.size / this.const.field.size );
    let id = index - f * this.const.field.size * this.const.field.size;
    let i = Math.floor( id / this.const.field.size );
    let j = id % this.const.field.size;

    let result = {
      f: f,
      i: i,
      j: j
    };
    return result;
  }

  compare( a, b ){
    return a - b;
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
