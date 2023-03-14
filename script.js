import Vector from "./vector.js";

var canvas = document.querySelector('canvas');

var width = 800;
var height = 600;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

var drawingSurface = canvas.getContext('2d');

class Attractor {
    constructor() {
        this.coordinates = new Vector(300, 200);
        this.mass = 20;
    };

    clamp(n) {
        return Math.min(Math.max(n, 25), 50);
    }

    josh(x, x1, x2, y1, y2) {
        var m = (y2 - y1) / (x2 - x1);
        var b = y1 -  m*x1;
        return m*x + b;
    };

    attract(m) {
        var force = new Vector().subStatic(this.coordinates, m.coordinates)
        var dist = force.mag();
        dist = this.clamp(dist);
        console.log(dist)
        force.normalize();
        var strength = (this.mass) / (dist * dist) * 3;
        force.mult(strength);
        //console.log(force);

        return force;
    };

    display() {
        drawingSurface.fillRect(this.coordinates.x, this.coordinates.y, 100, 100);
    };
};

class Mover {
    constructor(x, y, w, h, bounce) {
        (w && h) ? this.size = new Vector(w, h) : this.size = new Vector(25, 25);
        (w && h) ? this.mass = (w + h) / 10 : this.mass = 5;
        (x && y) ? this.coordinates = new Vector(x, y) : this.coordinates = new Vector(50, 250);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.gravity = new Vector(0, 0.01);
        this.resistance = new Vector(0, 0.1);
        this.topSpeed = 10;
        (bounce) ? this.bounce = bounce : this.bounce = 0.9;
        this.hit = false;
        this.atRest = false;
    }

    checkEdges() {
        var coStatic = new Vector().addStatic(this.coordinates, this.velocity);

        if(Math.floor(coStatic.x)  > (width - this.size.x)) {
            if(Math.floor(this.velocity.x) == 0) {
                this.velocity.x = 0;
                this.acceleration.x = 0;
            }
            else {
                this.velocity.x *= -1;
            }
        }

        if(this.coordinates.x <= 0) {
            this.velocity.x *= -1;
        }
        
        if(Math.floor(coStatic.y) > (height - this.size.y)) {
            this.hit = true;
            this.acceleration.mult(this.bounce);
            if(Math.floor(Math.abs(this.velocity.y)) == 0) {
                this.velocity.y = 0;
                this.coordinates.y = height - this.size.y;
                this.atRest = true;
            }
            else {
                //console.log(this.velocity.y)
                //this.velocity.y *= this.bounce;
                //console.log(this.velocity.y, 'after');
                //this.bounce += 0.5;
                this.velocity.mult(-1);
            }
        }
        
        if(Math.floor(coStatic.y) < 0) {
            this.velocity.y *= -1;
        }
    };

    applyGravity() {
        this.acceleration.add(this.gravity);
    }

    applyForce(force) {
        var f = force.makeCopy();
        f.div(this.mass);
        this.acceleration.add(f);
    };

    update() {
        //this.applyForce(this.gravity);
        if(!this.acceleration.y == 0) {
            this.atRest = false;
        }
        
        if(!this.atRest) {
            this.applyGravity();
            //this.acceleration.y *= 0;
        }

        this.velocity.add(this.acceleration);

        this.velocity.limit(this.topSpeed)
        
        this.coordinates.add(this.velocity);

        //console.log(this.coordinates.y, this.velocity.y);
    };

    display() {
        drawingSurface.fillRect(this.coordinates.x, this.coordinates.y, this.size.x, this.size.y);
    };

    animate() {
        this.update();
        this.checkEdges();
        this.display();

        window.addEventListener('mousedown', () => {
            mousePress = true;
        });
        
        window.addEventListener('mouseup', () => {
            mousePress = false;
            this.acceleration.mult(0);
        });
    };
};

var click = false;

var clicks = 0;

var button = document.querySelector('button');

button.onclick = () => {
    ++clicks;
    if(clicks % 2 == 0) {
        click = false;
    }
    else {
        click = true;
    }
}

var previous;

var mousePress = false;

var attractor = new Attractor();

var mover = new Mover(50, 250, 25, 25);
var mover2 = new Mover(300, 200, 45, 45);
var mover3 = new Mover(150, 200, 60, 60);

window.addEventListener('keypress', e => {
    if(e.keyCode == 32) {
        window.requestAnimationFrame(update);
    }
}, {once: true});

function attract() {
    var f = attractor.attract(mover);
    mover.applyForce(f);
}

function update(time) {
    if(previous == null) {
        previous = time;
        window.requestAnimationFrame(update);      
        return;
    }
    
    drawingSurface.clearRect(0, 0, width, height);

    attractor.display();
    
    if(click) {
        attract();
    }

    mover.animate();
    mover2.animate();
    mover3.animate();

    //console.log(mover3.velocity.y)

    if(mousePress) {
        var wind = new Vector(0.01, 0);
        mover.applyForce(wind);
        mover2.applyForce(wind);
        mover3.applyForce(wind);
    }

    var id = window.requestAnimationFrame(update);
}