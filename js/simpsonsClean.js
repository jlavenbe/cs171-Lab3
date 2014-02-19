(function() {
  var colorScale, data, i, names, ordinalScale, svg, update, worldData, xAxis, yScale;

  svg = d3.select("#visSimpsons").append("svg");
  svg.attr({
    width: 600,
    height: 400
  });

  /* here is the full list of data - our "world knowledge"*/


  worldData = [
    {
      name: "homer",
      age: 45
    }, {
      name: "maggie",
      age: 3
    }, {
      name: "march",
      age: 42
    }, {
      name: "bart",
      age: 14
    }, {
      name: "lisa",
      age: 13
    }, {
      name: "grandpa",
      age: 88
    }
  ];

  /* our view on the data is only the last 3 elements*/
  data = [];
  for (i = 1; i <= 3; ++i) {
    data.push(worldData.pop());
  }

  /* this is high-order function woodoo to create a list of only all names
  we need this list as reference for our ordinal scale/axis
  */
  names = data.reduce((function(old, d) {
    return old.concat(d.name);
  }), []);

  ordinalScale = d3.scale.ordinal().domain(names).rangeBands([10, 500]);

  yScale = d3.scale.linear().domain([
    0, d3.max(data, function(d) {
      return d.age;
    })
  ]).range([0, 200]);

  xAxis = d3.svg.axis().scale(ordinalScale);

  /* and for the fun of it we use some color scale. we use the woodoo from before to
  create a list of all (worldData) names to assign already colors to all potential elements
  */
  colorScale = d3.scale.category10().domain(worldData.reduce((function(old, d) {
    return old.concat(d.name);
  }), []));


  /* create axis*/
  svg.append("g").attr({
    "class": "x axis",
    "transform": "translate(0,200)"
  }).call(xAxis);

  update = function() {
    /* and again the pattern.. first all update data elements*/
    var bars;
    bars = svg.selectAll(".bar").data(data);

    /* then add alle new elements and give them an initial position*/
    bars.enter().append("rect").attr({
      "class": "bar",
      "x": function(d) {
        return ordinalScale(d.name) + 2;
      },
      "y": function(d) {
        return 200 - yScale(d.age);
      },
      "width": 1,
      "height": 1
    });

    /* delete the unused elements*/
    bars.exit().remove();

    /* and now apply the transition to all bound elements (including the newly added ones,
    excluding the just removed ones)
    */
    return bars.transition().attr({
      "x": function(d) {
        return ordinalScale(d.name) + 2;
      },
      "y": function(d) {
        return 200 - yScale(d.age);
      },
      "width": ordinalScale.rangeBand() - 5,
      "height": function(d) {
        return yScale(d.age);
      }
    }).style({
      "fill": function(d) {
        return colorScale(d.name);
      }
    });
  };

  update();

  /* create a button and apply a data change (more in the coffescript file)*/
  d3.select("body").append("button").text("add a simpson").on({
    "click": function() {
      if (worldData.length > 0) {
        data.push(worldData.pop());
        names = data.reduce((function(old, d) {
          return old.concat(d.name);
        }), []);
        ordinalScale = d3.scale.ordinal().domain(names).rangeBands([10, 500]);
        xAxis.scale(ordinalScale);
        yScale.domain([
          0, d3.max(data, function(d) {
            return d.age;
          })
        ]);
        d3.select(".x.axis").transition().call(xAxis);
        return update();
      }
    }
  });

}).call(this);
