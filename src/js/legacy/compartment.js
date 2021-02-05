//
class compartment  {
  constructor ( index, platform, type, subtype,  rotation, anchor, x, y ){
    this.const = {
      index: index,
      anchor: anchor
    };
    this.array = {
      shift: []
    };
    this.var = {
    };
    this.data = {
      platform: platform,
      type: {
        id: type,
        subtype: subtype,
        rotation: rotation,
        name: null
      },
      side: {
        x: x,
        y: y
      }
    };

    this.init();
  }

  init_shifts(){
    this.array.shift = [
      createVector( -1, 0 ),
      createVector( -1, 0 ),
      createVector( -1, 0 ),
      createVector( -1, 0 )
    ];
  }

  init(){
    this.init_shifts();
    this.complete_type();
    this.activate();
  }

  complete_type(){
    switch ( this.data.type.id ) {
      case 0:
        this.data.type.name = 'delta';
        break;
    }
  }

  activate(){
    let platform = this.data.platform;
    let begin = this.const.anchor.copy();
    let add_i = createVector();
    let add_j = createVector();
    let end = {};

    switch ( this.data.type.id ) {
      case 0:
        switch ( this.data.type.rotation ) {
          case 0:
            switch ( this.data.type.subtype ){
              case 0:
                add_i.x = -1;
                add_i.z = -1;
                add_j.x = 1;
                end.value = 1;
                end.add = 1;
                break;
              case 1:
                add_i.x = -1;
                add_j.x = 1;
                add_j.z = 1;
                end.value = 1;
                end.add = 1;
                break;
              case 2:
                add_i.z = 1;
                add_j.x = -1;
                end.value = 3;
                end.add = -1;
                break;
              case 3:
                add_i.x = 1;
                add_j.x = 1;
                add_j.z = 1;
                end.value = 3;
                end.add = -1;
                break;
            }
            break;
          case 1:
            switch ( this.data.type.subtype ){
              case 0:
                add_i.x = -1;
                add_i.z = -1;
                add_j.x = -1;
                end.value = 1;
                end.add = 1;
                break;
              case 1:
                add_i.x = -2;
                add_i.z = -1;
                add_j.x = -1;
                add_j.z = -1;
                end.value = 3;
                end.add = -1;
                break;
              case 2:
                add_i.x = 1;
                add_i.z = 1;
                add_j.x = -1;
                end.value = 3;
                end.add = -1;
                break;
              case 3:
                add_i.x = 1;
                add_j.x = 1;
                add_j.z = 1;
                end.value = 1;
                end.add = 1;
                break;
            }
            break;
          case 2:
            switch ( this.data.type.subtype ){
              case 0:
                add_i.z = -1;
                add_j.x = 1;
                end.value = 3;
                end.add = -1;
                break;
              case 1:
                add_i.x = -1;
                add_j.x = -1;
                add_j.z = -1;
                end.value = 3;
                end.add = -1;
                break;
              case 2:
                add_i.x = 1;
                add_i.z = 1;
                add_j.x = -1;
                end.value = 1;
                end.add = 1;
                break;
              case 3:
                add_i.x = 1;
                add_j.x = -1;
                add_j.z = -1;
                end.value = 1;
                end.add = 1;
                break;
            }
            break;
          case 3:
            switch ( this.data.type.subtype ){
              case 0:
                add_i.x = -1;
                add_i.z = -1;
                add_j.x = 1;
                end.value = 3;
                end.add = -1;
                break;
              case 1:
                add_i.x = -1;
                add_j.x = -1;
                add_j.z = -1;
                end.value = 1;
                end.add = 1;
                break;
              case 2:
                add_i.x = 1;
                add_i.z = 1;
                add_j.x = 1;
                end.value = 1;
                end.add = 1;
                break;
              case 3:
                add_i.x = 2;
                add_i.z = 1;
                add_j.x = 1;
                add_j.z = 1;
                end.value = 3;
                end.add = -1;
                break;
            }
            break;
        }
        break;
    }
    let marker = this.const.anchor.y + this.data.type.rotation - 2;


    for( let i = 0; i < this.data.side.x; i++ ){
      let current = begin.copy();

      for( let j = 0; j < end.value; j++ ){
        let flag;

        if( marker == 4 || marker == 0 )
          flag = ( j == 0 );
        else
          flag = ( j == end.value - 1 );

        if( !flag )
          platform.array.partition[current.x][current.y][current.z].set_all( 2 );
        else
          platform.array.partition[current.x][current.y][current.z].set_doublet( marker, 2 );
        current.add( add_j );
      }

      begin.add( add_i );
      end.value += end.add;
    }

  }
}
