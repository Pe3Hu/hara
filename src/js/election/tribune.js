//
class tribune {
  constructor( size ){
    this.const = {
      n: size + 1,
      m: ( size + + 1 ) * 2 + 1,
      size: size,
      a: CELL_SIZE * 0.5
    };
    this.var = {
      current: {
        community: null
      },
    };
    this.array = {
      community: [],
      visiable: []
    };
    this.data = {
      zoom: null
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
        let grid = createVector( j, i );
        let vec = createVector( this.const.a * 1.5 * j, this.const.r * 2 * i );
        if( j % 2 == 1 )
          vec.y += this.const.r;
        this.array.community[i].push( new community( index, vec, grid, this.const.a ) );
      }
    }

    this.communitysBetweenCapital();
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / this.const.n ) * 2 );

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
    let controversial = [];
    let j = Math.floor( this.const.m / 2 );
    let begin = ( this.const.n + 1 ) % 2;
    let end = this.const.n - this.const.n % 2;

    for( let i = begin; i < end; i++ )
      controversial.push( this.array.community[i][j].const.index );

    for( let side = -1; side < 2; side += 2 ){
      let x = this.const.n * ( 1 + side );
      let y = Math.round( this.const.size / 2 );
      capitals.push( createVector( x, y ) );
    }

    //move strictly left or right
    //0 - right direction
    //1 - left direction
    let moves = [
      [ 0, 2 ],
      [ 3, 5 ]
    ];

    for( let i = 0; i < capitals.length; i++ ){
      let capital = this.array.community[capitals[i].y][capitals[i].x];
      capital.var.visiable = true;

      for( let j = 0; j < controversial.length; j++ ){
        let grid = this.convertIndex( controversial[j] );
        let disputable = this.array.community[grid.y][grid.x];
        disputable.var.visiable = true;
        let step = 0;
        let stopper = 100;
        let flag = false;
        let indexs = {
          old: [ capital.const.index ],
          new: []
        };

        while( !flag && step < stopper ){
          step++;
          indexs.new = [];

          for( let k = 0; k < indexs.old.length; k++ ){
            let vec = this.convertIndex( indexs.old[k] );
            let parent = this.array.community[vec.y][vec.x];
            let parity = ( vec.x % 2 );

            for( let l = moves[i][0]; l < moves[i][1]; l++ ){
              vec = this.convertIndex( indexs.old[k] );
              vec.add( this.array.neighbor[parity][l] );

              if( this.checkBorder( vec ) ){
                let child = this.array.community[vec.y][vec.x];
                let index = controversial.indexOf( child.const.index );
                if( index != -1 ){
                  flag = true;
                }

                if( child.var.temp.remoteness == null ){
                  child.setRelations( step, parent );
                  let addIndex = this.convertGrid( vec );
                  indexs.new.push( addIndex );
                }
              }
            }
          }

          indexs.old = [];

          for( let k = 0; k < indexs.new.length; k++ )
            indexs.old.push( indexs.new[k] );
        }


        let steps = [];
        let communityGrid = this.convertIndex( disputable.const.index );
        let community = this.array.community[communityGrid.y][communityGrid.x];
        indexs = {
          old: community.array.parent,
          new: []
        };
        step = 0;
        flag = false;


        while( !flag && step < stopper ){
          step++;
          indexs.new = [];

          for( let c = 0; c < indexs.old.length; c++ ){
            let vec = this.convertIndex( indexs.old[c] );
            let child = this.array.community[vec.y][vec.x];
            child.var.visiable = true;

            for( let p = 0; p < child.array.parent.length; p++ ){
              let index = indexs.new.indexOf( child.array.parent[p] );

              if( index == -1 )
                indexs.new.push( child.array.parent[p] );
            }
          }

          indexs.old = [];

          for( let p = 0; p < indexs.new.length; p++ )
            indexs.old.push( indexs.new[p] );

          let index = indexs.old.indexOf( capital.const.index );

          if( index != -1 )
            flag = true;
        }
      }
    }

    for( let i = 0; i < this.array.community.length; i++ )
      for( let j = 0; j < this.array.community[i].length; j++ )
        if( this.array.community[i][j].var.visiable )
          this.array.visiable.push( this.array.community[i][j].const.index );
  }

  handleSide( side, controversial ){
    let x = this.const.n * ( 1 + side );
    let y = Math.round( this.const.size / 2 );
    let capitalGrid = createVector( x, y );
    let grid = {
      community: null,
      controversial: null,
      capital: createVector( x, y )
    };
    let distance = {
      controversial: 0,
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
        grid.controversial = createVector( this.const.n, i );
        distance.controversial = Math.abs( grid.controversial.x - grid.community.x ) + Math.abs( grid.controversial.y - grid.community.y );
        distance.capital = Math.abs( grid.capital.x - grid.community.x ) + Math.abs( grid.capital.y - grid.community.y );
        //if( distance.capital + distance.controversial == distance.min )
          console.log( this.array.community[i][j].const.index, distance.capital, distance.controversial )
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
    let flag = ( grid.x >= this.const.m ) || ( grid.x < 0 ) || ( grid.y >= this.const.n ) || ( grid.y < 0 );

    return !flag;
  }

  click(){
    if( this.var.current.community != null ){
      let neighbors = [];
      let grid = this.convertIndex( this.var.current.community );
      let community = this.array.community[grid.y][grid.x];
      let parity = ( grid.x % 2 );

      for( let l = 0; l <  this.array.neighbor[parity].length; l++ ){
        let vec = grid.copy();
        vec.add( this.array.neighbor[parity][l] );

        if( this.checkBorder( vec ) )
          neighbors.push( this.array.community[vec.y][vec.x] );
        }

      this.data.zoom = new zoom( community, neighbors );
    }
    else
      this.data.zoom = null;
  }

  mouseMoves( offset ){
    this.detectZoom( offset );
  }

  detectZoom( offset ){
    let mouse = createVector( mouseX, mouseY );
    let min = {
      dist: INFINITY,
      index: null
    };
    mouse.sub( offset );

    for( let i = 0; i < this.array.visiable.length; i++ ){
      let grid = this.convertIndex( this.array.visiable[i] );
      let community = this.array.community[grid.y][grid.x];
      let d = mouse.dist( community.var.center )
      if( d < min.dist && d < community.const.r ){
        min.dist = d;
        min.index = community.const.index;
      }
    }

    this.var.current.community = min.index;
  }

  draw( offsets ){
    //this.cleanCommunitys();
    this.mouseMoves( offsets[0] );
    let f = Math.floor( this.var.floor / 2 );

    for( let i = 0; i < this.array.community.length; i++ )
      for( let j = 0; j < this.array.community[i].length; j++ )
        this.array.community[i][j].draw( offsets[0] );

    if( this.data.zoom != null )
      this.data.zoom.draw( offsets[1] );
  }
}
