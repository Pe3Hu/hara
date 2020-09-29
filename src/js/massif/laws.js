//
class laws {
  constructor ( values ){
    this.obj = {
      'single': {
        'on': {},
        'notOn': {},
        'near': {},
        'notNear': {}
      },
      'shortest': {
        'on': {},
        'notOn': {},
        'near': {},
        'notNear': {}
      },
      'longest': {
        'on': {},
        'notOn': {},
        'near': {},
        'notNear': {}
      },
      'total': {
        'on': {},
        'notOn': {},
        'near': {},
        'notNear': {}
      }
    };
    this.array = {
      answers: []
    }

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

  setAnswers( answers ){
    this.array.answers = answers
  }
}
