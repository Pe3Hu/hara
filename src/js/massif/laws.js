//
class laws {
  constructor ( values ){
    this.obj = {
      'single': {
        'on': {},
        'near': {}
      },
      'shortest': {
        'on': {},
        'near': {}
      },
      'longest': {
        'on': {},
        'near': {}
      }
    };

    this.init( values );
  }

  initValues( values ){
    for( let subtype in this.obj )
      for( let location in this.obj[subtype] ){
        for( let i = 0; i < values.length; i++ )
          this.obj[subtype][location][values[i]] = [];

        if( subtype != 'single' )
          this.obj[subtype][location][0] = [];
      }
  }

  init( values ){
    this.initValues( values );
  }

  updateInfluence( subtype, location, value, index ){
    this.obj[subtype][location][value].push( index );
  }
}
