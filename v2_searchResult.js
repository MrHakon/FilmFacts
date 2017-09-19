// Variabler som representerer elementer i HTML-koden
var resultList = document.querySelector("#sResults");

// denne koden kjøres straks siden har lastet inn alt den trenger
window.onload = function() {
	// henter søkeparameterne fra URL og lagrer i variabel
	var searchparameters = get_query_string_parameters();

	// sender søkeparameterne videre til søkefunksjon
	complexSearch(searchparameters);
}

/* Generell søkefunksjon som tar imot søkeparametre, hva det søkes etter
og navnet på egenskapen til objektet det søkes i*/
function generalSearch(params, fieldSelect, objectProp){
	var search = params[fieldSelect].toLowerCase();
	
	var films = []
	var results = [];
	// legger filmene over i en array for å finne antall filmer som må itereres over
	for (x in movies_object){
		films.push(movies_object[x]);
	}

	if (objectProp === "genre"){
		for (var i = 0; i < films.length; i++){
			if ((genres_object[i] != undefined && genres_object[i] != null) && (genres_object[i].includes(search) && films[i] != undefined)){
				results.push(films[i]);
			}
		}
	}
	else {
		for (var p = 0; p < films.length; p++){
			if ((films[p] != undefined && films[p][objectProp] != null) && (films[p][objectProp].toLowerCase().includes(search))){
				results.push(films[p]);
			}
		}
	}
	return results;
}

/* Finner ut hva brukeren ønsker å søke etter, og sender informasjonen videre
til en generell søkefunksjon */
function complexSearch(params){
	// angir hva det skal søkes etter, basert på informasjonen brukeren har gitt
	var field = "";
	var generalHeadline = "Dine søketreff for alle felter: ";
	var spesificHeadline = "Dine søketreff for ";
	// listen hvor treff blir lagret
	var finalList = [];
	// liste for kombinasjon av flere søkeparametre
	var combinedListActor = [];
	var combinedListDirector = [];
	var combinedList = [];

	// "otitle" er egenskapen i filmobjektet, hvor verdien i "film_title"-egenskapen skal finne en match
	// resultatet legges sammen til en enkelt liste over treff
	if (params.film_title != "" && params.film_title != undefined){
		// søker både etter original tittel og norsk tittel
		finalList = generalSearch(params, "film_title", "otitle");
		finalList = finalList.concat(generalSearch(params, "film_title", "ntitle"));
	}
	// søker i utgangspunktet etter skuespiller
	if (params.film_actor != "" && params.film_actor != undefined){
		// hvis det søkes etter både skuespiller og regissør, vil den returnere treff hvor begge
		// søkeparameterne inntreffer
		if (params.film_director != "" && params.film_director != undefined){
			combinedList = multiSearch(params);

			if (combinedList.length > 0){
				spesificHeadline = spesificHeadline + "skuespiller '" + params.film_actor + "'' og regissør '" + params.film_director +"':";
			}
		}
		finalList = finalList.concat(generalSearch(params, "film_actor", "folk"));
	}

	if (params.film_director != "" && params.film_director != undefined){
		finalList = finalList.concat(generalSearch(params, "film_director", "dir"));
	}
	if (params.film_country != "" && params.film_country != undefined){
		// hvis bruker søker på landets navn, fremfor landskode, (eksempelvis France), vil metoden prøve
		// å søke på de tre første bokstavene i stedet for å ikke returnere noe (France = FRA, Italy = ITA, Norway = NOR, osv)
		var shortCountry = params.film_country;
		if (params.film_country.length > 3){
			shortCountry = shortCountry.substring(0,3);
			params.film_country = shortCountry;
		}
		finalList = finalList.concat(generalSearch(params, "film_country", "country"));
	}
	if (params.film_genre != "" && params.film_genre != undefined){
		finalList = finalList.concat(generalSearch(params, "film_genre", "genre"));
	}

	// fjerner duplikater fra listen
	var uniqueList = finalList.filter(function(element, index, self){
		return index == self.indexOf(element);
	})
	
	// sender søk for regi og skuespiller videre for å generere HTML-kode
	if (combinedList.length > 0){
	createLinkToFilm(combinedList, spesificHeadline);
	}
	// sender treffene videre for å generere HTML-kode for resultatene
	if (uniqueList.length > 0){
	createLinkToFilm(uniqueList, generalHeadline);
	}
	else {
		// feilmelding dersom ingen treff returneres
		noHits();
	}
}

// genererer feilmelding dersom ingen filmer matcher søkeparameterne
function noHits(){
			var errormessage = "Fant ingen filmer!";
		var tryAgain = "Du kan prøve å endre søkekriteriene, eller spesifisere søket under 'Avansert søk'";

		var retry = document.createElement("P");
		var noResult = document.createElement("H2");
		
		noResult.innerHTML = errormessage;
		retry.innerHTML = tryAgain;

		resultList.appendChild(noResult);
		resultList.appendChild(retry);
}

function multiSearch(params){
	var combinedList = [];
	var combinedList1 = generalSearch(params, "film_actor", "folk");
	var combinedList2 = generalSearch(params, "film_director", "dir");
			for (var i = 0; i < combinedList1.length; i++){
				for (var p = 0; p < combinedList2.length; p++){
					if (combinedList1[i].id === combinedList2[p].id){
						combinedList.push(combinedList1[i]);
					}
				}
			}
	return combinedList;
}

/* Lager lenker per film */
function createLinkToFilm(results, resultsHeadline){
	var searchHeadline = document.createElement("H2");
	searchHeadline.id = "searchHead";
	searchHeadline.innerHTML = resultsHeadline;
	resultList.appendChild(searchHeadline);

	// løkke som itererer over alle treffene
	for (var i = 0; i < results.length; i++){
		// lager et listeelement, hvor resultatet blir lagt til på slutten
		var li = document.createElement("li");
		// legger til ID for CSS
		li.id = "searchResultList";

		// informasjonen som blir returnert - sjekker om den finnes før den blir lagt til
		var contentString = "";
		// lagrer informasjon om genre for den aktuelle filmen
		var genre = genres_object[results[i].id];

		// sjekker om tittelen finnes og lager en lenke til informasjonssiden
		if (results[i].otitle != null){
			contentString = "<a href='v3_showmovie.html?id="+ results[i].id + "'>" + results[i].otitle + "</a><br>";
		}
		// sjekker om det finnes informasjon om land, og legger det til i tekststrengen
		if (results[i].country != null) {
			contentString = contentString + results[i].country;
		}
		// sjekker om det finnes informasjon om år, og legger det til i tekststrengen
		if (results[i].year != null){
			contentString = contentString + " " + results[i].year;
		}
		// sjekker om det finnes informasjon om lengden, og legger det til i tekststrengen
		if (results[i].length != null && results[i].length != 0){
			contentString = contentString + " (" + results[i].length + " minutter) <br>";
		}
		else {
			contentString = contentString + "<br>";
		}
		if (results[i].ntitle != null && results[i].ntitle != ""){
			contentString = contentString + "Norsk tittel: " + results[i].ntitle;
		}
		// sjekker om det finnes informasjon om genre, og legger det til i tekststrengen
		if (genre != null){
			contentString = contentString + "<br>" + genre + "<br><br>";
		}

		/* sjekker om det finnes en beskrivelse av filmen, og lager en "details/summary"-kode som viser litt
		av beskrivelsen, og utvider den til full beskrivelse ved klikk. Benytter substring for å starte og
		stoppe midt i teksstrengen*/
		if (results[i].description != null && results[i].description != ""){
			contentString = contentString +
			" <details><summary> " + results[i].description.substring(0, 200) + "..." + "</summary>" + 
			results[i].description.substring(200, results[i].description.length) + "</details> <br><br>";
		}

		// funksjon som henter bilde og returnerer klikkbar lenke
		var coverPic = getPhoto(results[i].id, results[i].otitle);

		// legger til bilde med lenke til filmside
		li.innerHTML = coverPic + "<br>" + contentString;

		// legger resultatet til i en liste i HTML-koden
		resultList.appendChild(li);
	}
}

// returnerer fotolenke fra nelson.uib.no
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

	// lenke til filmside
	var clickableImage = '<a href="v3_showmovie.html?id=' + filmId + '">' + imageLink;

	// returnerer et bilde som lenker til filmens informasjonsside ved klikk
	return clickableImage;
}