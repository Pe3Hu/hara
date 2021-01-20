//
class pedigree {
  constructor ( branchs, growths ){
    this.data = {
      branch: branchs
    };
    this.table = {
      growth: growths
    }
  }

  addGrowth( branch, ramus, growth ){
    this.data.branch[branch].growth.current += growth;
    while( this.data.branch[branch].growth.current >= this.data.branch[branch].growth.max ){
      this.data.branch[branch].growth.current -= this.data.branch[branch].growth.max;
      this.data.branch[branch].growth.stage++;
      this.data.branch[branch].growth.max = this.table.growth[this.data.branch[branch].growth.stage];
    }

    this.data.branch[branch].ramus[ramus].growth.current += growth;
    while( this.data.branch[branch].ramus[ramus].growth.current >= this.data.branch[branch].ramus[ramus].growth.max ){
      this.data.branch[branch].ramus[ramus].growth.current -= this.data.branch[branch].ramus[ramus].growth.max;
      this.data.branch[branch].ramus[ramus].growth.stage++;
      this.data.branch[branch].ramus[ramus].growth.max = this.table.growth[this.data.branch[branch].ramus[ramus].growth.stage];
    }
  }

  draw( offset ){
    let j = 0;

    for( let branch in this.data.branch ){

      for( let ramus in this.data.branch[branch].ramus ){

        let vec = offset.copy();
        vec.y += j * FONT_SIZE * 1.5;
        let txt = this.data.branch[branch].ramus[ramus].growth.stage;
        text( txt, vec.x, vec.y + FONT_SIZE / 3 );
        j++;
      }
    }
  }
}
