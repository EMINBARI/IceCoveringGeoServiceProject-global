$(document).ready(function(){

    map = L.map('mapid',{zoomControl:false}).setView([54.153646, 147.832428], 5);
    var positronMapLayer = L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}@2x.png?key=xKZmFY8RbwWhRaJXDIBE', {
        attribution: '<a>&copy; Anastasia Volkova & Emin Bariev |</a> <a id="timeDate"></a></b>',
    });

    positronMapLayer.addTo(map);



    var wellmaxzoom = 6;       
    
    function loadGeoJson(data) {
        console.log(data);
        //geojsonLayerWells.addData(data);
        var geojsonLayerWells = new L.GeoJSON(data);
        map.addLayer(geojsonLayerWells);
    };

    map.on('moveend', function(){
    if(map.getZoom() > wellmaxzoom){
        var geoJsonUrl ='http://localhost:8080/geoserver/web_gis_project/ows'; 
        var defaultParameters = {
            service: 'WFS',
            version: '1.0.0',
            request: 'getFeature',
            typeName: 'web_gis_project:ice_data_1',
            maxFeatures: 50,
            outputFormat: 'application/json'
            };

        var customParams = {
            bbox: map.getBounds().toBBoxString(),
            };
        var parameters = L.Util.extend(defaultParameters);
        console.log(geoJsonUrl + L.Util.getParamString(parameters));
       

        $.ajax({
            url: geoJsonUrl + L.Util.getParamString(parameters),
            datatype: 'jsonp',
            jsonCallback: 'getJson',
            success: loadGeoJson
            });
        }else{
        map.removeLayer(geojsonLayerWells);
        };
    });
});






// $(document).ready(function(){

//     map = L.map('mapid',{zoomControl:false}).setView([54.153646, 147.832428], 5);
//     var positronMapLayer = L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}@2x.png?key=xKZmFY8RbwWhRaJXDIBE', {
//         attribution: '<a>&copy; Anastasia Volkova & Emin Bariev |</a> <a id="timeDate"></a></b>',
//     });

//     positronMapLayer.addTo(map);



//     var wellmaxzoom = 6;       
//     var geojsonLayerWells = new L.GeoJSON();

//     function loadGeoJson(data) {
//         console.log(data);
//         geojsonLayerWells.addData(data);
//         map.addLayer(geojsonLayerWells);
//     };

//     map.on('moveend', function(){
//     if(map.getZoom() > wellmaxzoom){
//         var geoJsonUrl ='http://localhost:8080/geoserver/web_gis_project/wfs'; 
//         var defaultParameters = {
//             service: 'WFS',
//             version: '1.0.0',
//             request: 'GetFeature',
//             typeName: 'web_gis_project:ice_data_1',
//             maxFeatures: 3000,
//             outputFormat: 'application/json'
//             };

//         var customParams = {
//             bbox: map.getBounds().toBBoxString(),
//             };
//         var parameters = L.Util.extend(defaultParameters, customParams);
//         console.log(geoJsonUrl + L.Util.getParamString(parameters));
       

//         $.ajax({
//             url: geoJsonUrl + L.Util.getParamString(parameters),
//             datatype: 'json',
//             jsonCallback: 'getJson',
//             success: loadGeoJson
//             });
//         }else{
//         map.removeLayer(geojsonLayerWells);
//         };
//     });
// });