var currentCheck;

mainObject = {
  animals: ['Cat', 'Dog', 'Chicken'],
  food: ['Hot Dog', 'Pizza', 'Ice Cream'],
  artists: ['Lady Gaga', 'Romeo Santos', 'Snoop Dog']
}

function createButtons(arr) {
  $('#buttonshere').empty();
  for (i = 0; i < arr.length; i++) {
    newDiv = $('<div>');
    newButton = $('<button class="item">');
    newButton.attr('value', arr[i]);
    newButton.text(arr[i]);
    $('#buttonshere').append(newButton);
  }
}

$('.form-check-input').click(function () {

  if ($(this).prop("checked") == true) {
    currentCheck = $(this).val();
  }

  var hey = "Add " + currentCheck;
  $('#add-something').attr('value', hey);
  createButtons(mainObject[currentCheck]);

})


$("#add-something").on("click", function (event) {

  $('#errors').empty();
  event.preventDefault();
  var item = $("#movie-input").val().trim();
  mainObject[currentCheck].push(item);
  console.log(mainObject[currentCheck]);
  createButtons(mainObject[currentCheck]);

});

function ajaxCall() {
  //    

  if (mainObject.animals.includes($(this).val()) === true || mainObject.food.includes($(this).val()) === true) {

    $('#artists').empty();
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).val() + "&api_key=dc6zaTOxFJmzC&limit=10";

    // var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=LOnIqnyN2kSCU8ELpisj8AzLaXOmxiEj&tag=" + $(this).val();

    // for (i = 0; i < 10; i++) {
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      for (i = 0; i < 10; i++) {
        var gifUrl = response.data[i].images.downsized_still.url;
        var itemImage = $("<img>");
        itemImage.attr("src", gifUrl);
        itemImage.attr("alt", "image");
        itemImage.attr('data-state', 'still');
        itemImage.attr('data-still', response.data[i].images.downsized_still.url);
        itemImage.attr('data-animate', response.data[i].images.downsized.url);
        var newP = $('<p>');
        newP.text('Rating: ' + response.data[i].rating);
        newDiv = $('<div class="imageitem">').append(newP);
        newDiv.append(itemImage);
        $("#images").prepend(newDiv);
      }
    })

  }

  else {
    var queryURL = "https://rest.bandsintown.com/artists/" + $(this).val() + "?app_id=codingbootcamp";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      $('#images').empty();
      var newDiv = $('<div class="artists">');
      var artistName = $("<h1>").text(response.name);
      var artistURL = $("<a>").attr("href", response.url).append(artistName);
      var artistImage = $("<img>").attr("src", response.thumb_url);
      artistImage.attr("alt", "image");
      var trackerCount = $("<h2>").text(response.tracker_count + " Fans tracking this artist");
      var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " Upcoming events");
      var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");
      newDiv.append(artistURL, artistImage, trackerCount, upcomingEvents, goToArtist);
      $("#artists").prepend(newDiv)

    });

  }


}

function gifState() {

  var gifClicked = $(this);
  var gifState = gifClicked.attr('data-state');
  var stillSrc = gifClicked.attr('data-still');
  var animateSrc = gifClicked.attr('data-animate');

  if (gifState === 'still') {
    gifClicked.attr('data-state', 'animate');
    gifClicked.attr('src', animateSrc);
  }


  else if (gifState === 'animate') {
    gifClicked.attr('data-state', 'still');
    gifClicked.attr('src', stillSrc);
  }
  
}


$(document).on("click", ".item", ajaxCall);
$(document).on("click", "img", gifState);

$("#clear").on("click", function () {
  $("#images").empty();
  $("#artists").empty();
})





  



