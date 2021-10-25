// Belly Button Biodiversity - Plotly.js
//samples.json> got the data for names, metadata, samples.

//----------------------------------------


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultsarray = metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0]
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });

 //----------------------------------------



    });
}

//=============Bubble&Bar Chart Functions=======================//

function buildCharts(sample) {

// Use `d3.json` to read samples.json
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0]

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        //================ Build a BUBBLE Chart=================// 



var Bubble_Layout = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
};

var Data_Bubble = [
    {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
            color: ids,
            size: values,
        }
    }
];

Plotly.newPlot("bubble", Data_Bubble, Bubble_Layout);

         //===============  Build a BAR Chart=======================//


        var barChart_data = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }
        ];

        var barChart_Layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barChart_data, barChart_Layout);
    });
}

//============= Function init =======================//

function init() {
    // Grab reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate selection options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Update plots anytime new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);

}




// Initialize the dashboard
init();




