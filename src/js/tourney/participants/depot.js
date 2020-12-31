//
class depot {
  constructor ( forge ){
    this.const = {
    };
    this.var = {
      index: {
        mule: 0,
        compressor: 0
      }
    };
    this.array = {
      mule: {
        stand : [],
        garage: []
      },
      compressor: {
        stand : [],
        garage: []
      }
    };
    this.data = {
      forge: forge
    };
  }

  forgeBaseTransport( rails ){
    let keys = Object.keys(this.data.forge.array);
    //mule
    let key = keys[0];
    //index of base imprint
    let index = 0;

    for( let i = 0; i < rails; i++ )
      this.addMule( key, index );
  }

  addMule( key, index ){
    let imprint = this.data.forge.makeAnImpression( key, index );
    this.array.mule.garage.push( new mule( imprint ) );
  }
}
