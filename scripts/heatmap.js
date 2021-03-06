
        var map = new google.maps.Map(d3.select("#map").node(), {
                       zoom: 15,
                       center: new google.maps.LatLng(34.364732, -89.538443),
                       mapTypeId: google.maps.MapTypeId.ROADMAP
                     });

        //array of existing polygons
        var existingPolygons = [];
        var existingZones = [];



        d3.csv("FullDataRaw.csv", function(data) {

          //rollup with parking lot
          var lotsRolledUp = d3.nest()
          .key(function(d) {return d.CLM_DESCRIPTION;})
          .rollup(function(v) {return v.length;})
          .entries(data)

          //rollup with parking lot and year
          var lotsRolledUpY = d3.nest()
          .key(function(d) {return d.CLM_DESCRIPTION;})
          .key(function(d) {return d.Year;})
          .rollup(function(v) {return v.length;})
          .entries(data)

          //rollup with parking lot and year and month
          var lotsRolledUpM = d3.nest()
          .key(function(d) {return d.CLM_DESCRIPTION;})
          .key(function(d) {return d.Year;})
          .key(function(d) {return d.Month;})
          .rollup(function(v) {return v.length;})
          .entries(data)

          //rollup with parking lot and year and month and day
          var lotsRolledUpD = d3.nest()
          .key(function(d) {return d.CLM_DESCRIPTION;})
          .key(function(d) {return d.Year;})
          .key(function(d) {return d.Month;})
          .key(function(d) {return d.Day;})
          .rollup(function(v) {return v.length;})
          .entries(data)

        //Info Windows for labels
        var infowindow = new google.maps.InfoWindow({
          content: ''
        });

        var infowindow2 = new google.maps.InfoWindow({
          content: ''
        })

        //different arrays for populating lists, depends on selection
        var years = ["All", "2014", "2015", "2016", "2017"];
        var days = ["All"];
        var later = ["All", "2015", "2016", "2017"];
        var early = ["All", "2014", "2015", "2016"];
        var monthsSelection14 = ["All", "July", "August", "October", "December"];
        var months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var months14 = ["All", "July", "August", "September", "October", "November", "December"];
        var months17 = ["All", "January", "February", "March", "April", "May", "June"];

        var months30 = ["All", ]
        var noFeb = ["All", "January", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var no30 = ["All", "January", "March", "May", "July", "August", "October", "December"];


        //dictionary for corresponding month day
        var monthDict = {
          "January" : 1,
          "February" : 2,
          "March" : 3,
          "April" : 4,
          "May" : 5,
          "June" : 6,
          "July" : 7,
          "August" : 8,
          "September" : 9,
          "October" : 10,
          "November" : 11,
          "December" : 12
        }

        //dictionary for number of days in month
        var monthMaxDayDict = {
          "January": 31,
          "February": 28,
          "March" : 31,
          "April" : 30,
          "May" : 31,
          "June" : 30,
          "July" : 31,
          "August" : 31,
          "September" : 30,
          "October" : 31,
          "November" : 30,
          "December" : 31
        }

      //label for year
        var yearSelectLabel = d3.select('#gradient')
          .append('label')
          .attr('class', 'select-label')
          .attr('for', 'year')
          .text('Year:').style('color','#C8102E').style('font-family','Roboto, sans-serif')

        //year drop down
        var yearSelect = d3.select('#gradient')
          .append('select')
            .attr('class','select styled-select blue semi-square')
            .attr('id', 'year')
            .on('change',onchange)

        var options = yearSelect
          .selectAll('option')
          .data(years).enter()
          .append('option')
            .text(function (d) { return d; });


        //label for month
        var monthSelectLabel = d3.select('#gradient')
          .append('label')
          .attr('class', 'select-label')
          .attr('id', 'monthSelect')
          .attr('for', 'month')
          .text('Month:').style('color','#C8102E').style('font-family','Roboto, sans-serif')

        //month drop down
        var monthSelect = d3.select('#gradient')
          .append('select')
            .attr('class','select styled-select blue semi-square')
            .attr('id', 'month')
            .attr('disabled', 'disabled')
            .on('change',onchange)

        var options = monthSelect
          .selectAll('option')
          .data(months).enter()
          .append('option')
          .text(function (d) { return d; });

        //label for day
        var daySelectLabel = d3.select('#gradient')
          .append('label')
          .attr('class', 'select-label')
          .attr('for', 'day')
          .text('Day:').style('color','#C8102E').style('font-family','Roboto, sans-serif')

        //day drop down
        var daySelect = d3.select('#gradient')
          .append('select')
          .attr('class','select styled-select blue semi-square')
          .attr('id', 'day')
          .attr('disabled', 'disabled')
          .on('change',onchange)


        var options = daySelect
          .selectAll('option')
          .data(days).enter()
          .append('option')
          .text(function (d) { return d; });

        //label for check zone
        var zoneCheckLabel = d3.select(".totalTickets")
        .append('label')
        .attr('class', 'check-label')
        .attr('for', 'zoneToggle')
        .text('Toggle Parking Zones:')

        //Zone Toggle
        var zoneCheck = d3.select('.totalTickets')
        .append('input')
        .attr('id', 'zoneToggle')
        .attr('type', 'checkbox')
        .on('change', onchange)

        //label for jackson toggle
        var jacksonCheckLabel = d3.select(".totalTickets")
        .append('label')
        .attr('class', 'check-label')
        .attr('for', 'jacksonToggle')
        .text('Toggle Jackson Avenue:')

        //Jackson Ave Toggle
        var jacksonCheck = d3.select('.totalTickets')
        .append('input')
        .attr('id', 'jacksonToggle')
        .attr('type', 'checkbox')
        .on('change', onchange)




        //function for when drop down is changed
        function onchange()
        {
          selectYear = d3.select("#year").property("value");
          selectMonth = d3.select("#month").property("value");
          selectDay = d3.select("#day").property("value");

          //if Jackson toggle is checked
          if(jacksonCheck._groups[0][0].checked == true)
          {
            if(infowindow)
          {
            infowindow.close();
          }

          //if month is all, month and day is "All", disable day drop down
          if(selectYear == "All")
          {
            //set all options to all
            selectYear = "All";
            selectMonth = "All";
            selectDay = "All";
            //disable month and day drop downs
            d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
            d3.select("#month").attr('disabled', 'disabled').property('value', 'All');
            //remove previous options and replace with new ones
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });

          }
          //break down into years
          else if(selectYear == 2014)
          {
            if(selectMonth == "All")
            {
              selectMonth = "All";
              selectDay = "All";
              //enable month drop down, not day
              d3.select("#month").attr('disabled', null);
              d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
              //based on 2014 selection, remove months and add months available for that year
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months14).enter().append('option').text(function (d) { return d });
              //based on 2014 selection, remove years and add years available for all (all of them)
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });
              //select month and year
              d3.select("#month").property("value", selectMonth);
              d3.select("#year").property('value', selectYear);
            }
            //they selected a month
            else
            {
              //enable month and day dropdown
              d3.select("#day").attr('disabled', null);
              d3.select("#month").attr('disabled', null);
              //based on 2014 selection, remove months and add months available for that year
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months14).enter().append('option').text(function (d) { return d });
              //based on 2014 selection, remove years and add years available for those months
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(early).enter().append('option').text(function (d) { return d });
              //select month and year
              d3.select("#month").property("value", selectMonth);
              d3.select("#year").property("value", selectYear);
              var newDays = ["All"];
                //push number of days to newDays array, depending on month
                for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
                {
                  newDays.push(i);
                }
                //change spelt out month with corresponding number
                selectMonth = monthDict[selectMonth];
                //remove previous options
                daySelect.selectAll('option').remove()
                //replace new options
                daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
                //select day
                d3.select("#day").property("value", selectDay);
            }
          } //end if year = 2014
       else if (selectYear == 2015 || selectYear == 2016)
        {
          if(selectMonth == "All")
          {
            selectMonth = "All";
            selectDay = "All";
            d3.select("#month").attr('disabled', null);
            d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
            monthSelect.selectAll('option').remove();
            monthSelect.selectAll('option').data(months).enter().append('option').text(function (d) { return d });
            d3.select("#month").property("value", selectMonth);
            d3.select("#day").property("value", "All");
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });
              d3.select("#year").property('value', selectYear);
          }
          else
          {
            //if these months, they have different yearSelect than 7-12
            if(selectMonth == "January" || selectMonth == "February" || selectMonth == "March" || selectMonth == "April" || selectMonth == "May" || selectMonth == "June")
            {
            //enable month and day dropdown
            d3.select("#day").attr('disabled', null);
            d3.select("#month").attr('disabled', null);
            //based on 2015 or 2016 selection, remove months and add months available for these years
            monthSelect.selectAll('option').remove();
            monthSelect.selectAll('option').data(months).enter().append('option').text(function (d) { return d });
           //based on 2015 or 2016 selection, remove years and add years available for those months (1-6)
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(later).enter().append('option').text(function (d) { return d });
            d3.select("#month").property("value", selectMonth);
            d3.select("#year").property("value", selectYear);

            var newDays = ["All"];
            //push number of days to newDays array, depending on month
            for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
            {
              newDays.push(i);
            }
            //change spelt out month with corresponding number
            selectMonth = monthDict[selectMonth];
            //remove previous options
            daySelect.selectAll('option').remove()
            //replace new options
            daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
            //select day
            d3.select("#day").property("value", selectDay);
            }
            //month between 7-12 was selected
            else
            {
              //enable month and day dropdown
            d3.select("#day").attr('disabled', null);
            d3.select("#month").attr('disabled', null);
            //based on 2015 or 2016 selection, remove months and add months available for these years
            monthSelect.selectAll('option').remove();
            monthSelect.selectAll('option').data(months).enter().append('option').text(function (d) { return d });
            //based on 2015 or 2016 selection, remove years and add years available for those months (7-12)
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(early).enter().append('option').text(function (d) { return d });
            d3.select("#month").property("value", selectMonth);
            d3.select("#year").property("value", selectYear);


            var newDays = ["All"];
            //push number of days to newDays array, depending on month
            for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
            {
              newDays.push(i);
            }
            //change spelt out month with corresponding number
            selectMonth = monthDict[selectMonth];
            //remove previous options
            daySelect.selectAll('option').remove()
            //replace new options
            daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
            //select day
            d3.select("#day").property("value", selectDay);
            }
          }

        } //end year = 2015 or 2016
        else //2017
          {
            if(selectMonth == "All")
            {
              selectMonth = "All";
              selectDay = "All";
              d3.select("#month").attr('disabled', null);
              d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months17).enter().append('option').text(function (d) { return d });
              d3.select("#month").property('value', selectMonth);
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });
              console.log(selectYear);
              d3.select("#year").property('value', selectYear);
            }
            else
             {
              d3.select("#day").attr('disabled', null);
              d3.select("#month").attr('disabled', null);
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(later).enter().append('option').text(function (d) { return d });
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months17).enter().append('option').text(function (d) { return d });
              d3.select("#month").property("value", selectMonth);
              d3.select("#year").property("value", selectYear);
              var newDays = ["All"];
              //push number of days to newDays array, depending on month
              for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
              {
                newDays.push(i);
              }
              //change spelt out month with corresponding number
              selectMonth = monthDict[selectMonth];
              //remove previous options
              daySelect.selectAll('option').remove()
              //replace new options
              daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
              //select day
              d3.select("#day").property("value", selectDay);
            }
          }

          if (zoneCheck._groups[0][0].checked)
        {
          buildZoneOverlay();
        }
        else
        {
          //clear polygons
          for(var i = 0; i < existingZones.length; i++){
              existingZones[i].setMap(null);
          }
        }
          buildHeatmap(selectYear,selectMonth, selectDay);
          }
          //if jackson toggle is not checked
          else if(jacksonCheck._groups[0][0].checked == false)
          //toggle not checked
          {

          if(infowindow)
          {
            infowindow.close();
          }

          //if month is all, month and day is "All", disable day drop down
          if(selectYear == "All")
          {

            selectYear = "All";
            selectMonth = "All";
            selectDay = "All";
            d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
            d3.select("#month").attr('disabled', 'disabled').property('value', 'All');
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });

          }
          else if(selectYear == 2014)
          {
            if(selectMonth == "All")
            {
              selectMonth = "All";
              selectDay = "All";
              d3.select("#month").attr('disabled', null);
              d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months14).enter().append('option').text(function (d) { return d });
              d3.select("#month").property("value", selectMonth);
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });
              d3.select("#year").property('value', selectYear);
              console.log(selectYear);
              console.log(selectMonth);
            }
            else
            {
              d3.select("#day").attr('disabled', null);
              d3.select("#month").attr('disabled', null);
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(early).enter().append('option').text(function (d) { return d });
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months14).enter().append('option').text(function (d) { return d });
              d3.select("#month").property("value", selectMonth);
              d3.select("#year").property("value", selectYear);
              var newDays = ["All"];
                //push number of days to newDays array, depending on month
                for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
                {
                  newDays.push(i);
                }
                //change spelt out month with corresponding number
                selectMonth = monthDict[selectMonth];
                //remove previous options
                daySelect.selectAll('option').remove()
                //replace new options
                daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
                //select day
                d3.select("#day").property("value", selectDay);
                console.log(selectMonth);
            }
          }
       else if (selectYear == 2015 || selectYear == 2016)
        {
          if(selectMonth == "All")
          {
            selectMonth = "All";
            selectDay = "All";
            d3.select("#month").attr('disabled', null);
            d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
            monthSelect.selectAll('option').remove();
            monthSelect.selectAll('option').data(months).enter().append('option').text(function (d) { return d });
            d3.select("#month").property("value", selectMonth);
            d3.select("#day").property("value", "All");
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });
              d3.select("#year").property('value', selectYear);
          }
          else
          {
            if(selectMonth == "January" || selectMonth == "February" || selectMonth == "March" || selectMonth == "April" || selectMonth == "May" || selectMonth == "June")
            {

            d3.select("#day").attr('disabled', null);
            d3.select("#month").attr('disabled', null);
            monthSelect.selectAll('option').remove();
            monthSelect.selectAll('option').data(months).enter().append('option').text(function (d) { return d });
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(later).enter().append('option').text(function (d) { return d });
            d3.select("#month").property("value", selectMonth);
            d3.select("#year").property("value", selectYear);


            var newDays = ["All"];
            //push number of days to newDays array, depending on month
            for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
            {
              newDays.push(i);
            }
            //change spelt out month with corresponding number
            selectMonth = monthDict[selectMonth];
            //remove previous options
            daySelect.selectAll('option').remove()
            //replace new options
            daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
            //select day
            d3.select("#day").property("value", selectDay);
            }
            else
            {
            d3.select("#day").attr('disabled', null);
            d3.select("#month").attr('disabled', null);
            monthSelect.selectAll('option').remove();
            monthSelect.selectAll('option').data(months).enter().append('option').text(function (d) { return d });
            yearSelect.selectAll('option').remove();
            yearSelect.selectAll('option').data(early).enter().append('option').text(function (d) { return d });
            d3.select("#month").property("value", selectMonth);
            d3.select("#year").property("value", selectYear);


            var newDays = ["All"];
            //push number of days to newDays array, depending on month
            for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
            {
              newDays.push(i);
            }
            //change spelt out month with corresponding number
            selectMonth = monthDict[selectMonth];
            //remove previous options
            daySelect.selectAll('option').remove()
            //replace new options
            daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
            //select day
            d3.select("#day").property("value", selectDay);
            }
          }
        }
        else //2017
          {
            if(selectMonth == "All")
            {
              selectMonth = "All";
              selectDay = "All";
              d3.select("#month").attr('disabled', null);
              d3.select("#day").attr('disabled', 'disabled').property('value', 'All');
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months17).enter().append('option').text(function (d) { return d });
              d3.select("#month").property('value', selectMonth);
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(years).enter().append('option').text(function (d) { return d });
              console.log(selectYear);
              d3.select("#year").property('value', selectYear);
            }
            else
             {
              d3.select("#day").attr('disabled', null);
              d3.select("#month").attr('disabled', null);
              yearSelect.selectAll('option').remove();
              yearSelect.selectAll('option').data(later).enter().append('option').text(function (d) { return d });
              monthSelect.selectAll('option').remove();
              monthSelect.selectAll('option').data(months17).enter().append('option').text(function (d) { return d });
              d3.select("#month").property("value", selectMonth);
              d3.select("#year").property("value", selectYear);
              var newDays = ["All"];
              //push number of days to newDays array, depending on month
              for(var i = 1; i <= monthMaxDayDict[selectMonth]; i++)
              {
                newDays.push(i);
              }
              //change spelt out month with corresponding number
              selectMonth = monthDict[selectMonth];
              //remove previous options
              daySelect.selectAll('option').remove()
              //replace new options
              daySelect.selectAll('option').data(newDays).enter().append('option').text(function (d) { return d; });
              //select day
              d3.select("#day").property("value", selectDay);
            }
          }

          buildHeatmap(selectYear,selectMonth, selectDay);
        }
      if (zoneCheck._groups[0][0].checked)
        {
          buildZoneOverlay();
        }
        else
        {
          //clear polygons
          for(var i = 0; i < existingZones.length; i++)
          {
              existingZones[i].setMap(null);
          }
        }


        };

         function buildZoneOverlay()
        {

          lotAndLatLngDictZ =
          {
            "RESIDENTIAL EAST ZONE": new google.maps.LatLng(34.36921030338676, -89.53345119953156),
            "RESIDENTIAL CENTRAL ZONE": new google.maps.LatLng(34.371689880464444, -89.53582763671875),
            "RESIDENTIAL SOUTH ZONE": new google.maps.LatLng(34.36515426553087, -89.54214692115784),
            "COMMUTER ZONE": new google.maps.LatLng(34.363648699327484, -89.54376697540283)



          }

          function addInfoWindow(lotName) {
            if(infowindow)
            {
              infowindow.close();
            }


            if(infowindow2)
            {
              infowindow2.close();
            }

            infowindow2.setContent("<div id='iw-container'>"
              + "<div id='iw-title'>"
              + "<span class='lot-name'>" + lotName + "</span>"
              + "</div>"
              + "</div>");

            infowindow2.setPosition(lotAndLatLngDictZ[lotName]);
            infowindow2.open(map);
          }

          //clear polygons
          for(var i = 0; i < existingZones.length; i++){
              existingZones[i].setMap(null);
          }

          //#top right zone
          residentialEastPoly = new google.maps.Polygon({
          paths: window.LatLng.residentialEast,
          fillColor: "#00FFCC",
          fillOpacity: 0.50,
          strokeWeight: 0.6
        });

          //#top middle zone
          residentialCentralPoly = new google.maps.Polygon({
          paths: window.LatLng.residentialCentral,
          fillColor: "#885511",
          fillOpacity: 0.50,
          strokeWeight: 0.6
        });

          //#left middle zone
          residentialSouthPoly = new google.maps.Polygon({
          paths: window.LatLng.residentialSouth,
          fillColor: "#FF4422",
          fillOpacity: 0.50,
          strokeWeight: 0.6
        });

          //#commuter
          commuterPoly = new google.maps.Polygon({
          paths: [window.LatLng.commuter1, window.LatLng.commuter2],
          fillColor: "#005511",
          fillOpacity: 0.50,
          strokeWeight: 0.6
        });


        existingZones.push(residentialEastPoly);
        existingZones.push(residentialCentralPoly);
        existingZones.push(residentialSouthPoly);
        existingZones.push(commuterPoly);

        residentialEastPoly.setMap(map);
        residentialCentralPoly.setMap(map);
        residentialSouthPoly.setMap(map);
        commuterPoly.setMap(map);


        google.maps.event.addListener(residentialEastPoly, 'click', function() {
          addInfoWindow("RESIDENTIAL EAST ZONE");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(residentialEastPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

         google.maps.event.addListener(residentialCentralPoly, 'click', function() {
          addInfoWindow("RESIDENTIAL CENTRAL ZONE");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(residentialCentralPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });


        google.maps.event.addListener(residentialSouthPoly, 'click', function() {
          addInfoWindow("RESIDENTIAL SOUTH ZONE");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(residentialSouthPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });


        google.maps.event.addListener(commuterPoly, 'click', function() {
          addInfoWindow("COMMUTER ZONE");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(commuterPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });


        }


        // function to find key in array, give correct fill color
        function fillColor(lotCount, lotName, year, month="All", day="All")
        {
          //if jackson ave toggle clicked
          if(jacksonCheck._groups[0][0].checked)
          {
            total = 0;
          for(i = 0; i < lotCount.length; i++)
          {
            //skip jackson ave because button is clicked
            if(lotCount[i].key == "JACKSON AVENUE CENTER")
            {
              continue;
            }
            //match parking lot name
            if(lotCount[i].key == lotName)
            {
              for(j = 0; j < lotCount[i].values.length; j++)
                {
                    //if year is all accumulate values of year rollup data
                    if(year == "All"){
                        total += lotCount[i].values[j].value;
                    }
                    else if(year == lotCount[i].values[j].key)
                    {
                        if(month != "All")
                        {
                            for(k = 0; k < lotCount[i].values[j].values.length; k++)
                            {
                                //go through years and find correct month
                                if (month == lotCount[i].values[j].values[k].key)
                                {
                                   if(day != "All")
                                   {
                                      //go through years and months and days
                                      for(l = 0; l < lotCount[i].values[j].values[k].values.length; l++)
                                      {
                                        //if correct day
                                        if (day == lotCount[i].values[j].values[k].values[l].key)
                                        {
                                        //total up day value based off year and month in day rollup data
                                        total += lotCount[i].values[j].values[k].values[l].value;
                                        }
                                      }
                                   }
                                   else
                                   {
                                     //get value of correct year and month based off month rollup data
                                     total = lotCount[i].values[j].values[k].value;
                                   }
                                }
                            }
                        }
                        else
                        {
                          //total equals selected years value in year rollup data
                          total = lotCount[i].values[j].value;
                        }
                    }
                }
            }
          }
          return total;
          }
          else
          {
          total = 0;
          for(i = 0; i < lotCount.length; i++)
          {
            if(lotCount[i].key == lotName)
            {
              for(j = 0; j < lotCount[i].values.length; j++)
                {
                    if(year == "All"){
                        total += lotCount[i].values[j].value;
                    }
                    else if(year == lotCount[i].values[j].key)
                    {
                        if(month != "All")
                        {
                            for(k = 0; k < lotCount[i].values[j].values.length; k++)
                            {
                                if (month == lotCount[i].values[j].values[k].key)
                                {
                                   if(day != "All")
                                   {
                                      for(l = 0; l < lotCount[i].values[j].values[k].values.length; l++)
                                      {
                                        if (day == lotCount[i].values[j].values[k].values[l].key)
                                        {
                                        total += lotCount[i].values[j].values[k].values[l].value;
                                        }
                                      }
                                   }
                                   else
                                   {
                                     total = lotCount[i].values[j].values[k].value;
                                   }
                                }
                            }
                        }
                        else
                        {
                          total = lotCount[i].values[j].value;
                        }
                    }
                }
            }
          }
          return total;
        }
        }


       function totalCount(lotCount, year, month, day)
        {
          if(jacksonCheck._groups[0][0].checked)
          {
            total = 0
          for(i = 0; i < lotCount.length; i++)
          {
            if(lotCount[i].key == "JACKSON AVENUE CENTER")
            {
              continue;
            }
            if(year == "All") {

                total += lotCount[i].value;

            }
            else {
              for(j = 0; j < lotCount[i].values.length; j++)
                {
                    if(year == lotCount[i].values[j].key)
                    {
                        if(month != "All")
                        {
                            for(k = 0; k < lotCount[i].values[j].values.length; k++)
                            {
                                if (month == lotCount[i].values[j].values[k].key)
                                {
                                   if(day != "All")
                                   {
                                      for(l = 0; l < lotCount[i].values[j].values[k].values.length; l++)
                                      {
                                        if (day == lotCount[i].values[j].values[k].values[l].key)
                                        {

                                            total += lotCount[i].values[j].values[k].values[l].value;


                                        }
                                      }
                                   }
                                   else
                                   {

                                      total += lotCount[i].values[j].values[k].value;

                                   }
                                }
                            }
                        }
                    else
                    {

                           total  += lotCount[i].values[j].value

                        }
                    }
            }
          }
        }
          return total;
          }
        else
        {
         total = 0
          for(i = 0; i < lotCount.length; i++)
          {
            if(year == "All") {

                total += lotCount[i].value;

            }
            else {
              for(j = 0; j < lotCount[i].values.length; j++)
                {
                    if(year == lotCount[i].values[j].key)
                    {
                        if(month != "All")
                        {
                            for(k = 0; k < lotCount[i].values[j].values.length; k++)
                            {
                                if (month == lotCount[i].values[j].values[k].key)
                                {
                                   if(day != "All")
                                   {
                                      for(l = 0; l < lotCount[i].values[j].values[k].values.length; l++)
                                      {
                                        if (day == lotCount[i].values[j].values[k].values[l].key)
                                        {

                                            total += lotCount[i].values[j].values[k].values[l].value;


                                        }
                                      }
                                   }
                                   else
                                   {

                                      total += lotCount[i].values[j].values[k].value;

                                   }
                                }
                            }
                        }
                    else
                    {

                           total  += lotCount[i].values[j].value

                        }
                    }
            }
          }
        }
          return total;
        }

        }

        function maxGradient(lotCount, year, month, day)
        {

          //console.log(jacksonCheck._groups[0][0].checked)
          if(jacksonCheck._groups[0][0].checked)
          {
            currentMax = 0;
          for(i = 0; i < lotCount.length; i++)
          {
           if(lotCount[i].key == "JACKSON AVENUE CENTER")
            {
              continue;
            }
            if(year == "All")
            {

               if(lotCount[i].value > currentMax)
                          {
                            currentMax = lotCount[i].value;
                          }
            }
            else {
              for(j = 0; j < lotCount[i].values.length; j++)
                {
                    if(year == lotCount[i].values[j].key)
                    {
                        if(month != "All")
                        {
                            for(k = 0; k < lotCount[i].values[j].values.length; k++)
                            {
                                if (month == lotCount[i].values[j].values[k].key)
                                {
                                   if(day != "All")
                                   {
                                      for(l = 0; l < lotCount[i].values[j].values[k].values.length; l++)
                                      {
                                        if (day == lotCount[i].values[j].values[k].values[l].key)
                                        {
                                          if(lotCount[i].values[j].values[k].values[l].value > currentMax)
                                          {
                                            currentMax = lotCount[i].values[j].values[k].values[l].value;
                                          }
                                        }
                                      }
                                   }
                                   else
                                   {
                                     if(lotCount[i].values[j].values[k].value > currentMax)
                                     {
                                      currentMax = lotCount[i].values[j].values[k].value;
                                     }
                                   }
                                }
                            }
                        }
                    else
                    {
                          if(lotCount[i].values[j].value > currentMax)
                          {
                            currentMax = lotCount[i].values[j].value
                          }
                        }
                    }
            }
          }
        }
          return currentMax;
          }

          else
          {
          currentMax = 0;
          for(i = 0; i < lotCount.length; i++)
          {
            if(year == "All")
            {
               if(lotCount[i].value > currentMax)
                          {
                            currentMax = lotCount[i].value;
                          }
            }
            else {
              for(j = 0; j < lotCount[i].values.length; j++)
                {
                    if(year == lotCount[i].values[j].key)
                    {
                        if(month != "All")
                        {
                            for(k = 0; k < lotCount[i].values[j].values.length; k++)
                            {
                                if (month == lotCount[i].values[j].values[k].key)
                                {
                                   if(day != "All")
                                   {
                                      for(l = 0; l < lotCount[i].values[j].values[k].values.length; l++)
                                      {
                                        if (day == lotCount[i].values[j].values[k].values[l].key)
                                        {
                                          if(lotCount[i].values[j].values[k].values[l].value > currentMax)
                                          {
                                            currentMax = lotCount[i].values[j].values[k].values[l].value;
                                          }

                                        }
                                      }
                                   }
                                   else
                                   {
                                     if(lotCount[i].values[j].values[k].value > currentMax)
                                     {
                                      currentMax = lotCount[i].values[j].values[k].value;
                                     }
                                   }
                                }
                            }
                        }
                    else
                    {
                          if(lotCount[i].values[j].value > currentMax)
                          {
                            currentMax = lotCount[i].values[j].value
                          }
                        }
                    }
            }
          }
        }
          return currentMax;
        }
        }

        function buildLegend(max, newgradient, year, month, day)
        {
          //clear old legend
          d3.select('svg').remove();
          d3.selectAll('.legend-keys').remove();
          d3.selectAll('.totalCount').remove();

          //create 0 label, gradient svg
          d3.select('#map-container').append('text').attr('class', 'legend-keys').text('0');
          d3.select('#map-container').append('svg');

          //set svg height and lower it slightly
          var vis = d3.select('svg')

          vis
          .attr('height', 40)
          .attr('transform', 'translate(0, 2)')


          //create gradient

           var colorScale = d3.scaleLinear().domain([0, 25, 50, 75, 100])
             .range(["#FDBB2D", "#C6BC52", "#8FBE78", "#58BF9D", "#22C1C3"])
          var xScale = d3.scaleLinear().domain([0, 100]).range([0, 300])

          //create 100 rectangles, set first color to 0 and increase every rect
          var arr = d3.range(101);
          vis.selectAll('rect').data(arr).enter()
          .append('rect')
          .attr('x', function(d) { return xScale(d) })
                .attr('y', 20)
                .attr('height', 20)
                .attr('width', 5)
                .attr('fill', function(d) { return colorScale(d) })

          //add max label
          d3.select('#map-container').append('text').attr('class','legend-keys').text(max).style('transform','translateY(-50px)');

          //display total amount of tickets
          d3.select('.totalTickets')
                .append('text')
                .attr('class', 'totalCount')
                .text("Total Number of Tickets: " + totalCount(year == "All" ? lotsRolledUp : (yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD)), year, month, day))
                  .style('color', '#13294B')
            }


        //function to get rid of precious polygons and then add new ones
         function buildHeatmap(year="All", month="All", day="All"){
          //Did they select a year only?
          yearOnly = month == "All" && day == "All";
          //did they select a year and a month?
          yearAndMonth = day == "All";

            //ternary function to determine which dataset should be used for max gradient
            maxGradient1 = maxGradient(year == "All" ? lotsRolledUp : (yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD)), year, month, day);
          //create legend based off of selection
          buildLegend(maxGradient1, gradient, year, month, day);

        //separate domain into five equal bins, with respective colors
        var gradient = d3.scaleLinear().domain([0, maxGradient1 * 0.25, maxGradient1 * 0.50, maxGradient1 * 0.75, maxGradient1]).range(["#FDBB2D", "#C6BC52", "#8FBE78", "#58BF9D", "#22C1C3"]);

        //infoWindows for polygons
        function addInfoWindow(lotName) {
          //close any open windows
            if(infowindow)
            {
              infowindow.close();
            }


            if(infowindow2)
            {
              infowindow2.close();
            }

            //fill label with info
            infowindow.setContent("<div id='iw-container'>"
              + "<div id='iw-title'>"
              + "<span class='lot-name'>" + lotName + "</span>"
              + "</div>"
              + "<div class='ymd'>Year: " + year + " | Month: " + month + " | Day: " + day
              + "</div>"
              + "<div id='iw-content'>Tickets: <strong>" + fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), lotName, year, month, day) + "</strong></div></div>");

            infowindow.setPosition(lotAndLatLngDict[lotName]);
            infowindow.open(map);
        }

          //clear polygons
          for(var i = 0; i < existingPolygons.length; i++){
              existingPolygons[i].setMap(null);
          }

        //#1
        jacksonAvePoly = new google.maps.Polygon({
          paths: window.LatLng.jacksonAveLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "JACKSON AVENUE CENTER", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

          sororityPoly = new google.maps.Polygon({
          paths: window.LatLng.sororityLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "SORORITY LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
         });

          coliseumEastPoly = new google.maps.Polygon({
          paths: window.LatLng.coliseumEastLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "COLISEUM EAST LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
         });

           stockardRearPoly = new google.maps.Polygon({
          paths: window.LatLng.stockardRearLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "STOCKARD/MARTIN REAR LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6,
        });

          crosbyRearPoly = new google.maps.Polygon({
          paths: window.LatLng.crosbyRearLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "CROSBY REAR LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });



         //#6
          manningCenterPoly = new google.maps.Polygon({
          paths: window.LatLng.manningCenterLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "MANNING CENTER EAST", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

          residentialCollegePoly = new google.maps.Polygon({
          paths: window.LatLng.residentialCollegeLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "RESIDENTIAL COLLEGE/ALUMN DR LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

          magnoliaPoly = new google.maps.Polygon({
          paths: window.LatLng.magnoliaLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "MAGNOLIA DRIVE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

       stockardMartinFrontPoly = new google.maps.Polygon({
          paths: window.LatLng.stockardMartinFrontLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "STOCKARD/MARTIN FRONT LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6,
        });

          poolePoly = new google.maps.Polygon({
          paths: window.LatLng.pooleLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "POOLE DRIVE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });




         //#11
          meekPoly = new google.maps.Polygon({
          paths: window.LatLng.meekLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "MEEK LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

          bishopPoly = new google.maps.Polygon({
          paths: window.LatLng.bishopLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "BISHOP LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

          fordCenterPoly = new google.maps.Polygon({
          paths: window.LatLng.fordCenterLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "FORD CENTER LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

         kinardRearPoly = new google.maps.Polygon({
          paths: window.LatLng.kinardRearLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "KINARD REAR", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        circlePoly = new google.maps.Polygon({
          paths: [window.LatLng.outerCircleLatLng, window.LatLng.innerCircleLatLng],
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "CIRCLE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });



        //#16
        oldAthleticsPoly = new google.maps.Polygon({
          paths: window.LatLng.oldAthleticsLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "OLD ATHLETICS F/S", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        kincannonPoly = new google.maps.Polygon({
          paths: window.LatLng.kincannonLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "KINCANNON  HALL PARKING LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        womensTerraceLowerPoly = new google.maps.Polygon({
          paths: window.LatLng.womensTerraceLowerLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "WOMENS TERRACE-LOWER LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        hflFacultyPoly = new google.maps.Polygon({
          paths: window.LatLng.hflFacultyLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "HFL FACULTY/STAFF", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        oldAthleticMeterPoly = new google.maps.Polygon({
          paths: window.LatLng.oldAthleticMeterLatLng,
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "OLD ATHLETICS METER", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });




        //#21
        dormRowNorthPoly = new google.maps.Polygon({
          paths: [window.LatLng.dormRowNorthLatLng1, window.LatLng.dormRowNorthLatLng2, window.LatLng.dormRowNorthLatLng3],
          fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "DORM ROW NORTH", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        campusWalkPoly = new google.maps.Polygon({
          paths: window.LatLng.campusWalkLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "CAMPUS WALK APT. COMPLEX", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        ncpaFacultyPoly = new google.maps.Polygon({
          paths: window.LatLng.ncpaFacultyLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "NCPA FACULTY/STAFF LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        // allAmericanPoly = new google.maps.Polygon({
        //   paths: window.LatLng.allAmericanLatLng,
        //    fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "ALL AMERICAN DR.", year, month, day)),
        //   fillOpacity: 0.95,
        //   strokeWeight: 0.6
        // });

        coliseumWestPoly = new google.maps.Polygon({
          paths: window.LatLng.coliseumWestLatLng1,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "COLISEUM WEST LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });



        //#26
        womensTerraceUpperPoly = new google.maps.Polygon({
          paths: window.LatLng.womensTerraceUpperLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "WOMENS TERRACE-UPPER LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        turnerColiseumPoly = new google.maps.Polygon({
          paths: window.LatLng.turnerColiseumLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "TURNER COLISEUM LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        fratAlleyPoly = new google.maps.Polygon({
          paths: [window.LatLng.fratAlleyLatLng1, window.LatLng.fratAlleyLatLng2],
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "FRATERNITY ALLEY", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        theInnPoly = new google.maps.Polygon({
          paths: window.LatLng.theInnLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "THE INN AT OLE MISS", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        musicBuildingPoly = new google.maps.Polygon({
          paths: window.LatLng.musicBuildingLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "MUSIC BUILDING WEST LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });



        //#31
        southLotPoly = new google.maps.Polygon({
          paths: window.LatLng.southLotLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "SOUTH LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#32 No More Union Lot

        //#33 Sorority Row
        sororityRowPoly = new google.maps.Polygon({
          paths: window.LatLng.sororityRowLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "SORORITY ROW", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#34 Martindale Meter
        martindaleMeterPoly = new google.maps.Polygon({
          paths: window.LatLng.martindaleMeterLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "MARTINDALE METER", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#35 Kincannon Field
        kincannonFieldPoly = new google.maps.Polygon({
          paths: window.LatLng.kincannonFieldLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "KINCANNON FIELD", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });



      //#36 Athletics Admin Complex
        athleticsAdminPoly = new google.maps.Polygon({
          paths: [window.LatLng.athelticsAdminLatLng1, window.LatLng.athelticsAdminLatLng2],
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "ATHLETICS ADMIN COMPLEX", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#37 Womens Terrace Drive
        womensTerraceDrivePoly = new google.maps.Polygon({
          paths: window.LatLng.womensTerraceDriveLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "WOMENS TERRACE DRIVE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#38 Dorm Row West
        dormRowWestPoly = new google.maps.Polygon({
          paths: window.LatLng.dormRowWestLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "DORM ROW WEST", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

       //#39 Coliseum Circle
        coliseumCirclePoly = new google.maps.Polygon({
          paths: [window.LatLng.coliseumCircleLatLng1, window.LatLng.coliseumCircleLatLng2],
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "COLISEUM CIRCLE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#40 West Road Commuter
        westRoadCommuterPoly = new google.maps.Polygon({
          paths: window.LatLng.westRoadCommuterLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "WEST ROAD COMMUTER LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });




        //#41 Hill Drive
        hillDrivePoly = new google.maps.Polygon({
          paths: window.LatLng.hillDriveLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "HILL DRIVE LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#42 Farley Lamar
        farleyLamarPoly = new google.maps.Polygon({
          paths: window.LatLng.farleyLamarLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "FARLEY/LAMAR LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#43 Khayat Law
        khayatLawPoly = new google.maps.Polygon({
          paths: window.LatLng.khayatLawLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "KHAYAT LAW COMMUTER N W LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#44 Chiller
        chillerPoly = new google.maps.Polygon({
          paths: window.LatLng.chillerLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "CHILLER PARKING LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#45 Sorority Circle
        sororityCirclePoly = new google.maps.Polygon({
          paths: window.LatLng.sororityCircleLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "SORORITY CIRCLE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });





        //#46 Guyton
        guytonPoly = new google.maps.Polygon({
          paths: window.LatLng.guytonLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "GUYTON COMMUTER", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#47 Luckyday
        luckydayPoly = new google.maps.Polygon({
          paths: window.LatLng.luckydayLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "LUCKYDAY EAST LOTS", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#48 Turner East
        turnerEastPoly = new google.maps.Polygon({
          paths: window.LatLng.turnerEastLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "TURNER CENTER EAST LOT", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        //#49 Rebel Drive
        rebelDrivePoly = new google.maps.Polygon({
          paths: [window.LatLng.rebelDriveLatLng1, window.LatLng.rebelDriveLatLng2, window.LatLng.rebelDriveLatLng3],
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "REBEL DRIVE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });

        // //#50 North Lane
        northLanePoly = new google.maps.Polygon({
          paths: window.LatLng.northLaneLatLng,
           fillColor: gradient(fillColor(yearOnly?lotsRolledUpY:(yearAndMonth?lotsRolledUpM:lotsRolledUpD), "NORTH LANE", year, month, day)),
          fillOpacity: 0.95,
          strokeWeight: 0.6
        });


        lotAndLatLngDict = {
          //#1
          "JACKSON AVENUE CENTER" : new google.maps.LatLng(34.37066853965804, -89.54728603363037),
          "SORORITY LOT" : new google.maps.LatLng(34.369278197455856, -89.5319464802742),
          "COLISEUM EAST LOT" : new google.maps.LatLng(34.36365903178182, -89.539475440979),
          "STOCKARD/MARTIN REAR LOT" : new google.maps.LatLng(34.37050618657293, -89.5378178358078),
          "CROSBY REAR LOT" : new google.maps.LatLng(34.37159984944055, -89.53448116779327),

          //#6
          "MANNING CENTER EAST" : new google.maps.LatLng(34.36066700781123, -89.53498005867004),
          "RESIDENTIAL COLLEGE/ALUMN DR LOT" : new google.maps.LatLng(34.3679210419447, -89.52936619520187),
          "MAGNOLIA DRIVE" : new google.maps.LatLng(34.36608711253981, -89.54136371612549),
          "STOCKARD/MARTIN FRONT LOT" : new google.maps.LatLng(34.37173415795954, -89.53732967376709),
          "POOLE DRIVE" : new google.maps.LatLng(34.363890772536365, -89.54178214073181),

          //#11
          "MEEK LOT" : new google.maps.LatLng(34.3674288001151, -89.53739404678345),
          "BISHOP LOT" : new google.maps.LatLng(34.365564601387156, -89.53974902629852),
          "FORD CENTER LOT" : new google.maps.LatLng(34.36741994416282, -89.5282906293869),
          "KINARD REAR" : new google.maps.LatLng(34.369032449857976, -89.54127252101898),
          "CIRCLE" : new google.maps.LatLng(34.3660295477764, -89.53502297401428),

          //#16
          "OLD ATHLETICS F/S" : new google.maps.LatLng(34.36398819206313, -89.53863859176636),
          "KINCANNON  HALL PARKING LOT" : new google.maps.LatLng(34.36960364607053, -89.53856885433197),
          "WOMENS TERRACE-LOWER LOT" : new google.maps.LatLng(34.368850906327204, -89.53476279973984),
          "HFL FACULTY/STAFF" : new google.maps.LatLng(34.36704208934999, -89.53857153654099),
          "OLD ATHLETICS METER" : new google.maps.LatLng(34.364292258415695, -89.53848570585251),

          //#21
          "DORM ROW NORTH" : new google.maps.LatLng(34.36702511524971, -89.5376904308796),
          "CAMPUS WALK APT. COMPLEX" : new google.maps.LatLng(34.364366060716115, -89.54769641160965),
          "NCPA FACULTY/STAFF LOT" : new google.maps.LatLng(34.36204273213624, -89.54077363014221),
          // "ALL AMERICAN DR." : new google.maps.LatLng(34.364382666231094, -89.53818965703249),
          "COLISEUM WEST LOT" : new google.maps.LatLng(34.363375037542795, -89.54072856955463),

          //#26
          "WOMENS TERRACE-UPPER LOT" : new google.maps.LatLng(34.368250923426345, -89.53442215919495),
          "TURNER COLISEUM LOT" : new google.maps.LatLng(34.3626006913775, -89.53744769096375),
          "FRATERNITY ALLEY" : new google.maps.LatLng(34.36462141636153, -89.54166948795319),
          "THE INN AT OLE MISS" : new google.maps.LatLng(34.3674184679905, -89.52908992767334),
          "MUSIC BUILDING WEST LOT": new google.maps.LatLng(34.36443691089038, -89.53004479408264),


          //#31
          "SOUTH LOT" : new google.maps.LatLng(34.35723940805898, -89.53495860099792),
          //no union lot anymore #32
          "SORORITY ROW" : new google.maps.LatLng(34.36973943358368, -89.53249499201775),
          "MARTINDALE METER" : new google.maps.LatLng(34.364310708975786, -89.53793451189995),
          "KINCANNON FIELD" : new google.maps.LatLng(34.3700106391883, -89.53996427357197),

          //#36
          "ATHLETICS ADMIN COMPLEX" : new google.maps.LatLng(34.36365312750306, -89.53266531229019),
          "WOMENS TERRACE DRIVE" : new google.maps.LatLng(34.368902565040614, -89.5351342856884),
          "DORM ROW WEST" : new google.maps.LatLng(34.366802608093224, -89.54114712774754),
          "COLISEUM CIRCLE" : new google.maps.LatLng(34.362645711534306, -89.53979328274727),
          "WEST ROAD COMMUTER LOT" : new google.maps.LatLng(34.36536459983204, -89.5438702404499),

          //#41
          "HILL DRIVE LOT" : new google.maps.LatLng(34.36035407185799, -89.5385567843914),
          "FARLEY/LAMAR LOT" : new google.maps.LatLng(34.367169025036205, -89.53180029988289),
          "KHAYAT LAW COMMUTER N W LOT" : new google.maps.LatLng(34.36398081184497, -89.543437063694),
          "CHILLER PARKING LOT" : new google.maps.LatLng(34.367285259683335, -89.53067041933537),
          "SORORITY CIRCLE" : new google.maps.LatLng(34.36783764880203, -89.53239306807518),

          //#46
          "GUYTON COMMUTER" : new google.maps.LatLng(34.366522536056245, -89.5437066257),
          "LUCKYDAY EAST LOTS" : new google.maps.LatLng(34.36790185411465, -89.52928707003593),
          "TURNER CENTER EAST LOT" : new google.maps.LatLng(34.36375608251882, -89.53655518591404),
          "REBEL DRIVE" : new google.maps.LatLng(34.36729743663703, -89.53948751091957),
          "NORTH LANE" : new google.maps.LatLng(34.36921030338676, -89.53345119953156)
        }


        //Info Window event listeners, every polygon
        //#1 Jackson Ave
        google.maps.event.addListener(jacksonAvePoly, 'mouseover', function() {
        addInfoWindow("JACKSON AVENUE CENTER");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(jacksonAvePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#2 Sorority Lot
        google.maps.event.addListener(sororityPoly, 'mouseover', function() {
        addInfoWindow("SORORITY LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(sororityPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#3 Coliseum East
        google.maps.event.addListener(coliseumEastPoly, 'mouseover', function() {
        addInfoWindow("COLISEUM EAST LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(coliseumEastPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#4 Stockard/Martin Rear Lot
        google.maps.event.addListener(stockardRearPoly, 'mouseover', function() {
          addInfoWindow("STOCKARD/MARTIN REAR LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(stockardRearPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#5 Crosby Rear
        google.maps.event.addListener(crosbyRearPoly, 'mouseover', function() {
        addInfoWindow("CROSBY REAR LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(crosbyRearPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#6 Manning Center East
        google.maps.event.addListener(manningCenterPoly, 'mouseover', function() {
          addInfoWindow("MANNING CENTER EAST");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(manningCenterPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#7 Residential College
        google.maps.event.addListener(residentialCollegePoly, 'mouseover', function() {
          addInfoWindow("RESIDENTIAL COLLEGE/ALUMN DR LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(residentialCollegePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#8 Magnolia Drive
        google.maps.event.addListener(magnoliaPoly, 'mouseover', function() {
          addInfoWindow("MAGNOLIA DRIVE");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(magnoliaPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

      //#9 Stockard/Martin Front
        google.maps.event.addListener(stockardMartinFrontPoly, 'mouseover', function() {
          addInfoWindow("STOCKARD/MARTIN FRONT LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(stockardMartinFrontPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#10 Poole Drive
        google.maps.event.addListener(poolePoly, 'mouseover', function() {
        addInfoWindow("POOLE DRIVE");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(poolePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




       //#11 Meek Lot
        google.maps.event.addListener(meekPoly, 'mouseover', function() {
          addInfoWindow("MEEK LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(meekPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#12 Bishop Lot
        google.maps.event.addListener(bishopPoly, 'mouseover', function() {
          addInfoWindow("BISHOP LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(bishopPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#13 Ford Center
        google.maps.event.addListener(fordCenterPoly, 'mouseover', function() {
          addInfoWindow("FORD CENTER LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(fordCenterPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#14 Kinard Rear
        google.maps.event.addListener(kinardRearPoly, 'mouseover', function() {
        addInfoWindow("KINARD REAR");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(kinardRearPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#15 Circle
        google.maps.event.addListener(circlePoly, 'mouseover', function() {
          addInfoWindow("CIRCLE");
          this.setOptions({strokeWeight: 1.6});
        })

        google.maps.event.addListener(circlePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#16 Old Athletics F/S
        google.maps.event.addListener(oldAthleticsPoly, 'mouseover', function() {
          addInfoWindow("OLD ATHLETICS F/S");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(oldAthleticsPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#17 Kincannon Hall
        google.maps.event.addListener(kincannonPoly, 'mouseover', function() {
          addInfoWindow("KINCANNON  HALL PARKING LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(kincannonPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#18 Womens Terrace- Lower Lot
        google.maps.event.addListener(womensTerraceLowerPoly, 'mouseover', function() {
          addInfoWindow("WOMENS TERRACE-LOWER LOT");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(womensTerraceLowerPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#19 HFL F/S
        google.maps.event.addListener(hflFacultyPoly, 'mouseover', function() {
          addInfoWindow("HFL FACULTY/STAFF");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(hflFacultyPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#20 Old Athletics Meter
        google.maps.event.addListener(oldAthleticMeterPoly, 'mouseover', function() {
          addInfoWindow("OLD ATHLETICS METER");
          this.setOptions({strokeWeight: 1.6});
        })
        google.maps.event.addListener(oldAthleticMeterPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#21 Dorm Row North
        google.maps.event.addListener(dormRowNorthPoly, 'mouseover', function() {
        addInfoWindow("DORM ROW NORTH");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(dormRowNorthPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#22 Campus Walk
        google.maps.event.addListener(campusWalkPoly, 'mouseover', function() {
        addInfoWindow("CAMPUS WALK APT. COMPLEX");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(campusWalkPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#23 NCPA F/S
        google.maps.event.addListener(ncpaFacultyPoly, 'mouseover', function() {
        addInfoWindow("NCPA FACULTY/STAFF LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(ncpaFacultyPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

       // //#24 All American Drive
       //  google.maps.event.addListener(allAmericanPoly, 'mouseover', function() {
       //  addInfoWindow("ALL AMERICAN DR.");
       //  this.setOptions({strokeWeight: 1.6});
       //  });
       //  google.maps.event.addListener(allAmericanPoly, 'mouseout', function() {
       //  this.setOptions({strokeWeight: 0.6});
       //  });

        //#25 Coliseum West
        google.maps.event.addListener(coliseumWestPoly, 'mouseover', function() {
        addInfoWindow("COLISEUM WEST LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(coliseumWestPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#26 Womens Terrace- Upper Lot
        google.maps.event.addListener(womensTerraceUpperPoly, 'mouseover', function() {
        addInfoWindow("WOMENS TERRACE-UPPER LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(womensTerraceUpperPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#27 Turner Coliseum
        google.maps.event.addListener(turnerColiseumPoly, 'mouseover', function() {
        addInfoWindow("TURNER COLISEUM LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(turnerColiseumPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#28 Frat Alley
        google.maps.event.addListener(fratAlleyPoly, 'mouseover', function() {
        addInfoWindow("FRATERNITY ALLEY");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(fratAlleyPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#29 The Inn
        google.maps.event.addListener(theInnPoly, 'mouseover', function() {
        addInfoWindow("THE INN AT OLE MISS");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(theInnPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#30 Music Building
         google.maps.event.addListener(musicBuildingPoly, 'mouseover', function() {
        addInfoWindow("MUSIC BUILDING WEST LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(musicBuildingPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




       //#31 South Lot
        google.maps.event.addListener(southLotPoly, 'mouseover', function() {
        addInfoWindow("SOUTH LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(southLotPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#32 Union Lot not there anymore

        //#33 Sorority Row
        google.maps.event.addListener(sororityRowPoly, 'mouseover', function() {
        addInfoWindow("SORORITY ROW");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(sororityRowPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#34 Martindale Meter
        google.maps.event.addListener(martindaleMeterPoly, 'mouseover', function() {
        addInfoWindow("MARTINDALE METER");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(martindaleMeterPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#35 Kincannon Field
        google.maps.event.addListener(kincannonFieldPoly, 'mouseover', function() {
        addInfoWindow("KINCANNON FIELD");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(kincannonFieldPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#36 Athletics Admin
        google.maps.event.addListener(athleticsAdminPoly, 'mouseover', function() {
        addInfoWindow("ATHLETICS ADMIN COMPLEX");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(athleticsAdminPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#37 Womens Terrace Drive
        google.maps.event.addListener(womensTerraceDrivePoly, 'mouseover', function() {
        addInfoWindow("WOMENS TERRACE DRIVE");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(womensTerraceDrivePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#38 Dorm Row West
        google.maps.event.addListener(dormRowWestPoly, 'mouseover', function() {
        addInfoWindow("DORM ROW WEST");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(dormRowWestPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#39 Coliseum Circle
        google.maps.event.addListener(coliseumCirclePoly, 'mouseover', function() {
        addInfoWindow("COLISEUM CIRCLE");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(coliseumCirclePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#40 West Road Commuter
        google.maps.event.addListener(westRoadCommuterPoly, 'mouseover', function() {
        addInfoWindow("WEST ROAD COMMUTER LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(westRoadCommuterPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#41 Hill Drive
        google.maps.event.addListener(hillDrivePoly, 'mouseover', function() {
        addInfoWindow("HILL DRIVE LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(hillDrivePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#42 Farley/Lamar
        google.maps.event.addListener(farleyLamarPoly, 'mouseover', function() {
        addInfoWindow("FARLEY/LAMAR LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(farleyLamarPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#43 Khayat Law
        google.maps.event.addListener(khayatLawPoly, 'mouseover', function() {
        addInfoWindow("KHAYAT LAW COMMUTER N W LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(khayatLawPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#44 Chiller
        google.maps.event.addListener(chillerPoly, 'mouseover', function() {
        addInfoWindow("CHILLER PARKING LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(chillerPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#45 Sorority Circle
        google.maps.event.addListener(sororityCirclePoly, 'mouseover', function() {
        addInfoWindow("SORORITY CIRCLE");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(sororityCirclePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });




        //#46 Guyton
        google.maps.event.addListener(guytonPoly, 'mouseover', function() {
        addInfoWindow("GUYTON COMMUTER");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(guytonPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#47 Luckyday
        google.maps.event.addListener(luckydayPoly, 'mouseover', function() {
        addInfoWindow("LUCKYDAY EAST LOTS");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(luckydayPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#48 Turner East
        google.maps.event.addListener(turnerEastPoly, 'mouseover', function() {
        addInfoWindow("TURNER CENTER EAST LOT");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(turnerEastPoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#49 Rebel Drive
        google.maps.event.addListener(rebelDrivePoly, 'mouseover', function() {
        addInfoWindow("REBEL DRIVE");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(rebelDrivePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });

        //#50 North Lane
        google.maps.event.addListener(northLanePoly, 'mouseover', function() {
        addInfoWindow("NORTH LANE");
        this.setOptions({strokeWeight: 1.6});
        });
        google.maps.event.addListener(northLanePoly, 'mouseout', function() {
        this.setOptions({strokeWeight: 0.6});
        });






        //push polygons to existing polygon array
        //#1
        existingPolygons.push(jacksonAvePoly);
        existingPolygons.push(sororityPoly);
        existingPolygons.push(coliseumEastPoly);
        existingPolygons.push(stockardRearPoly);
        existingPolygons.push(crosbyRearPoly);

        //#6
        existingPolygons.push(manningCenterPoly);
        existingPolygons.push(residentialCollegePoly);
        existingPolygons.push(magnoliaPoly);
        existingPolygons.push(stockardMartinFrontPoly);
        existingPolygons.push(poolePoly);

        //#11
        existingPolygons.push(meekPoly);
        existingPolygons.push(bishopPoly);
        existingPolygons.push(fordCenterPoly);
        existingPolygons.push(kinardRearPoly);
        existingPolygons.push(circlePoly);

        //#16
        existingPolygons.push(oldAthleticsPoly);
        existingPolygons.push(kincannonPoly);
        existingPolygons.push(womensTerraceLowerPoly);
        existingPolygons.push(hflFacultyPoly);
        existingPolygons.push(oldAthleticMeterPoly);

        //#21
        existingPolygons.push(dormRowNorthPoly);
        existingPolygons.push(campusWalkPoly);
        existingPolygons.push(ncpaFacultyPoly);
        // existingPolygons.push(allAmericanPoly);
        existingPolygons.push(coliseumWestPoly);

        //#26
        existingPolygons.push(womensTerraceUpperPoly);
        existingPolygons.push(turnerColiseumPoly);
        existingPolygons.push(fratAlleyPoly);
        existingPolygons.push(theInnPoly);
        existingPolygons.push(musicBuildingPoly);


        //#31
        existingPolygons.push(southLotPoly);
        //no Union Lot anymore
        existingPolygons.push(sororityRowPoly);
        existingPolygons.push(martindaleMeterPoly);
        existingPolygons.push(kincannonFieldPoly);

        //#36
        existingPolygons.push(athleticsAdminPoly);
        existingPolygons.push(womensTerraceDrivePoly);
        existingPolygons.push(dormRowWestPoly);
        existingPolygons.push(coliseumCirclePoly);
        existingPolygons.push(westRoadCommuterPoly);

        //#41
        existingPolygons.push(hillDrivePoly);
        existingPolygons.push(farleyLamarPoly);
        existingPolygons.push(khayatLawPoly);
        existingPolygons.push(chillerPoly);
        existingPolygons.push(sororityCirclePoly);

        //#46
        existingPolygons.push(guytonPoly);
        existingPolygons.push(luckydayPoly);
        existingPolygons.push(turnerEastPoly);
        existingPolygons.push(rebelDrivePoly);
        existingPolygons.push(northLanePoly);

        //bind polygons to map
        //#1
        jacksonAvePoly.setMap(map);
        sororityPoly.setMap(map);
        coliseumEastPoly.setMap(map);
        stockardRearPoly.setMap(map);
        crosbyRearPoly.setMap(map);

        //#6
        manningCenterPoly.setMap(map);
        residentialCollegePoly.setMap(map);
        magnoliaPoly.setMap(map);
        stockardMartinFrontPoly.setMap(map);
        poolePoly.setMap(map);

        //#11
        meekPoly.setMap(map);
        bishopPoly.setMap(map);
        fordCenterPoly.setMap(map);
        kinardRearPoly.setMap(map);
        circlePoly.setMap(map);

        //#16
        oldAthleticsPoly.setMap(map);
        kincannonPoly.setMap(map);
        womensTerraceLowerPoly.setMap(map);
        hflFacultyPoly.setMap(map);
        oldAthleticMeterPoly.setMap(map);

        //#21
        dormRowNorthPoly.setMap(map);
        campusWalkPoly.setMap(map);
        ncpaFacultyPoly.setMap(map);
        // allAmericanPoly.setMap(map);
        coliseumWestPoly.setMap(map);


        //#26
        womensTerraceUpperPoly.setMap(map);
        turnerColiseumPoly.setMap(map);
        fratAlleyPoly.setMap(map);
        theInnPoly.setMap(map);
        musicBuildingPoly.setMap(map);


        //#31
        southLotPoly.setMap(map);
        //no Union Lot anymore
        sororityRowPoly.setMap(map);
        martindaleMeterPoly.setMap(map);
        kincannonFieldPoly.setMap(map);

        //#36
        athleticsAdminPoly.setMap(map);
        womensTerraceDrivePoly.setMap(map);
        dormRowWestPoly.setMap(map);
        coliseumCirclePoly.setMap(map);
        westRoadCommuterPoly.setMap(map);

        //#41
        hillDrivePoly.setMap(map);
        farleyLamarPoly.setMap(map);
        khayatLawPoly.setMap(map);
        chillerPoly.setMap(map);
        sororityCirclePoly.setMap(map);

        //#46
        guytonPoly.setMap(map);
        luckydayPoly.setMap(map);
        turnerEastPoly.setMap(map);
        rebelDrivePoly.setMap(map);
        northLanePoly.setMap(map);

        }

         //init with All
         buildHeatmap(d3.select("#year").property("value") == 'All' ? "All" : d3.select('#year').property('value'));
        });

        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(new google.maps.LatLng(34.364732, -89.538443));
        });
