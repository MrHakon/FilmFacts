var resultList = document.querySelector(".lBorrowed");

window.onload = function() {
	var parameters = [];
	var movie = movies_object;

	// fyller en array med valge filmer
	parameters.push(movie[2754], movie[3818], movie[3823], movie[1027], movie[504], movie[2064], movie[2367], movie[2631], movie[1316]);

	// sender videre parameterne til en funksjon som lager lenker og bilder
	createLink(parameters);
}

// tar imot en liste av filmer og returnerer lenker i HTML-koden
function createLink(movies){
	// itererer gjennom alle filmene
	for (var i=0; i < movies.length; i++){
		var li = document.createElement("li");
		li.id = "myList";
		var contentString = "";

	// resultList
	if (movies[i].otitle != null){
		contentString = "<a href='v3_showmovie.html?id="+movies[i].id + "'>" + movies[i].otitle + "</a><br><br>";
	}

	// bilde
	var thumbnail = prepPhotos(movies[i]);

	// legger til resultatet
	li.innerHTML = contentString + "<br>" + thumbnail + "<br><br>";
	resultList.appendChild(li);
}
}

function prepPhotos(movie){
	var image = "https://nelson.uib.no/o/";
	var imageURL = "";

	// sørger for at riktig bildemappe blir funnet
	if (movie.id < 1000){
		imageURL = image + "0/" + movie.id + ".jpg";
	}
	else if (movie.id > 1000 && movie.id < 2000){
		imageURL = image + "1/" + movie.id + ".jpg";
	}
	else if (movie.id > 2000 && movie.id < 3000){
		imageURL = image + "2/" + movie.id + ".jpg";
	}
	else {
		imageURL = image + "3/" + movie.id + ".jpg";
	}

	// finner bildet
	var imageLink = '<img src="' + imageURL + '" alt="' + movie.otitle + '" width="200">';

	//lenker bildet til filmen ved klikk
	var clickableImageLink = '<a href="v3_showmovie.html?id=' + movie.id + '">' + imageLink;

	// returnerer bilde med lenke til informasjonsside
	return clickableImageLink;
}