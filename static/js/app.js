//methods

function drawResults() {
    var markers = results;
    for (var i = 0; i < markers.length; i++) {

        var lon = markers[i]['latitude'];
        var lat = markers[i]['longitude'];
        var popupText = markers[i]['name'];
        var markerLocation = new L.LatLng(lon, lat);
        var marker = new L.Marker(markerLocation).bindPopup(popupText).addTo(feature_group);
    }
}
//get route waypoints and push them. this gets posted
function getWaypoints() {

    for (var i = 0; i < routeControl.getWaypoints().length; i++) {
        points = routeControl.getWaypoints();
        routepoints.push(points[i]['latLng']); //where is points?
    }
};


//create the map and router
var map = L.map('map', {
    zoomControl: true,
    maxZoom: 19
}).fitBounds([
    [41.082208455, -82.1033158688], //us bounds
    [41.7934502486, -81.0530349416]
]);
var hash = new L.Hash(map);
var additional_attrib = 'app created by Eric Sherman';
var feature_group = new L.featureGroup([]);
var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});
basemap_0.addTo(map);
var layerOrder = new Array();

feature_group.addTo(map);
var title = new L.Control();
title.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
title.update = function() {
    this._div.innerHTML = '<h2>Factual API Data Extract</h2>'
};
title.addTo(map);

routeControl = L.Routing.control({
    waypoints: [
        L.latLng(),
        L.latLng()
    ],
    router: L.Routing.mapzen('valhalla-v9fMrPq', 'auto'),
    formatter: new L.Routing.Mapzen.Formatter({units: 'imperial'}),
    geocoder: L.Control.Geocoder.mapzen("search-iv_vGuI", "autocomplete")

}).addTo(map);


var baseMaps = {
    'OSM Standard': basemap_0
};
L.control.layers(baseMaps, {
    "result": feature_group
}, {
    collapsed: false
}).addTo(map);
L.control.scale({
    options: {
        position: 'bottomleft',
        maxWidth: 100,
        metric: true,
        imperial: false,
        updateWhenIdle: false
    }
}).addTo(map);

//add buttons for routing and drawing results
routepoints = []
$(".leaflet-routing-geocoders").append("<input id=\"clickMe\" type=\"button\" value=\"Run Query\" onclick=\"getWaypoints();post();\" />");
$(".leaflet-routing-geocoders").append("<input id=\"draw\" type=\"button\" value=\"Draw Results\" onclick=\"drawResults();\" />");

//results, output
function post() {
    $.ajax({
        type: 'POST',
        url: '/call',
        data: JSON.stringify(routepoints),
        success: function(data) {
            results = data; //results from API call
        },
        complete: function(data) {
            loadTable();
        },
        contentType: 'application/json',
        dataType: 'json'
    });
}
//load results from query
function loadTable() {
    $(function() {
        $('#table').bootstrapTable({
            data: results
        });
    });
}

//messy forms
jsonObj = bigcats[0].children
var bigarray = [];
for(var i = 0, len = jsonObj .length; i < len; i++) {
  bigarray.push( {"text": jsonObj[i].label, "id" : jsonObj[i].id});
}

var big_cats = '';

$(function() {
    $('button').click(function() {
        var user = $('#txtUsername').val();
        var main = $(sel1);
        var sub = $(sel2).val();
        $.ajax({
            url: '/searchParams',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

function bigCats(){

  //for (i = 0; i < bigcats[0].children.length; i++){
    //big_cats += '<select class="form-control" id ="'+ bigcats[0].children[i].id +'"'+ '>';

    //big_cats += '<option value = '+ bigcats[0].children[i].id +'>'+ bigcats[0].children[i].label + '</option>';

    //console.log(bigcats[0].children[i])
    //bigarray.push("{id"+ ":" + bigcats[0].children[i].id + ',' + "text:"+ bigcats[0].children[i].label +"}" );
    //big_cats += '</select>'
  //}
  //document.getElementById('sel1').innerHTML = big_cats;
  //big_cats = $.parseHTML(big_cats);
//return big_cats;
}
//bigCats();

//document.getElementById('sel1').oninput= function() {subCats()};
var id = parseInt($(sel1).val());
var filtered = [];
var catray = [];
  function subCats(){
    var sub_cats = '';

    if (filtered.length !== 0) {
      for (i =0; i < filtered[0].children.length; i++) {
      //sub_cats += '<select class="form-control" id ="sel2">';
      sub_cats += '<option value ='+ filtered[0].children[i].id + '>' + filtered[0]['children'][i].label + '</option><br>';
      //catray.push("{id:" + filtered[0].children[i].id + "},{text:"+ filtered[0]['children'][i].label +"}" );
      //sub_cats += '</select>'
    }
    document.getElementById('sel2').innerHTML = sub_cats;
  }
}


  var selectone = $(sel1).select2(
    {data: bigarray, placeholder: "Select a Business Category First", allowClear: true}
  ).on("select2:select", function() {
    id = parseInt($(sel1).val());
    console.log('change');
    filtered = jQuery.grep(bigcats[0].children, function( item, index ) {
      return ( item.id == id  );
    });
    subCats();
  });
//});


var selecttwo = $(sel2).select2({allowClear: true, placeholder: "Optional Sub-Categories"});

$(sel1).on("change", function() {
  subCats();
});
