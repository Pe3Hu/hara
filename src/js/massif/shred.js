//
class shred {
  constructor ( index, value, kind, center, grid, a ){
    this.const = {
      index: index,
      value: {
        id: null,
        name: null
      },
      kind: kind,
      i: grid.y,
      j: grid.x,
      n: 8,
      a: a
    };
    this.array = {
      vertex: [],
      corner: [],
      segment: [],
      color: []
    };
    this.var = {
      center: center.copy(),
      harmony: null,
      group:{
        id: null,
        'shortest': false,
        'longest': false
      },
      value:{
        'shortest': false,
        'longest': false,
        'single': false,
        'total': false
      },
      fit: {
        law: true,
        node: true
      }
    };
    this.flag = {
      digital: [],
      costal: [],
      angular: [],
      secant: []
    };
    this.color = {
      bg:{
        h: 60,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0.5
      },
      value:{
        h: COLOR_MAX * 0.5,
        s: COLOR_MAX * 0.75,
        l: COLOR_MAX * 0
      }
    }

    this.init( value );
  }

  initVertexs(){
    for( let i = 0; i < this.const.n; i++ ){
      let vec = createVector(
        Math.sin( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.r,
        Math.cos( Math.PI * 2 / this.const.n * ( 0.5 - i + this.const.n / 2 ) ) * this.const.r );
      vec.add( this.var.center );
      this.array.vertex.push( vec );
    }
  }

  initColors(){
    this.color.extent = {
      13: 210,
      14: 240,
      5: 270,
      15: 300,
      10: 330,
      7: 0,
      11: 30
    }
  }

  init( value ){
    this.const.r =  this.const.a / ( Math.cos( Math.PI / this.const.n ) );
    this.initVertexs();
    this.initColors();
    this.setValue( value );
    this.setGroup( 0 );
  }

  setValue( value ){
    this.const.value.id = value;
    let code = value;
    let rank = 8;
    let binaryCode = [];

    while( rank >= 1 ){
      binaryCode.push( Math.floor( code / rank ) );
      code = code % rank;
      rank /= 2;
    }

    this.array.corner = binaryCode;
    this.array.corner = [];
    for( let i = binaryCode.length - 1; i > -1 ; i-- )
      this.array.corner.push( binaryCode[i] )

    this.setSegments();
    this.updateHarmony();
  }

  setSegments(){
    let length = null;

    switch ( this.const.kind ) {
      case 0:
        length = 7;
        break;
      case 1:
        length = 8;
        break;
      case 2:
        length = 10;
        break;
      case 3:
        length = 4;
        break;
    }

    this.array.segment = [];
    let segments = [];
    let sqaure = [];
    let dots = [];
    let a, b;

    for( let i = 0; i < length; i++ )
      segments.push( false );

    switch ( this.const.kind ) {
      case 0:
        sqaure = [];
        dots = [];
        a = this.const.a / 3;
        b = this.const.a / 8;

        dots.push( createVector( 0, -2 * a ) );
        dots.push( createVector( a, -a ) );
        dots.push( createVector( a, a ) );
        dots.push( createVector( 0, 2 * a ) );
        dots.push( createVector( -a, a ) );
        dots.push( createVector( -a, -a ) );
        dots.push( createVector( 0, 0 ) );

        sqaure.push( createVector( 1, -1 ) );
        sqaure.push( createVector( 1, 1 ) );
        sqaure.push( createVector( -1, 1 ) );
        sqaure.push( createVector( -1, -1 ) );

          for( let i = 0; i < this.array.corner.length; i++ )
            if( this.array.corner[i] ){
              switch ( i ) {
                case 0:
                  segments[0] = true;
                  segments[1] = true;
                  break;
                case 1:
                  segments[2] = true;
                  segments[3] = true;
                  break;
                case 2:
                  segments[3] = true;
                  segments[4] = true;
                  break;
                case 3:
                  segments[0] = true;
                  segments[5] = true;
                  break;
              }
            }

          segments[6] = true;

          for( let i = 0; i < segments.length; i++ )
            if( segments[i] ){
              let center = dots[i];
              let vertical = i % 3;
              let vertexs = [];
              let x = 0;
              let y = 2;
              let shfit = 0;

              if( !vertical ){
                shfit = 1;
                x = 2;
                y = 0;
              }

              for( let j = 0; j < sqaure.length; j++ ){
                let jj = ( shfit + j ) % sqaure.length;
                vertexs.push( createVector( sqaure[jj].x * b, sqaure[jj].y * b ) );
              }

              if( !vertical ){
                vertexs.splice( 0, 0, createVector( x * b, y * b ) );
                vertexs.splice( 3, 0, createVector( -x * b, y * b ) );
              }
              else{
                vertexs.splice( 0, 0, createVector( x * b, -y * b ) );
                vertexs.splice( 3, 0, createVector( x * b, y * b ) );
              }

              for( let j = 0; j < vertexs.length; j++ ){
                vertexs[j].add( center );
                vertexs[j].add( this.var.center );
              }

              this.array.segment.push( vertexs );
            }
        break;
      case 1:
        a = this.const.a / 8 * 3;
        b = this.const.a / 8;

        dots.push( createVector( a, -2 * a ) );
        dots.push( createVector( a, 0 ) );
        dots.push( createVector( a, 0 ) );
        dots.push( createVector( a, 2 * a ) );
        dots.push( createVector(- a, 2 * a ) );
        dots.push( createVector( -a, 0 ) );
        dots.push( createVector( -a, 0 ) );
        dots.push( createVector( -a, -2 * a ) );

        sqaure.push( createVector( -1, 1 ) );
        sqaure.push( createVector( -1, -1 ) );
        sqaure.push( createVector( 1, -1 ) );
        sqaure.push( createVector( 1, 1 ) );

        for( let i = 0; i < this.array.corner.length; i++ )
          if( this.array.corner[i] ){
            let j = i * 2;
            segments[j] = true;
            segments[j + 1] = true;
          }

        for( let i = 0; i < segments.length; i++ )
          if( segments[i] ){
            let center = dots[i];
            let vertexs = [];
            let type = null;

            switch ( i ) {
              case 0:
              case 2:
                type = 0;
                break;
              case 1:
              case 3:
                type = 1;
                break;
              case 4:
              case 6:
                type = 2;
                break;
              case 5:
              case 7:
                type = 3;
                break;
            }

            vertexs.push( createVector( sqaure[type].x * b * 3, sqaure[type].y * -b ) );
            vertexs.push( createVector( sqaure[type].x * b * 3, sqaure[type].y * b ) );
            vertexs.push( createVector( sqaure[type].x * b, sqaure[type].y * b * 3 ) );
            vertexs.push( createVector( sqaure[type].x * -b , sqaure[type].y * b * 3 ) );

            for( let j = 0; j < vertexs.length; j++ ){
              vertexs[j].add( center );
              vertexs[j].add( this.var.center );
            }

            this.array.segment.push( vertexs );
          }
        break;
      case 2:
        b = this.const.a / 30;
        let v = b * 4;
        let w = b * 5 / 2;
        a = v + w + b * 3;

        dots.push( createVector( a, -2 * a ) );
        dots.push( createVector( a, 0 ) );
        dots.push( createVector( a, 0 ) );
        dots.push( createVector( a, 2 * a ) );
        dots.push( createVector(- a, 2 * a ) );
        dots.push( createVector( -a, 0 ) );
        dots.push( createVector( -a, 0 ) );
        dots.push( createVector( -a, -2 * a ) );

        sqaure.push( createVector( -1, 1 ) );
        sqaure.push( createVector( -1, -1 ) );
        sqaure.push( createVector( 1, -1 ) );
        sqaure.push( createVector( 1, 1 ) );

        for( let i = 0; i < this.array.corner.length; i++ )
          if( this.array.corner[i] ){
            let j = i * 2;
            segments[j] = true;
            segments[j + 1] = true;
          }

        for( let i = 0; i < segments.length; i++ )
          if( segments[i] ){
            let center = dots[i].copy();
            let vertexs = [];
            let type = null;

            switch ( i ) {
              case 0:
              case 2:
                type = 0;
                break;
              case 1:
              case 3:
                type = 1;
                break;
              case 4:
              case 6:
                type = 2;
                break;
              case 5:
              case 7:
                type = 3;
                break;
            }

            center.add( this.var.center );
            vertexs.push( center );
            center = dots[i];

            vertexs.push( createVector( sqaure[type].x * ( w + v ), sqaure[type].y * -w ) );
            vertexs.push( createVector( sqaure[type].x * ( w + v ), sqaure[type].y * w ) );
            vertexs.push( createVector( sqaure[type].x * w, sqaure[type].y * w ) );
            vertexs.push( createVector( sqaure[type].x * w, sqaure[type].y * ( w + v ) ) );
            vertexs.push( createVector( sqaure[type].x * -w , sqaure[type].y * ( w + v ) ) );
            vertexs.push( createVector( sqaure[type].x * -w, sqaure[type].y * -w ) );


            for( let j = 1; j < vertexs.length; j++ ){
              vertexs[j].add( center );
              vertexs[j].add( this.var.center );
            }


            this.array.segment.push( vertexs );
          }
        break;
      case 3:
        a = this.const.a / 3;
        b = this.const.a / 9;
        dots.push( createVector( a, -2 * a ) );
        dots.push( createVector( a, 2 * a ) );
        dots.push( createVector( -a, 2 * a ) );
        dots.push( createVector( -a, -2 * a ) );

        sqaure.push( createVector( 1, 0 ) );
        sqaure.push( createVector( -1, 0 ) );
        sqaure.push( createVector( -1, 0 ) );
        sqaure.push( createVector( 1, 0 ) );

        for( let i = 0; i < this.array.corner.length; i++ )
          if( this.array.corner[i] )
            segments[i] = true;

        for( let i = 0; i < segments.length; i++ )
          if( segments[i] ){
            let center = dots[i].copy();
            let vertexs = [];

            for( let j = 0; j < sqaure.length; j++ )
              vertexs.push( createVector( sqaure[j].x * b, sqaure[j].y * b ) );

            for( let j = 0; j < vertexs.length; j++ )
              vertexs[j].add( this.var.center );

            for( let j = 0; j < 2; j++ )
              vertexs[j].add( center );

            this.array.segment.push( vertexs );
          }
        break;

    }

  }

  setGroup( type, id ){
    if( id == undefined )
      id = null;
    this.var.group.id = id;

    switch ( type ) {
      case -2:
        this.var.group['shortest'] = true;
        this.var.group['longest'] = false;
        break;
      case -1:
        this.var.value['shortest'] = true;
        this.var.value['longest'] = false;
        break;
      case 0:
        this.var.value['total'] = true;
        this.var.value['shortest'] = false;
        this.var.value['shortest'] = false;
        this.var.value['longest'] = false;
        this.var.group['shortest'] = false;
        this.var.group['longest'] = false;
        break;
      case 1:
        this.var.value['longest'] = true;
        this.var.value['shortest'] = false;
        break;
      case 2:
        this.var.group['longest'] = true;
        this.var.group['shortest'] = false;
        break;
    }
  }

  setSingle( single ){
    this.var.value['single'] = single;
  }

  setFit( flag, type ){
    //
    switch ( type ) {
      case 0:
        this.var.fit.law = flag;
        break;
      case 1:
        this.var.fit.node = flag;
        break;
    }

    if( !this.var.fit.law || !this.var.fit.node )
      this.color.bg.h = 120;
    else
      this.color.bg.h = 60;
  }

  updateHarmony(){
    let harmony = 0;
    let charges = [ 1, 2, -2 , -1 ];

    for( let i = 0; i < this.array.corner.length; i++ )
      harmony += this.array.corner[i] * charges[i];

    this.var.harmony = harmony;
  }

  drawValue( offset ){
    noStroke();
    fill( this.color.value.h, this.color.value.s, this.color.value.l );
    fill( this.color.value.h, this.color.value.s, this.color.value.l );

    for( let i = 0; i < this.array.segment.length; i++ ){
        let length = this.array.segment[i].length - 1;
        if( this.const.kind == 2 )
          length = this.array.segment[i].length;

        for( let j = 1; j < length; j++ ){
          let jj = ( j + 1 ) % this.array.segment[i].length;
          if( jj == 0 )
            jj = 1;

          triangle( this.array.segment[i][0].x + offset.x, this.array.segment[i][0].y + offset.y,
                    this.array.segment[i][j].x + offset.x, this.array.segment[i][j].y + offset.y,
                    this.array.segment[i][jj].x + offset.x, this.array.segment[i][jj].y + offset.y );
      }
    }
  }

  drawBackground( offset ){
    let size = this.const.a * 1.75;
    fill( this.color.bg.h, this.color.bg.s, this.color.bg.l );
    stroke( this.color.bg.h, this.color.bg.s, this.color.bg.l );

    strokeWeight( 0.2 );

    for( let i = 0; i < this.array.vertex.length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex.length;

      triangle( this.var.center.x + offset.x, this.var.center.y + offset.y,
                this.array.vertex[i].x + offset.x, this.array.vertex[i].y + offset.y,
                this.array.vertex[ii].x + offset.x, this.array.vertex[ii].y + offset.y );
    }
  }

  draw( offset ){
   this.drawBackground( offset );
   this.drawValue( offset );

   fill( 0 );
   let txt = this.const.index;
  // text( txt, this.var.center.x + offset.x, this.var.center.y + offset.y + fontSize / 3 );
  }
}
