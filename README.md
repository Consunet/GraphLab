# GraphLab

GraphLab is a JavaScript library, which solves the following problems:
1. Visualises mathematical functions in 3D space.
2. Shows more than just one function for comparison.
3. Allows those functions to be written in JavaScript (rather than as a mathematic formula) for subsequent copy-and-paste to another program (i.e. written in Java, C++, etc.).
4. Allows for using additional parameters for functions and see how they change in real time.
5. Enables the functions to be animated in case they rely on parameters that change continuously in time.

## Installation

Use the package manager [npm ](https://www.npmjs.com/) to install GraphLab.

```bash
npm install @consunet/graph-lab
```

## Usage

```javascript
// in ReactJS
import GraphLab from @consunet/graph-lab
// in JavaScript application
var GraphLab = require('@consunet/graph-lab');
// in raw HTML
<script src="node_modules/@consunet/graph-lab/graph.js"></script>

var myGraph = new graph(); // if you want to place graph into the entire <body>
var myGraph = new graph('div_id'); // if you want to specify a <div> element, where the graph is inserted.
var myGraph = new graph('div_id', {....}); // with specified <div> element and JSON-based setup.
var myGraph = new graph({....}); // with graph placed into the entire <body> and JSON-based setup.

myGraph.insertFunction(function_1, name, optional_colour);
myGraph.insertFunction(function_2, name, optional_colour);
....
myGraph.insertSwitchPanel(); // if you want to be able to turn on/off functions

// the following are some setup commands, which you may use
// if you decided not to use JSON-based setup
myGraph.range_x(from, to, step);
myGraph.range_y(from, to);
myGraph.range_z(from, to, step);
myGraph.axisNames('X', 'Z', 'Y'); // please, observer the order as the Y axis goes last!
myGraph.scaling(0.4);
myGraph.reRoll(-0.5, -0.5);


myGraph.draw(); // to draw it for the first time
// or
setInterval(function() {gr.draw ();}, 100); // if you wish the graph to be animated every 100 milliseconds
// or simply
myGraph.animate(100); // with optional myGraph.animate(100, myFunction) to update some global parameters
// enjoy....



```
## JSON-based setup
You may make the code shorter by using JSON-based setup in the graph constructor
rather than calling separate commands. The controllable parameters are listed
below:

```javascript

myGraph = new graph({
  scaling: 0.4,          // controls the initial magnification of the graph (same as using mouse wheel)
  yaw: -0.5,             // controls the initial yaw of the graph (same as moving mouse vertically)
  roll: -0.5,            // controls the initial rotation of the graph (same as moving mouse horizontally)
  range_y: {from: -4, to: 4},            // controls the range of the y axis
  range_x: {from: -10, to: 10, tick: 1}, // controls the range of the x axis with ticks specified
  range_z: {from: -10, to: 10, tick: 1}, // controls the range of the z axis with ticks specified
  x_name: 'x',           // controls the name of the x axis
  y_name: 'y',           // controls the name of the y axis
  z_name: 'z',           // controls the name of the z axis
});

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
