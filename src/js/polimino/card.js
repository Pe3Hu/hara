//
class card {
  constructor ( index, a, utensils, caste, sin, grade, predisposition ){
    this.const = {
      index: index,
      center: null,
      a: a
    };
    this.array = {
      vertex: [],
      predisposition: [],
      color: []
    };
    this.var = {
      utensils: {
        id: null,
        name: null
      },
      caste: {
        id: null,
        name: null
      },
      grade: {
        id: null,
        name: null
      },
      sin: {
        id: null,
        name: null,
        lear: null
      },
      selected: false,
      onBoard: false,
      cell: null,
      maxPredisposition: null
    };

    this.init( utensils, caste, sin, grade, predisposition );
  }

  init( utensils, caste, sin, grade, predisposition ){
    this.initColor();
    this.initVertexs();
    this.initSizes();
    this.setUtensils( utensils, sin, grade, predisposition );
    this.setCaste( caste );
    this.setStatus( 0 );
  }

  initColor(){
    let n = 7;

    for ( let i = 0; i < n; i++ )
      this.array.color.push( {
        hue: i * COLOR_MAX / n,
        saturation: COLOR_MAX,
        lightness: COLOR_MAX * 0.5
      } );

    this.array.color.push( {
      hue: 0,
      saturation: 0,
      lightness: COLOR_MAX * 0.75
    } );


    this.array.color.push( {
      hue: 0,
      saturation: 0,
      lightness: COLOR_MAX
    } );
  }

  initVertexs(){
    let vec = createVector(  this.const.a * 0.25, -this.const.a * 0.25 );
    this.array.vertex.push( vec );

    vec = createVector(  -this.const.a * 0.25, -this.const.a * 0.5, );
    this.array.vertex.push( vec );

    vec = createVector( 0, -this.const.a * 0.5 );
    this.array.vertex.push( vec );

    vec = createVector( -this.const.a * 0.25, this.const.a * 0.25 );
    this.array.vertex.push( vec );

    vec = createVector( -this.const.a / 12,  this.const.a * 0.25 );
    this.array.vertex.push( vec );

    vec = createVector( this.const.a / 12, this.const.a * 0.25 );
    this.array.vertex.push( vec );

    vec = createVector(  -this.const.a * 0.5, -this.const.a * 0.25);
    this.array.vertex.push( vec );
  }

  initSizes(){
    this.array.size = [];
    let rectSize = createVector( 0.25 * this.const.a, 0.5 * this.const.a );
    this.array.size.push( rectSize );

    rectSize = createVector( 0.25 * this.const.a, 0.25 * this.const.a );
    this.array.size.push( rectSize );
    this.array.size.push( rectSize );

    rectSize = createVector( this.const.a / 6, 0.25 * this.const.a );
    this.array.size.push( rectSize );
    this.array.size.push( rectSize );
    this.array.size.push( rectSize );

    rectSize = createVector( 0.25 * this.const.a, 0.5 * this.const.a );
    this.array.size.push( rectSize );
  }

  setUtensils( utensils, sin, grade, predisposition ){
    this.var.utensils.id = utensils;
    switch ( utensils ) {
      case 0:
        this.var.utensils.name = 'neutral';
        this.array.predisposition = predisposition;
        this.maxPredisposition();
        break;
      case 1:
        this.var.utensils.name = 'private';
        this.setGrade( grade );
        this.setSin( sin );
        break;
    }
  }

  setSin( sin ){
    this.var.sin.id = sin;
    //PEAWLGS
    switch ( sin ) {
      case 0:
        this.var.sin.name = 'pride';
        this.var.sin.lear = 0;
        break;
      case 1:
        this.var.sin.name = 'envy';
        this.var.sin.lear = 1;
        break;
      case 2:
        this.var.sin.name = 'avarice';
        this.var.sin.lear = 1;
        break;
      case 3:
        this.var.sin.name = 'wrath';
        this.var.sin.lear = 2;
        break;
      case 4:
        this.var.sin.name = 'lust';
        this.var.sin.lear = 2;
        break;
      case 5:
        this.var.sin.name = 'gluttony';
        this.var.sin.lear = 2;
        break;
      case 6:
        this.var.sin.name = 'sloth';
        this.var.sin.lear = 3;
        break;
    }

  }

  setCaste( caste ){
    this.var.caste.id = caste;
    //BDMCRWHAOPSN
    switch ( caste ) {
      case 0:
        this.var.caste.name = 'beggar';
        break;
      case 1:
        this.var.caste.name = 'digger';
        break;
      case 2:
        this.var.caste.name = 'maid';
        break;
      case 3:
        this.var.caste.name = 'criminal';
        break;
      case 4:
        this.var.caste.name = 'rustler';
        break;
      case 5:
        this.var.caste.name = 'warrior';
        break;
      case 6:
        this.var.caste.name = 'handler';
        break;
      case 7:
        this.var.caste.name = 'artist';
        break;
      case 8:
        this.var.caste.name = 'officiary';
        break;
      case 9:
        this.var.caste.name = 'priest';
        break;
      case 10:
        this.var.caste.name = 'steward';
        break;
      case 11:
        this.var.caste.name = 'noble';
        break;
      case 12:
        this.var.caste.name = 'royal';
        break;
    }
  }

  setGrade( grade ){
    this.var.grade.id = grade;
    //NDPMGV
    switch ( grade ) {
      case 0:
        this.var.grade.name = 'novice';
        break;
      case 1:
        this.var.grade.name = 'disciple';
        break;
      case 2:
        this.var.grade.name = 'prentice';
        break;
      case 3:
        this.var.grade.name = 'master';
        break;
      case 4:
        this.var.grade.name = 'grandmatser';
        break;
      case 4:
        this.var.grade.name = 'virtuoso';
        break;
    }
  }

  setStatus( status, center, cell ){
    switch ( status ) {
      case 0:
        this.var.status = 'notTaken';
        this.var.onBoard = false;
        this.var.cell = null;
        this.const.center = null;
        break;
      case 1:
        this.var.status = 'wait';
        this.var.onBoard = true;
        this.var.cell = null;
        this.const.center = center.copy();
        break;
      case 2:
        this.var.status = 'involved';
        this.var.onBoard = true;
        this.var.cell = cell;
        this.const.center = cell.const.center.copy();
        break;
    }
  }

  maxPredisposition(){
    if( this.array.predisposition.length == 0
      || this.array.predisposition == null )
      retunr;

    this.var.maxPredisposition = this.array.predisposition[0];

    for( let i = 1; i < this.array.predisposition.length; i++ )
      if( this.array.predisposition[i] > this.var.maxPredisposition )
        this.var.maxPredisposition = this.array.predisposition[i];
  }

  draw( offset ){
    if( !this.var.onBoard )
      return;

    stroke( 0 );
    fill( this.array.color[7].hue, this.array.color[7].saturation, this.array.color[7].lightness );
    rect(
      this.const.center.x - this.const.a / 2,
      this.const.center.y - this.const.a / 2,
      this.const.a, this.const.a
    );


    let casteVec;
    let caste;
    switch ( this.var.utensils.name ) {
      case 'private':
        fill( 0 );
        casteVec = this.const.center.copy();
        caste = this.var.caste.name.charAt( 0 ).toUpperCase();
        let rectSize = createVector( 0.5 * this.const.a, 0.5 * this.const.a );
        let rectVec = this.const.center.copy();
        rectVec.x -= 0.5 * this.const.a;
        rectVec.y -= 0.5 * this.const.a;

        switch ( this.var.sin.lear ) {
          case 0:
            casteVec.x -= 0.25 * this.const.a;
            rectVec.x += 0.5 * this.const.a;
            rectSize.y += 0.5 * this.const.a;
            break;
          case 1:
            casteVec.y += 0.25 * this.const.a;
            rectSize.x += 0.5 * this.const.a;
            break;
          case 2:
            casteVec.y -= 0.25 * this.const.a;
            rectVec.y += 0.5 * this.const.a;
            rectSize.x += 0.5 * this.const.a;
            break;
          case 3:
            casteVec.x += 0.25 * this.const.a;
            rectSize.y += 0.5 * this.const.a;
            break;
        }

        text( caste, casteVec.x, casteVec.y + FONT_SIZE / 3 );
        let color = this.array.color[this.var.sin.id];
        fill( color.hue, color.saturation, color.lightness );
        rect( rectVec.x, rectVec.y, rectSize.x, rectSize.y );
        break;
      case 'neutral':
        for( let i = 0; i < this.array.vertex.length; i++ ){
          let vec = this.const.center.copy();
          vec.add( this.array.vertex[i] );
          fill( this.array.color[i].hue, this.array.color[i].saturation, this.array.color[i].lightness );
          rect( vec.x, vec.y, this.array.size[i].x, this.array.size[i].y );

          vec.x += this.array.size[i].x / 2;
          vec.y += this.array.size[i].y / 2;
          let txt = this.array.predisposition[i];

          textSize( FONT_SIZE * 0.8 );
          if( this.array.predisposition[i] == this.var.maxPredisposition )
            fill( this.array.color[8].hue, this.array.color[8].saturation, this.array.color[8].lightness );
          else
            fill( this.array.color[7].hue, this.array.color[7].saturation, this.array.color[7].lightness );
          text( txt, vec.x, vec.y + FONT_SIZE / 3 * 0.8 );
          textSize( FONT_SIZE );
        }

        casteVec = this.const.center.copy();
        caste = this.var.caste.name.charAt( 0 ).toUpperCase();
        fill( 0 );
        text( caste, casteVec.x, casteVec.y + FONT_SIZE / 3 );
        break;
    }

  }
}
