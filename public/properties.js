(function($) {
  $.loadMap = function(map, params) {
    console.log("Got params", params);
    $.getJSON("/properties.json", params, function(data) {
      var properties = [];

      $("table#properties").html([
        "<tr>",
          "<th>Address</th>",
          "<th>Price</th>",
        "</tr>"
      ].join(""));

      data.forEach(function(property) {
        var lat    = parseFloat(property["property"]["latitude"]);
        var lng    = parseFloat(property["property"]["longitude"]);
        var price  = property["property"]["price"];
        var add    = property["property"]["address"];

        var marker = L.marker([lat, lng]).addTo(map).bindPopup(price + "<br/>" + add);
        properties.push(marker);

        $("table#properties").append([
          "<tr>",
            "<td>" + add + "</td>",
            "<td>" + price + "</td>",
          "</tr>"
        ].join(""));
      });

      if (map.currentLayer != null)
        map.removeLayer(map.currentLayer);

       map.currentLayer = L.layerGroup(properties);
       map.currentLayer.addTo(map);
      // map.addLayer(map.currentLayer);
    });
  };

  $(document).ready(function() {
    $("input[type=number]").stepper();
  });

  $(document).ready(function() {
    // TODO: This should ask the user for their current location
    // and place the map there.
    var philadelphia = [39.97, -75.15];
	  window.$map      = L.map('map', {scrollWheelZoom: false, doubleClickZoom: false}).setView(philadelphia, 12);

    $("input[type=number]").on('change', _.throttle(function(e) {
      var price = $("#max_price").val();
      var latlng = window.$map.getCenter();
      var lat    = latlng.lat;
      var lng    = latlng.lng;
      $.loadMap(window.$map, {max_price: price, lat: lat, lng: lng});
    }, 100));

    window.$map.on('moveend', _.throttle(function(e) {
      var price  = $("#max_price").val();
      var latlng = window.$map.getCenter();
      var lat    = latlng.lat;
      var lng    = latlng.lng;
      $.loadMap(window.$map, {max_price: price, lat: lat, lng: lng});
    }, 100));

	  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		  maxZoom: 18,
		  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		  id: 'examples.map-i86knfo3'
	  }).addTo(window.$map);

    $.loadMap(window.$map, {lat: philadelphia[0], lng: philadelphia[1]});
  });
})(jQuery);
