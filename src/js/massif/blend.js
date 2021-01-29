//
class blend {
  constructor ( size, shred, a ){
    this.const = {
      a: a,
      field:{
        count: 3,
        size: size,
      }
    };
    this.array = {
      node: [],
      shred: [],
      value: [],
      activated: {
        law: [],
        node: []
      },
      answer: []
    };
    this.var = {
      shred: shred,
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
      [ 15, 10, 5 ],
      [ 15, 14, 10, 7, 5 ],
      [ 15, 14, 13, 11, 10, 7, 5 ]
    ];
    /*
    this.table.shred = [
      [ 5, 10, 15 ],
      [ 5, 7, 10, 14, 15 ],
      [ 5, 7, 10, 11, 13, 14, 15 ]
    ];*/
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
    let sqaure = [];

    sqaure.push( createVector( 0, -1 ) );
    sqaure.push( createVector( 0, 0 ) );
    sqaure.push( createVector( -1, 0 ) );
    sqaure.push( createVector( -1, -1 ) );

    for( let field = 0; field < this.const.field.count; field++ ){
      this.array.node.push( [] );
      for( let i = 0; i < this.const.field.size + 1; i++ ){
        this.array.node[field].push( [] );
        for( let j = 0; j < this.const.field.size + 1; j++ ){
          let grid = createVector( i, j, field );
          let type = 0;
          let neighbors = [ 0, 1, 2, 3 ];
          let exceptions = [];
          if( j == 0 ){
            exceptions.push( 0 );
            exceptions.push( 3 );
          }
          if( i == this.const.field.size ){
            exceptions.push( 0 );
            exceptions.push( 1 );
          }
          if( j == this.const.field.size ){
            exceptions.push( 1 );
            exceptions.push( 2 );
          }
          if( i == 0 ){
            exceptions.push( 2 );
            exceptions.push( 3 );
          }

          for( let i = neighbors.length - 1; i > -1; i-- )
            if( exceptions.indexOf( neighbors[i] ) != -1 )
              neighbors.splice( i, 1 );

          let array = [];
          for( let i = 0; i < neighbors.length; i++ )
            array.push( sqaure[neighbors[i]] );
          /*
          if( j == 0 ){
            type = 1;
            if( i == this.const.field.size )
              type = 2;
            if( i == 0 )
              type = 8;
          }
          else
            if( j == this.const.field.size ){
              type = 5;
              if( i == this.const.field.size )
                type = 4;
              if( i == 0 )
                type = 6;
            }
          else{
            if( i == 0 )
              type = 7;
            if( i ==  this.const.field.size )
              type = 3;
          }*/
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
          this.array.node[field][i].push( new node( index, l, vec, grid, array, a ) );
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
          let grid = createVector( j, i, field );
          let vec = createVector( this.const.a * ( j + 0.5 + field * ( this.const.field.size + 1 ) ), this.const.a * ( i + 0.5 ) );
          this.array.shred[field][i].push( new shred( index, value, kind, vec, grid,  a ) );
          index++;
        }
      }
    }
  }

  cleanShreds(){
    let type = 2;
    let status = 2;
    //
    for( let f = 0; f < this.array.shred.length; f++ )
      for( let i = 0; i < this.array.shred[f].length; i++ )
        for( let j = 0; j < this.array.shred[f][i].length; j++ )
          this.array.shred[f][i][j].setFit( type, status );
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

  defineLaws(){
    let table = this.table.shred[this.var.shred];
    this.obj.laws = new laws( table );
    let subtypes = [ 'single', 'shortest', 'longest', 'total' ];
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
          let result = this.convertShredIndex( index );

          for( let j = 0; j < neighbors.length; j++ ){
            let neighbor = createVector( result.j, result.i, result.f );
            let y = neighbor.y + neighbors[j].y;
            if( y >= size || y < 0 )
              continue;
            let z = result.f;
            let x = ( neighbor.x + neighbors[j].x + size ) % size;

            if( ( ( neighbor.x == 0 && neighbors[j].x == -1 ) ) ||
                  ( neighbor.x == size - 1 && neighbors[j].x == 1 ) )
                    z = ( result.f + neighbors[j].x + this.const.field.count ) % this.const.field.count;

            if( this.array.shred[z][y][x].const.value.id !=
                this.array.shred[result.f][result.i][result.j].const.value.id )
              if( near.indexOf( this.array.shred[z][y][x].const.index ) == -1 )
                near.push( this.array.shred[z][y][x].const.index );
          }
        }

        let a, b;
        near.sort( this.compare );
        this.obj.laws.obj[subtype]['near'][value] = near;
      }

    let max = Math.pow( this.const.field.size, 2 ) * this.const.field.count;

    for( let subtype in this.obj.laws.obj )
      for( let location in this.obj.laws.obj[subtype] )
        if( location.includes( 'not' ) ){
          let notLocation = location.substr( 3 ).toLowerCase();
          for( let value in this.obj.laws.obj[subtype][notLocation] )
            if( this.obj.laws.obj[subtype][notLocation][value].length > 0 ){
              let indexs = [];

              for( let j = 0; j < max; j++ )
                if( this.obj.laws.obj[subtype][notLocation][value].indexOf( j ) == -1 ){
                  let flag = true;
                  if( location == 'notNear' )
                    flag = ( this.obj.laws.obj[subtype]['on'][value].indexOf( j ) == -1 );

                  if( flag )
                    this.obj.laws.obj[subtype][location][value].push( j );
                }
            }
        }
  }

  generateIntersections(){
    let laws = [];
    let max = Math.pow( this.const.field.size, 2 ) * this.const.field.count;

    for( let subtype in this.obj.laws.obj )
      for( let location in this.obj.laws.obj[subtype] )
        for( let value in this.obj.laws.obj[subtype][location] ){
          let indexs = this.obj.laws.obj[subtype][location][value];
          if( indexs.length > 0 && indexs.length < max - 1 )
            laws.push( {
              subtype: subtype,
              location: location,
              value: value,
              indexs: indexs
            } );
        }

    let intersections = [];

    for( let i = 0; i < laws.length; i++ ){
      let origin = [];
      let conclusion = {
        id: null,
        added: 0,
        idle: null
      }

      for( let j = 0; j < laws[i].indexs.length; j++ )
        origin.push( laws[i].indexs[j] );

      for( let j = 0; j < laws.length; j++ )
        if( i != j ){
          let innovation = laws[j].indexs;
          let difference = [];
          let repetition = [];

          for( let l = 0; l < innovation.length; l++ ){
            if( origin.indexOf( innovation[l] ) == -1 )
              difference.push( innovation[l] );
            else
              repetition.push( innovation[l] );
          }
          //console.log( difference )

          if( difference.length > conclusion.added &&
              difference.length + origin.length < max ){
                let alreadyUsed = ( i > j );
                if( alreadyUsed )
                    alreadyUsed = ( intersections[j].child == i );
                if( !alreadyUsed )
                  conclusion = {
                    id: j,
                    added: difference.length,
                    idle: repetition.length
                  }
              }

            if( difference.length == conclusion.added &&
                conclusion.idle > repetition.length )
              conclusion = {
                id: j,
                added: difference.length,
                idle: repetition.length
              }
          }

      if( conclusion.id == null )
        conclusion = {
          id: i,
          added: 0,
          idle: origin.length
        }

      for( let j = 0; j < laws[conclusion.id].indexs.length; j++ )
        if( origin.indexOf( laws[conclusion.id].indexs[j] ) == -1 )
          origin.push( laws[conclusion.id].indexs[j] );

      origin.sort( this.compare );
      intersections.push( {
        parent: i,
        child: conclusion.id,
        idle: conclusion.idle,
        indexs: origin
      } );
    }

    let best = [];
    let length = 3;
    let counter = 0;
    let stoper = 0;
    let stop = 100;
    let previousMax = max;


    let indexs = [];
    for( let i = 0; i < max; i++ ){
      indexs.push( [] );

      for( let j = 0; j < max; j++ )
        indexs[i].push( [] );
    }

    do{
      let maxL = 0;

      for( let i = 0; i < intersections.length; i++ )
        if( intersections[i].child != intersections[i].parent ){
            let idle = intersections[i].idle;
            let l = intersections[i].indexs.length;

            if( l == maxL && l < max ){
              indexs[l][idle].push( i );
              counter++;
            }

            if( l > maxL && l < previousMax ){
              maxL = intersections[i].indexs.length;
              indexs[l][idle] = [ i ];
              counter = 0;
            }
          }

      best.push( {
        length: maxL,
        indexs: indexs[maxL]
      } );

      stoper++;
      previousMax = maxL;
    }
    while( counter < length && stoper < stop );

    let top3 = [];
    let i = 0;

    while( length > 0 ){
      if( best[i].indexs.length > 0 )
        for( let j = 0; j < best[i].indexs.length; j++ )
          if( best[i].indexs[j].length <= length  &&
              best[i].indexs[j].length > 0 ){
            length -= best[i].indexs[j].length;

            for( let l = 0; l < best[i].indexs[j].length; l++ )
              top3.push( best[i].indexs[j][l] );
          }
          else
            if( best[i].indexs[j].length > 0 )
              while( length > 0 ){
                let rand = Math.floor( Math.random() * best[i].indexs[j].length );
                top3.push( best[i].indexs[j][rand] );
                best[i].indexs[j].splice( rand, 1 );
                length--;
              }

      i++;
    }

    let result = [];

    for( let i = 0; i < top3.length; i++ ){
      let intersection = intersections[top3[i]];
      let parent = {
        subtype: laws[intersection.parent].subtype,
        location: laws[intersection.parent].location,
        value: laws[intersection.parent].value
      };
      let child = {
        subtype: laws[intersection.child].subtype,
        location: laws[intersection.child].location,
        value: laws[intersection.child].value
      };
      let answers = [];

      for( let j = 0; j < max; j++ )
        if( intersection.indexs.indexOf( j ) == -1 )
          answers.push( j );

      result.push( {
        parent: parent,
        child: child,
        idle: intersection.idle,
        indexs: intersection.indexs,
        answers: answers
      } );
    }

    this.obj.laws.setAnswers( result );
    //console.log( result );
  }

  init(){
    this.initTables();
    this.initMap();
    this.initNodes();
    this.initShreds();
    this.findConnections();
    this.defineLaws();
    this.generateIntersections();
    this.setAnswer();
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

  setAnswer(){
    this.array.answer = [];
    let id = 0;
    let laws = this.obj.laws;
    let answers = laws.array.answer[id].answers;

    for( let i = 0; i < answers.length; i++ ){
      let obj = this.convertShredIndex( answers[i] );
      this.array.shred[obj.f][obj.i][obj.j].setAnswer( true );
      this.array.answer.push( answers[i] );
    }
  }

  activateLaw( string ){
    //
    let id =  this.array.activated.law.indexOf( string );
    if( id == -1 )
      this.array.activated.law.push( string );
    else
      this.array.activated.law.splice( id, 1 );
  }

  updateLaws(){
    //
    let type = 0;

    for( let i = 0; i < this.array.activated.law.length; i++ ){
      let string = this.array.activated.law[i];
      let array = string.split( ' ' );
      let subtype = array[0];
      let location = array[1];
      let value = array[2];
      let indexs = this.obj.laws.obj[subtype][location][value];
      let status = false;

      for( let j = 0; j < indexs.length; j++ ){
        let obj = this.convertShredIndex( indexs[j] );
        status = this.array.answer.includes(this.array.shred[obj.f][obj.i][obj.j].const.index ) || status;
      }

      if( status )
        status = 1;
      else
        status = 0;

      for( let j = 0; j < indexs.length; j++ ){
        let obj = this.convertShredIndex( indexs[j] );
        this.array.shred[obj.f][obj.i][obj.j].setFit( type, status );
      }
    }
  }

  activateButton( buttons, id ){
    let array = buttons[id].const.name.split( ' ' );
    let subtype = array[0];
    let location = array[1];
    let value = array[2];
    let indexs = this.obj.laws.obj[subtype][location][value];
    let l = this.obj.laws.array.value.length;
    let shift = null;

    switch ( subtype ) {
      case 'shortest':
      case 'longest':
        l++;
        break;
    }

    if( location.includes( 'not' ) )
      shift = -l;
    else
      shift = l;

    let status = this.checkLaw( indexs );
    let shifteID = id + shift;
    let shiftedStatus = 2;

    if( status == 1 ){
      shiftedStatus = 0;
      buttons[shifteID].setStatus( shiftedStatus );
      this.activateLaw( buttons[shifteID].const.name );
    }

    let string = buttons[id].const.name;
    buttons[id].setStatus( status );
    this.activateLaw( string );
  }

  checkLaw( indexs ){
    let status = false;

    for( let j = 0; j < indexs.length; j++ ){
      let obj = this.convertShredIndex( indexs[j] );
      status = this.array.answer.includes(this.array.shred[obj.f][obj.i][obj.j].const.index ) || status;
    }

    if( status )
      status = 1;
    else
      status = 0;

    return status;
  }

  shuffle( array ){
    for( let i = array.length; i > -1; i-- ){
      let shift = Math.floor( Math.random() * i );
      let index = array.pop();
      array.splice( shift, 0, index );
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

  convertShredIndex( index ){
    let f = Math.floor( index / Math.pow( this.const.field.size, 2 ) );
    let id = index - f * Math.pow( this.const.field.size, 2 );
    let i = Math.floor( id / this.const.field.size );
    let j = id % this.const.field.size;

    let result = {
      f: f,
      i: i,
      j: j
    };
    return result;
  }

  convertNodeIndex( index ){
    let f = Math.floor( index / Math.pow( ( this.const.field.size + 1 ), 2 ) );
    let id = index - f * Math.pow( ( this.const.field.size + 1 ), 2 );
    let i = Math.floor( id / ( this.const.field.size + 1 ) );
    let j = id % ( this.const.field.size + 1 );

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

  click( offsets ){
    this.clickNode( offsets );
    this.update();
  }

  clickNode( offsets ){
    let minDist = INFINITY;
    let node = null;
    let mouse = createVector( mouseX, mouseY );
    mouse.sub( offsets[1].copy() );
    mouse.sub( this.const.a / 3,  this.const.a / 3 );

    for( let f = 0; f < this.array.node.length; f++ )
      for( let i = 0; i < this.array.node[f].length; i++ )
        for( let j = 0; j < this.array.node[f][i].length; j++ ){
          let center = this.array.node[f][i][j].var.center;
          let d = mouse.dist( center );

          if ( d < minDist ){
            minDist = d;

            if( this.array.node[f][i][j].const.a > minDist ){
              node = this.array.node[f][i][j];
              break;
            }
          }
        }

    if( node != null ){
      let double = null;

      if( node.const.i == 0 )
        double = createVector(
          this.const.field.size,
          node.const.j,
          ( node.const.f - 1 + this.const.field.count ) % this.const.field.count );

      if( node.const.i == this.const.field.size )
        double = createVector(
          0,
          node.const.j,
          ( node.const.f + 1 ) % this.const.field.count );


      let status = this.checkNode( node );
      let doubleStatus = 2;

      if( double != null )
        doubleStatus = this.checkNode( this.array.node[double.z][double.x][double.y] )

      if( doubleStatus != 2 )
        status = Math.max( status, doubleStatus );

      node.press( status );
      this.activateNode( node.const.index );

      if( double != null ){
        this.array.node[double.z][double.x][double.y].press( status );
        this.activateNode( this.array.node[double.z][double.x][double.y].const.index );
      }
    }
  }

  checkNode( node ){
    let status = false;
    let center = createVector( node.const.i, node.const.j, node.const.f );

    for( let i = 0; i < node.array.neighbors.length; i++ ){
      let neighbor = center.copy();
      neighbor.add( node.array.neighbors[i] );
      status = this.array.answer.includes( this.array.shred[neighbor.z][neighbor.y][neighbor.x].const.index ) || status;
    }

    if( status )
      status = 1;
    else
      status = 0;

    return status;
  }

  activateNode( index ){
    let id =  this.array.activated.node.indexOf( index );
    if( id == -1 )
      this.array.activated.node.push( index );
    else
      this.array.activated.node.splice( id, 1 );
  }

  updateNodes(){
    //
    let type = 1;

    for( let i = 0; i < this.array.activated.node.length; i++ ){
      let index = this.array.activated.node[i];
      let obj = this.convertNodeIndex( index );
      let node = this.array.node[obj.f][obj.i][obj.j];
      let center = createVector( obj.i, obj.j, obj.f );
      let status = false;

      for( let i = 0; i < node.array.neighbors.length; i++ ){
        let neighbor = center.copy();
        neighbor.add( node.array.neighbors[i] );
        status = this.array.answer.includes( this.array.shred[neighbor.z][neighbor.y][neighbor.x].const.index ) || status;
      }

      if( status )
        status = 1;
      else
        status = 0;

      if( node.var.status != 2 )
        status = node.var.status;

      for( let i = 0; i < node.array.neighbors.length; i++ ){
        let neighbor = center.copy();
        neighbor.add( node.array.neighbors[i] );
        this.array.shred[neighbor.z][neighbor.y][neighbor.x].setFit( type, status );
      }
    }
  }

  update(){
    this.cleanShreds();
    this.updateLaws();
    this.updateNodes();
  }

  key(){
    //
  }  

  moved( offsets ){
  }

  draw( offsets ){
    let offset = offsets[1].copy();
    offset.add( this.const.a / 3, this.const.a / 3 )

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
