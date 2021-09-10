export function bubbleChart() {
    const width = 1100;
    const height = 1000;

  
    // location to centre the bubbles
    const centre = { x: width/2, y: height/2 };
  
    // strength to apply to the position forces
    const forceStrength = 0.03;
  
    // these will be set in createNodes and chart functions
    let svg = null;
    let bubbles = null;
    // let labels = null;
    let nodes = [];
  
    // charge is dependent on size of the bubble, so bigger towards the middle
    function charge(d) {
      return Math.pow(d.radius, 2.0) * 0.01
    }
  
    // create a force simulation and add forces to it
    const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(charge))
    .force('x', d3.forceX().strength(forceStrength).x(centre.x))
    .force('y', d3.forceY().strength(forceStrength).y(centre.y))
    .force('collision', d3.forceCollide().radius(d => d.radius + 1));

    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    simulation.stop();

    const fillColour = d3.scaleOrdinal()
        .domain([1, 2, 3, 4, 5])
        .range(["#881013", "#b5161a", "#e21c21", "#e8494d", "#f3a4a6"]);
  
    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // rawData is expected to be an array of data objects, read in d3.csv
    // function returns the new node array, with a node for each element in the rawData input
    function createNodes(rawData) {
      // use max size in the data as the max in the scale's domain
      // note we have to ensure that size is a number
      const maxSize = d3.max(rawData, d => +d.amount);
  
      // size bubbles based on area
      const radiusScale = d3.scaleSqrt()
        .domain([0, maxSize])
        .range([0, 40])
  
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
        .attr('width', width)
        .attr('height', height)
        .attr('viewbox', '0 0 1100 1000')
        
  
      // bind nodes data to circle elements
      const elements = svg.selectAll('.bubble')
        .data(nodes, d => d.committee)
        .enter()
        .append('g')
        
      //create the bubbles with the attributes of
      //each committee donation  
      bubbles = elements
        .append('circle')
        .classed('bubble', true)
        .attr('r', d => d.radius)
        .attr('fill', d => fillColour(Math.trunc(d.amount/250)))
        .attr('data-original-title', d => 'Committee: ' + d.committee + '\nAmount: ' + d.amount )
        .attr('data-toggle', 'tooltip');

  
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