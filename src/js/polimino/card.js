//
class card {
  constructor ( index, center, a, caste, grade, sin ){
    this.const = {
      index: index,
      center: center,
      a: a
    };
    this.array = {
    };
    this.var = {
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
      cell: null
    };

    this.init( caste, grade, sin );
  }

  init( caste, grade, sin ){
    this.initColor();
    this.setCaste( caste );
    this.setGrade( grade );
    this.setSin( sin );
  }

  initColor(){
    this.var.hue = 0;
    this.var.saturation = 0;
    this.var.lightness = colorMax * 0.75;
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
      case 11:
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

  setCell( cell ){
    this.var.cell = cell;
    this.const.center = cell.const.center;
  }

  draw( offset ){
    stroke( 0 );
    fill( this.var.hue, this.var.saturation, this.var.lightness );
    rect(
      this.const.center.x - this.const.a / 2,
      this.const.center.y - this.const.a / 2,
      this.const.a, this.const.a
    );

    stroke( 0 );
    fill( 0 );
    let casteVec = this.const.center.copy();
    let caste = this.var.caste.name.charAt(0).toUpperCase() + this.var.caste.id;
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
    text( caste, casteVec.x, casteVec.y + fontSize / 3 );
    fill( this.var.sin.id * colorMax / 7, colorMax * 1, colorMax * 0.5 )
    rect( rectVec.x, rectVec.y, rectSize.x, rectSize.y );
  }
}
