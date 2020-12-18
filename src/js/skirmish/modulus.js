//
class modulus {
  constructor ( index, center ){
    this.const = {
      index: index,
      center: center,
      type: {

      }
    };
    this.var = {
    };
    this.array = {
    };

    this.init();
  }

  init(){
  }

  setType( destination, specialization ){
    this.const.type.index = type;

    switch ( destination ) {
      case 0:
        this.const.type.specialization = 'founder';
        switch ( specialization ) {
          case 0:
            this.const.type.specialization = 'motherboard';
            break;
          case 1:
            this.const.type.specialization = 'carcass';
            break;
          }
        break;
      case 1:
        this.const.type.specialization = 'keeper';
        switch ( specialization - 2 ) {
          case 0:
            this.const.type.specialization = 'accumulator';
            break;
          case 1:
            this.const.type.specialization = 'entrepot';
            break;
          case 2:
            this.const.type.specialization = 'warehouse';
            break;
          case 3:
            this.const.type.specialization = 'library';
            break;
          case 4:
            this.const.type.specialization = 'protector';
            break;
          }
        break;
      case 2:
        this.const.type.specialization = 'executor';
        switch ( specialization - 6 ) {
          case 0:
            this.const.type.specialization = 'extractor';
            break;
          case 1:
            this.const.type.specialization = 'builder';
            break;
          case 2:
            this.const.type.specialization = 'repairer';
            break;
          case 3:
            this.const.type.specialization = 'carrier';
            break;
          case 4:
            this.const.type.specialization = 'conveyor';
            break;
          }
        break;
      case 3:
        this.const.type.specialization = 'surfer';
        switch ( specialization - 10 ) {
          case 0:
            this.const.type.specialization = 'photocell';
            break;
          case 1:
            this.const.type.specialization = 'destroyer';
            break;
          case 2:
            this.const.type.specialization = 'observer';
            break;
          case 3:
            this.const.type.specialization = 'encoder';
            break;
          case 4:
            this.const.type.specialization = 'emitter';
            break;
          }
        break;
      case 4:
        this.const.type.specialization = 'transformer';
        switch ( specialization - 14 ) {
          case 0:
            this.const.type.specialization = 'manufacturer';
            break;
          case 1:
            this.const.type.specialization = 'reactor';
            break;
          case 2:
            this.const.type.specialization = 'concentrator';
            break;
          case 3:
            this.const.type.specialization = 'designer';
            break;
          }
        break;
      }

      /*
      case 18:
        this.const.type.specialization = 'helmsman';
        break;
      case 19:
        this.const.type.specialization = 'closer';
        break;
      case 20:
        this.const.type.specialization = 'afterburner';
        break;
      case 21:
        this.const.type.specialization = 'cooler';
        break;*/
      /*case 22:
        this.const.type.specialization = 'scheduler';
        break;
      case 23:
        this.const.type.specialization = 'observer';
        break;
      case 24:
        this.const.type.specialization = 'encoder';
        break;
      case 25:
        this.const.type.specialization = 'destroyer';
        break;
      case 26:
        this.const.type.specialization = 'protector';
        break;
      case 27:
        this.const.type.specialization = 'helmsman';
        break;
      case 28:
        this.const.type.specialization = 'concentrator';
        break;
      case 29:
        this.const.type.specialization = 'designer';
        break;*/

  }

  draw(  ){
  }
}
