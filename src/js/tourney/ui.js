//
class ui {
  constructor ( joust ){
    this.const = {
      joust: joust
    };
    this.var = {
    };
    this.array = {
      trolley: {
        speed: [],
        fuel: []
      }
    };

    this.init();
  }

  updateTrolleyUI(){
    let x = 0;
    let a = this.const.joust.const.a;

    for( let knight of this.const.joust.array.knight ){
      let y = 0;
      let speeds = [];
      let fuels = [];

      for( let trolley of knight.array.trolley ){
        let center = createVector( x * a, y * a );
        let indicators = {
          name: 'speed',
          value: trolley.data.mule.var.current.speed,
          center: center
        };
        speeds.push( indicators );
        y++;

        center = createVector( x * a, y * a );
        indicators = {
          name: 'fuel',
          value: trolley.data.mule.data.weight.fuel,
          center: center
        };
        fuels.push( indicators );
        y++;
      }

      this.array.trolley.speed.push( speeds );
      this.array.trolley.fuel.push( fuels );
      //number of indicators
      let n = 2;
      x += n;
    }


  }

  init(){
    //this.updateTrolleyUI();
  }

  draw( offset ){
    this.updateTrolleyUI();
    fill( 0 );
    noStroke();

    /*for( let indicator in this.array.trolley )
      for( let knight of this.array.trolley[indicator] )
        for( let data of knight ){
          text( data.value.toFixed( 1 ), data.center.x + offset.x, data.center.y + offset.y + FONT_SIZE / 3 );
        }*/
  }
}
