var currentCheck = "artists";
var favoriteMode = false;

mainObject = {
    animals: ['Cat', 'Dog', 'Chicken'],
    food: ['Hot Dog', 'Pizza', 'Ice Cream'],
    artists: ['Lady Gaga', 'Romeo Santos', 'Snoop Dog'],
    favorites: []
}

var arrayInLocal = JSON.parse(localStorage.getItem("array"));

if (arrayInLocal != undefined) {
    mainObject.favorites = arrayInLocal;
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

function addFavorite() {
    var newFavorite = this.outerHTML;
    if (favoriteMode === true && newFavorite != null && newFavorite != undefined) {
        mainObject.favorites.push(newFavorite);
        // making sure array doesnt have duplicates
        var newArray = []
        $.each(mainObject.favorites, function (i, el) {
            if ($.inArray(el, newArray) === -1) newArray.push(el);
        });

        mainObject.favorites = newArray;

        console.log(newArray);
        localStorage.setItem("array", JSON.stringify(mainObject.favorites));
    }

}

function gifState() {
    if (favoriteMode === false) {
        var gifClicked = $(this);
        var gifState = gifClicked.attr('data-state');
        var stillSrc = gifClicked.attr('data-still');
        var animateSrc = gifClicked.attr('data-animate');
        if (gifState === 'still') {
            gifClicked.attr('data-state', 'animate');
            gifClicked.attr('src', animateSrc);
        } else if (gifState === 'animate') {
            gifClicked.attr('data-state', 'still');
            gifClicked.attr('src', stillSrc);
        }
    }
}

function formCheck() {
    if ($(this).prop("checked") == true) {
        currentCheck = $(this).val();
        $('#artists').empty();
    }

    var hey = "Add " + currentCheck;

    if (currentCheck != 'favorites' && currentCheck != 'favoriteart') {
        $('#clearfav').hide();
        $('#movie-form').show();
        $('#images').empty();
        $('#artists').empty();
        $('#buttonshere').empty();
        $('#addlabel').text(hey);
        $('#add-something').attr('value', 'Click to add');

        createButtons(mainObject[currentCheck]);
    } else if (currentCheck === 'favorites') {

        if (mainObject.favorites.length === 0) {
            alert("You don't have any favorites")
        }
        $('#clearfav').show();
        $('#movie-form').hide();
        $('#buttonshere').empty();
        $('#artists').empty();
        $('#images').empty();
        $('#images').show();

        for (i = 0; i < mainObject.favorites.length; i++) {

            if (mainObject.favorites[i].substring(12, 13) === 'i') {
                $('#images').prepend(mainObject.favorites[i]);
            }

        }

    }
    else if (currentCheck === 'favoriteart') {
        if (mainObject.favorites.length === 0) {
            alert("You don't have any favorites")
        }
        $('#artist').empty();
        for (i = 0; i < mainObject.favorites.length; i++) {
            if (mainObject.favorites[i].substring(12, 13) === 'a') {

                $('#artists').prepend(mainObject.favorites[i]);
            }
        }

        $('#clearfav').show();
        $('#movie-form').hide();
        $('#buttonshere').empty();
        $('#images').hide();

    }
}

function ajaxCall() {

    if (mainObject.animals.includes($(this).val()) === true || mainObject.food.includes($(this).val()) === true) {

        $('#artists').empty();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).val() + "&api_key=dc6zaTOxFJmzC&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

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

    } else if (mainObject.artists.includes($(this).val()) === true) {
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


$('.form-check-input').on("click", formCheck)

$("#add-something").on("click", function (event) {

    event.preventDefault();
    if ($("#movie-input").val() != "") {
        var item = $("#movie-input").val().trim();
        $("#movie-input").val('');
        mainObject[currentCheck].push(item);
        createButtons(mainObject[currentCheck]);
    }
    else {
        alert('Please write something!');
    }

});

$("#favorite").on('click', function () {
    if (!favoriteMode) {
        favoriteMode = true;
        alert('Favorite mode on, click the gifs you want to save!');
    } else {
        favoriteMode = false;
        alert('Favorite mode off, continue enjoying all the funny gifs!')
    }
})

$("#clear").on("click", function (event) {
    event.preventDefault();
    $("#images").empty();
    $("#artists").empty();

})

$('#clearfav').on("click", function () {
    var userCheck = confirm('Are you sure?')
    if (userCheck) {
        localStorage.clear();
        mainObject.favorites = [];
        $("#images").empty();
        $("#artists").empty();
        alert("Favorites have been erased")
    }
    else {
        alert("Favorites have not been erased")
    }
})

$(document).on("click", ".item", ajaxCall);
$(document).on("click", "img", gifState);
$(document).on("click", ".imageitem", addFavorite);
$(document).on("click", ".artists", addFavorite);

formCheck();
