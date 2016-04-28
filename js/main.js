

var moveWhat;

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 13])
    .on("zoom", move);



// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;

// Variables for the visualization instances
var myScatter;

// Start application by loading the data
loadData();

function loadData() {
    d3.csv("data/PriorityAndDemographics.csv", function(error, csvData){
        if(!error){
            allData = csvData;
            createVis();
        }
    });
}

function createVis() {
    myScatter = new ScatterPlot("scatterVB",allData);
}


function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;
    var h = mapHeight/4;


    t[0] = Math.min((mapWidth/mapHeight)  * (s - 1), Math.max( mapWidth * (1 - s), t[0] ));
    t[1] = Math.min(h * (s - 1) + h * s, Math.max(mapHeight  * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the country hover stroke mapWidth based on zoom level
    d3.selectAll([moveWhat]).style("stroke-width", 1.5 / s);
    //d3.selectAll(".mapCountry").style("stroke-width", 1.5 / s);
}



function mousedown() {  // remember where the mouse was pressed, in canvas coords
    m0 = trackballAngles(d3.mouse(svg[0][0]));
    o0 = projection.rotate();
    d3.event.preventDefault();
}

function mousemove() {
    if (m0) {  // if mousedown
        var m1 = trackballAngles(d3.mouse(svg[0][0]));
        // we want to find rotate the current projection so that the point at m0 rotates to m1
        // along the great circle arc between them.
        // when the current projection is at rotation(0,0), with the north pole aligned
        // to the vertical canvas axis, and the equator aligned to the horizontal canvas
        // axis, this is easy to do, since D3's longitude rotation corresponds to trackball
        // rotation around the vertical axis, and then the subsequent latitude rotation
        // corresponds to the trackball rotation around the horizontal axis.
        // But if the current projection is already rotated, it's harder.
        // We need to find a new rotation equivalent to the composition of both

        // Choose one of these three update schemes:

        // Best behavior
        o1 = composedRotation(o0[0], o0[1], o0[2], m1[0] - m0[0], m1[1] - m0[1])

        // Improved behavior over original example
        //o1 = [o0[0] + (m1[0] - m0[0]), o0[1] + (m1[1] - m0[1])];

        // Original example from http://mbostock.github.io/d3/talk/20111018/azimuthal.html
        // o1 = [o0[0] - (m0[0] - m1[0]) / 8, o0[1] - (m1[1] - m0[1]) / 8];

        // move to the updated rotation
        projection.rotate(o1);

        // We can optionally update the "origin state" at each step.  This has the
        // advantage that each 'trackball movement' is small, but the disadvantage of
        // potentially accumulating many small drifts (you often see a twist creeping in
        // if you keep rolling the globe around with the mouse button down)

        //o0 = o1;
        //m0 = m1;

        svg.selectAll("path").attr("d", path);
    }
}

function mouseup() {
    if (m0) {
        mousemove();
        m0 = null;
    }
}
