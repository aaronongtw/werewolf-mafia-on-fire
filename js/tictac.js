var run tictac = function () {

  $('.tictac').show();

  var inputMat = [0,0,0,0,0,0,0,0,0];
  var $box = $('<div class="box"></div>');
  $box.css({width: '196px',
    height: '196px',
    display: 'inline-block',
    'background-color': 'rgba(0,0,0,0.8)',
    margin: '2px',
    fontSize: '150px',
    textAlign: 'center',
    float: 'left',
    'z-index': 5
  });

  var setupBoard = function () {
    for (var i = 0 ; i < inputMat.length ; i++ ) {
      $('.tictac').append($box.clone());
      $('.box').last().addClass(' ' + i);
    }
    $('.tictac .box:even').css('background-color', 'rgba(0,0,0,0.6)');
  }

  var userSelect = function () {
    //this gets the class atribute of the clicked square
    var fullclass = $(this).attr('class');

    //if the clicked square already contains an x or an o, then it doesn't allow the user to click the square
    if (inputMat[parseInt(fullclass[4])] === 1) {
      console.log("you can't click there")
    } else {
      $(this).html('X');
      //console.log(fullclass);
      inputMat[parseInt(fullclass[4])] = 1;
      //console.log(fullclass[4]);
      if checkWin(1) {
        console.log('user wins')
      } else {
        computerSelect();
      }
    }
  }

  var compuRand = function () {
    //finds a 
    var randEight = Math.round(Math.random() * 8);
    if ((inputMat[randEight] === 1) || (inputMat[randEight] === -1)) {
      return compuRand();
    } else {
      return randEight;
    }
  }

  var summa = function (arra) {
    var sum = 0;
    arra.forEach( function(val) {
      sum += Math.abs(val);
    })
    return sum;
  }

  var computerSelect = function () {
    if (summa(inputMat) === 9) {
      console.log('tie')
    } else {
      var rand = compuRand();
      var boxString = '.' + rand;
      $('.tictac').find(boxString).html('O');
      inputMat[rand] = -1;
      if checkWin(-1) {
        console.log('computer wins');
      }
    } 
  }

  //you don't need to check this conditional, these aren't the conditionals you're looking for
  var checkWin = function (x) {
    if ( (inputMat[0] === inputMat[1] && inputMat[2] && x) || (inputMat[3] === inputMat[4] && inputMat[5] && x) || (inputMat[6] === inputMat[7] && inputMat[8] && x) || (inputMat[0] === inputMat[3] && inputMat[6] && x) || (inputMat[1] === inputMat[4] && inputMat[7] && x) || (inputMat[2] === inputMat[5] && inputMat[8] && x) || (inputMat[0] === inputMat[4] && inputMat[8] && x) || (inputMat[2] === inputMat[4] && inputMat[6] && x) ) {
      return true;
    }
  }



  setupBoard();

  $('.tictac').on('click', '.box', userSelect);

}