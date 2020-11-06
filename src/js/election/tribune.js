//
class tribune {
  constructor( size ){
    this.const = {
      offset: createVector( CELL_SIZE * 2, CELL_SIZE * 2 ),
      n: size + 1,
      m: ( size + + 1 ) * 2 + 1,
      size: size,
      a: CELL_SIZE * 0.5
    };
    this.var = {
    }
    this.array = {
      community: []
    }

    this.init();
  }

  initNeighbors(){
    this.array.neighbor = [
      [
        createVector( 1, -1 ),
        createVector( 1, 0 ),
        createVector( 0, 1 ),
        createVector( -1, 0 ),
        createVector( -1, -1 ),
        createVector( 0, -1 )
      ],
      [
        createVector( 1, 0 ),
        createVector( 1, 1 ),
        createVector( 0, 1 ),
        createVector( -1, 1 ),
        createVector( -1, 0 ),
        createVector( 0, -1 )
      ]
    ];
  }

  initCommunitys(){
    //
    for( let i = 0; i < this.const.n; i++ ){
      this.array.community.push( [] );
      for( let j = 0; j < this.const.m; j++ ){
        let index = i * this.const.m + j;
        let vec = createVector( this.const.offset.x, this.const.offset.y );
        let grid = createVector( j, i );
        vec.x += this.const.a * 1.5 * j;
        vec.y += this.const.r * 2 * i;
        if( j % 2 == 1 )
          vec.y += this.const.r;
        this.array.community[i].push( new community( index, vec, grid, this.const.a ) );
      }
    }

    this.communitysBetweenCapital();


  for( let i = 0; i < this.array.community.length; i++ )
    for( let j = 0; j < this.array.community[i].length; j++ )
    //  if( this.array.community[i][j].var.remoteness != null )
        this.array.community[i][j].var.visiable = true;
    //this.communitysAroundCenter();
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initNeighbors();
    this.initCommunitys();
  }

  cleanCommunitys(){
    for( let i = 0; i < this.array.community.length; i++ )
      for( let j = 0; j < this.array.community[i].length; j++ )
          this.array.community[i][j].setStatus( 0 );
  }

  communitysBetweenCapital(){
    let capitals = [];
    let disputable = [];
    let j = Math.floor( this.const.m / 2 );
    let begin = ( this.const.n + 1 ) % 2;

    for( let i = begin; i < this.const.n; i++ )
      disputable.push( this.array.community[i][j].const.index );

    for( let side = -1; side < 0; side += 2 ){
      let x = this.const.n * ( 1 + side );
      let y = Math.round( this.const.size / 2 );
      capitals.push( createVector( x, y ) );
    }

    for( let i = 0; i < 1/*capitals.length*/; i++ ){
      this.array.community[capitals[i].y][capitals[i].x].setRemoteness( 0, 'capital', false );

      for( let j = 0; j < 1/*disputable.length*/; j++ ){
        let capital = this.array.community[capitals[i].y][capitals[i].x].const.index;
        let finish = disputable[j];
        let step = 0;
        let stopper = 100;
        let flag = false;
        let indexs = {
          old: [ capital ],
          new: []
        };

        while( !flag && step < stopper ){
          step++;
          indexs.new = [];

          for( let i = 0; i < indexs.old.length; i++ ){
            let vec = this.convertIndex( indexs.old[i] );
            let path = this.array.community[vec.y][vec.x].var.temp.path;
            let parity = ( vec.x % 2 );

            for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
              vec = this.convertIndex( indexs.old[i] );
              vec.add( this.array.neighbor[parity][l] );
              if( this.checkBorder( vec ) )
                if( this.array.community[vec.y][vec.x].var.temp.remoteness == null ){
                  let array = [];

                  for( let j = 0; j < path.length; j++ )
                    array.push( path[i] );
                  array.push( indexs.old[i] )

                  this.array.community[vec.y][vec.x].setRemoteness( step, array, false );
                  let addIndex = this.convertGrid( vec );
                  if( addIndex == finish )
                    flag = true;
                  indexs.new.push( addIndex );
                }
            }
          }

          indexs.old = [];
          for( let i = 0; i < indexs.new.length; i++ )
            indexs.old.push( indexs.new[i] );
        }

        let steps = [];
        let resultGrid = this.convertIndex( finish );
        let result = this.array.community[resultGrid.y][resultGrid.x].var.temp.parent;

        /*while( result != 'capital' ){
          steps.push( result );
          resultGrid = this.convertIndex( result );
          result = this.array.community[resultGrid.y][resultGrid.x].var.temp.parent;
        }


        for( let i = 0; i < steps.length; i++ ){
          let grid = this.convertIndex( steps[i] );
          console.log( i, steps[i], this.array.community[grid.y][grid.x].var.remoteness )
          if( this.array.community[grid.y][grid.x].var.remoteness == null )
            this.array.community[grid.y][grid.x].setRemoteness( i, steps[i], true );
        }

        resultGrid = this.convertIndex( finish );*/
        this.array.community[resultGrid.y][resultGrid.x].setRemoteness( steps.length, 'disputable', true );
      }

      this.array.community[capitals[i].y][capitals[i].x].setRemoteness( 0, 'capital', true );
    }
  }

  handleSide( side, disputable ){
    let x = this.const.n * ( 1 + side );
    let y = Math.round( this.const.size / 2 );
    let capitalGrid = createVector( x, y );
    let grid = {
      community: null,
      disputable: null,
      capital: createVector( x, y )
    };
    let distance = {
      disputable: 0,
      capital: 0,
      min: this.const.n
    };
    let capitalIndex = this.convertGrid( grid.capital );
    let begin, end;
    if( side < 0 ){
      begin = grid.capital.x;
      end = this.const.n;
    }
    else{
      begin = this.const.n + 1;
      end = grid.capital.x + 1;
    }

    for( let i = 0; i < this.const.n; i++ )
      for( let j = begin; j < end; j++ ){
        grid.community = createVector( j, i );
        grid.disputable = createVector( this.const.n, i );
        distance.disputable = Math.abs( grid.disputable.x - grid.community.x ) + Math.abs( grid.disputable.y - grid.community.y );
        distance.capital = Math.abs( grid.capital.x - grid.community.x ) + Math.abs( grid.capital.y - grid.community.y );
        //if( distance.capital + distance.disputable == distance.min )
          console.log( this.array.community[i][j].const.index, distance.capital, distance.disputable )
      }
  }

  communitysAroundCenter(){
    let indexs = [];
    indexs.push( this.array.community[this.const.size][this.const.size].const.index );

    for( let i = 0; i < this.const.size; i++ ){
      for( let j = indexs.length - 1; j >= 0; j-- ){
        let vec = this.convertIndex( indexs[j] );
        let parity = ( vec.x % 2 );

        console.log( '#########', indexs[j], this.convertIndex( indexs[j] ) )
        for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
          vec = this.convertIndex( indexs[j] );
          vec.add( this.array.neighbor[parity][l] );
          console.log( '#########' )
          console.log( vec.x, vec.y )
          console.log( this.array.neighbor[parity][l].x, this.array.neighbor[parity][l].y )
          let addIndex = this.convertGrid( vec );
          if( !indexs.includes( addIndex ) )
            indexs.push( addIndex );
        console.log( indexs[j], addIndex )
        }
      }
    }
      console.log( indexs )

      for( let i = 0; i < indexs.length; i++ ){
        let vec = this.convertIndex( indexs[i] );
        this.array.community[vec.y][vec.x].var.visiable = true;
      }

  }

  //find the grid coordinates by index
  convertIndex( index ){
    if( index == undefined )
      return null;

    let i = Math.floor( index / this.const.m );
    let j = index % this.const.m;
    return createVector( j, i );
  }

  //find the index coordinates by grid coordinates
  convertGrid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.m + vec.x;
  }

  checkBorder( grid ){
    let flag = ( grid.x >= this.const.m ) || ( grid.x < 0 )  || ( grid.y >= this.const.n ) || ( grid.y < 0 );

    return !flag;
  }

  click(){
    //
  }

  draw(){
    //this.cleanCommunitys();
    let f = Math.floor( this.var.floor / 2 );

    for( let i = 0; i < this.array.community.length; i++ )
      for( let j = 0; j < this.array.community[i].length; j++ )
          this.array.community[i][j].draw( this.array.toConstruct );
  }
}
