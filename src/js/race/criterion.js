//
class criterion {
  constructor ( index, data, promotions ){
    this.const = {
      index: index,
      parent: parent
    };
    this.array = {
      promotion: promotions
    };
    this.data = data;
  }

  duplicate(){
    let data = {
      branch: {
        id: this.data.branch.id,
        name: this.data.branch.name
      },
      ramus: {
        id: this.data.ramus.id,
        name: this.data.ramus.name
      },
      chance: {
        value: this.data.chance.value,
        growth: this.data.chance.growth
      }
    };

    let c = new criterion( null, data, this.array.promotion );
    return c;
  }

  updateGrowth(){

    for( let promotion of this.array.promotion )
      if( promotion.data.begin < this.data.chance.value && promotion.data.end >= this.data.chance.value )
        this.data.chance.growth = promotion.data.growth;


  }

  draw( offset ){
    fill( 0 );
    noStroke();
    let txt = this.data.ramus.name;
    text( txt, offset.x, offset.y + FONT_SIZE / 3 );
  }
}
