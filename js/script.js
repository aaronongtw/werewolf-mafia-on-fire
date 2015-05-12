var numberOfPlayers;

var playerRole = []
var colorArray = ['red','blue','green','pink','brown','black','yellow','orange','purple','grey']
var roleArray = ['Mafia','Villager','Doctor', 'Inspector']
var roleCountCap = [0,0,0,0]
var extraRole = ['Vigilante', 'Barman']
var villageData = new Firebase("https://glowing-heat-4029.firebaseio.com");

var dice = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

var werewolfGame = {

    appendPlayer : function() {
        var assignedRole;
        if (playerRole.length < 4) {
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
        else if (playerRole.length < 6) {
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
        playerRole.push({id: playerRole.length, color:colorArray[playerRole.length],role: assignedRole, status:"alive", voteCount: 0 })
        villageData.set(playerRole);     
    },
    nightPhase : function(id) {
        if (playerRole[id].role === "Mafia") {
            nightPhase.mafiaVote();
        }
        if (playerRole[id].role === "Villager") {
            nightPhase.bubblePop();
        }
    },
    dayPhase : function() {
        event = "discussion time"
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
        playerRole[id].status = "dead"
        roleCountCap[roleArray.indexOf(playerRole[id].role)] -= 1
    }
 }
nightPhase = {
    mafiaVote : function(id) {
        var timedVote = setTimeOut(werewolfGame.dayPhase, 60000)
        if (playerRole[id].voteCount === roleCountCap[0]) {
            werewolfGame.dead();
            clearTimeOut(timedVote);
            werewolfGame.DayPhase();

        }

    },
    bubblePop : function() {

    }
}
dayPhase = {
    allVote : function() {
        if (playerRole[id].voteCount === Math.ceil(playerRole.length/2)){
            werewolfGame.dead();
        }
    }
}







