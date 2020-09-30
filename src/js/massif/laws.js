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
      value: values,
      answer: []
    }
    this.table = {
      label: {}
    }

    this.init();
  }

  initValues(){
    for( let subtype in this.obj )
      for( let location in this.obj[subtype] ){
        for( let i = 0; i < this.array.value.length; i++ )
          this.obj[subtype][location][this.array.value[i]] = [];

        if( subtype != 'single' && subtype != 'total' )
          this.obj[subtype][location][0] = [];
      }
  }

  initLabels(){
    this.table.label = {
      '0': 'all',
      '5': '2',
      '7': 'a',
      '10': '5',
      '11': '9',
      '13': 'e',
      '14': '6',
      '15': '8'
    }
  }

  init(){
    this.initValues();
    this.initLabels();
  }

  updateInfluence( subtype, location, value, index ){
    this.obj[subtype][location][value].push( index );
  }

  setAnswers( answers ){
    this.array.answer = answers
  }
}
