//
class card {
  constructor ( index, center, a ){
    this.const = {
      index: index,
      center: center,
      a: a
    };
    this.array = {
    };
    this.var = {
      caste: null,
      grade: null
    };

    this.init();
  }

  init(){

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

  draw(){

  }
}
