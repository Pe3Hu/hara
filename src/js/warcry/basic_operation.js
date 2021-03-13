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
    console.log( 'task', this.const.index, this.data.task, this.data.drone.data.comb.const.index )
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
    }
  }
}
