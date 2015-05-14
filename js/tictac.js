var tictac = function () {
  // debugger;
  // $('.tictac' ).show();

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
    if (Math.abs(inputMat[parseInt(fullclass[4])]) === 1) {
      console.log("you can't click there")
    } else {
      $(this).html('X');
      //console.log(fullclass);
      inputMat[parseInt(fullclass[4])] = 1;
      //console.log(fullclass[4]);
      if (checkWin(1)) {
        winScreen(1);
      } else if (summa === 9) {
        winScreen(0);
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
      if (checkWin(-1)) {
        winScreen(-1);
      } else if (summa === 9) {
        winScreen(0);
      }
    } 
  }

  //you don't need to check this conditional, these aren't the conditionals you're looking for
  var checkWin = function (x) {
    if ( ((inputMat[0] === x) && (inputMat[1] === x) && (inputMat[2] === x)) || ((inputMat[3] === x) && (inputMat[4] === x) && (inputMat[5] === x)) || ((inputMat[6] === x) && (inputMat[7] === x) && (inputMat[8] === x)) || ((inputMat[0] === x) && (inputMat[3] === x) && (inputMat[6] === x)) || ((inputMat[1] === x) && (inputMat[4] === x) && (inputMat[7] === x)) || ((inputMat[2] === x) && (inputMat[5] === x) && (inputMat[8] === x)) || ((inputMat[0] === x) && (inputMat[4] === x) && (inputMat[8] === x)) || ((inputMat[2] === x) && (inputMat[4] === x) && (inputMat[6] === x)) ) {
      return true;
    } else {
      return false;
    }
  }

  var winScreen = function(xx) {
    var $overlay = $('<div class="overlay"></div>');
    $overlay.css({width: '100%',
      height: '100%',
      'background-color': 'rgba(0,0,0,.4)',
      position: 'absolute',
      'z-index': 6,
      textAlign: 'center'
    });

    $('.tictac').append($overlay);

    if (xx === 1) {
      $('.overlay').html("You Win (or, more likely, barely avoided losing)! You get to live")
      return true;
    } else {
      $('.overlay').html("You lost to a random computer, you die... And are dumb.")
      return false;
    }
  }


  setupBoard();

  $('.tictac').on('click', '.box', userSelect);



}