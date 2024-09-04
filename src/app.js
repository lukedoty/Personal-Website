const DEBUG = true;

var canvas;

var centerOffset;
var viewer;
var scl;

var screenBounds;
var loadBuffer;

var content = new Set();
var loadedContent = new Set();

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseWheel(zoom);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');

    centerOffset = createVector(windowWidth / 2, windowHeight / 2);
    viewer = createVector(0, 0);
    scl = {
        'value': 1,
        'min': 0.1,
        'max': 10,
        'factor': 0.1
    }

    screenBounds = new Bounds();
    loadBuffer = 250;
}

function draw() {
    background(220);

    screenBounds.x = (-viewer.x - loadBuffer) / scl.value - centerOffset.x;
    screenBounds.y = (-viewer.y - loadBuffer) / scl.value - centerOffset.y;
    screenBounds.w = (windowWidth + 2 * loadBuffer) / scl.value;
    screenBounds.h = (windowHeight + 2 * loadBuffer) / scl.value;

    //Load content
    content.forEach(c => {
        if (screenBounds.intersects(c.bounds)) {
            if (!loadedContent.has(c)) {
                c.load();
                loadedContent.add(c);
                loadedContent = sortByLayer(loadedContent);
                if (DEBUG) console.log("load");
            }
        } else if (loadedContent.has(c)) {
            c.unload();
            loadedContent.delete(c);
            if (DEBUG) console.log("unload");
        }
    });

    //Update content
    loadedContent.forEach(lc => {
        lc.update();
    });

    push();
    //Pan and Zoom
    translate(viewer.x, viewer.y);
    scale(scl.value);
    translate(centerOffset.x, centerOffset.y);

    if (DEBUG) {
        push();
        stroke('blue');
        strokeWeight(1);
        noFill();
        rect(screenBounds.x, screenBounds.y, screenBounds.w, screenBounds.h);
        pop();
    }

    //0, 0 Gizmo
    if (DEBUG) draw00();

    //Draw content
    loadedContent.forEach(lc => {
        push();
        if (DEBUG) {
            push();
            stroke('red');
            strokeWeight(1);
            noFill();
            rect(lc.bounds.x, lc.bounds.y, lc.bounds.w, lc.bounds.h);
            pop();
        }
        translate(lc.bounds.x, lc.bounds.y);
        lc.draw();
        pop();
    });

    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerOffset.x = windowWidth / 2;
    centerOffset.y = windowHeight / 2;
}

function mouseDragged() {
    viewer.x += movedX;
    viewer.y += movedY;
}

function sortByLayer(contentSet) {
    let arr = Array.from(contentSet);
    arr.sort((a, b) => b.layer - a.layer).reverse();
    return new Set(arr);
}

function zoom(event) {
    let factor;
    if (event.deltaY > 0) {
        factor = 1 + scl.factor;
        if (scl.value >= scl.max) return false;
    } else {
        factor = 1 - scl.factor;
        if (scl.value <= scl.min) return false;
    }
    
    scl.value *= factor;
    viewer.x = mouseX - (mouseX * factor) + (viewer.x * factor);
    viewer.y = mouseY - (mouseY * factor) + (viewer.y * factor);

    return false;
}

function draw00() {
    push();
    strokeWeight(20);
    stroke('red');
    point(0, 0);
    stroke('green');
    point(50, 0);
    stroke('blue');
    point(0, 50);
    pop();
}
   