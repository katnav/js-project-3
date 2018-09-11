const wineApp = {};
wineApp.apikey = 'MDo1ZmIzNzRmMi1hYTE5LTExZTgtYTE2MC0wZjM0NTY4NzM0NTQ6MTFZV3NQZmhheWdxeGQ2WDVHazdoM1p0ZEFyUzlyV1RVcUg1';


wineApp.getWines = (query) => {
    // debugger;
    $.ajax({
        url: 'http://lcboapi.com/products',
        headers: {
            'Authorization': 'Token wineApp.apikey'
        },
        method: 'GET',
        dataType: 'jsonp',
        data: {
            primary_category: 'Wine',
            q: query
        }
    }).then((response) => {
        // debugger;

        wineApp.displayWines(response.result) //result is a property in the api
    })
}



wineApp.displayWines = (lcboWines) => {
    $('#wine-display').empty();


    lcboWines.forEach((wine) => {

        //each wine is an input
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
        const price = $('<p>').addClass('price').text('$' + (wine.price_in_cents / 100).toFixed(2));
        const servingSuggestion = $('<p>').text(wine.serving_suggestion);
        const thumb = $('<img>').attr('src', wine.image_thumb_url);

        if (wine.image_thumb_url != null && wine.inventory_count > 0) {
            const label = $('<label>').attr('for', wine.id).append(name, thumb, price, origin, style,
                servingSuggestion);
            const wineSuggestion = $('<div class="wine-tile">').addClass('wine-container').append(input,
                label)

            $('#wine-display').append(wineSuggestion);

            //add border to selected wine
            $('#wine-display').on('click', '.wine-tile', function() {
                $(this).siblings().removeClass('selected-wine');
                $(this).addClass('selected-wine');
            });


            // wineSuggestion.hide();
            // wineSuggestion.fadeIn("slow");



        }

    });

};


wineApp.loadMap = function(lat, lng) {


    const mapDiv = $('.map')[0]

    const mapOptions = {
        center: {
            lat: lat,
            lng: lng
        },
        zoom: 8
    };
    wineApp.map = new google.maps.Map(mapDiv, mapOptions);



} // end wineApp.loadMap


wineApp.loadMarkers = function(lat, lng) {


    const currentPosition = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        icon: 'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png',
        map: wineApp.map
    })

    //display info when current postion marker is clicked
    const infoWindow = new google.maps.InfoWindow()

    google.maps.event.addListener(currentPosition, 'click', () => {
        infoWindow.setContent('You are here');
        infoWindow.open(wineApp.map, currentPosition);


    });


}; //end loadMarkers

//user geolocation works
wineApp.getUserLocation = function() {

    navigator.geolocation.getCurrentPosition(function(userPosition) {

        console.log(userPosition);
        wineApp.loadMap(userPosition.coords.latitude, userPosition.coords.longitude);
        wineApp.loadMarkers(userPosition.coords.latitude, userPosition.coords.longitude)
        wineApp.map.setCenter(userPosition);
        wineApp.usrLat = userPosition.coords.latitude;
        wineApp.usrLng = userPosition.coords.longitude;


    })


} //end user location


//get stores by ID; works
wineApp.getStoresById = function(clickedItem, lat, lng, storeName) {

    $.ajax({
        url: "http://lcboapi.com/stores",
        // url: 'http://lcboapi.com/stores?latitude=lat&longitude=lng',
        headers: {
            'Authorization': 'Token wineApp.apikey'
        },
        method: "GET",
        dataType: "jsonp",
        data: {
            product_id: clickedItem,
            per_page: 10,
            page: 1,
            latitude: lat,
            longitude: lng,
            name: storeName
        }
    }).then(function(response2) {
        let storeResults = response2.result;
        wineApp.filteredStore(storeResults);
        console.log(storeResults)
    })


}
//end getStoresByID

wineApp.filteredStore = function(stores) {

    stores.forEach(function(store) {
        const storePos = {
            lat: store.latitude,
            lng: store.longitude,
            name: store,
            id: store.id
        };

        // const storeId = {

        //     id: store.id

        // };

        const lcboStoreMarker = new google.maps.Marker({

            position: storePos,
            map: wineApp.map,
            icon: '../api/images/LCBOMarker.png',
        });

        console.log(storePos);

        const infoWindowStore = new google.maps.InfoWindow()

        lcboStoreMarker.addListener('click', function() {
            wineApp.map.setZoom(10);
            wineApp.map.setCenter(lcboStoreMarker.getPosition());



            infoWindowStore.setContent('<div><strong>' + store.name + '</strong><br>' +
          'Store ID: ' + store.id + '<br>' +
          store.address_line_1 + '<br>' + store.address_line_2 + '<br>' + store.city + '<br>' + store.telephone + '<br>' +'</div>');
            infoWindowStore.open(wineApp.map, this);
        }); //end listener




    }); //end forEach




            // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        storePos = [];
      }


} //end filtered stores




//display array of wines when user makes a selection
wineApp.eventHandler = () => {
    $('#wineType').on('change', (event) => {
        $('#wine-selection').removeClass('hide-wine-selection').addClass('show-wine-selection');
        wineApp.getWines(event.target.value);

    });

    //grabbing data (product id) and sending it to the stores endpont AJAX call
    $('#wine-display').on('click', 'input', function() {

        const clickedItem = $(this).val();
        wineApp.getStoresById(clickedItem, wineApp.usrLat, wineApp.usrLng);
        console.log(clickedItem, wineApp.usrLat, wineApp.usrLng);

         $('#location').removeClass('hide-map').addClass('show-map');

        $('html, body').animate({ scrollTop: $(document).height() }, "slow");



    });


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
    wineApp.init();

    $('#wineType').on('change', (event) => {
        $('html, body').animate({
            scrollTop: $("div.wine-list").offset().top
        }, 1500)
    })






})