//
class nulla {
  constructor ( index, direction, headwaters, water_content, reaches ){
    this.const = {
      index: index
    };
    this.var = {
    };
    this.array = {
      reaches: reaches
    };
    this.data = {
      direction: direction,
      headwaters: headwaters,
      water_content: water_content
    };
    this.table = {
      probabilities: []
    };

    this.init();
  }

  init_probabilities(){
    this.table.init_probabilities = [ [
      [ 0, 2, 1, 8, 6, 5, 1, 2 ],
      [ 0, 4, 1, 1, 1, 11, 3, 4 ],
      [ 0, 4, 11, 3, 1, 1, 1, 4 ],
      [ 0, 10, 1, 1, 1, 1, 1, 10 ],
      [ 0, 1, 1, 8, 5, 8, 1, 1 ],
      [ 0, 1, 1, 1, 1, 1, 1, 1 ],
    ],
    [
      [ 0, 1, 3, 5, 7, 5, 3, 1 ],
      [ 0, 1, 1, 1, 9, 4, 7, 2 ],
      [ 0, 2, 7, 4, 9, 1, 1, 1 ],
      [ 0, 2, 9, 1, 1, 1, 9, 2 ],
      [ 0, 1, 1, 1, 1, 1, 15, 5 ],
      [ 0, 5, 15, 1, 1, 1, 1, 1 ]
    ] ];
  }

  set_headwaters(){
    this.array.reaches[this.data.headwaters.x][this.data.headwaters.y].add_input( this.data.direction );
    //console.log(this.array.reaches[this.data.headwaters.x][this.data.headwaters.y])
  }

  init(){
    this.init_probabilities();
    this.set_headwaters();
  }

  generate_new_way( type, rule ){
    let max = 25;
    let rand = Math.floor( Math.random() * max );
    let probabilities = this.table.init_probabilities[type][rule];
    let new_way = null;
  }

  draw( offset ){
  }
}
