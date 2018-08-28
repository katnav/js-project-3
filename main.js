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

// }).then(function(data) {
//   console.log(data);
// });



wineApp.displayWines = (lcboWines) => {
	// if (!lcboWines) {
	// 	return;
	// }
	$('#wine-display').empty();
	//slice lcbowines
	lcboWines.forEach((wine) => {

		const name = $('<h2>').text(wine.name);
		const style = $('<p>').text(wine.style);
		const thumb = $('<img>').attr('src', wine.image_thumb_url);
		const wineSuggestion = $('<div>').append(name, style, thumb);
		$('#wine-display').append(wineSuggestion);


	});

};

wineApp.eventHandler = () => {
	$('#mealQuery').on('change', (event) => {
		//event.preventDefault();
		wineApp.getWines(event.target.value)

	})
	};

wineApp.init = () => {
	wineApp.getWines('red');
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