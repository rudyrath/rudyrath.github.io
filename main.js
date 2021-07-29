// JS code

// Store the drop-down selection in ddSelection var
var ddSelection = document.getElementById("UsageType").value;


// Width and height of map
 var width = 1100;
 var height = 550;
 
 var lowColor = '#d9fab9'
 var highColor = '#1b3602'
 
 // D3 Projection
 var projection = d3.geoAlbersUsa()
   .translate([width / 2, height / 2]) // translate to center of screen
   .scale([1000]); // scale things down so see entire US
 
 // Define path generator
 var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
   .projection(projection); // tell path generator to use albersUsa projection
 
 //Create SVG element and append map to the SVG
 var svg = d3.select("body")
   .append("svg")
   .attr("width", width)
   .attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
.append("div")   
.attr("class", "tooltip")               
.style("opacity", 0);
 
 // Function to draw chart

function updateChart(ddSelection) {
 var csvFile = ddSelection + ".csv";

 d3.csv(csvFile, function(data) {
   var dataArray = [];
   for (var d = 0; d < data.length; d++) {
     dataArray.push(parseFloat(data[d].value))
   }
   var minVal = d3.min(dataArray)
   var maxVal = d3.max(dataArray)
   var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
   
   // Load GeoJSON data and merge with states data
   d3.json("AllState.json", function(json) {
 
     // Loop through each state data value in the .csv file
     for (var i = 0; i < data.length; i++) {
 
       // Grab State Name
       var dataState = data[i].state;
 
       // Grab data value 
       var dataValue = data[i].value;
 
       // Find the corresponding state inside the GeoJSON
       for (var j = 0; j < json.features.length; j++) {
         var jsonState = json.features[j].properties.name;
 
         if (dataState == jsonState) {
 
           // Copy the data value into the JSON
           json.features[j].properties.value = dataValue;
 
           // Stop looking through the JSON
           break;
         }
       }
     }
 
     // Bind the data to the SVG and create one path per GeoJSON feature
     svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("stroke", "#fff")
       .style("stroke-width", "1")
       .style("fill", function(d) { return ramp(d.properties.value) });
    

     // Tooltip 

     var tooltip = d3.select("div.tooltip");
     svg.selectAll("path")
     .data(json.features)
     .attr("d", path )
     .on("mouseover", function(d) {      
    	div.transition()        
      	   .duration(50)      
           .style("opacity", .9);      
           div.text(d.properties.name + '  ' + d.properties.value + '%')
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");
               
	})   

    // Fade out tooltip on mouse out               
    .on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0); 
           });
     
     // Legend 
     var w = 140, h = 300;
 
     var key = d3.select("body")
       .append("svg")
       .attr("width", w)
       .attr("height", h)
       .attr("class", "legend");
 
     var legend = key.append("defs")
       .append("svg:linearGradient")
       .attr("id", "gradient")
       .attr("x1", "100%")
       .attr("y1", "0%")
       .attr("x2", "100%")
       .attr("y2", "100%")
       .attr("spreadMethod", "pad");
 
     legend.append("stop")
       .attr("offset", "0%")
       .attr("stop-color", highColor)
       .attr("stop-opacity", 1);
       
     legend.append("stop")
       .attr("offset", "100%")
       .attr("stop-color", lowColor)
       .attr("stop-opacity", 1);
 
     key.append("rect")
       .attr("width", w - 100)
       .attr("height", h)
       .style("fill", "url(#gradient)")
       .attr("transform", "translate(0,10)");
       
     
 
     var y = d3.scaleLinear()
       .range([h, 0])
       .domain([minVal, maxVal]);
 
     var yAxis = d3.axisRight(y);
 
     key.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate(41,10)")
       .call(yAxis)

    
    // Annotations
    const CroplandAnnotation = [
      {
      note:{
        label: "Across all states, Iowa has the highest % of state area as Cropland",
        title: "Iowa 74.7%",
      },
      connector:{
        end:"dot",
        endScale: 2
      },
      color: ["#800303"],
      x: 595,
      y: 210,
      dy: -130,
      dx: 80,
    }
    ]
    const GrasslandAnnotation = [
      {
      note:{
        label: "Across all states, Nevada has the highest % of state area as Grassland",
        title: "Nevada 74.5%",
      },
      connector:{
        end:"dot",
        endScale: 2
      },
      color: ["#800303"],
      x: 270,
      y: 240,
      dy: 100,
      dx: -40,
    }
    ] 
    const ForestAnnotation = [
      {
      note:{
        label: "Across all states, Maine has the highest % of state area as Forest",
        title: "Maine 87.1%",
      },
      connector:{
        end:"dot",
        endScale: 2
      },
      color: ["#800303"],
      x: 880,
      y: 118,
      dy: -50,
      dx: -40,
    }
    ]
    const SpecialUseAnnotation1 = [
      {
      note:{
        label: "Across all states, Alaska has the highest % of state area as Special Use",
        title: "Alaska 40%",
      },
      connector:{
        end:"dot",
        endScale: 2
      },
      color: ["#800303"],
      x: 250,
      y: 425,
      dy: -40,
      dx: -25,
    }
    ]
      const SpecialUseAnnotation2 = [
        {
        note:{
          label: "Rural transportation, rural parks and wildlife, defense and industrial, plus miscellaneous farm and other special uses",
          title: "Special Use Area",
        },
       
        color: ["#800303"],
        x: 720,
        y: 0,
        dy: 0,
        dx: 0,
      }
      ]
      const OtherAnnotation1 = [
        {
        note:{
          label: "Across all states, Alaska has the highest % of state area as Other",
          title: "Alaska 34.6%",
        },
        connector:{
          end:"dot",
          endScale: 2
        },
        color: ["#800303"],
        x: 250,
        y: 425,
        dy: -40,
        dx: -25,
      }
      ]
      const OtherAnnotation2 = [
        {
        note:{
          label: "Unclassified uses such as marshes, swamps, bare rock, deserts, tundra plus other uses not estimated, classified, or inventoried",
          title: "Other Area",
        },
        color: ["#800303"],
        x: 720,
        y: 0,
        dy: 0,
        dx: 0,
      }
      ]

      if (ddSelection == "Cropland") {
        svg.append("g")
        .call(d3.annotation()
        .annotations(CroplandAnnotation));
        }
      if (ddSelection == "Grassland") {
          svg.append("g")
          .call(d3.annotation()
          .annotations(GrasslandAnnotation));
          }
      if (ddSelection == "Forest") {
            svg.append("g")
            .call(d3.annotation()
            .annotations(ForestAnnotation));
            }      
      if (ddSelection == "SpecialUse") {
      svg.append("g")
      .call(d3.annotation()
      .annotations(SpecialUseAnnotation1));
      svg.append("g")
      .call(d3.annotation()
      .annotations(SpecialUseAnnotation2));

      }

      if (ddSelection == "Other") {
      svg.append("g")
      .call(d3.annotation()
      .annotations(OtherAnnotation1));
      svg.append("g")
      .call(d3.annotation()
      .annotations(OtherAnnotation2));
        }

   });
 });
};


// Generate initial chart

updateChart(ddSelection);

// Handle new dropdown selection

d3.select('#UsageType')
  .on('change', function() {
   d3.selectAll("svg > *").remove();
   ddSelection = d3.select(this).property('value');
   updateChart(ddSelection);
  });


    