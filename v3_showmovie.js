var movieTitleAndTrailer = document.querySelector(".trailer");
var movieRating = document.querySelector(".rating");
var movieDescription = document.querySelector(".filmDescription");
var movieFacts = document.querySelector(".factbox");
var moviePics = document.querySelector(".tallPics");
var movieIndRating = document.querySelector("#individualRating");


window.onload = function() {
	// får parametre fra URL
	var movieID = get_query_string_parameters();
	// variabel for lagring av resultat
	var movieObject = [];

	// lagrer filmen hvis den finnes
	if (movies_object[movieID.id] != undefined){
		movieObject.push(movies_object[movieID.id]);
		createFilmInfo(movieObject[0]);
	}
	else {
		alert("Finner ikke film!");
	}
}

// hovedmetode som syr sammen informasjonen som blir funnet og legger den til i HTML-koden
function createFilmInfo(movie){
	var content = "";
	var filmtrailer = "";
	var trailerFrame = "";

	// hvis tittelen finnes, legges den til
	if (movie.otitle != null){
		var title = document.createElement("H1");
		title.id = "movietitle"
		title.innerHTML = movie.otitle;
		movieTitleAndTrailer.appendChild(title);
	}
	// sjekker om trailer finnes, og bygger den inn i koden
	if (movie["youtube trailer id"] != ""){
		// lenke til filmtraileren
		filmtrailer = "https://www.youtube.com/embed/" + movie["youtube trailer id"];
		// kode for den innebygde filmviseren
		trailerFrame = "<iframe class='trailersize' src='"+ filmtrailer + "' allowfullscreen></iframe>";

		// legger til filmen i HTML-koden
		var trailer = document.createElement("DIV");
		trailer.innerHTML = trailerFrame;
		movieTitleAndTrailer.appendChild(trailer);
	}

	// lagrer vurderinger for filmen, og antall vurderinger
	var userRating;
	
	// sjekker om filmen finnes i reviews_object
	if (reviews_object[movie.id] != undefined){
		// kaller funksjon som returnerer gjennomsnittsvurdering og antall vurderinger
		userRating = ratings(reviews_object[movie.id], "rating");
		// kaller funksjon som returnerer brukernavnene i samme rekkefølge som brukervurderingen
		userNames = ratings(reviews_object[movie.id], "users");
		var totalnumbers = "";
		if (userRating != null){
			for (var k = 0; k < userRating.length-2; k++){
				totalnumbers = totalnumbers + "Filmen har fått: " + userRating[k].toString() + " fra brukeren "+ userNames[k].toString() + "<br><br>";
			}
		
		var individualRatings = "<details><summary>Les flere vurderinger</summary>" + totalnumbers + "</details> <br>";
		}
	}

	// sjekker om filmen er vurdert
	if (userRating != null){
		//userRating[0] = gjennomsnittsvurdering, userRating[1] = antall vurderinger
		var ratingString = "Vurdering: " + userRating[userRating.length-2] + " av 5 stjerner fra " + userRating[userRating.length-1] + " bruker(e).";
		var average = document.createElement("P");
		average.id = "rating";
		average.innerHTML = ratingString;
		movieFacts.appendChild(average);

		var indivRating = document.createElement("P");
		indivRating.innerHTML = individualRatings;
		movieFacts.appendChild(indivRating);
	}

	// undersøke om beskrivelse av filmen finnes, og legger den til i HTML-koden
	if (movie.description != null){
		var desc = document.createElement("P");
		desc.id = "description";
		desc.innerHTML = movie.description;

		var descHead = document.createElement("H2");
		descHead.innerHTML = "Kort beskrivelse: ";
		descHead.id = "descHead";
		movieDescription.appendChild(descHead);
		movieDescription.appendChild(desc);
	}

	// finner og lagrer korte fakta om filmen
	var factString = "";
	if (movie.country != null){
		factString = "Land: " + movie.country + ". ";
	}
	if (movie.year != null){
		factString = factString + "År: " + movie.year + ". ";
	}
	if (movie.length != null){
		factString = factString + "Lengde: " + movie.length + " minutter. <br>";
	}
	// finner genre-info fra annet objekt enn resten av informasjonen
	if (genres_object[movie.id] != null){
		factString = factString + "Genre: " + genres_object[movie.id] + ".<br>";
	}

	var filmfacts = document.createElement("P");
	filmfacts.id = "filmfacts";
	filmfacts.innerHTML = factString;
	movieFacts.appendChild(filmfacts);
	
	// finner og legger til regissør og skuespillere
	var castLink = "";
	var dirLink = "";
	
	// undersøker om det finnes en regissør, og lager en lenke til deres andre filmer
	var fullcast = "";
	if (movie.dir != null){
		dirLink = linkedCast(movie.dir, "director");
	}
	// lager lenke til skuespillerne
	if (movie.folk != null){
		castLink = linkedCast(movie.folk, "actor");
	}

	var filmDirector = document.createElement("P");
	filmDirector.id ="filmDirector";
	filmDirector.innerHTML = "<b>Regissør:</b> <br>" + dirLink.join(" ");
	movieFacts.appendChild(filmDirector);

	var actors = document.createElement("P");
	actors.id = "actors";
	actors.innerHTML = "<b>Skuespillere:</b> <br>" + castLink.join(" ");
	movieFacts.appendChild(actors);

	// finner bilder og legger dem til på siden
	var imageLink = getPhoto(movie.id, movie.otitle);
	var pics = document.createElement("DIV");
	pics.class = "pics";
	pics.innerHTML = imageLink;	
	moviePics.appendChild(pics);

	// Finner brukerkommentarer og legger dem til i HTML-koden
	if (reviews_object[movie.id] != undefined){
		userCom = comments(reviews_object[movie.id]);

	if (userCom != null){
		var sectionHeadline = "<b>Brukervurderinger:</b> <br>";
		var userComments = document.createElement("P");
		userComments.id = "userComs";
		// join() fjerner komma
		userComments.innerHTML = sectionHeadline + userCom.join(" ");
		movieRating.appendChild(userComments);
	}
}
}

function getPhoto(filmId, filmTitle){
	var image = "https://nelson.uib.no/o/";
	var imageURL = "";

	// undersøker verdien av filmens ID for å sørge for at det letes i riktig mappe på serveren
	if (filmId < 1000){
		imageURL = image + "0/" + filmId + ".jpg"; 
	}
	else if (filmId > 1000 && filmId < 2000){
		imageURL = image + "1/" + filmId + ".jpg";
	}
	else if (filmId > 2000 && filmId < 3000) {
		imageURL = image + "2/" + filmId + ".jpg";
	}
	else {
		imageURL = image + "3/" + filmId + ".jpg";
	}

	// lenke til bilde
	var imageLink = '<img src="' + imageURL + '" alt="' + filmTitle + '" width="300">';

	return imageLink;
}

// funksjon som lenker til et søk for skuespilleren man trykker på
function linkedCast(movieFolk, field){

	// splitter navnene og legger dem i en array
	var results = movieFolk.split(", ");
	var linkedResults = [];
	var castLink = "";
	
	// fjerner whitespace som finnes i begynnelsen av en streng og komma på slutten
	for (var i = 0; i < results.length; i++){
		if (results[i].substring(0,1)=== " "){
			results[i] = results[i].replace(" ", "");
		}
		if (results[i].substring(results[i].length-1, results[i].length) === ","){
			results[i] = results[i].replace(",", "");
		}
		// undersøker om det er skuespiller eller regissør som skal returneres
		if (field === "actor"){
			castLink = "<a href='searchresult.html?film_actor=" + results[i] + "'>" + results[i] + "</a><br>";
		}
		else if (field === "director"){
			castLink = "<a href='searchresult.html?film_director=" + results[i] + "'>" + results[i] + "</a><br>";
		}
		// legger til resultatet i en tabell
		linkedResults.push(castLink);
		linkedResults.push(" ");
	}
	return linkedResults;
}

// returnerer filmens gjennomsnittsvurdering dersom den er vurdert
function ratings(reviews, term){
	// lagrer vurderinger
	var rating = 0;
	// lagrer antall vurderinger
	var counter = 0;
	var ratingAndCounter = [];
	var totalRatings = [];
	var users = [];
	var byUser = [];

	// itererer over de 200 første brukernavnene
	for (var i = 1; i < 200; i++){
		var user = "xyz0";
		
		if (i < 10){
			user = user + 0 + i;
		}
		else {
			user = user + i;
		}
		// hvis brukeren ikke finnes, starter ny iterasjon uten å gjøre noe
		if (reviews[user] === undefined){
			continue;
		}

		// legger sammen alle vurderingene og inkrementerer telleren
		if (reviews[user].rating != 0){
			// totalvurdering
			rating = rating + reviews[user].rating;
			// individuell vurdering
			totalRatings.push(reviews[user].rating);
			// brukernavn
			byUser.push(user);
			// antall vurderinger
			counter = counter + 1;
		}
	}
	// hvis det ble funnet vurderinger
	if (counter != 0 && term === "users"){
		return byUser;
	}
	else if (counter != 0 && term === "rating"){
		var average = rating/counter;
		var roundedAverage = average.toFixed(2);
		// legger til gjennomsnittsvurdering med 2 desimaler
		ratingAndCounter.push(roundedAverage);
		// legger til antall vurderinger
		ratingAndCounter.push(counter);

		// returerer gjennomsnittsvurdering og antall vurderinger
		// nest sisteplass (totalRatings.length-2) = gjennomsnittsvurdering
		totalRatings.push(roundedAverage);
		// sisteplass (totalRatings.length-1) = antall vurderinger 
		totalRatings.push(counter);

		return totalRatings;
	}
	else{
		return null;
	}
}

// returnerer brukerkommentarer, dersom de finnes
function comments(reviews){
	var results = [];
	var byUser = "<br><em>Skrevet av: ";

	for (var i = 1; i < 200; i++){
		var user = "xyz0";
		
		if (i < 10){
			user = user + 0 + i;
		}
		else {
			user = user + i;
		}

		// sjekker om filmen har brukervurderinger/kommentarer og legger dem til i en tabell
		if (reviews[user] != undefined && reviews[user].comment != undefined && reviews[user].comment != ""){
			byUser = byUser + user + "</em><br>(" + reviews[user].mod_date + ")";
			results.push(reviews[user].comment);
			results.push(byUser);
		}
	}
	// dersom det ikke er noen kommentarer, returneres null
	if (results.length < 1){
		return null;
	}
	// returnerer resultater
	return results;
}