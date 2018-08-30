const wineApp = {};


wineApp.getWines = (query) => {
	// debugger;
	$.ajax({
		url: 'http://lcboapi.com/products',
		headers: { 'Authorization': 'Token MDo1ZmIzNzRmMi1hYTE5LTExZTgtYTE2MC0wZjM0NTY4NzM0NTQ6MTFZV3NQZmhheWdxeGQ2WDVHazdoM1p0ZEFyUzlyV1RVcUg1' },
		method: 'GET',
		dataType: 'jsonp',
		data: {
			// format: 'jsonp',
			//per_page: 6,
			primary_category: 'Wine',
			q: query
		}
	}).then((response)=> {
// debugger;

		wineApp.displayWines(response.result) //result is a property from api response
	})
}




wineApp.displayWines = (lcboWines) => {
	// if (!lcboWines) {
	// 	return;
	// }
	$('#wine-display').empty();
	//slice lcbowines to display 6 results



	lcboWines.forEach((wine) => {


		const name = $('<h2>').text(wine.name);
		const wineID = $('<p>').text(wine.id);
		const origin = $('<p>').text(wine.origin);
		const style = $('<p>').text(wine.style);
		const servingSuggestion = $('<p>').text(wine.serving_suggestion);
		const thumb = $('<img>').attr('src', wine.image_thumb_url);
		if (wine.image_thumb_url != null && wine.inventory_count > 0) {
		const wineSuggestion = $('<div class="wine-container">').append(thumb, name, origin, style, servingSuggestion);

		$('#wine-display').append(wineSuggestion);

		wineSuggestion.hide();
        wineSuggestion.fadeIn("slow");
    }

	});


};

wineApp.eventHandler = () => {
	$('#wineType').on('change', (event) => {
		wineApp.getWines(event.target.value)
	})

	};




//stores?lat=43.65838&lon=-79.44335&product_id=438457
	const mapApp = {};

    mapApp.loadMap = function(lat, lng) {

      const mapDiv = $('.map')[0] //select first div - class map

      const mapOptions = {
        center: {lat: lat, lng: lng},
        zoom: 10
              };

      mapApp.map = new google.maps.Map(mapDiv, mapOptions);

    } // end mapApp.loadMap definition


	mapApp.loadMarkers = function(lat, lng) {

      const currentPosition = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        icon: 'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png',
        map: mapApp.map
      })

      //display info when marker is clicked
      const infoWindow = new google.maps.InfoWindow()

      google.maps.event.addListener(currentPosition, 'click', () => {
       infoWindow.setContent('You are here');
       infoWindow.open(mapApp.map, currentPosition);

//places api key AIzaSyASpkSOoUNQjSnFOyAcqncw7_jZMaXh7Wc

});


    }; //end loadMarkers

	mapApp.getUserLocation = function() {

  navigator.geolocation.getCurrentPosition(function(position) {

    console.log(position);
    mapApp.loadMap(position.coords.latitude, position.coords.longitude);
    mapApp.loadMarkers(position.coords.latitude, position.coords.longitude)

  })
}//end user location



wineApp.init = () => {
	wineApp.getWines('sweet');
	wineApp.eventHandler();
	mapApp.getUserLocation();
	mapApp.loadMap();


}



$(function() {
	// code to run when the doc is ready
	//console.log('doc ready ✨');
	wineApp.init();


})





//test lcbo api; no key works
// $.ajax({
//   url: 'http://lcboapi.com/products?q=wine',
//   dataType: 'jsonp'
// }).then(function(data) {
//   console.log(data);
// });

// $.ajax({
//   url: 'https://lcboapi.com/products',
//   headers: { 'Authorization': 'Token MDo1ZmIzNzRmMi1hYTE5LTExZTgtYTE2MC0wZjM0NTY4NzM0NTQ6MTFZV3NQZmhheWdxeGQ2WDVHazdoM1p0ZEFyUzlyV1RVcUg1' }
// }).then(function(data) {
//   console.log(data);
// });