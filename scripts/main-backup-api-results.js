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
		// const wineID = $('<p>').text(wine.id);
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

	$('#wineOrigin').on('change', (event) => {
		wineApp.getWines(event.target.value)
	})

	};

wineApp.init = () => {
	wineApp.getWines('sweet');
	wineApp.eventHandler();

}

$(function() {
	// code to run when the doc is ready
	//console.log('doc ready ✨');
	wineApp.init();
})





//test lcbo api; no key works
$.ajax({
  url: 'http://lcboapi.com/products?q=wine',
  dataType: 'jsonp'
}).then(function(data) {
  console.log(data);
});

// $.ajax({
//   url: 'https://lcboapi.com/products',
//   headers: { 'Authorization': 'Token MDo1ZmIzNzRmMi1hYTE5LTExZTgtYTE2MC0wZjM0NTY4NzM0NTQ6MTFZV3NQZmhheWdxeGQ2WDVHazdoM1p0ZEFyUzlyV1RVcUg1' }
// }).then(function(data) {
//   console.log(data);
// });