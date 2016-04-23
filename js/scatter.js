

ScatterPlot = function(_parentElement, _data){
	this.parentElement = _parentElement;
  	this.data = _data;
	console.log("create object")
	this.initVis();
}


ScatterPlot.prototype.initVis = function(){
	console.log("initVis")
	var vis = this;
	vis.margin = { top: 40, right: 150, bottom: 100, left: 60 };
	vis.width = 800 - vis.margin.left - vis.margin.right,
		vis.height = 600 - vis.margin.top - vis.margin.bottom;
	vis.padding = 0;
  // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
  	vis.xScale = d3.scale.linear()
  		.range([0, vis.width]);

	vis.rScale = d3.scale.log()
		.range([2, 12]);

	vis.yScale = d3.scale.linear()
		.range([vis.height, 0]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.xScale)
		.tickFormat(function (d) {
			return vis.xScale.tickFormat(20,d3.format(",d"))(d)
		})
		.orient("bottom");

	vis.yAxis = d3.svg.axis()
	    .scale(vis.yScale)
	    .orient("left");

	vis.svg.append("g")
	    .attr("class", "x-axis axis")
	    .attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
		.attr("class", "y-axis axis");

	vis.xAxisLabel = vis.svg.append("text")
		.attr("x", vis.width/2-vis.margin.left)
		.attr("y", vis.height - 5);

	vis.yAxisLabel = vis.svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -vis.margin.left/1.25)
		.attr("x", -vis.height/1.25);

	// TO-DO: (Filter, aggregate, modify data)
	vis.updateData();
}

ScatterPlot.prototype.updateData = function updateData() {
	var vis = this;
	console.log("updateData");
	var selectedValueX = rankingtype.options[rankingtype.selectedIndex].value;
	var selectedValueY = rankingtype1.options[rankingtype1.selectedIndex].value;
	var selectedValueCont = rankingtype2.options[rankingtype2.selectedIndex].value;
	console.log(selectedValueX + " vs " + selectedValueY + " in " + selectedValueCont);
	vis.wrangleData(selectedValueX, selectedValueY, selectedValueCont);
}

/*
* Data wrangling
 */


ScatterPlot.prototype.wrangleData = function(selectedValueX, selectedValueY, selectedValueCont){
	console.log("wrangleData");
	var vis = this;
	var xName;
	var yName;
	var test = vis.data;

	test.forEach(function(d){
		d.Votes = +d.Votes
		if (selectedValueX == "HDI") {
			if (!isNaN(d.HDI)) {
				d.xValue = +d.HDI;
				xName = "Human Development Index";
			}
		}
		if (selectedValueX == "LifeExpectancy") {
			if (!isNaN(d.LifeExpectancy)) {
				d.xValue = +d.LifeExpectancy;
				xName = "Life Expectancy";
			}
		}
		if (selectedValueX == "ExpectedSchool") {
			if (!isNaN(d.ExpectedSchool)) {
				d.xValue = +d.ExpectedSchool;
				xName = "Expected Years of Schooling";
			}
		}
		if (selectedValueX == "MeanSchool") {
			if (!isNaN(d.MeanSchool)) {
				d.xValue = +d.MeanSchool;
				xName = "Average Years of Schooling";
			}
		}
		if (selectedValueX == "GNI") {
			if (!isNaN(d.GNI)) {
				d.xValue = +d.GNI;
				xName = "Gross National Income Per Capita ($1000)";
			}
		}
		if (selectedValueX == "Population") {
			if (!isNaN(d.Population)) {
				d.xValue = +d.Population;
				xName = "Population in 1000s";
			}
		}
		if (selectedValueY == "x100") {
			if (!isNaN(d.x100)) {
				d.yValue = (+d.x100);
				yName = "Action Taken on Climate Change";
			}
		}
		if (selectedValueY == "x101") {
			if (!isNaN(d.x101)) {
				d.yValue = +d.x101;
				yName = "Better Transport and Roads";
			}
		}
		if (selectedValueY == "x102") {
			if (!isNaN(d.x102)) {
				d.yValue = +d.x102;
				yName = "Support for People Who Can't Work";
			}
		}
		if (selectedValueY == "x103") {
			if (!isNaN(d.x103)) {
				d.yValue = +d.x103;
				yName = "Access to Clean Water and Sanitation";
			}
		}
		if (selectedValueY == "x104") {
			if (!isNaN(d.x104)) {
				d.yValue = +d.x104;
				yName = "Better Healthcare";

			}
		}
		if (selectedValueY == "x105") {
			if (!isNaN(d.x105)) {
				d.yValue = +d.x105;
				yName = "A Good Education";

			}
		}
		if (selectedValueY == "x106") {
			if (!isNaN(d.x106)) {
				d.yValue = +d.x106;
				yName = "A Responsive Government We Can Trust";
			}
		}
		if (selectedValueY == "x107") {
			if (!isNaN(d.x107)) {
				d.yValue = +d.x107;
				yName = "Phone and Internet Access";
			}
		}
		if (selectedValueY == "x108") {
			if (!isNaN(d.x108)) {
				d.yValue = +d.x108;
				yName = "Reliable Energy at Home";
			}
		}
		if (selectedValueY == "x109") {
			if (!isNaN(d.x109)) {
				d.yValue = +d.x109;
				yName = "Affordable and Nutritious Food";
			}
		}
		if (selectedValueY == "x110") {
			if (!isNaN(d.x110)) {
				d.yValue = +d.x110;
				yName = "Protecting Forests, Rivers and Oceans";
			}
		}
		if (selectedValueY == "x111") {
			if (!isNaN(d.x111)) {
				d.yValue = +d.x111;
				yName = "Political Freedoms";
			}
		}
		if (selectedValueY == "x112") {
			if (!isNaN(d.x112)) {
				d.yValue = +d.x112;
				yName = "Protection Against Crime and Violence";
			}
		}
		if (selectedValueY == "x113") {
			if (!isNaN(d.x113)) {
				d.yValue = +d.x113;
				yName = "Freedom from Discrimination and Persecution";
			}
		}
		if (selectedValueY == "x114") {
			if (!isNaN(d.x114)) {
				d.yValue = +d.x114;
				yName = "Equality Between Men and Women";
			}
		}
		if (selectedValueY == "x115") {
			if (!isNaN(d.x115)) {
				d.yValue = +d.x115;
				yName = "Better Job Opportunities";
			}
		}
		if (selectedValueY == "Votes") {
			if (!isNaN(Votes)) {
				d.yValue = +d.Votes;
				yName = "Total Votes";
			}
		}
		});

	vis.displayData = test.sort(function(a,b) {return (b.Votes - a.Votes)});
	vis.updateVis(xName, yName, selectedValueCont);
	}

ScatterPlot.prototype.updateVis = function( xName, yName, selectedValueCont){
	console.log("updateVis");
	var vis = this;
	var xMin = 0.9*d3.min(vis.displayData, function(d) { return d.xValue; });
	var xMax = 1.1*d3.max(vis.displayData, function(d) { return d.xValue; });
	var yMin = 0;
	var yMax = 1.1*d3.max(vis.displayData, function(d) { return d.yValue/ d.Votes; });
	vis.xScale.domain([xMin, xMax]);
	vis.yScale.domain([yMin, yMax]);

	vis.rScale.domain(d3.extent(vis.displayData, function(d) { return d.Votes; }));

	vis.xAxisLabel.text(xName);
	vis.yAxisLabel.text("% of Votes for : " + yName);

	var continentVar = ["Asia", "Africa", "Europe", "North America", "South America", "AustraliaPacificIslands"];
	var colorScale = d3.scale.category10()
		.domain(continentVar);

	var circle = vis.svg.selectAll("circle")
		.data(vis.data);
// Enter (initialize the newly added elements)
	circle.enter().append("circle")
		.attr("class", "dot")
		.append("svg:title")
			.text(function(d) { return ("hi") ; });

// Update (set the dynamic properties of the elements)
	circle
		.attr("r",function(d) { return vis.rScale(d.Votes) })
		.attr("cx", function(d) { return vis.xScale(d.xValue) })
		.attr("cy", function(d) { return vis.yScale(d.yValue/ d.Votes) })
		.attr("data-legend",function(d) { return d.Continent})
		.attr("fill", function(d) { return colorScale(d.Continent) })
		.attr("opacity", function(d) {
			if (selectedValueCont == "ALL") { return 1;}
			if (d.Continent == selectedValueCont) {return 1;}
			else {return 0;}
		})
		.attr("stroke", "black");




	circle.select("title").text(function(d) {
		if (selectedValueCont == "ALL") { return (d.countryName + "\n" + xName + " = " + d.xValue + "\n" + d.yValue + " Votes / " + d.Votes+ " Total"); }
		if (d.Continent == selectedValueCont) {return (d.countryName + "\n" + xName + " = " + d.xValue + "\n" + d.yValue + " Votes / " + d.Votes+ " Total") }
		else {return "";}}
		);

// Exit
	circle.exit().remove("circle");

// Call axis functions with the new domain
	vis.svg.select(".x-axis")
		.call(vis.xAxis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");

	vis.svg.select(".y-axis").call(vis.yAxis);

	var legend = vis.svg.selectAll("g.legend")
		.data(continentVar )
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", vis.width - 45)
		.attr("y", function(d, i){ return vis.height - 75 + (i*12) })
		.attr("width", 10)
		.attr("height", 10)
		.attr("stroke", "black")
		.style("fill", function(d){return colorScale(d);});

	legend.append("text")
		.attr("x",vis.width - 30)
		.attr("y", function(d,i){return vis.height - 65 + (i*12)})
		.attr("class", "legend-text")
		.text(function(d){
			if (d == "AustraliaPacificIslands") { return "Australia & Pacific Islands";}
			else {return d;}
		});

	legend.append("text")
		.attr("x",vis.width - 45)
		.attr("y", vis.height - 80)
		.attr("class", "legend-text")
		.text("Point Size ~ log(#voters)");

}

