/**
 * Created by Ben on 4/15/2016.
 */



var benMargin = {top: 1, right: 1, bottom: 1, left: 1};
//var benWidth = 550 - benMargin.left - benMargin.right,
//    benHeight = 400 - benMargin.top - benMargin.bottom;


var benWidth = (document.getElementById('map-area').offsetWidth *.6) - benMargin.left - benMargin.right,
    benHeight = benWidth

console.log(benWidth);
var benColor = d3.scale.linear() // create a linear scale
    .domain([1,16])  // input uses min and max values
    .range([1,.1]);

var benProjection = d3.geo.mercator()
    //.scale(100)
    .scale((benHeight/2)/3)
    .translate([benWidth / 2, benHeight / 2])
    .center([-10,40]);

var benPath = d3.geo.path()
    .projection(benProjection);


var benSvg = d3.select("#map2").append("svg")
    .attr("width", benWidth + benMargin.left + benMargin.right)
    .attr("height", benHeight + benMargin.top + benMargin.bottom)
    .append("g")
    .attr("transform", "translate(" - benMargin.left + "," - benMargin.top + ")");
//
//var benBorder = benSvg.append("rect")
//    .attr("x", 0)
//    .attr("y", 0)
//    .attr("width", benWidth + benMargin.left + benMargin.right)
//    .attr("height", benHeight + benMargin.top + benMargin.bottom)
//    .style("stroke", 'black')
//    .style("fill", "none")
//    .style("stroke-width", '4px')
//    ;

//added
var benIssueFinder = d3.scale.ordinal()
    .domain(["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115"])
    .range(["ClimateChange", "BetterTransport", "SupportWork", "AccessWater", "BetterHealthcare",
        "GoodEducation", "ResponsiveGovernment", "PhoneInternet", "ReliableEnergy", "AffordableFood",
        "ProtectingForests", "PoliticalFreedoms", "ProtectionCrime", "FreedomDiscrimination", "Equality", "BetterJob"]);

var benColorScale = d3.scale.ordinal()
    .domain(["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115"])
    .range(["#fcb749", "#fbe792", "#233884", "#97d3c9", "#ca3a28", "#47c0be", "#2da9e1", "#7cb5d6", "#a01c40", "#b0d256", "#71be45", "#387195", "#723390", "#dec0ca", "#c84699", "#e8168b"]);

//added

var benPriorityKey = {};
benPriorityKey["ClimateChange"]="Action Taken on Climate Change";
benPriorityKey["BetterTransport"]="Better Transport and Roads";
benPriorityKey["SupportWork"]="Support for People who can't Work";
benPriorityKey["AccessWater"]="Access to Clean Water and Sanitation";
benPriorityKey["BetterHealthcare"]="Better Healthcare";
benPriorityKey["GoodEducation"]="A Good Education";
benPriorityKey["ResponsiveGovernment"]="A Responsive Government We Can Trust";
benPriorityKey["PhoneInternet"]="Phone and Internet Access";
benPriorityKey["ReliableEnergy"]="Reliable Energy at Home";
benPriorityKey["AffordableFood"]="Affordable and Nutritious Food";

benPriorityKey["ProtectingForests"]="Protecting forests, rivers and oceans";
benPriorityKey["PoliticalFreedoms"]="Political freedoms";
benPriorityKey["ProtectionCrime"]="Protection against crime and violence";
benPriorityKey["FreedomDiscrimination"]="Freedom from discrimination and persecution";
benPriorityKey["Equality"]="Equality between men and women";
benPriorityKey["BetterJob"]="Better job opportunities";


 queue()
 .defer(d3.csv, "data/prioritiesRanked.csv")
     .defer(d3.tsv, "data/world-country-names.tsv")
     .defer(d3.json, "data/world-topo.json")
 .await(benCreateMap);



function benCreateMap(error, data2, data3, data4) {

    benRankData=data2;
    benCountryNames = data3;
    benMapData= data4;

    benRankData.forEach(function(d){
        d.ClimateChange = +d.ClimateChange;
        d.BetterTransport=+d.BetterTransport;
        d.SupportWork = +d.SupportWork;
        d.AccessWater=+d.AccessWater;
        d.BetterHealthcare = +d.BetterHealthcare;
        d.GoodEducation = +d.GoodEducation;
        d.ResponsiveGovernment = +d.ResponsiveGovernment;
        d.PhoneInternet = +d.PhoneInternet;
        d.ReliableEnergy = +d.ReliableEnergy;
        d.AffordableFood = +d.AffordableFood;
        d.ProtectingForests = +d.ProtectingForests;
        d.PoliticalFreedoms = +d.PoliticalFreedoms;
        d.ProtectionCrime = +d.ProtectionCrime;
        d.FreedomDiscrimination = +d.FreedomDiscrimination;
        d.Equality = +d.Equality;
        d.BetterJob = +d.BetterJob;
        d.Population = +d.Population;
    });
    benRankByCountry={};
    benRankData.forEach(function(d) { benRankByCountry[d.countryName] = {ClimateChange : d.ClimateChange, BetterTransport: d.BetterTransport,
        SupportWork : d.SupportWork,
        AccessWater:d.AccessWater,
        BetterHealthcare :d.BetterHealthcare,
        GoodEducation :d.GoodEducation,
        ResponsiveGovernment :d.ResponsiveGovernment,
        PhoneInternet : +d.PhoneInternet,
        ReliableEnergy : +d.ReliableEnergy,
        AffordableFood : +d.AffordableFood,
        ProtectingForests : +d.ProtectingForests,
        PoliticalFreedoms : +d.PoliticalFreedoms,
        ProtectionCrime : +d.ProtectionCrime,
        FreedomDiscrimination : +d.FreedomDiscrimination,
        Equality : +d.Equality,
        BetterJob : +d.BetterJob,
        Population : +d.Population,
        CountryName: d.countryName
        }});

    benWorld = topojson.feature(benMapData, benMapData.objects.countries).features;


    benMap = benSvg.selectAll("path")
        .data(benWorld)
        .enter().append("path")
        .attr("d", benPath)
        .attr("class","map2Country")
        .attr("fill", function(d){

            if(benRankByCountry[d.properties.name]===undefined){return "#ccc";}
            else {return "green"}});

/*
    var opacityRange=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    var legend = benSvg.selectAll("g.legend")
        .data(opacityRange)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return benHeight - (i*6) -50})
        .attr("width", 20)
        .attr("height", 6)
        .style("fill", "green")
        .style("opacity", function(d,i){return benColor(i)})
        ;
    legend.append("text")
        .attr("x",40)
        .attr("y", function(d,i){return benHeight-44})
        .attr("class", "legend-text")
        .text('Priority 1');
    legend.append("text")
        .attr("x",40)
        .attr("y", function(d,i){return benHeight-130})
        .attr("class", "legend-text")
        .text('Priority 16');
*/
    benUpdateMap();
}

function benUpdateMap() {

     //added
     var selectedValueOriginal = document.getElementById("selectissue").value;

     if (selectedValueOriginal == "All") {
     selectedValueOriginal = "100";
     }

     var selectedValue = benIssueFinder(selectedValueOriginal);
     var benSelectedColor = benColorScale(selectedValueOriginal);

    var opacityRange=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

    benSvg.selectAll("g.legend").remove();

    var legend = benSvg.selectAll("g.legend")
        .data(opacityRange)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return benHeight - (i*6) -50})
        .attr("width", 20)
        .attr("height", 6)
        .style("fill", benSelectedColor)
        .style("opacity", function(d,i){return benColor(i)})
    ;
    legend.append("text")
        .attr("x",45)
        .attr("y", function(d,i){return benHeight-44})
        .attr("class", "legend-text")
        .text('Priority: Rank 1');
    legend.append("text")
        .attr("x",45)
        .attr("y", function(d,i){return benHeight-130})
        .attr("class", "legend-text")
        .text('Priority: Rank 16');

    //added

    benTooltip = d3.tip().attr('class', 'd3-tip').html(function(d){return d.properties.name + "<br> " + benPriorityKey[selectedValue]
    +"<br> Rank: " + benRankByCountry[d.properties.name][selectedValue]});
    benTooltip.offset(function() {
        return [0  , 0]
    });
    benMap
//added
        .attr("fill", benSelectedColor)
//added
        .attr("fill-opacity",function(d){
            if(benRankByCountry[d.properties.name]===undefined){return 1;}
            else{ return benColor(benRankByCountry[d.properties.name][selectedValue])}
        }) ;
    /*$(".dropdown1 li a").click( function() {
        var yourText = $(this).text();
    });*/
    benMap.call(benTooltip);
    benMap
        .on('mouseover', benTooltip.show)
        .on('mouseout', benTooltip.hide);

}


