# GraphLab

Foobar is a Python library for dealing with word pluralization.
GraphLab is a JavaScript library, which solves the following problems:
1. Visualises mathematical functions in 3D space.
2. Shows more than just one function for comparison.
3. Allows those functions to be written in JavaScript (rather than as a mathematic formula) for subsequent copy-and-paste to another program (i.e. written in Java, C++, etc.).
4. Allows for using additional parameters for functions and see how they change in real time.
5. Enables the functions to be animated in case they relay on parameters that change continuously in time.

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

myGraph.insertFunction(function_1, name, optional_colour);
myGraph.insertFunction(function_2, name, optional_colour);
....
myGraph.insertSwitchPanel(); // if you want to be able to turn on/off functions
myGraph.range_x(from, to, optional_step);
myGraph.range_y(from, to, optional_step);
myGraph.range_z(from, to, optional_step);
myGraph.axisNames('X', 'Y', 'Z');
myGraph.reGraph(); // to draw it for the first time
// or
setInterval (function () {gr . reGraph ();}, 100); // if you wish the graph to be animated every 100 milliseconds
// enjoy....



```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
