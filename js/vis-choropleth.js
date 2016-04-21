


d3.select(window).on("resize", throttle);


var mapWidth = document.getElementById('map-area').offsetWidth ;
var mapHeight = mapWidth /2;

//console.log(mapWidth, " ", mapWidth);

//['ffffff','#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b','#062655']

var color = d3.scale.linear()
    .range(['ffffff','#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b','#062655']);
    //.range(colorbrewer.RdYlGn[11]);


var zoom = d3.behavior.zoom()
    .scaleExtent([1, 13])
    .on("zoom", move);

var topo,projection,path,svg, g,countries,domainRange,maxValue,UNPri;


var labelWidth = 15, labelHeight = 15;

var tooltip = d3.select("#map-area").append("div").attr("class", "tooltip hidden");

var radius = mapHeight/2;

loadData();


function loadData() {
    //population file from here
    //http://esa.un.org/unpd/wpp/Download/Standard/Population/

    queue()
        .defer(d3.json, "data/world-topo.json")
        //.defer(d3.csv, "data/UN-Population.csv")
        //.defer(d3.csv, "data/TotalVotesPerPriorityByCountry.csv")
        .defer(d3.csv, "data/Shep-Priority.csv")
        //.defer(d3.csv, "data/Priority.csv")
        .await(function (error, world,priorities ) {
            countries = topojson.feature(world, world.objects.countries).features;
            //UNpopulation = population;
            UNPri = priorities;
            //console.log(UNPri);


            //console.log("Countries = ",countries);
            console.log("UNPri = ", UNPri);

            map1WrangleData();
            topo = countries;

            drawMap();
            draw(topo);

        });
}


function drawMap(){
    projection = d3.geo.orthographic()
        .translate([(mapWidth/2), (mapHeight/2)])
        .scale(radius)
       // .translate([radius , radius])
        .clipAngle(90   )
        .precision(0.9);

    //projection = d3.geo.mercator()
    //    .translate([(mapWidth/2), (mapHeight/2)])
    //    .scale( mapWidth / 2 / Math.PI);



    path = d3.geo.path()
        .projection(projection);

    svg = d3.select("#map-area").append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .call(zoom)
        //.on("click", click)
        .on("mousedown", mousedown)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup)
        .append("g");

    g = svg.append("g");

    var legend = svg.selectAll("g.legend");

}


function draw(topo) {

    var mapCountry = g.selectAll(".mapCountry").data(topo);

    maxValue = d3.max(countries, function(d) {return d.properties.population});

    //domainRange = ([0,
    //        (maxValue *.001),
    //        (maxValue *.01),
    //        (maxValue *.05),
    //        (maxValue *.10),
    //        (maxValue *.125),
    //        (maxValue *.15),
    //        (maxValue *.175),
    //        (maxValue *.20),
    //        (maxValue *.35),
    //        (maxValue *1)
    //    ]);
        domainRange = ([
            (maxValue *1),
            (maxValue *.35),
            (maxValue *.20),
            (maxValue *.175),
            (maxValue *.15),
            (maxValue *.125),
            (maxValue *.10),
            (maxValue *.05),
            (maxValue *.01),
            (maxValue *.001),
            0   ]);

    //console.log(domainRange);
    color.domain(domainRange);

    //console.log(color.domain());

    mapCountry.enter()
        .insert("path")
        .attr("class", "mapCountry")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
      //  .style("fill", function(d) { return d.properties.color; });
        .style("fill", function(d) { return color(d.properties.population); });


    var offsetL = document.getElementById('map-area').offsetLeft+20;
    var offsetT =document.getElementById('map-area').offsetTop+10;

    //tooltips
    mapCountry
        .on("mousemove", function(d) {

            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
            tooltip
                .classed("hidden", false)
                .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
                .html(d.properties.name +
                    "<br>Population: " + (d.properties.population*1000).toLocaleString('en') +
                    "<br>Total Votes: " + d.properties.TotalVotes.toLocaleString('en')+
                    "<br>HDI: " + d.properties.HDI.toLocaleString('en') +
                    "<br>GNI: " + d.properties.GNI.toLocaleString('en') +
                    "<br>Mean School Years: " + d.properties.MeanSchool.toLocaleString('en') +
                    "<br>Life Expectancy: " + d.properties.LifeExpectancy.toLocaleString('en')
                )
                updateTable(d);
        })
        .on("mouseout",  function(d) {
            tooltip.classed("hidden", true)
        });

    svg.selectAll("g.legend").remove()

    //legend

    svg.selectAll("g.legend")
        .data(domainRange)
        .enter()
        .append("g")
        .attr("class", "legend");

    updateLegend(maxValue);



}

function redraw() {
    mapWidth = document.getElementById('map-area').offsetWidth-60;
    mapHeight = mapWidth / 2;
    d3.select('svg').remove();
    drawMap();
    draw(topo);
}



//function click() {
//    var latlon = projection.invert(d3.mouse(this));
//
//}


function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;
    var h = mapHeight/4;


    t[0] = Math.min((mapWidth/mapHeight)  * (s - 1), Math.max( mapWidth * (1 - s), t[0] ));
    t[1] = Math.min(h * (s - 1) + h * s, Math.max(mapHeight  * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the country hover stroke mapWidth based on zoom level
    d3.selectAll(".mapCountry").style("stroke-width", 1.5 / s);
}

var throttleTimer;
function throttle() {
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
        redraw();
    }, 200);
}

function updateLegend(maxValue){


    legend = svg.selectAll("g.legend")
        .data(domainRange)
        .append("g")
        .attr("class", "legend");

    legend.append("rect")
        .transition()
        .attr("x", 20)
        .attr("y", function(d, i){ return mapHeight - (i*labelHeight) - 2*labelHeight+2;})
        .attr("width", labelWidth)
        .attr("height", labelHeight)
        .style("fill", function(d) { return color(d); })
        .style("opacity", 0.8);

    legend.append("text")
        .transition()
        .attr("x", 50)
        .attr("y", function(d, i){ return mapHeight - (i*labelHeight) - labelHeight ;})
        .text(function(d){ return d3.format(",")(d3.round(d)); });
}
function map1WrangleData(){


    for (var i = 0; i < countries.length; i++){

        //for (var j = 0 ; j < UNpopulation.length; j++){
        //    if(countries[i].properties.name.toUpperCase() == UNpopulation[j].Country.toUpperCase()) {
        //        countries[i].properties.population = parseInt(UNpopulation[j].population);
        //        countries[i].properties.continent = UNpopulation[j].Continent;
        //    }
        //}
        for (var k = 0 ; k < UNPri.length; k++){
            //console.log(countries[i].properties.name.toUpperCase());
            if(countries[i].properties.name.toUpperCase() == UNPri[k].countryName.toUpperCase()){
                countries[i].properties.HDI = parseFloat(UNPri[k].HDI);
                countries[i].properties.ExpectedSchool = parseFloat(UNPri[k].ExpectedSchool);
                countries[i].properties.GNI = parseInt(UNPri[k].GNI);
                countries[i].properties.MeanSchool = parseFloat(UNPri[k].MeanSchool);
                countries[i].properties.population = parseInt(UNPri[k].Population);
                countries[i].properties.LifeExpectancy = parseFloat(UNPri[k].LifeExpectancy);
                countries[i].properties[100] = parseInt(UNPri[k][100]);
                countries[i].properties[101] = parseInt(UNPri[k][101]);
                countries[i].properties[102] = parseInt(UNPri[k][102]);
                countries[i].properties[103] = parseInt(UNPri[k][103]);
                countries[i].properties[104] = parseInt(UNPri[k][104]);
                countries[i].properties[105] = parseInt(UNPri[k][105]);
                countries[i].properties[106] = parseInt(UNPri[k][106]);
                countries[i].properties[107] = parseInt(UNPri[k][107]);
                countries[i].properties[108] = parseInt(UNPri[k][108]);
                countries[i].properties[109] = parseInt(UNPri[k][109]);
                countries[i].properties[110] = parseInt(UNPri[k][110]);
                countries[i].properties[111] = parseInt(UNPri[k][111]);
                countries[i].properties[112] = parseInt(UNPri[k][112]);
                countries[i].properties[113] = parseInt(UNPri[k][113]);
                countries[i].properties[114] = parseInt(UNPri[k][114]);
                countries[i].properties[115] = parseInt(UNPri[k][115]);
                countries[i].properties.TotalVotes = parseInt(UNPri[k][100]) +
                    parseInt(UNPri[k][101]) + parseInt(UNPri[k][102]) +
                    parseInt(UNPri[k][103]) + parseInt(UNPri[k][104]) +
                    parseInt(UNPri[k][105]) + parseInt(UNPri[k][106]) +
                    parseInt(UNPri[k][107]) + parseInt(UNPri[k][108]) +
                    parseInt(UNPri[k][109]) + parseInt(UNPri[k][110]) +
                    parseInt(UNPri[k][111]) + parseInt(UNPri[k][112]) +
                    parseInt(UNPri[k][113]) + parseInt(UNPri[k][114]) +
                    parseInt(UNPri[k][115]);
            }
        }
    }




    //for (var i = 0; i < countries.length; i++){
    //    if (!countries[i].properties.population){
    //        console.log(countries[i].properties.name);
    //    }
    //
    //}

    console.log("Countries = ",countries);

}
function updateTable(d){

    document.getElementById('countryName').innerHTML = d.properties.name.toLocaleString('en');


    document.getElementById('Pri-100').innerHTML = d.properties[100].toLocaleString('en');
    document.getElementById('PriPer-100').innerHTML =((d.properties[100]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-101').innerHTML = d.properties[101].toLocaleString('en');
    document.getElementById('PriPer-101').innerHTML = ((d.properties[101]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-102').innerHTML = d.properties[102].toLocaleString('en');
    document.getElementById('PriPer-102').innerHTML = ((d.properties[102]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-103').innerHTML = d.properties[103].toLocaleString('en');
    document.getElementById('PriPer-103').innerHTML = ((d.properties[103]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-104').innerHTML = d.properties[104].toLocaleString('en');
    document.getElementById('PriPer-104').innerHTML = ((d.properties[104]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-105').innerHTML = d.properties[105].toLocaleString('en');
    document.getElementById('PriPer-105').innerHTML = ((d.properties[105]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-106').innerHTML = d.properties[106].toLocaleString('en');
    document.getElementById('PriPer-106').innerHTML = ((d.properties[106]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-107').innerHTML = d.properties[107].toLocaleString('en');
    document.getElementById('PriPer-107').innerHTML = ((d.properties[107]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-108').innerHTML = d.properties[108].toLocaleString('en');
    document.getElementById('PriPer-108').innerHTML = ((d.properties[108]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-109').innerHTML = d.properties[109].toLocaleString('en');
    document.getElementById('PriPer-109').innerHTML = ((d.properties[109]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-110').innerHTML = d.properties[110].toLocaleString('en');
    document.getElementById('PriPer-110').innerHTML = ((d.properties[110]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-111').innerHTML = d.properties[111].toLocaleString('en');
    document.getElementById('PriPer-111').innerHTML = ((d.properties[111]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-112').innerHTML = d.properties[112].toLocaleString('en');
    document.getElementById('PriPer-112').innerHTML = ((d.properties[112]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-113').innerHTML = d.properties[113].toLocaleString('en');
    document.getElementById('PriPer-113').innerHTML = ((d.properties[113]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-114').innerHTML = d.properties[114].toLocaleString('en');
    document.getElementById('PriPer-114').innerHTML = ((d.properties[114]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-115').innerHTML = d.properties[115].toLocaleString('en');
    document.getElementById('PriPer-115').innerHTML = ((d.properties[115]/d.properties.TotalVotes)* 100).toFixed(2)+"%";


    $(document).ready(function()
        {
            $("#mapTable1").tablesorter({theme: 'blue', sortList: [[0,0]]});
            $("#mapTable2").tablesorter({theme: 'blue', sortList: [[0,0]]});
        }
    );


    //http://bl.ocks.org/patricksurry/5721459

}function trackballAngles(pt) {
    // based on http://www.opengl.org/wiki/Trackball
    // given a click at (x,y) in canvas coords on the globe (trackball),
    // calculate the spherical coordianates for the point as a rotation around
    // the vertical and horizontal axes

    var r = projection.scale();
    var c = projection.translate();
    var x = pt[0] - c[0], y = - (pt[1] - c[1]), ss = x*x + y*y;


    var z = r*r > 2 * ss ? Math.sqrt(r*r - ss) : r*r / 2 / Math.sqrt(ss);

    var lambda = Math.atan2(x, z) * 180 / Math.PI;
    var phi = Math.atan2(y, z) * 180 / Math.PI
    return [lambda, phi];
}

function composedRotation(λ, ϕ, γ, δλ, δϕ) {
    λ = Math.PI / 180 * λ;
    ϕ = Math.PI / 180 * ϕ;
    γ = Math.PI / 180 * γ;
    δλ = Math.PI / 180 * δλ;
    δϕ = Math.PI / 180 * δϕ;

    var sλ = Math.sin(λ), sϕ = Math.sin(ϕ), sγ = Math.sin(γ),
        sδλ = Math.sin(δλ), sδϕ = Math.sin(δϕ),
        cλ = Math.cos(λ), cϕ = Math.cos(ϕ), cγ = Math.cos(γ),
        cδλ = Math.cos(δλ), cδϕ = Math.cos(δϕ);

    var m00 = -sδλ * sλ * cϕ + (sγ * sλ * sϕ + cγ * cλ) * cδλ,
        m01 = -sγ * cδλ * cϕ - sδλ * sϕ,
        m02 = sδλ * cλ * cϕ - (sγ * sϕ * cλ - sλ * cγ) * cδλ,
        m10 = - sδϕ * sλ * cδλ * cϕ - (sγ * sλ * sϕ + cγ * cλ) * sδλ * sδϕ - (sλ * sϕ * cγ - sγ * cλ) * cδϕ,
        m11 = sδλ * sδϕ * sγ * cϕ - sδϕ * sϕ * cδλ + cδϕ * cγ * cϕ,
        m12 = sδϕ * cδλ * cλ * cϕ + (sγ * sϕ * cλ - sλ * cγ) * sδλ * sδϕ + (sϕ * cγ * cλ + sγ * sλ) * cδϕ,
        m20 = - sλ * cδλ * cδϕ * cϕ - (sγ * sλ * sϕ + cγ * cλ) * sδλ * cδϕ + (sλ * sϕ * cγ - sγ * cλ) * sδϕ,
        m21 = sδλ * sγ * cδϕ * cϕ - sδϕ * cγ * cϕ - sϕ * cδλ * cδϕ,
        m22 = cδλ * cδϕ * cλ * cϕ + (sγ * sϕ * cλ - sλ * cγ) * sδλ * cδϕ - (sϕ * cγ * cλ + sγ * sλ) * sδϕ;

    if (m01 != 0 || m11 != 0) {
        γ_ = Math.atan2(-m01, m11);
        ϕ_ = Math.atan2(-m21, Math.sin(γ_) == 0 ? m11 / Math.cos(γ_) : - m01 / Math.sin(γ_));
        λ_ = Math.atan2(-m20, m22);
    } else {
        γ_ = Math.atan2(m10, m00) - m21 * λ;
        ϕ_ = - m21 * Math.PI / 2;
        λ_ = λ;
    }

    return([λ_ * 180 / Math.PI, ϕ_ * 180 / Math.PI, γ_ * 180 / Math.PI]);
}

var m0 = null,
    o0;

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
