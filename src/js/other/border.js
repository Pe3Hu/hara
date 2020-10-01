class border {
  constructor ( index, layer, name, offset, size ){
    this.const = {
      index: index
    };
    this.layer = layer;
    this.name = name;
    this.offset = offset;
    this.size = size;
    this.color = color( COLOR_MAX / 3 * 2 );
    this.onScreen = true;
  }

  draw( layer ){
    if ( ( this.layer == layer || this.layer == MENU_LAYER ) && this.onScreen ){
      fill( this.color );
      rect( this.offset.x, this.offset.y, this.size.x, this.size.y );
    }
  }
}
