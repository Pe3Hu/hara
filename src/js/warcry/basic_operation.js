//
class basic_operation {
  constructor ( index, task, detail, drone ){
    this.const = {
      index: index
    };
    this.data = {
      task: task,
      detail: detail,
      drone: drone
    };
  }

  execute(){
    console.log( 'task', this.const.index, this.data.task, this.data.drone.data.comb.const.index, this.data.drone.data.comb.data.honey.const.index, this.data.drone.data.cargo.stage )
    let drone = this.data.drone;
    let hive = drone.data.hive;

    switch ( this.data.task ) {
      case 'rotate':
        if( drone.flag.wait ){
          drone.flag.rotate = true;
          drone.flag.wait = false;
          //detail = turns of rotation
          let turns = this.data.detail;
          drone.var.rotate.clockwise = Math.sign( turns );

          drone.var.rotate.crank = drone.var.rotate.clockwise * Math.PI / 2 / drone.var.rotate.tempo;
          drone.var.rotate.end = ( drone.var.sight + turns + drone.const.sides ) % drone.const.sides * Math.PI / 2;
        }
        break;
      case 'swap':
        if( drone.flag.wait && drone.var.arc.tandem != null ){
          drone.var.swap.end = drone.var.angle.swap + Math.PI;
          drone.flag.slide = this.data.detail;
          drone.flag.swap = true;
          drone.flag.wait = false;
          drone.var.swap.crank = drone.var.swap.clockwise * Math.PI / 2 / drone.var.swap.tempo;
          drone.var.swap.r = Math.abs( drone.var.arc.center.x - drone.var.arc.tandem.x ) / 2 + Math.abs( drone.var.arc.center.y - drone.var.arc.tandem.y ) / 2;
        }
        break;
      case 'impact':
        if( drone.flag.wait && drone.var.arc.tandem != null ){
          drone.flag.impact = true;
          drone.flag.wait = false;
          drone.var.impact.slip = createVector();

          if( this.data.detail == 1 )
            drone.var.impact.slip.sub( drone.var.arc.center );
          else{
            let slip = drone.var.arc.center.copy() ;
            drone.var.impact.slip = drone.data.comb.const.center.copy();
            drone.var.impact.slip.sub( drone.data.tandem.const.center );
            drone.var.impact.slip.add( slip );
          }

          drone.var.impact.end = drone.var.impact.slip.copy();
          drone.var.impact.end.mult( this.data.detail )

          drone.var.impact.slip.div( drone.var.impact.tempo );

          drone.var.impact.begin = createVector();
          drone.var.impact.vector = drone.var.impact.begin.copy();
          drone.var.impact.direction = this.data.detail;

          drone.data.tandem.data.honey.flag.tandem = true;
        }
        break;
      case 'exchange':
        if( drone.flag.wait ){
          let temp = drone.data.comb.data.honey.copy();
          drone.data.comb.data.honey = drone.data.tandem.data.honey.copy();
          drone.data.tandem.data.honey = temp;
          drone.flag.slide = this.data.detail;
          drone.flag.last_animation = this.data.detail;
        }
        break;
      case 'reset':
        if( drone.flag.wait )
          drone.flag.reset = true;;
        break;
    }
  }

  /*execute(){
    console.log( 'task', this.const.index, this.data.task, this.data.drone.data.comb.const.index,  this.data.drone.var.sight )
    let drone = this.data.drone;
    let hive = drone.data.hive;

    switch ( this.data.task ) {
      case 'rotate':
        if( drone.flag.wait ){
          drone.flag.rotate = true;
          drone.flag.wait = false;
          //detail = turns of rotation
          let turns = this.data.detail;
          drone.var.rotate.clockwise = Math.sign( turns );

          drone.var.rotate.crank = drone.var.rotate.clockwise * Math.PI / 2 / drone.var.rotate.tempo;
          drone.var.rotate.end = ( drone.var.sight + turns + drone.const.sides ) % drone.const.sides * Math.PI / 2;
        }
        break;
      case 'swap':
        if( drone.flag.wait && drone.var.arc.tandem != null &&
            !( this.data.drone.var.sight % 2 == 0 && this.data.detail )){
          drone.var.swap.end = drone.var.angle.swap + Math.PI;
          drone.flag.slide = this.data.detail;
          drone.flag.swap = true;
          drone.flag.wait = false;
          drone.var.swap.crank = drone.var.swap.clockwise * Math.PI / 2 / drone.var.swap.tempo;
          drone.var.swap.r = Math.abs( drone.var.arc.center.x - drone.var.arc.tandem.x ) / 2 + Math.abs( drone.var.arc.center.y - drone.var.arc.tandem.y ) / 2;
        }
        break;
      case 'impact':
        if( drone.flag.wait && drone.var.arc.tandem != null ){
          drone.flag.impact = true;
          drone.flag.wait = false;
          drone.var.impact.slip = createVector();

          if( this.data.detail == 1 )
            drone.var.impact.slip.sub( drone.var.arc.center );
          else{
            let slip = drone.var.arc.center.copy() ;
            drone.var.impact.slip = drone.data.comb.const.center.copy();
            drone.var.impact.slip.sub( drone.data.tandem.const.center );
            drone.var.impact.slip.add( slip );
          }

          drone.var.impact.end = drone.var.impact.slip.copy();
          drone.var.impact.end.mult( this.data.detail )

          drone.var.impact.slip.div( drone.var.impact.tempo );

          drone.var.impact.begin = createVector();
          drone.var.impact.vector = drone.var.impact.begin.copy();
          drone.var.impact.direction = this.data.detail;

          drone.data.tandem.data.honey.flag.tandem = true;
        }
        break;
      case 'exchange':
        if( drone.flag.wait ){
          let temp = drone.data.comb.data.honey.copy();
          drone.data.comb.data.honey = drone.data.tandem.data.honey.copy();
          drone.data.tandem.data.honey = temp;
          drone.flag.slide = this.data.detail;
          drone.flag.last_animation = this.data.detail;
        }
        break;
      case 'trace':
        if( drone.flag.wait ){
          let turn = drone.array.turn.splice( 0, 1 );
          let direction = turn[0].direction;

          if( turn[0].stage == 0 )
            direction = ( drone.const.sides / 2 + turn[0].direction ) % drone.const.sides;

          //console.log( 'before', turn[0].stage, direction )
          drone.turn_to( direction );
          let comb_swap = drone.var.sight % 2 == 1 && turn[0].stage == 1;
          drone.exchange( comb_swap );
          //console.log( 'after', turn[0].stage, direction )
          }
        break;
      case 'reset':
        if( drone.flag.wait )
          drone.flag.reset = true;;
        break;
    }
  }*/
}

//this.add_task( 'impact', -1 );
//this.add_task( 'swap' );
//this.add_task( 'rotate', 2 );
//this.slide();
//this.exchange();
//this.add_task( 'rotate', 1 )
/*this.slide();
this.add_task( 'rotate', 1 )
this.exchange();
this.add_task( 'rotate', 1 )
this.exchange();*/
//this.add_task( 'swap', true );
