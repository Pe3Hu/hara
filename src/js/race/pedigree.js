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
    let i = 0;
    let b = 0;
    let l = FONT_SIZE + CELL_SIZE * 0.25;

    for( let branch in this.data.branch ){
      let j = 0;

      fill( 0 );
      noStroke();

      for( let ramus in this.data.branch[branch].ramus ){
        let vec_r = offset.copy();
        vec_r.y += ( i + j ) * l + b * CELL_SIZE;
        let txt = this.data.branch[branch].ramus[ramus].growth.stage;
        text( txt, vec_r.x, vec_r.y + FONT_SIZE / 3 );
        j++;
      }

      noFill();
      stroke( 0 );
      rect( offset.x  - CELL_SIZE * 0.5, offset.y + i * l + ( b - 0.5 ) * CELL_SIZE,
        CELL_SIZE * 2, j * l + CELL_SIZE * 0.25  )

      fill( 0 );
      noStroke();

      let vec_b = offset.copy();
      vec_b.y += ( i + j  / 2 - 0.5 ) * l + b * CELL_SIZE;
      vec_b.x += CELL_SIZE;
      let txt = this.data.branch[branch].growth.stage;
      text( txt, vec_b.x, vec_b.y + FONT_SIZE / 3 );

      i += j;
      b += 0.25;
    }
  }
}
