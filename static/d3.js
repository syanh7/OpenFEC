export function bubbleChart() {
  var width = 300;
  var height = 300;


  // location to centre the bubbles
  const centre = { x: width/2, y: height/2 };

  // strength to apply to the position forces
  const forceStrength = 0.06;

  // these will be set in createNodes and chart functions
  let svg = null;
  let bubbles = null;
  let nodes = [];

  // charge is dependent on size of the bubble, so bigger towards the middle
  function charge(d) {
    return Math.pow(d.radius, 2.0) * 0.01
  }
  
  // create a force simulation and add forces to it
  const simulation = d3.forceSimulation()
  .velocityDecay(0.5)
  .force('charge', d3.forceManyBody().strength(charge))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('x', d3.forceX().strength(forceStrength).x(centre.x))
  .force('y', d3.forceY().strength(forceStrength).y(centre.y))
  .force('collision', d3.forceCollide().radius(d => d.radius + 1));

  // force simulation starts up automatically, which we don't want as there aren't any nodes yet
  simulation.stop();

  const fillColourNone = d3.scaleOrdinal()
      .domain([1, 2, 3, 4, 5])
      .range(["#5e5ebf", "#7070c7", "#8383ce", "#9595d5", "#a7a7dc"]);
  
  const fillColourREP = d3.scaleOrdinal()
      .domain([1, 2, 3, 4, 5])
      .range(["#881013", "#b5161a", "#e21c21", "#e8494d", "#f3a4a6"]);

  const fillColourDEM = d3.scaleOrdinal()
      .domain([1, 2, 3, 4, 5])
      .range(["#4da7ff", "#67b3ff", "#80c0ff", "#9acdff", "#b3d9ff"]);

  // data manipulation function takes raw data from csv and converts it into an array of node objects
  // each node will store data and visualisation values to draw a bubble
  // rawData is expected to be an array of data objects, read in d3.csv
  // function returns the new node array, with a node for each element in the rawData input
  function createNodes(rawData) {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    const maxSize = d3.max(rawData, d => +d.amount);
    console.log(maxSize);

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([0, 15])

    // use map() to convert raw data into node data
    const myNodes = rawData.map(d => ({
      ...d,
      radius: radiusScale(+d.amount),
      size: +d.amount,
      x: Math.random() * 450,
      y: Math.random() * 400
    }))
    

    return myNodes;
  }
  
  // main entry point to bubble chart, returned by parent closure
  // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
  let chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);
    // create svg element inside provided selector
    svg = d3.select(selector)
      .append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 300 300")
      .classed("svg-content", true);
      

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.committee)
      .enter()
      .append('g')
      .attr('id', d => 'circle-' + d.committee_id)
      
    //create the bubbles with the attributes of
    //each committee donation  
    const party = $("#candidate-party").text()

    if (party == 'DEM') {
      bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => fillColourDEM(Math.trunc(d.amount/250)))
      .attr('data-original-title', d => 'Committee: ' + d.committee + '\nAmount: ' + d.amount )
      .attr('data-toggle', 'tooltip');
    }
    else if (party == "REP") {
      bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => fillColourREP(Math.trunc(d.amount/250)))
      .attr('data-original-title', d => 'Committee: ' + d.committee + '\nAmount: ' + d.amount )
      .attr('data-toggle', 'tooltip');
    }
    else {
      bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => fillColourNone(Math.trunc(d.amount/250)))
      .attr('data-original-title', d => 'Committee: ' + d.committee + '\nAmount: ' + d.amount )
      .attr('data-toggle', 'tooltip');
    }



    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes)
      .on('tick', ticked)
      .restart()
  

  }


  // callback function called after every tick of the force simulation
  // here we do the actual repositioning of the circles based on current x and y value of their bound node data
  // x and y values are modified by the force simulation
  function ticked() {
    bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

  }

    // return chart function from closure

  return chart;

}