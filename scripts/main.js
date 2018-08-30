const wineApp = {};
wineApp.apikey = 'MDo1ZmIzNzRmMi1hYTE5LTExZTgtYTE2MC0wZjM0NTY4NzM0NTQ6MTFZV3NQZmhheWdxeGQ2WDVHazdoM1p0ZEFyUzlyV1RVcUg1';


wineApp.getWines = (query) => {
	// debugger;
	$.ajax({
		url: 'http://lcboapi.com/products',
		headers: { 'Authorization': 'Token wineApp.apikey' },
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

		wineApp.displayWines(response.result) //result is a property from api
	})
}




wineApp.displayWines = (lcboWines) => {
	// if (!lcboWines) {
	// 	return;
	// }
	$('#wine-display').empty();
	//slice lcbowines to display 6 results

// $('#wine-display').append('Select a wine');

	lcboWines.forEach((wine) => {

		const input = $('<input id="wine-input">').addClass('hide').attr({
            type: 'radio',
            id: wine.id,
            name: 'options',
            value: wine.id
        })
		const name = $('<p>').addClass('name').text(wine.name);
		const wineID = $('<p>').text(wine.id); //not displayed
		const origin = $('<p>').text(wine.origin);
		const style = $('<p>').text(wine.style);
		const price = $('<p>').addClass('price').text('$' + (wine.price_in_cents/100).toFixed(2));
		const servingSuggestion = $('<p>').text(wine.serving_suggestion);
		const thumb = $('<img>').attr('src', wine.image_thumb_url);
		if (wine.image_thumb_url != null && wine.inventory_count > 0) {
		//const wineSuggestion = $('<div class="wine-container">').append(name, thumb, price, origin, style, servingSuggestion);

		const label = $('<label>').attr('for', wine.id).append(name,thumb, price,  origin, style, servingSuggestion);
		const wineSuggestion = $('<div id="wine-container">').addClass('wine-container').append(input, label)
		$('#wine-display').append(wineSuggestion);

		$('#wine-display').append(wineSuggestion);

		 $('#wine-display').on('click', '#wine-container', function() {
           $(this).siblings().removeClass('selected-wine');
             $(this).addClass('selected-wine');


       });



		wineSuggestion.hide();
    wineSuggestion.fadeIn("slow");
    }

	});

};








//stores?lat=43.65838&lon=-79.44335&product_id=438457
	//const wineApp = {};

    wineApp.loadMap = function(lat, lng) {

      const mapDiv = $('.map')[0] //select first div - class map

      const mapOptions = {
        center: {lat: lat, lng: lng},
        zoom: 10
              };

      wineApp.map = new google.maps.Map(mapDiv, mapOptions);

    } // end wineApp.loadMap definition


	wineApp.loadMarkers = function(lat, lng) {

      const currentPosition = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        icon: 'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png',
        map: wineApp.map
      })

      //display info when marker is clicked
      const infoWindow = new google.maps.InfoWindow()

      google.maps.event.addListener(currentPosition, 'click', () => {
       infoWindow.setContent('You are here');
       infoWindow.open(wineApp.map, currentPosition);

//places api key AIzaSyASpkSOoUNQjSnFOyAcqncw7_jZMaXh7Wc

});


    }; //end loadMarkers

	wineApp.getUserLocation = function() {

  navigator.geolocation.getCurrentPosition(function(position) {

    console.log(position);
    wineApp.loadMap(position.coords.latitude, position.coords.longitude);
    wineApp.loadMarkers(position.coords.latitude, position.coords.longitude)

  })
}//end user location

//get stores by ID

wineApp.getStoresById = function(clickedItem, lat, lng){
        console.log(clickedItem);
        // let storeResults = [];
         $.ajax({
            url: "http://lcboapi.com/stores",
            headers: { 'Authorization': 'Token wineApp.apikey' },
            method: "GET",
            dataType: "jsonp",
            data: {
                //access_key: wineApp.apikey,
                product_id: clickedItem,
                per_page: 100,
                page: 1,
                lat: lat,
                lon: lng
            }
         }).then(function(response2){
            let storeResults = response2.result;
            console.log(storeResults)
            wineApp.filteredStore(storeResults);
         })
}
//end store location

wineApp.filteredStore = function(store) {
    // console.log(wineApp.map.clear);
    // map.removeOverlay(marker);
    wineApp.loadMap(wineApp.position);
    // maybe add button click listener here?
    store.forEach(function(storeObj) {
        const pos = {
            lat: storeObj.latitude,
            lng: storeObj.longitude
        }
        const lcboStore = new google.maps.Marker({
            position: pos,
            map: wineApp.map,
            icon:'images/LCBOMarker.svg',
        });

        lcboStore.addListener('click', function() {
            wineApp.map.setZoom(17);
            wineApp.map.setCenter(lcboStore.getPosition());
            const userClickedPos = lcboStore.position;
            console.log (userClickedPos);
            wineApp.getGoogleDirections(userClickedPos);
        });
    });
} //end filtered stores

//get array of wines when user makes a selection
wineApp.eventHandler = () => {
  $('#wineType').on('change', (event) => {
    wineApp.getWines(event.target.value);
  })

  $('#wine-display').on('click', 'input', function(){
        const clickedItem = $(this).val();
        wineApp.getStoresById(clickedItem, wineApp.lat, wineApp.lng);
})

  };

wineApp.init = () => {
	wineApp.getWines('sweet');
	wineApp.eventHandler();
	wineApp.getUserLocation();
	wineApp.loadMap();
  wineApp.getStoresById();


}



$(function() {
	// code to run when the doc is ready
	//console.log('doc ready ✨');
	wineApp.init();

  $('#wineType').on('change', (event) => {
  $('html, body').animate({
    scrollTop: $("div.wine-list").offset().top
  }, 1500)
})
  // $('div.middle').click(function (){
  //   $('html, body').animate({
  //     scrollTop: $("div.bottom").offset().top
  //   }, 1000)
  // }),
  // $('div.bottom').click(function (){
  //   $('html, body').animate({
  //     scrollTop: $("div.top").offset().top
  //   }, 1000)
  // })




})




//my google API Key AIzaSyASpkSOoUNQjSnFOyAcqncw7_jZMaXh7Wc
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