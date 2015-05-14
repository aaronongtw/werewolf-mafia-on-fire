var numberOfPlayers;
var playerName;
var playerRole;
var pRole = [];
var playerVote = -1;
var colorArray = ['red', 'blue', 'green', 'pink', 'brown', 'black', 'yellow', 'orange', 'purple', 'grey'];
var roleArray = ['mafia', 'villager', 'doctor', 'inspector'];
var roleCountCap = [0, 0, 0, 0];
var extraRole = ['Vigilante', 'Barman']
var villageData = new Firebase("https://glowing-heat-4029.firebaseio.com");
var villageDataArray = getSynchronizedArray(villageData);
var pID;
var cID;
var phase;


var dice = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var werewolfGame = {

    appendPlayer: function() {
        $('#test').remove()
      var assignedRole;
      pRole = list
      if (pRole.length < 4) {
        roleRandom = dice(0, 1)
        if (roleCountCap[0] === 1) {
          roleRandom = 1;
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        } else if (roleCountCap[1] === 2) {
          roleRandom = 0;
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        } else {
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        }

      } else if (pRole.length < 6) {
        roleRandom = dice(0, 1)
        if (roleCountCap[0] === 2) {
          roleRandom = 1;
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        } else if (roleCountCap[1] === 3) {
          roleRandom = 0;
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        } else {
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        }
      } else if (pRole.length < 11) {
        roleRandom = dice(0, 2)
        if (roleCountCap[0] === 3) {
          roleRandom = 1;
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        } else if (roleCountCap[1] === 6) {
          roleRandom = 0;
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        } else if (roleCount[2] === 1) {
          roleRandom = 1;
          assignedRole = roleArray[roleRandom]
          roleCountCap[roleRandom] += 1;

        } else {
          assignedRole = roleArray[roleRandom];
          roleCountCap[roleRandom] += 1;
        }
      }
      villageDataArray.$set(pRole.length, {
        id: pRole.length,
        name: playerName,
        color: colorArray[pRole.length],
        role: assignedRole,
        status: "alive",
        voteCount: 0
      });
    },
    nightPhase: function() {
        werewolfGame.winCondition();
      pRole = list;
      $('.body').addClass(' night');
      $('#phase').html("Phase: Night");
      if (pRole[pID].role === "mafia") {
        $('#supplemental').html("You're the mafia, vote on a player to kill!")
        nightPhase.mafiaVote();
      }
      if (pRole[pID].role === "villager") {
        $('#supplemental').html("You're a villager, beat or tie the computer to stay alive!");
        nightPhase.bubblePop();
      }
    },
    dayPhase: function() {
        $('.body').addClass(' day');
        $('#phase').html("Phase: Day");
        $('#supplemental').html("Everyone, please talk amongst yourselves, and then vote on whom to kill!")
      werewolfGame.winCondition();
      $(".tictac").html("")
      // var event = "discussion time";
      // console.log(event)
      dayPhase.allVote();
    },
    mafiaWin: function() {
      alert("MAFIA WINS")
      setTimeout(removeData(),5000)
      setTimeout(location.reload(),5000)
    },
    villagerWin: function() {
      alert("VILLAGERS WIN")
      removeData();
      location.reload()
    },
    winCondition: function() {
      updateList();
      if (roleCountCap[0] === roleCountCap[1]) {
        werewolfGame.mafiaWin();
      } else if (roleCountCap[0] === 0) {
        werewolfGame.villagerWin();
      }

    },
    voteCheck: function() {
      if (pRole[cID].voteCount === roleCountCap[0] && phase === "night") {
        //console.log("day phase someone died")
        werewolfGame.dead();
        werewolfGame.dayPhase();
      } else if (phase === "night") {
        werewolfGame.dayPhase();
        //console.log("day phase")
      }
      else if (pRole[cID].voteCount === Math.ceil(pRole.length / 2) && phase === "day") {
        werewolfGame.dead();
        werewolfGame.nightPhase();
        //console.log("night phase someone died")
      } else if (phase === "day") {
        werewolfGame.nightPhase();
        //console.log("night phase")
      }
    },
    checkDeath: function() {
      if (cID === undefined) {
        cID = dice(0, list.length - 1);
        werewolfGame.voteCheck();
      } else {
        werewolfGame.voteCheck();
      }

    },

    dead: function() {
      pRole = list;
      pRole[cID].status = "dead";
      roleCountCap[roleArray.indexOf(pRole[cID].role)] -= 1;
      villageDataArray.$set(cID, pRole[cID])

    }
  }
  // update : function() {

// }

var nightPhase = {

  mafiaVote: function() {
    phase = "night"
    resetVotes();
    playerVote = -1
    pRole = list
    countdown(10, werewolfGame.checkDeath)
    console.log("you are mafia")

  },
  bubblePop: function() {
    phase = "night";
    $(".tictac").show();
    tictac();
    countdown(10, werewolfGame.checkDeath);
  }
};
var dayPhase = {

  allVote: function() {
    phase = "day"
    resetVotes();
    playerVote = -1;
    pRole = list;
    countdown(12, werewolfGame.checkDeath);
  }
};

/*
     __________                              
    |__\_____  \  __ __   ___________ ___.__.
    |  |/  / \  \|  |  \_/ __ \_  __ <   |  |
    |  /   \_/.  \  |  /\  ___/|  | \/\___  |
/\__|  \_____\ \_/____/  \___  >__|   / ____|
\______|      \__>           \/       \/     

*/
var resetVotes = function() {
  pRole = list
  for (var i = 0; i < pRole.length; i += 1) {
    pRole[i].voteCount = 0
    villageDataArray.$set(i, pRole[i])
  }

}

var removeData = function() {
  villageData.set([]);
}


var popHMain = function() {
  list.forEach(function(element, index) {
    $('.container').append($("<div></div>").addClass('player-tile ' + element.id));
    $('.player-tile').last().prepend($("<div></div>").addClass('role-badge ' + element.role));
    $('.player-tile').last().append($('<div></div>').addClass('player-info'));
    $('.player-info').last().append($('<p></p>').html(element.name)).addClass(element.name);
    $('.player-tile').last().append($('<div></div>').addClass('votecount'));
    $('.votecount').last().append($('<p></p>').html(element.voteCount));
  });
  pID = $('.container').find('.' + playerName).parent().attr('class').split(' ')[1]
}


var reflowHMain = function(objec) {
  objec.forEach(function(element, index) {
    if (element.status === 'dead') {
      $('.' + element.id).addClass('eliminated');
    }
    $('.' + element.id).find('.votecount').children().html(element.voteCount);
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
var logging = function() {
  console.log("logging")
}

var countdown = function(seconds, funct) {
  var sec = seconds
  $(".timer").html("<p>" + seconds + " seconds remaining</p>")
  var minusOne = setInterval(function() {
    sec -= 1
    $(".timer").html("<p>" + sec + " seconds remaining</p>")
    if (sec === 0) {
      var nFunc = funct
      nFunc();
      clearInterval(minusOne);
    }
  }, 1000)
}



var updateList = function() {
  roleCountCap = [0, 0, 0, 0]
  list = getSynchronizedArray(villageData);
  reflowHMain(list);
  for (var i = 0; i < list.length; i += 1) {
    if (list[i].status === "alive"){
    roleCountCap[roleArray.indexOf(list[i].role)] += 1
  }
  }
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
  list.forEach(function(element, index) {
    delete element.$id;
  })
  return list;
}

var upVoteCount = function() {

  pRole = list
  if (playerVote < 0 && pRole[parseInt($(this).attr('class').split(' ')[1])].name !== playerName && pRole[parseInt($(this).attr('class').split(' ')[1])].status !== "dead") {
    cID = $(this).attr('class').split(' ')[1]
    pRole[parseInt($(this).attr('class').split(' ')[1])].voteCount += 1;
    playerVote += 1;
    villageDataArray.$set(parseInt($(this).attr('class').split(' ')[1]), pRole[parseInt($(this).attr('class').split(' ')[1])]);
    werewolfGame.checkDeath()
  }

}

var startGame = function() {

  werewolfGame.nightPhase();

}



updateList();
setInterval(updateList, 500)
playerName = prompt("What is your name?")
$('.container').on('click', '.player-tile', upVoteCount);

$('#test').on("click", werewolfGame.appendPlayer);
$('.player-tile').on("click", upVoteCount);
  // var updHMain = function (objec) {
  //     objec.forEach( function () {
  //         if 
  //     })
  // }
  // 
  // 
var newP = [];

var newPlayer = function() {
  var sec = 20
  $(".timer").html("<p>" + sec + " seconds remaining</p>")
  var minusOne = setInterval(function() {
    sec -= 1
    $(".timer").html("<p>" + sec + " seconds remaining</p>")
      if(newP.length !== list.length) {
        sec = 20
        console.log("YOU HAVE A NEW ChALLENGER")
        newP.push(list[list.length-1])
      }
      if (sec === 0) {
      clearInterval(minusOne);
      popHMain();
      startGame();
    }
  }, 1000)
}


setTimeout(newPlayer,1000);