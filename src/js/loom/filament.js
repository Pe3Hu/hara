//ниить
class filament {
  constructor ( index ){
    this.const = {
      index: index
    };
    this.var = {
    };
  }

  setType( type ){
    this.var.type.id = type;

    switch ( type ) {
      //основа
      case 0:
        this.var.type.name = 'warp';
        break;
      //уток
      case 1:
        this.var.type.name = 'weft';
        break;
    }
  }

  draw(  ){
  }
}
