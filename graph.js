//////////////////////////////////////////////////////////
// GRAPHING LIBRARY                                     //
// Copyright (C) 2019, Consunet Pty. Ltd.               //
// Author: Robert Wolf                                  //
// ==================================================== //
// Solves the following problems:
// 1. Presents multiple functions at the same time.
// 2. Presents functions in 3D space.
// 3. Allows to write the functions in JavaScript
//    for subsequent copy/paste into Java code.
// 4. Allows for using additional parameters for functions
//    and see how they change in real time.
// 5. Enables the functions to be animated in case they relay
//    on parameters that change continuously in time.
// Usage:
//   var myGraph = new graph(optional id of HTML element for inserting canvas);
//   myGraph.insertFunction(f1, name, optional colour);
//   myGraph.insertFunction(f2, name, optional colour);
//   ....
//   myGraph.insertSwitchPanel(); if you want to turn on/off functions
//   myGraph.range_x(from, to, optional step);
//   myGraph.range_y(from, to, optional step);
//   myGraph.range_z(from, to, optional step);
//   myGraph.axisNames(X, Y, Z);
//   myGraph.(); to draw it for the first time (or re-draw it for animation)
//   enjoy....
/////////////////////////////////////////////////////////

/*jslint
  this, for, browser, eval
*/
/*global module, speechSynthesis, SpeechSynthesisUtterance */

var graph = function (parameter_1, parameter_2) {
    if (typeof(parameter_1) === "string") {
        this.div_id = parameter_1;
    }
    if (typeof(parameter_2) === "string") {
        this.div_id = parameter_2;
    }
    if (typeof(parameter_1) === "object") {
        this.setup = parameter_1;
    }
    if (typeof(parameter_2) === "object") {
        this.setup = parameter_2;
    }
    this.zee = 0;
    this.colours = [
        "red", "green", "yellow", "lime", "fuchsia",
        "teal", "orange", "aqua", "maroon", "olive",
        "white", "purple", "silver", "gold"
    ];
    this.functions = {};
    this.function_switches = {};
    this.function_colours = {};
    this.screen = 2500;
    this.width = 1;
    this.height = 1;
    this.depth = 1;
    this.x_tick = 1;
    this.z_tick = 1;
    this.y_tick = 1;
    this.x_shift = 0;
    this.y_shift = 0;
    this.z_shift = 0;
    this.x_name = "X";
    this.y_name = "Y";
    this.z_name = "Z";
    this.axis_font = "96px arial";
    this.centre = false;
    this.x_axis = true;
    this.y_axis = true;
    this.z_axis = true;
    this.axisNames = function (x, z, y) {
        this.x_name = x;
        this.y_name = y;
        this.z_name = z;
    };
    this.range_x = function (from, to, tick) {
        this.width = (to - from) / 2;
        this.x_shift = (to + from) / -2;
        if (tick !== undefined) {
            this.x_tick = tick;
        }
    };
    this.range_y = function (from, to, tick) {
        this.height = (to - from) / 2;
        this.y_shift = (to + from) / -2;
        if (tick !== undefined) {
            this.y_tick = tick;
        }
    };
    this.range_z = function (from, to, tick) {
        this.depth = (to - from) / 2;
        this.z_shift = (to + from) / -2;
        if (tick !== undefined) {
            this.z_tick = tick;
        }
    };
    this.alpha = 0;
    this.alphaCos = 1;
    this.alphaSin = 0;
    this.beta = 0;
    this.betaCos = 1;
    this.betaSin = 0;
    this.lineto = function (x, y, z) {
        var xx = x * this.betaCos - z * this.betaSin;
        var zz = z * this.betaCos + x * this.betaSin;
        var yy = y * this.alphaCos - zz * this.alphaSin;
        zz = zz * this.alphaCos + y * this.alphaSin + this.screen;
        zz += this.zee;
        if (zz <= 0) {
            return;
        }
        xx = this.screen * (xx + this.drift_x) / zz;
        yy = this.screen * (yy - this.drift_y) / zz;
        this.ctx.lineTo(xx, -yy);
    };
    this.text = function (x, y, z, text) {
        var xx = x * this.betaCos - z * this.betaSin;
        var zz = z * this.betaCos + x * this.betaSin;
        var yy = y * this.alphaCos - zz * this.alphaSin;
        zz = zz * this.alphaCos + y * this.alphaSin + this.screen;
        zz += this.zee;
        if (zz <= 0) {
            return;
        }
        xx = this.screen * (xx + this.drift_x) / zz;
        yy = this.screen * (yy - this.drift_y) / zz;
        this.ctx.fillText(text, xx, -yy);
    };
    this.scaling = 1;
    this.drift_x = 0;
    this.drift_y = 0;
    this.reAlpha = function (alpha) {
        this.alphaCos = Math.cos(alpha);
        this.alphaSin = Math.sin(alpha);
    };
    this.reBeta = function (beta) {
        this.betaCos = Math.cos(beta);
        this.betaSin = Math.sin(beta);
    };
    this.reRoll = function (a, b) {
        this.alpha = a;
        this.beta = b;
        this.reAlpha(this.alpha);
        this.reBeta(this.beta);
    };
    this.roll = function (alpha, beta) {
        this.reRoll(this.alpha - alpha, this.beta + beta);
        this.reGraph();
    };
    this.move = function (x, y) {
        this.drift_x += x;
        this.drift_y += y;
        this.reGraph();
    };
    this.graphFunction = function (ind, width) {
        var f = this.functions[ind];
        if (!f) {
            return;
        }
        this.ctx.strokeStyle = (
            this.function_colours[ind] !== undefined
            ? this.function_colours[ind]
            : "gray"
        );
        var gww = this.width / width;
        var gzw = this.depth / width;
        var wgh = width / this.height;
        var wgt = width * this.x_tick / this.width;
        var zgt = width * this.z_tick / this.depth;
        var XX;
        var x;
        var ZZ;
        var z;
        z = (
            this.centre
            ? 0
            : -width
        );
        while (z < width + 1) {
            ZZ = z * gzw - this.z_shift;
            x = -width;
            this.ctx.beginPath();
            while (x <= width) {
                this.lineto(x, (
                    f(x * gww - this.x_shift, ZZ) + this.y_shift
                ) * wgh, z);
                x += 1;
            }
            this.ctx.stroke();
            z += zgt;
        }
        if (this.centre) {
            z = -zgt;
            while (z > -width - 1) {
                ZZ = z * gzw - this.z_shift;
                x = -width;
                this.ctx.beginPath();
                while (x <= width) {
                    this.lineto(x, (
                        f(x * gww - this.x_shift, ZZ) + this.y_shift
                    ) * wgh, z);
                    x += 1;
                }
                this.ctx.stroke();
                z -= zgt;
            }
        }
        x = (
            this.centre
            ? 0
            : -width
        );
        while (x < width + 1) {
            XX = x * gww - this.x_shift;
            z = -width;
            this.ctx.beginPath();
            while (z <= width) {
                ZZ = z * gww;
                this.lineto(x, (
                    f(XX, z * gzw - this.z_shift) + this.y_shift
                ) * wgh, z);
                z += 1;
            }
            this.ctx.stroke();
            x += wgt;
        }
        if (this.centre) {
            x = -wgt;
            while (x > -width - 1) {
                XX = x * gww - this.x_shift;
                z = -width;
                this.ctx.beginPath();
                while (z <= width) {
                    ZZ = z * gww;
                    this.lineto(x, (
                        f(XX, z * gzw - this.z_shift) + this.y_shift
                    ) * wgh, z);
                    z += 1;
                }
                this.ctx.stroke();
                x -= wgt;
            }
        }
    };
    var grapher = this;
    this.reGraph = function () {
        if (this.div_id === undefined) {
            if (this.canvas.offsetWidth > 0) {
                this.canvas.width = this.canvas.offsetWidth;
            }
            if (this.canvas.offsetHeight > 0) {
                this.canvas.height = this.canvas.offsetHeight;
            }
        }
        if (this.ctx === undefined) {
            return;
        }
        this.ctx.save();
        var bgcolour = this.background_colour;
        if (bgcolour === undefined) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = bgcolour;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        var cw = this.canvas.width * 0.5;
        var ch = this.canvas.height * 0.5;
        this.ctx.translate(cw, ch);
        this.ctx.scale(this.scaling, this.scaling);
        this.ctx.lineWidth = 1 / this.scaling;
        this.ctx.strokeStyle = "blue";
        var xw = this.x_shift * cw / this.width;
        var yw = this.y_shift * cw / this.height;
        var zw = this.z_shift * cw / this.depth;
        if (this.x_axis) {
            this.ctx.beginPath();
            this.lineto(-cw, yw, zw);
            this.lineto(cw, yw, zw);
            this.ctx.stroke();
        }
        if (this.y_axis) {
            this.ctx.beginPath();
            this.lineto(xw, -cw, zw);
            this.lineto(xw, cw, zw);
            this.ctx.stroke();
        }
        if (this.z_axis) {
            this.ctx.beginPath();
            this.lineto(xw, yw, -cw);
            this.lineto(xw, yw, cw);
            this.ctx.stroke();
        }
        var keys = Object.keys(this.functions);
        keys.forEach(function (ind) {
            if (grapher.function_switches[ind]) {
                grapher.graphFunction(ind, cw);
            }
        });
        this.ctx.fillStyle = "white";
        this.ctx.font = this.axis_font;
        this.text(ch, yw, zw, this.x_name);
        this.text(xw, ch, zw, this.y_name);
        this.text(xw, yw, ch, this.z_name);
        this.ctx.restore();
    };
    this.draw = this.reGraph;
    this.insertFunction = function (f, name, colour) {
        this.functions[name] = f;
        this.function_switches[name] = true;
        this.function_colours[name] = (
            colour === undefined
            ? this.colours.shift()
            : colour
        );
    };
    this.insertSwitchPanel = function () {
        var div = document.createElement("div");
        div.style.fontFamily = "arial";
        div.style.position = "absolute";
        div.style.left = "10px";
        div.style.top = "10px";
        div.style.background = "#ffffffaa";
        div.style["text-align"] = "left";
        var function_names = Object.keys(this.functions);
        function_names.forEach(function (ind) {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = true;
            checkbox.id = ind;
            checkbox.onchange = function () {
                grapher.function_switches[this.id] = this.checked;
                grapher.reGraph();
            };
            div.appendChild(checkbox);
            var label = document.createElement("span");
            label.style.color = grapher.function_colours[ind];
            label.appendChild(document.createTextNode(ind));
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });
        if (this.div === undefined) {
            document.body.appendChild(div);
        } else {
            this.div.appendChild(div);
        }
    };
    this.canvas = document.createElement("canvas");
    this.canvas.id = "graph";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    document.body.oncontextmenu = function () {
        return false;
    };
    this.canvas.onmousemove = function (e) {
        if (e.buttons === 1) {
            grapher.roll(e.movementY / 100, e.movementX / 100);
            return;
        }
        if (e.buttons === 2) {
            grapher.move(e.movementX, e.movementY);
            return;
        }
    };
    this.canvas.onwheel = function (e) {
        e.preventDefault();
        var delta = e.deltaX + e.deltaY + e.deltaZ;
        if (grapher.z_scaling) {
            grapher.zee += delta * 100;
        } else {
            grapher.scaling *= Math.pow(2, -delta / 12);
        }
        grapher.reGraph();
    };
    if (this.div_id !== undefined) {
        this.div = document.getElementById(this.div_id);
        this.div.appendChild(this.canvas);
    } else {
        document.body.appendChild(this.canvas);
    }
    if (this.canvas.offsetWidth > 0) {
        this.canvas.width = this.canvas.offsetWidth;
    }
    if (this.canvas.offsetHeight > 0) {
        this.canvas.height = this.canvas.offsetHeight;
    }
    this.ctx = this.canvas.getContext("2d");
    this.parameter_block = null;
    this.createParameterBlock = function (div) {
        this.parameter_block = (
            div == null
            ? null
            : document.getElementById(div)
        );
        if (this.parameter_block === null) {
            this.parameter_block = document.createElement("div");
            document.body.appendChild(this.parameter_block);
        }
        this.parameter_block.id = "parameter_block";
        this.parameter_block.style.fontFamily = "arial";
        this.parameter_block.style.position = "absolute";
        this.parameter_block.style.left = "10px";
        this.parameter_block.style.bottom = "10px";
        this.parameter_block.style.background = "#ffffffaa";
        this.parameter_block.appendChild(document.createTextNode("PARAMETERS"));
        this.parameter_block.appendChild(document.createElement("br"));
    };
    this.createParameter = function (parameter, from, to, step, init) {
        if (this.parameter_block === null) {
            return;
        }
        var span = document.createElement("span");
        var slider = document.createElement("input");
        slider.id = parameter + "_slider";
        slider.type = "range";
        if (from !== undefined) {
            slider.min = from;
        }
        if (to !== undefined) {
            slider.max = to;
        }
        if (step !== undefined) {
            slider.step = step;
        }
        if (init !== undefined) {
            slider.value = init;
        }
        slider.oninput = function () {
            var v = Number(this.value);
            eval(parameter + " = " + v);
            span.innerHTML = v;
            grapher.reGraph();
        };
        var v = Number(slider.value);
        eval(parameter + " = " + v);
        span.style.display = "inline-block";
        span.style.width = "60px";
        span.innerHTML = Number(slider.value);
        this.parameter_block.appendChild(slider);
        this.parameter_block.appendChild(
            document.createTextNode(" " + parameter + " = ")
        );
        this.parameter_block.appendChild(span);
        this.parameter_block.appendChild(document.createElement("br"));
    };
    this.animate = function (delay, f) {
        if (f === undefined) {
            setInterval(function () {
                grapher.reGraph();
            }, delay);
        } else {
            setInterval(function () {
                f();
                grapher.reGraph();
            }, delay);
        }
    };
    if (this.setup !== undefined) {
        Object.keys(this.setup).forEach(function (key) {
            var value = grapher.setup[key];
            switch (key) {
            case "roll":
                grapher.alpha = value;
                grapher.reAlpha(value);
                break;
            case "yaw":
                grapher.beta = value;
                grapher.reBeta(value);
                break;
            case "range_y":
                grapher.range_y(value.from, value.to, value.tick);
                break;
            case "range_x":
                grapher.range_x(value.from, value.to, value.tick);
                break;
            case "range_z":
                grapher.range_z(value.from, value.to, value.tick);
                break;
            default:
                grapher[key] = value;
            }
        });
    }
};

var module;
if (module !== undefined) {
    module.exports.graph = graph;
}
