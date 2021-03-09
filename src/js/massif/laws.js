//
class laws {
  constructor ( values ){
    this.obj = {
      'total': {
        'on': {},
        'not_on': {},
        'near': {},
        'not_near': {}
      },
      'shortest': {
        'on': {},
        'not_on': {},
        'near': {},
        'not_near': {}
      },
      'longest': {
        'on': {},
        'not_on': {},
        'near': {},
        'not_near': {}
      },
      'single': {
        'on': {},
        'not_on': {},
        'near': {},
        'not_near': {}
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

  init_values(){
    for( let subtype in this.obj )
      for( let location in this.obj[subtype] ){
        for( let i = 0; i < this.array.value.length; i++ )
          this.obj[subtype][location][this.array.value[i]] = [];

        if( subtype != 'single' && subtype != 'total' )
          this.obj[subtype][location][0] = [];
      }
  }

  init_labels(){
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
    this.init_values();
    this.init_labels();
  }

  update_influence( subtype, location, value, index ){
    this.obj[subtype][location][value].push( index );
  }

  set_answers( answers ){
    this.array.answer = answers;
  }
}
