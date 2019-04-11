
const graph = require ('./graph').graph;

require('jest-canvas-mock');

test("JSON-based setup", function () {
  var myGraph = new graph({
    range_x: {from: -4, to: 6, tick: 2},
    range_z: {from: -5, to: 3, tick: 3},
    range_y: {from: -6, to: 12},
    scaling: 0.4,
    yaw: 0.5,
    roll: 0.4,
    x_name: "xx",
    y_name: "yy",
    z_name: "zz",
    sonda: "sputnik"
  });
  expect(myGraph).not.toBeNull();
  expect(myGraph.width).toBe(5);
  expect(myGraph.x_shift).toBe(-1);
  expect(myGraph.x_tick).toBe(2);
  expect(myGraph.depth).toBe(4);
  expect(myGraph.z_shift).toBe(1);
  expect(myGraph.z_tick).toBe(3);
  expect(myGraph.height).toBe(9);
  expect(myGraph.y_shift).toBe(-3);
  expect(myGraph.y_tick).toBe(1);
  expect(myGraph.scaling).toBe(0.4);
  expect(myGraph.alpha).toBe(0.4);
  expect(myGraph.beta).toBe(0.5);
  expect(myGraph.x_name).toBe("xx");
  expect(myGraph.y_name).toBe("yy");
  expect(myGraph.z_name).toBe("zz");
  expect(myGraph.sonda).toBe("sputnik");
});

test("Function-based setup", function () {
  var myGraph = new graph();
  myGraph.axisNames("xx", "zz", "yy");
  myGraph.range_y(7, 8, 5);
  myGraph.range_x(1, 1);
  myGraph.range_z(1, 1);
  expect(myGraph.x_name).toBe("xx");
  expect(myGraph.y_name).toBe("yy");
  expect(myGraph.z_name).toBe("zz");
  expect(myGraph.y_tick).toBe(5);
  expect(myGraph.x_tick).toBe(1);
  expect(myGraph.z_tick).toBe(1);
});

function buildDiv (id) {
  document.body.innerHTML = "<div id=" + id + " />";
  var div = document.createElement("div");
  div.appendChild = jest.fn();
  document.getElementById = jest.fn();
  document.getElementById.mockReturnValueOnce(div);
  return div;
};

function expectCallsOnDiv (graph, div, id) {
  expect(document.getElementById).toHaveBeenCalledWith(id);
  expect(graph.div).toBe(div);
  expect(div.appendChild).toHaveBeenCalledWith(graph.canvas);
};

test("Inserting canvas into specified div (version 1).", function () {
  var g = document.getElementById;
  var div = buildDiv("graph_id");
  var myGraph = new graph("graph_id");
  expectCallsOnDiv(myGraph, div, "graph_id");
  document.getElementById = g;
});

test("Inserting canvas into specified div (version 2).", function () {
  var g = document.getElementById;
  var div = buildDiv("graph_id");
  var myGraph = new graph("graph_id", {});
  expectCallsOnDiv(myGraph, div, "graph_id");
  document.getElementById = g;
});

test("Inserting canvas into specified div (version 3).", function () {
  var g = document.getElementById;
  var div = buildDiv("graph_id");
  var myGraph = new graph({}, "graph_id");
  expectCallsOnDiv(myGraph, div, "graph_id");
  document.getElementById = g;
});

test("Inserting canvas into <body> (version without JSON-based setup).", function () {
  var g = document.body.appendChild;
  document.body.appendChild = jest.fn();
  var myGraph = new graph();
  expect(document.body.appendChild).toHaveBeenCalledWith(myGraph.canvas);
  document.body.appendChild = g;
});

test("Inserting canvas into <body> (version with JSON-based setup).", function () {
  var g = document.body.appendChild;
  document.body.appendChild = jest.fn();
  var myGraph = new graph({});
  expect(document.body.appendChild).toHaveBeenCalledWith(myGraph.canvas);
  document.body.appendChild = g;
});

test("Inserting functions", function () {
  var myGraph = new graph();
  var f1 = jest.fn();
  var f2 = jest.fn();
  myGraph.insertFunction(f1, "F1");
  myGraph.insertFunction(f2, "F2", "yellow");
  expect(myGraph.functions).toEqual({F1: f1, F2: f2});
  expect(myGraph.function_switches).toEqual({F1: true, F2: true});
  expect(myGraph.function_colours).toEqual({F1: "red", F2: "yellow"});
});

test("Drawing", function () {
  var myGraph = new graph();
  var lineTo = jest.fn();
  myGraph.ctx.lineTo = lineTo;
  myGraph.reRoll(Math.PI * -0.5, 0);
  myGraph.zee = -2500;
  myGraph.colours = ["red"];
  myGraph.insertFunction(function () {return 0;}, "sputnik");
  myGraph.insertFunction(function () {return 1;}, "voyager");
  myGraph.insertFunction(null, "sonda");
  myGraph.canvas.onmousemove({buttons: 1, movementX: 2, movementY: -1});
  myGraph.centre = true;
  myGraph.background_colour = "blue";
  myGraph.x_axis = false;
  myGraph.y_axis = false;
  myGraph.z_axis = false;
  myGraph.function_switches["voyager"] = false;
  myGraph.canvas.onmousemove({buttons: 2, movementX: 2, movementY: -1});
  myGraph.canvas.onmousemove({buttons: 3, movementX: 2, movementY: -1});
  expect(lineTo).toHaveBeenCalled();
  lineTo = jest.fn();
  myGraph.ctx.lineTo = lineTo;
  delete myGraph.ctx;
  myGraph.draw();
  Object.defineProperty(myGraph.canvas, "offsetWidth", {value: 100, writable: false});
  Object.defineProperty(myGraph.canvas, "offsetHeight", {value: 100, writable: false});
  myGraph.draw();
  expect(lineTo).not.toHaveBeenCalled();
});

test("Insert switch panel into <body>.", function () {
  var g = document.body.appendChild;
  document.body.appendChild = jest.fn();
  var myGraph = new graph();
  myGraph.insertFunction(jest.fn(), "sonda");
  myGraph.insertSwitchPanel();
  expect(document.body.appendChild).toBeCalled();
  document.body.appendChild = g;
});

test("Insert switch panel into specified div.", function () {
  var g = document.getElementById;
  buildDiv("graph_id");
  document.getElementById = g;
  var myGraph = new graph("graph_id");
  myGraph.insertFunction(jest.fn(), "sonda");
  myGraph.insertSwitchPanel();
  var checkbox = document.getElementById("sonda");
  checkbox.checked = false;
  checkbox.onchange();
  expect(myGraph.function_switches["sonda"]).toBe(false);
});

test("Initial canvas width and height might need to be set automatically.", function () {
  var canvas = document.createElement("canvas");
  Object.defineProperty(canvas, "offsetWidth", {value: 200, writable: false});
  Object.defineProperty(canvas, "offsetHeight", {value: 100, writable: false});
  var g = document.createElement;
  document.createElement = jest.fn();
  document.createElement.mockReturnValueOnce(canvas);
  var myGRaph = new graph();
  expect(canvas.width).toBe(200);
  expect(canvas.height).toBe(100);
  document.createElement = g;
});

test("Mouse onwheel.", function () {
  var myGraph = new graph({scaling: 1});
  var e = {
    preventDefault: jest.fn(),
    deltaX: 1,
    deltaY: 2,
    deltaZ: 3
  };
  myGraph.canvas.onwheel(e);
  expect(e.preventDefault).toHaveBeenCalled();
  expect(myGraph.scaling).toBe(0.70710678118654752440084436210485);
  myGraph.z_scaling = true;
  myGraph.canvas.onwheel(e);
  expect(myGraph.zee).toBe(600);
});

test("Create parameter block.", function () {
  var myGraph = new graph("graph_id");
  myGraph.createParameter("Amplitudes", 0, 1, 0.01);
  myGraph.createParameterBlock();
  myGraph.createParameterBlock("graph_id");
  myGraph.createParameter("Amplitude", 0, 1, 0.01, 0.5);
  myGraph.createParameter("Sonda");
  myGraph.createParameter("Sputnik", 1);
  myGraph.createParameter("Voyager", 1, 2);
  expect(Amplitude).toBe(0.5);
  document.getElementById("Amplitude_slider").oninput();
});

test("Document body on context should return false.", function () {
  new graph();
  expect(document.body.oncontextmenu()).toBe(false);
});

test("Animation", function () {
  var si = setInterval;
  setInterval = function (f, d) {f();};
  var myGraph = new graph();
  myGraph.animate(100);
  myGraph.animate(120, jest.fn());
  setInterval = si;
});
