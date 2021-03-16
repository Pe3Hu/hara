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
          drone.var.impact.end = createVector();
          let end = createVector(
              Math.sin( Math.PI / 2 - drone.var.angle.rotate ) * drone.const.b ,
              Math.cos( Math.PI / 2 - drone.var.angle.rotate ) * drone.const.b );

          if( this.data.detail == 1 )
            drone.var.impact.end.sub( end );

          if( this.data.detail == -2  )
            drone.var.impact.end.add( end );

          drone.var.impact.slip = end.copy();
          drone.var.impact.slip.mult( -1 );
          drone.var.impact.slip.div( drone.var.impact.tempo );

          drone.var.impact.direction = Math.sign( this.data.detail );
          //console.log( drone.var.impact.direction, drone.var.impact.vector, drone.var.impact.end )
          drone.data.tandem.data.honey.flag.tandem = true;
        }
        break;
      case 'exchange_begin':
        if( drone.flag.wait ){
          drone.flag.exchange = true;
        }
        break;
      case 'exchange_end':
        if( drone.flag.wait ){
          let temp = drone.data.comb.data.honey.copy();
          drone.data.comb.data.honey = drone.data.tandem.data.honey.copy();
          drone.data.tandem.data.honey = temp;
          drone.flag.exchange = false;
          drone.flag.wait = true;
        }
        break;
      case 'reset':
        if( drone.flag.wait )
          drone.flag.reset = true;;
        break;
      case 'slide':
        if( drone.flag.wait )
          drone.flag.slide = true;
        break;
    }
  }
}
