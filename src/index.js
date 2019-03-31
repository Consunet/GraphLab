import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import GraphLab from '@consunet/graph-lab';

ReactDOM.render(<App />, document.getElementById('root'));

var graph = new GraphLab.graph('GraphLabDiv');

var offset = 0;

graph.insertFunction(function(x, z) {return window.Amplitude * Math.cos(x + offset) * Math.cos(z + offset);}, 'cos(x) \u00d7 cos(z)');
graph.insertFunction(function(x, z) {return window.Amplitude * Math.exp(x) * z / 100;}, 'exp(x) \u00d7 z');

graph.insertSwitchPanel();
graph.createParameterBlock();
graph.createParameter('Amplitude', 0, 1, 0.01, 1);

graph.range_x(Math.PI * -2, Math.PI * 2, Math.PI * 0.125);
graph.range_z(Math.PI * -2, Math.PI * 2, Math.PI * 0.125);
graph.range_y(-4, 4);

graph.scaling = 0.4;
graph.reRoll(-0.5, -0.5);

setInterval(function() {graph.reGraph(); offset += 0.04;}, 100);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
