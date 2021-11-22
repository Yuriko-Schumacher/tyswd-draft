const margin = { t: 200, r: 200, b: 200, l: 200 };
const padding = 15;
const size = { w: window.innerWidth, h: window.innerHeight };
const svg = d3.select(".chart").append("svg");

svg.attr("width", size.w).attr("height", size.h);

const containerG = svg
	.append("g")
	.classed("container", true)
	.attr("transform", `translate(${margin.t}, ${margin.l})`);

size.w = size.w - margin.l - margin.r;
size.h = size.h - margin.t - margin.b;

const parseTime = d3.timeParse("%Y-%m-%d");

d3.csv("data/accidents_illumination_merged.csv", function (d) {
	d.date = parseTime(d.date);
	d.year = +d.year;
	d.est_pct_illuminated = +d.est_pct_illuminated;
	d.pct_fixed = +d.pct_fixed;
	d.fatalities = +d.fatalities;
	return d;
}).then(function (data) {
	let chart = new RadialScatter();
	chart.data(data).selection(containerG).size(size.h).draw();
});
