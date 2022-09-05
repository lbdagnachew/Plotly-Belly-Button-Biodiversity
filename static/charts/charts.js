function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samplesA = data.samples;
      console.log(samplesA);
  
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var samplesNums = samplesA.filter(sampleObj => sampleObj.id == sample);
  
      //  5. Create a variable that holds the first sample in the array.
      var samResult = samplesNums[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = samResult.otu_ids;
      var otuLabels = samResult.otu_labels;
      var sampleV = samResult.sample_values;
      console.log(otuIds)
      console.log(otuLabels)
      console.log(sampleV)
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otuIds.slice(0, 10).map(id => 'OTU ' + id).reverse();
      console.log(yticks)
      var reversedYs = yticks.reverse()
      console.log(reversedYs)
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: sampleV.slice(0, 10).reverse(),
        y: yticks.slice(0, 10).reverse(),
        type: "bar",
        orientation: 'h',
        marker: { color: 'rgb(102,0,102)'}
      }];
  
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        // xaxis: { title: "Sample Values" },
        // yaxis: { title: "ID's" }
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout)
  
    // BellyButton_Scatter chart starts here
  
      // 1. Create the trace for the bubble chart.
      var bubbleData = {
        x: otuIds,
        y: sampleV,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleV,
          color: sampleV,
          colorscale: 'Viridis'
        }
  
      };
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" },
        hovermode: "closest",
        autosize: true
  
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
  
  
      // 3. Create a variable that holds the washing frequency.
     var metadata = data.metadata;
     var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
     var gaugeResult = gaugeArray[0];
  
     var washing = gaugeResult.wfreq;
     console.log(washing);
  
      // 4. Create the trace for the gauge chart.
      var prettyGauge = [
        {
          value: washing,
          title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {range: [null, 10]},
            steps:[ 
              { range: [0, 2], color: "darkmagenta" },
              { range: [2, 4], color: "mediumvioletred" },
              { range: [4, 6], color: "lightcoral" },
              { range: [6, 8], color: "gold" },
              { range: [8, 10], color: "mediumspringgreen" },
            ],
            bar: {color: "black"}}
        }     
      ];
  
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { width: 500, height: 450, margin: { t: 0, b: 0 } };
  
      //};
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", prettyGauge, gaugeLayout);
  
    });
  }
  
  