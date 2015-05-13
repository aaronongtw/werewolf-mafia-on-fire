var numberOfPlayers;
var playerName;
var playerRole;
var pRole = [];
var playerVote = -1;
var colorArray = ['red','blue','green','pink','brown','black','yellow','orange','purple','grey']
var roleArray = ['mafia','villager','doctor', 'inspector']
var roleCountCap = [0,0,0,0]
var extraRole = ['Vigilante', 'Barman']
var villageData = new Firebase("https://glowing-heat-4029.firebaseio.com");
var villageDataArray = getSynchronizedArray(villageData);

var dice = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

var werewolfGame = {

    appendPlayer : function() {
        var assignedRole;
        list.forEach(function(value) {
            delete value['$id']
        })
        pRole = list
        if (pRole.length < 4) {
            roleRandom = dice(0,1)
            if (roleCountCap[0] === 1){
                roleRandom = 1;
                assignedRole = roleArray[roleRandom];
                roleCountCap[roleRandom] += 1;
            }
            else if (roleCountCap[1] === 2){
                roleRandom = 0;
                assignedRole = roleArray[roleRandom];
                roleCountCap[roleRandom] += 1;
            }
            else {
                assignedRole = roleArray[roleRandom];
                roleCountCap[roleRandom] += 1;
            }

        }
        else if (pRole.length < 6) {
            roleRandom = dice(0,1)
            if (roleCountCap[0] === 2){
                roleRandom = 1;
                assignedRole = roleArray[roleRandom];
                roleCountCap[roleRandom] += 1;
            }
            else if (roleCountCap[1] === 3){
                roleRandom = 0;
                assignedRole = roleArray[roleRandom];
                roleCountCap[roleRandom] += 1;
            }
            else {
                assignedRole = roleArray[roleRandom];
                roleCountCap[roleRandom] += 1;
            }

        }


        villageDataArray.$set(pRole.length, {id: pRole.length, name: playerName, color:colorArray[pRole.length],role: assignedRole, status:"alive", voteCount: 0});

    },
    nightPhase : function(id) {
        if (pRole[id].role === "Mafia") {
            nightPhase.mafiaVote();
        }
        if (pRole[id].role === "Villager") {
            nightPhase.bubblePop();
        }
    },
    dayPhase : function() {
        event = "discussion time"
        console.log(event)
        dayPhase.allVote();
    },
    winCondition : function() {
        if (roleCountCap[0] === roleCountCap[1]) {
            werewolfGame.mafiaWin();
        }   
        else if (roleCountCap[0] === 0) {
            werewolfGame.villagerWin();
        }

    },
    dead : function() {
        pRole[id].status = "dead"
        roleCountCap[roleArray.indexOf(pRole[id].role)] -= 1
    },
    removeData : function() {
        villageData.set([]); 
    }
    // update : function() {

    // }
}
nightPhase = {
    mafiaVote : function(id) {
        countdown(60, werewolfGame.dayPhase)
        if (pRole[id].voteCount === roleCountCap[0]) {
            werewolfGame.dead();
            werewolfGame.dayPhase
        }

    },
    bubblePop : function() {

    }
}
dayPhase = {
    allVote : function() {
        if (pRole[id].voteCount === Math.ceil(pRole.length/2)){
            werewolfGame.dead();
        }
    }
}

/*
     __________                              
    |__\_____  \  __ __   ___________ ___.__.
    |  |/  / \  \|  |  \_/ __ \_  __ <   |  |
    |  /   \_/.  \  |  /\  ___/|  | \/\___  |
/\__|  \_____\ \_/____/  \___  >__|   / ____|
\______|      \__>           \/       \/     

*/




var popHMain = function (objec) {
    objec.forEach( function (element, index) {
        $('.container').append($("<div></div>").addClass('player-tile ' + element.id));
        $('.player-tile').last().prepend($("<div></div>").addClass('role-badge ' + element.role));
        $('.player-tile').last().append($('<div></div>').addClass('player-info'));
        $('.player-info').last().append($('<p></p>').html(element.name));
        $('.player-tile').last().append($('<div></div>').addClass('votecount'));
        $('.votecount').last().append($('<p></p>').html(element.voteCount));
    });
}

var reflowHMain = function (objec) {
    objec.forEach( function (element, index) {
        if (element.status === 'dead')  { 
            $('.' + element.id).addClass('eliminated');
        }
        $('.' + element.id).find('.votecount').children().html( element.voteCount );

    })
}

// var userSelect = function () {
//     //this gets the class atribute of the clicked square
//     var fullclass = $(this).attr('class');

//     if (parseInt(fullclass[13]) === playerVote) {
//       console.log("you can't click there")
//     } else {
//       $(this).children().find('votecount').children().html('1 ----- input incrim');
//       //console.log(fullclass);
//       inputMat[parseInt(fullclass[13])] = 1;
//       //console.log(fullclass[4]);
//       computerSelect();
//     }
// }

var countdown = function(seconds, func ) {
    var sec = seconds
    $(".timer").html("<p>"+seconds+" seconds remaining</p>")
    var minusOne = setInterval(function(){
        sec -= 1
        $(".timer").html("<p>"+sec+" seconds remaining</p>")
            if (sec === 0) {
                clearInterval(minusOne)
                popHMain(list);
            }
    },1000)
}

var updateList = function() {
    list = getSynchronizedArray(villageData);
    reflowHMain(list);
}

function getSynchronizedArray(villageData) {
  var list = [];
  syncChanges(list, villageData);
  wrapLocalCrudOps(list, villageData);
  return list;
}

function syncChanges(list, ref) {
  ref.on('child_added', function _add(snap, prevChild) {
    var data = snap.val();
    data.$id = snap.key(); // assumes data is always an object
    var pos = positionAfter(list, prevChild);
    list.splice(pos, 0, data);
  });
  ref.on('child_removed', function _remove(snap) {
    var i = positionFor(list, snap.key());
    if (i > -1) {
      list.splice(i, 1);
    }
  });
  ref.on('child_changed', function _change(snap) {
    var i = positionFor(list, snap.key());
    if (i > -1) {
      list[i] = snap.val();
      list[i].$id = snap.key(); // assumes data is always an object
    }
  });
  ref.on('child_moved', function _move(snap, prevChild) {
    var curPos = positionFor(list, snap.key());
    if (curPos > -1) {
      var data = list.splice(curPos, 1)[0];
      var newPos = positionAfter(list, prevChild);
      list.splice(newPos, 0, data);
    }
  });
}

function positionFor(list, key) {
  for (var i = 0, len = list.length; i < len; i++) {
    if (list[i].$id === key) {
      return i;
    }
  }
  return -1;
}

function positionAfter(list, prevChild) {
  if (prevChild === null) {
    return 0;
  } else {
    var i = positionFor(list, prevChild);
    if (i === -1) {
      return list.length;
    } else {
      return i + 1;
    }
  }
}

function wrapLocalCrudOps(list, villageData) {
    // we can hack directly on the array to provide some convenience methods
    list.$add = function(data) {
      return villageData.push(data);
    };
    list.$remove = function(key) {
      villageData.child(key).remove();
    };
    list.$set = function(key, newData) {
      // make sure we don't accidentally push our $id prop
      if (newData.hasOwnProperty('$id')) {
        delete newData.$id;
      }
      villageData.child(key).set(newData);
    };
    list.$indexOf = function(key) {
      return positionFor(list, key); // positionFor in examples above
    }
}

var getPushable = function() {
    list.forEach( function (element, index) {
        delete element.$id;
    })
    return list;
}

var upVoteCount = function() {

    pRole = list
    if (playerVote < 0 && pRole[parseInt($(this).attr('class').split(' ')[1])].name !== playerName ) {
    pRole[parseInt($(this).attr('class').split(' ')[1])].voteCount += 1;
    playerVote += 1;
    console.log(pRole)
    villageDataArray.$set(parseInt($(this).attr('class').split(' ')[1]) ,pRole[parseInt($(this).attr('class').split(' ')[1])]);
    }

}

setInterval(updateList,500)
playerName = prompt("What is your name?")
$('.container').on('click', '.player-tile', upVoteCount);

updateList();
countdown(10, popHMain(list));


$('#test').on("click", werewolfGame.appendPlayer)
$('.player-tile').on("click", upVoteCount)
// var updHMain = function (objec) {
//     objec.forEach( function () {
//         if 
//     })
// }