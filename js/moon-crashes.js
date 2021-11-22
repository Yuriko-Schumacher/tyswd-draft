function RadialScatter() {
	this._data = null;
	this._sel = null;
	this._size = 150;
	this._outerRadius = () => {
		return this._size / 2;
	};
	this._innerRadius = 0;

	this.data = function () {
		if (arguments.length > 0) {
			this._data = arguments[0];
			return this;
		}
		return this._data;
	};

	this.selection = function () {
		if (arguments.length > 0) {
			this._sel = arguments[0];
			return this;
		}
		return this._sel;
	};

	this.size = function () {
		if (arguments.length > 0) {
			this._size = arguments[0];
			this._outerRadius = this._size / 2;
			return this;
		}
		return this._size;
	};

	this.draw = function () {
		let xScale = d3
			.scaleLinear()
			.domain([0, 200])
			.range([2 * Math.PI, 0]);

		let yScale = d3
			.scaleTime()
			.domain([parseTime("1966-01-01"), parseTime("2030-12-31")])
			.range([this._innerRadius, this._outerRadius]);

		let rScale = d3
			.scaleSqrt()
			.domain(d3.extent(this._data, (d) => d.fatalities))
			.range([1, 15]);

		let aScale = d3
			.scaleLinear()
			.domain(d3.extent(this._data, (d) => d.fatalities))
			.range([0.1, 0.8]);

		this._drawXAxis();
		this._drawYAxis(yScale);
		this._addImgs(xScale, yScale);

		let circlesG = this._sel
			.append("g")
			.attr("transform", `translate(${size.w / 2}, ${size.h / 2})`);

		let circles = circlesG
			.selectAll("circle")
			.data(this._data)
			.join("circle")
			.attr("cx", (d) => yScale(d.date) * Math.cos(xScale(d.pct_fixed)))
			.attr("cy", (d) => -yScale(d.date) * Math.sin(xScale(d.pct_fixed)))
			.attr("r", (d) => rScale(d.fatalities))
			.attr("fill", "yellow")
			.attr("fill-opacity", (d) => aScale(d.fatalities))
			.attr("stroke-width", 0);

		// this._addTooltip(circles, this._data, aScale);
	};

	this._drawXAxis = function () {
		let data = [...Array(4).keys()];

		let xAxisG = this._sel
			.selectAll("g.axis-x")
			.data([0])
			.join("g")
			.classed("axis-x", true)
			.attr("transform", `translate(${size.w / 2}, ${size.h / 2})`);

		xAxisG
			.selectAll("line")
			.data(data)
			.join("line")
			.attr("x1", -this._outerRadius / 1.4)
			.attr("y1", -this._outerRadius / 1.4)
			.attr("x2", this._outerRadius / 1.4)
			.attr("y2", this._outerRadius / 1.4)
			.attr("transform", (d) => `rotate(${d * 45})`)
			.attr("stroke", "white")
			.attr("stroke-width", 0.5)
			.attr("stroke-opacity", 0.3);
	};

	this._drawYAxis = function (yScale) {
		let data = [
			"1970-01-01",
			"1980-01-01",
			"1990-01-01",
			"2000-01-01",
			"2010-01-01",
			"2020-01-01",
		];

		let yAxisG = this._sel
			.selectAll("g.axis-y")
			.data([0])
			.join("g")
			.classed("axis-y", true)
			.attr("transform", `translate(${size.w / 2}, ${size.h / 2})`);

		yAxisG
			.selectAll("circle")
			.data(data)
			.join("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", (d) => yScale(parseTime(d)))
			.attr("fill-opacity", 0)
			.attr("stroke", "white")
			.attr("stroke-width", 0.5)
			.attr("stroke-opacity", 0.3);
	};

	this._addImgs = function (xScale, yScale) {
		let data = [...Array(8).keys()];
		let imgSize = 75;

		let imgG = this._sel
			.selectAll("g.img")
			.data([0])
			.join("g")
			.classed("img", true)
			.attr(
				"transform",
				`translate(${size.w / 2 - imgSize / 2}, ${
					size.h / 2 - imgSize / 2
				})`
			);

		imgG.selectAll("image")
			.data(data)
			.join("image")
			.attr("width", imgSize)
			.attr("height", imgSize)
			.attr(
				"transform",
				(d) =>
					`translate(${
						yScale(parseTime("2030-12-31")) *
						Math.cos(xScale(d * 25))
					}, ${
						-yScale(parseTime("2030-12-31")) *
						Math.sin(xScale(d * 25))
					})`
			)
			.attr("href", (d) => `../assets/phase/${d + 1}.jpg`);
	};

	// this._addTooltip = function (circles, data, aScale) {
	// 	circles.on("mouseover", function () {
	// 		d3.selectAll("circle")
	// 			.attr("stroke-width", 0)
	// 			.attr("fill", "yellow")
	// 			.attr(
	// 				"fill-opacity",
	// 				aScale((d) => d.fatalities)
	// 			)
	// 			.attr("fill-opacity", (d) => aScale(d.fatalities));
	// 		d3.select(this)
	// 			.attr("stroke", "white")
	// 			.attr("stroke-width", 0.5)
	// 			.attr("fill", "white")
	// 			.attr("fill-opacity", 1);
	// 	});
	// };

	return this;
}
