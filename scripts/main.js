var map, heatmap;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 34.364732, lng: -89.538443},
          mapTypeId: 'satellite'
        });

        // heatmap = new google.maps.visualization.HeatmapLayer({
        //   data: getPoints(),
        //   map: map
        // });
        //   }
          

          var outerCoords = [
          {lat: 34.365984, lng: -89.534889},
          {lat: 34.365249, lng: -89.533870,
          {lat: 34.364674, lng: -89.535082}
        ];


          var innerCoords = [
          {lat: 34.365900, lng: -89.534980},
          {lat: 34.365240, lng: -89.534020},
          {lat: 34.364780, lng: -89.535087}
        ];

         var bermudaTriangle = new google.maps.Polygon({
          paths: [outerCoords, innerCoords],
          strokeColor: '#FFC107',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FFC107',
          fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map);
      }
        // function getPoints() {
        //   return [
        //   new google.maps.LatLng(34.370005, -89.548021)
        //   ];
        // }
