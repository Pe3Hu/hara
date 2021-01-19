//
class criterion {
  constructor ( index, branch, type, parent ){
    this.const = {
      index: index,
      parent: parent
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
      branch: {
        id: branch,
        name: null
      },
      type: {
        id: type,
        name: null
      },
      chance:{
        value: null
      }
    };

    this.init();
  }

  init(){
    this.updateData();
  }

  updateData(){
    switch ( this.data.branch.id ) {
      case 0:
        this.data.branch.name = '-';
        switch ( this.data.type.id ) {
          case 0:
            this.data.type.name = 'reflection';
            break;
          case 1:
            this.data.type.name = 'distortion';
            break;
          case 2:
            this.data.type.name = 'echelon';
            break;
        }
        break;
      case 1:
        this.data.branch.name = '=';
        switch ( this.data.type.id ) {
          case 0:
            this.data.type.name = 'even';
            break;
          case 1:
            this.data.type.name = 'odd';
            break;
          case 2:
            this.data.type.name = 'min';
            break;
          case 3:
            this.data.type.name = 'max';
            break;
        }
        break;
      case 2:
        this.data.branch.name = '+';
        switch ( this.data.type.id ) {
          case 0:
            this.data.type.name = 'less';
            break;
          case 1:
            this.data.type.name = 'balance';
            break;
          case 2:
            this.data.type.name = 'more';
            break;
        }
        break;
    }
  }

  duplicate(){
    return new criterion( null, this.data.branch.id, this.data.type.id, this.const.index );
  }

  draw( offset ){

    fill( 0 );
    noStroke();
    let txt = this.data.type.name;
    text( txt, offset.x, offset.y + FONT_SIZE / 3 );
  }
}
