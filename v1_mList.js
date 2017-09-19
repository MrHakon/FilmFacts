var myList = document.querySelector("#mListe");

window.onload = function(){
	var parameters = [];
	var movie = movies_object;

	parameters.push(movie[2284], movie[2522], movie[2298], movie[918], movie[2138]);	

	// sender filmene videre til en funksjon som genererer lenker og bilder til filmene
	createLink(parameters);
}

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
	myList.appendChild(li);
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

	// returnerer klikkbart bilde som sender brukeren videre til filmens informasjonsside
	return clickableImageLink;
}