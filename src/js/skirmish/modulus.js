//
class modulus {
  constructor ( index, center, r ){
    this.const = {
      index: index,
      center: center,
      r: r
    };
    this.var = {
    };
    this.array = {
    };
    this.flag = {
      free: true,
      enable: false
    }
    this.data = {
      destination: null,
      specialization: null,
      creator: null,
      inflow: null,
      outflow: null,
      impasse: null,
      rapids: null,
      flow: null
    }

    this.init();
  }

  init(){
    this.const.r = this.const.a / ( 2 * Math.tan( Math.PI / this.const.n ) );
  }

  setType( destination, specialization ){
    if( destination != undefined && destination != null &&
        specialization != undefined && specialization != null ){
      this.flag.free = false;

      switch ( destination ) {
        case 0:
          this.data.destination = 'founder';

          switch ( specialization ) {
            case 0:
              this.data.specialization = 'motherboard';
              break;
            case 1:
              this.data.specialization = 'carcass';
              break;
            case 2:
              this.data.specialization = 'engine';
              break;
            }
          break;
        case 1:
          this.data.destination = 'keeper';

          switch ( specialization ) {
            case 0:
              this.data.specialization = 'accumulator';
              break;
            case 1:
              this.data.specialization = 'entrepot';
              break;
            case 2:
              this.data.specialization = 'warehouse';
              break;
            case 3:
              this.data.specialization = 'library';
              break;
            case 4:
              this.data.specialization = 'protector';
              break;
            }
          break;
        case 2:
          this.data.destination = 'executor';

          switch ( specialization ) {
            case 0:
              this.data.specialization = 'extractor';
              break;
            case 1:
              this.data.specialization = 'builder';
              break;
            case 2:
              this.data.specialization = 'repairer';
              break;
            case 3:
              this.data.specialization = 'carrier';
              break;
            case 4:
              this.data.specialization = 'conveyor';
              break;
            }
          break;
        case 3:
          this.data.destination = 'surfer';

          switch ( specialization ) {
            case 0:
              this.data.specialization = 'photocell';
              break;
            case 1:
              this.data.specialization = 'destroyer';
              break;
            case 2:
              this.data.specialization = 'observer';
              break;
            case 3:
              this.data.specialization = 'encoder';
              break;
            case 4:
              this.data.specialization = 'emitter';
              break;
            }
          break;
        case 4:
          this.data.destination = 'transformer';

          switch ( specialization ) {
            case 0:
              this.data.specialization = 'manufacturer';
              break;
            case 1:
              this.data.specialization = 'reactor';
              break;
            case 2:
              this.data.specialization = 'concentrator';
              break;
            case 3:
              this.data.specialization = 'designer';
              break;
            }
          break;
      }
    }
    else{
      this.flag.free = true;
      this.data.destination = null;
      this.data.specialization = null;
      this.data.creator = null;
    }

  }

  draw( offset ){
    let center = this.const.center.copy();
    center.add( offset );

    if( !this.flag.free )
      text( this.data.specialization.charAt( 0 ), this.const.center.x + offset.x, this.const.center.y + offset.y + FONT_SIZE / 3 );
  }
}
