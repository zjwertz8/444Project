var map, heatmap;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 34.364732, lng: -89.538443},
          mapTypeId: 'satellite'
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getPoints(),
          map: map
        });
          }


        function getPoints() {
          return [
          new google.maps.LatLng(34.370005, -89.548021)
          ];
        }
