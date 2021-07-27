
// $.getJSON('http://localhost:8080/geoserver/web_gis_project/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_gis_project%3Aice_data_1&maxFeatures=50&outputFormat=application%2Fjson', function (dataGeoJSON3) {
//     L.geoJSON(dataGeoJSON3).addTo(map);
// });

//var dataGeoJSON3 = new L.GeoJSON.AJAX("http://localhost:8080/geoserver/web_gis_project/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=web_gis_project%3Aice_data_1&maxFeatures=50&outputFormat=application%2Fjson");


var dateLayer = [['21.01.2020', dataGeoJSON1],['21.02.2020', dataGeoJSON2]];
var shipsLayer = null;

$(document).ready(function() {

    map = L.map('mapid',{zoomControl:false}).setView([54.153646, 147.832428], 5);
        
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    measure(map);

    var positronMapLayer = L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}@2x.png?key=xKZmFY8RbwWhRaJXDIBE', {
        attribution: '<a>&copy; Anastasia Volkova & Emin Bariev |</a> <a id="timeDate"></a></b>',
    });

    positronMapLayer.addTo(map);

    var hybridMapLayer = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=xKZmFY8RbwWhRaJXDIBE', {
        attribution: '<b><a id="timeDate"><a></b>',});
    // hybridMapLayer.addTo(map);

    // <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>
    
    //info
    info = createChoroplethInfo();
    //legend uses getColor
    createChoroplethLegend(getColor);

    createShipLayer();

    //time show and uodate
    setInterval(timeFunction, 1000);

    $('input[name="mapLayerType"]').click(function() {
        chooseMapLayer(positronMapLayer, hybridMapLayer);
    });

    //initial layer
    createIceLayer(dataGeoJSON1);

    $('input[name="layerDate"]').click(function() {
        chooseIceLayer();
        //shipsLayer.bringToFront();
    });

    shipsLayer.bringToFront();

});

function getColor(d) {
    return d == "green" ? '#3BFF00':
            d == "white" ? '#BDC3FF':
            d == "pink" ? '#ff6666':
            d == "purple" ? '#9381FF':
            d == "green_1" ? '#66ffd9':
            d == "blue" ? '#66b3ff': '#dcdcdc';
}

function iceLayerStyle(feature) {
    return {
        fillColor: getColor(feature.properties.color),
        weight: 1,
        opacity: 0.8,
        color: 'white',
        dashArray: '4',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 3,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    shipsLayer.bringToFront();
    //for info
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);

    //for info
    info.update();

  
    // geojson.setZIndex(1);
    // mainLayer.setZIndex(1);
    shipsLayer.bringToFront();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function createShipLayer(){
    shipsLayer = L.geoJson(ships_data,{
        style: function(feature) {
            switch (feature.properties.color) {
                case 'brown': return {color: "#5E503F"};
                case 'green': return {color: "#4C9E34"}
                case 'orange': return {color: "#F28A52"};
                case 'red': return {color: "#F23E3E"};
                case 'pink': return {color: "#EA77CA"};
                case 'yellow': return {color: "#FFDF54"};
            }
        },
        pointToLayer: function(feature, LatLng) {
            return new L.CircleMarker(LatLng, {
                radius: 4, 
                fillOpacity: 0.85
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(function (LatLng) {
                return L.Util.template('<div style="width:200px; height:290px;"> '+
                '<span class="lead">{country} {name}</span><hr class="pb-2">'+
                '<img src="{img}" width="200"></img><hr class="mt-2">' +
                '<span class="lead"><b>IMO:</b> {imo}<br><b>Type:</b> {type}<br> <b>Status:</b> {status} </span>'+
                '<i><p class="m-0">lon: ' + feature.geometry.coordinates[0].toFixed(4)+'&nbsp; &nbsp; lan: '+layer.feature.geometry.coordinates[1].toFixed(4)+'</p></i>'+
                '</div>', 
                layer.feature.properties);
            });
        }
    });

    shipsLayer.bringToFront();
    shipsLayer.addTo(map);
}

function chooseIceLayer() {
    // Get the storedValue
    var previousValue = $(this).data('storedValue');
    
    if (previousValue) {
        $(this).prop('checked', !previousValue);
        $(this).data('storedValue', !previousValue);
    }
    else{
        $(this).data('storedValue', true);
        $('input[name="layerDate"]').data("storedValue", false);
    }
    
    let dateElements = document.getElementsByName('layerDate');

    for (let i = 0, length = dateElements.length; i < length; i++) {
        if (dateElements[i].checked) {
            
            dateLayer.forEach(e => {
                if(dateElements[i].value == e[0] ){
                    // alert(radios[i].value);
                    map.removeLayer(geojson);
                    map.removeLayer(mainLayer);
                    createIceLayer(e[1]);
                }
            });

            
            // if(selectedDate[i].value == '21.02.2020'){
            //     // alert(radios[i].value);
            //     map.removeLayer(geojson);
            //     map.removeLayer(mainLayer);
            //     createChoroplethLayer(dataGeoJSON1);
            // }
            // else if(selectedDate[i].value == '21.02.2020'){
            //     // alert(radios[i].value);
            //     map.removeLayer(geojson);
            //     map.removeLayer(mainLayer);
            //     createChoroplethLayer(dataGeoJSON2);
                
            // }
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    shipsLayer.bringToFront();
}

function createIceLayer(dataGeoJSON){
    //main layer for higher brightness
    mainLayer = L.geoJSON(dataGeoJSON, {style: iceLayerStyle});
    mainLayer.addTo(map);

    geojson = L.geoJson(dataGeoJSON, {
        style: iceLayerStyle,
        onEachFeature: onEachFeature
    });
    geojson.addTo(map)
  
    createIceTypeGroup(dataGeoJSON);

    $('.eye_ico').click(selectIceTypeGroup);
}

function selectIceTypeGroup() {  
    if ($(this).attr('src') === 'images/uncheck.png') {
        $(this).attr('src','images/check.png');

        let num = parseInt($(this).attr('name'));
        console.log(num);
        i = featureGroupLayers[num];
        i.addTo(map);
        
    }
    else{
        $(this).attr('src','images/uncheck.png');
        let num = parseInt($(this).attr('name'));
        map.removeLayer(featureGroupLayers[num]);
        
    }
    //dataGeoJSON.features[1].properties.cohesion
}

function createChoroplethInfo() {

    let info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4 class="mb-0 align-items-center align-middle">Ice cover of Okhotsk Sea</h4> ' +
            (props ?
                '<br><b>ID: </b>' + '<span class="property">' + props.id + '</span>' + '<br/>' +
                '<b>Ice type: </b> ' + '<span class="property">' + props.ice_type + '</span>' + '<br>' +
                '<b>Dynamic: </b> ' + '<span class="property">' + props.dynamic + '</span>' + '<br>' +
                '<b>Cohesion: </b> ' + '<span class="property">' + props.cohesion + '</span>' + '<br>' +
                '<b>Destructiveness: </b> ' + '<span class="property">' + props.destruct + '</span>' + '<br>' +
                '<b>Ice shape: </b> ' + '<span class="property">' + props.ice_shape + ' m.' + '</span>' + '<br>' +
                '<b>Ice area: </b> ' + '<span class="property">' + props.area.toFixed(3) + 'K miles' + '</span>' + '<br>' : '');
    };
    info.addTo(map);
    return info;
}

function createChoroplethLegend(getColor) {

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'), grades = ["green", "white", "pink", "purple", "green_1", "blue"],
            // labels = ["Thin ice/тонкий лёд", "One year middle ice/Однолетний лёд средней толщины",
            // "Grey ice/Серый лёд", "White ice/белый лёд", "Drifting One year middle ice/Дрейфующий однолетний лёд средней толщины",
            // "Nilas/Нилас"];
            labels = ["Thin ice", "Fixed one year middle ice",
                "Grey ice", "White ice", "Drifting One year middle ice",
                "Nilas"];
                
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i>' + labels[i] + "<br>";
        }
        return div;
    };
    legend.addTo(map);
}

function createIceTypeGroup(dataGeoJSON) {
    function featureStyle(feature) {
        return {
            weight: 3,
            opacity: 1,
            color: '#72767F',
            dashArray: '',
            fillOpacity: 0.0
        };
    }
    let ice_types = ['thin_ice', 'one_year_middle', 'grey_ice', 'white_ice', 'd_one_year_middle', 'nilas'];
    
    featureGroupLayers = [];
    ice_types.forEach(i => {
        function typeFilter(feature) {
            if (feature.properties.ice_type === i)
                return true;
        }
        featureGroupLayers.push(L.geoJson(dataGeoJSON, { filter: typeFilter, style: featureStyle }));
    });
    return featureGroupLayers;
}

function timeFunction() {
    var str = "";

    var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    var now = new Date();

    str += "Today is: " + days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear() + " " + now.getHours() +":" + now.getMinutes() + ":" + now.getSeconds();
    document.getElementById("timeDate").innerHTML = str;
}

function chooseMapLayer(positronMapLayer, hybridMapLayer){

    // Get the storedValue
    var previousValue = $(this).data('storedValue');
    // if previousValue = true then
    //     Step 1: toggle radio button check mark.
    //     Step 2: save data-StoredValue as false to indicate radio button is unchecked.
    if (previousValue) {
        $(this).prop('checked', !previousValue);
        $(this).data('storedValue', !previousValue);
    }
    // If previousValue is other than true
    //    Step 1: save data-StoredValue as true to for currently checked radio button.
    //    Step 2: save data-StoredValue as false for all non-checked radio buttons. 
    else{
        $(this).data('storedValue', true);
        $('input[name="mapLayerType"]').data("storedValue", false);
    }

    var radios = document.getElementsByName('mapLayerType');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            
            if(radios[i].value == 'positron'){
                // alert(radios[i].value);
                map.removeLayer(positronMapLayer);
                map.removeLayer(hybridMapLayer);
                positronMapLayer.addTo(map);
            }
            else if(radios[i].value == 'hybrid'){
                // alert(radios[i].value);
                map.removeLayer(hybridMapLayer);
                map.removeLayer(positronMapLayer);
                hybridMapLayer.addTo(map);
            }
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}

function measure(map) {
    var plugin = L.control.measure({
        //  control position
        position: 'bottomright',
        //  weather to use keyboard control for this plugin
        keyboard: true,
        //  shortcut to activate measure
        activeKeyCode: 'M'.charCodeAt(0),
        //  shortcut to cancel measure, defaults to 'Esc'
        cancelKeyCode: 27,
        //  line color
        lineColor: 'red',
        //  line weight
        lineWeight: 3,
        //  line dash
        lineDashArray: '6, 6',
        //  line opacity
        lineOpacity: 1,
        //  distance formatter
        // formatDistance: function (val) {
        //   return Math.round(1000 * val / 1609.344) / 1000 + 'mile';
        // }
      }).addTo(map)
}