/**
 * Retourne un nombre aléatoire compris entre les valeurs données en paramètre
 * @param min
 * @param max
 * @returns {*}
 */
function random(min, max) {

    return Math.random() * (max - min) + min;

}
/**
 * Permet de debugger une valeur et de stopper la lecture du script selon le second parametre
 * @param val
 * @param stop
 */
function debug(val, stop) {
    console.log(val);
    if (stop)
        debugger;
}
/**
 * Objet permettant de capter plusieur données afin de les afficher et analyser dans la console
 * @constructor
 */
var Analyst = function () {
    this.push = function (data) {
        this.datas.push(data);
    };
    this.pop = function () {
        debug(this.datas, false);
        this.clear();
    };
    this.clear = function () {
        this.datas = [];
    };
    this.datas = [];
};

/**
 * Objet permettant de gérer des Vecteurs / Points
 * @constructor
 */
function Vector() {

    this.x = 0;
    this.y = 0;

    this.set = function (x, y) {
        this.x = x;
        this.y = y;
    };

    this.scl = function (val) {
        this.x *= val;
        this.y *= val;
    };

    this.add = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
    };

    this.distance = function (vector) {
        return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
    };
}

/**
 * Objet permettant de gérer le comportement/ déplacement des Blocks
 * @constructor
 */
var Behavior = function () {

    this.act = function (position, focus) {
        if (position.distance(focus) > this.detection)
            this.wander();
        else {
            var angleRad = Math.atan2(
                (focus.y - position.y),
                (focus.x - position.x));
            if (this.state)
                this.pursuit(angleRad);
            else
                this.leak(angleRad);
        }
    };

    this.pursuit = function (angleRad) {
        this.motion.x = (this.velocity * Math.cos(angleRad) / 0.25 + this.oldMotion.x * this.inertia) * 0.5;
        this.motion.y = (this.velocity * Math.sin(angleRad) / 0.25 + this.oldMotion.y * this.inertia) * 0.5;
    };
    this.leak = function (angleRad) {
        this.motion.x = (-this.velocity * Math.cos(angleRad) / 0.25 + this.oldMotion.x * this.inertia) * 0.5;
        this.motion.y = (-this.velocity * Math.sin(angleRad) / 0.25 + this.oldMotion.y * this.inertia) * 0.5;
    };

    this.wander = function () {
        this.motion.x = (this.velocity * Math.cos(random(0, 100)) / 0.25 + this.oldMotion.x * this.inertia) * 0.5;
        this.motion.y = (this.velocity * Math.sin(random(0, 100)) / 0.25 + this.oldMotion.y * this.inertia) * 0.5;
    };

    this.swapState = function () {
        this.state = !this.state;
    };

    this.setProperties = function (velocity, inertia, detection) {
        this.velocity = velocity;
        this.inertia = inertia;
        this.detection = detection;
    };

    this.detection = 300;
    this.velocity = 0.4;
    this.inertia = 1.98;

    this.state = false;

    this.motion = new Vector();
    this.oldMotion = new Vector();
};

/**
 * Objet interragissant graphiquement et avec le curseur en tant que blocs
 * @constructor
 */
var Block = function (focus) {
    this.act = function (delta) {
        this.behavior.act(this.shape.position, this.focus);
        var motion = this.behavior.motion;
        motion.scl(delta / TIME);
        this.collide(this.shape.position, motion);
        this.behavior.oldMotion.set(this.behavior.motion.x / (delta / TIME), this.behavior.motion.y / (delta / TIME));
        this.shape.position.add(motion);
    };

    this.move = function (x, y) {
        this.shape.move(x, y);
    };
    this.collide = function (position, motion) {
        if (position.x + motion.x + this.shape.size > app.viewport.size.x || position.x + motion.x < 0)
            motion.x = -motion.x * this.bounce;

        if (position.y + motion.y + this.shape.size > app.viewport.size.y || position.y + motion.y < 0)
            motion.y = -motion.y * this.bounce;
    };

    this.changeColor = function (color) {
        this.shape.body.style.borderColor = color;
    };

    this.swapState = function () {
        this.behavior.swapState();
        this.behavior.state ? this.changeColor(RED) : this.changeColor(BLUE);
    };

    this.setProperties = function (properties) {
        this.behavior.setProperties(properties['velocity'], properties['inertia'], properties['detection']);
        this.bounce = properties['bounce'];
    };

    this.bounce = 0.5;
    this.focus = focus;
    this.shape = new Shape(classNames.block);
    this.behavior = new Behavior();
};

/**
 * Objet gérant un élément html/css
 * @param className
 * @constructor
 */
var Shape = function (className) {

    this.act = function () {
        var translate = `translate(${this.position.x - midsize}px,${this.position.y - midsize}px)`;
        this.body.style['-webkit-transform'] = translate;
        this.body.style['-moz-transform'] = translate;
        this.body.style['-o-transform'] = translate;
        this.body.style['transform'] = translate;
    };

    this.createBody = function (className) {
        var div = document.createElement('div');
        div.className = className;
        return div;
    };

    this.move = function (x, y) {
        this.position.set(x, y);
    };
    this.position = new Vector();
    this.body = this.createBody(className);

    this.size = 8;
    var midsize = this.size / 2;
};

/**
 * Groupe de Blocs, leurs permettants d'avoir un comportement similaire entre eux
 * @constructor
 */
var BlockGroup = function (nbBlocks, focus) {

    this.generate = function (nbBlocks, focus) {
        this.clear();
        this.properties['length'] = nbBlocks;
        if (focus)
            this.focus = focus;
        for (var index = 0; index < nbBlocks; index++) {
            var block = new Block(focus);
            block.changeColor(BLUE);
            block.setProperties(this.properties);
            this.blocks.push(block);
        }
    };

    this.act = function (delta) {
        for (var index = 0; index < this.blocks.length; index++)
            this.blocks[index].act(delta);
    };

    this.clear = function () {
        this.blocks = [];
    };

    this.move = function (intervalX, intervalY) {
        for (var index = 0; index < this.blocks.length; index++)
            this.blocks[index].move(random(0, intervalX - this.blocks[index].shape.size),
                random(0, intervalY - this.blocks[index].shape.size));
    };

    this.changeColor = function (color) {
        for (var index = 0; index < this.blocks.length; index++)
            this.blocks[index].changeColor(color);
    };

    this.swapState = function () {
        for (var index = 0; index < this.blocks.length; index++)
            this.blocks[index].swapState();
    };

    this.setProperties = function (velocity, inertia, detection, bounce) {
        this.properties.velocity = velocity;
        this.properties.inertia = inertia;
        this.properties.detection = detection;
        this.properties.bounce = bounce;
        for (var index = 0; index < this.blocks.length; index++)
            this.blocks[index].setProperties(this.properties);
    };

    this.getProperties = function () {
        return this.properties;
    };
    this.properties = {
        velocity: 3,
        inertia: 1.98,
        detection: 300,
        bounce: 0.5,
        length: 0
    };
    this.blocks = [];

    if (focus)
        this.focus = focus;
};

/**
 * Un Stage contient et gère les eléments actifs de l'application
 * @param world
 * @constructor
 */
var Stage = function (world) {

    this.addGroup = function (group) {
        for (var index = 0; index < group.blocks.length; index++)
            this.addBlock(group.blocks[index]);
    };

    this.addBlock = function (block) {
        this.blocks.push(block);
        this.addShape(block.shape);
    };

    this.addShape = function (shape) {
        this.shapes.push(shape);
        this.world.appendChild(shape.body);
    };

    this.wipe = function () {

        if (this.world.hasChildNodes())
            while (this.world.childNodes.length >= 1)
                this.world.removeChild(this.world.firstChild);
        this.blocks = [];
        this.shapes = [];
    };

    this.act = function (delta) {
        for (var index = 0; index < this.blocks.length; index++)
            this.blocks[index].act(delta);
        for (index = 0; index < this.shapes.length; index++)
            this.shapes[index].act(delta);
    };

    this.world = world;
    this.blocks = [];
    this.shapes = [];
};

/**
 * Objet permettant de connaitre des informations sur laa taille de l'espace de l'application
 * @param viewport
 * @constructor
 */
var Viewport = function (viewport) {

    this.resize = function () {
        this.size.set(viewport.clientWidth, viewport.clientHeight);
        this.marge.set((window.innerWidth - this.size.x), (window.innerHeight - this.size.y));
    };

    this.size = new Vector();
    this.marge = new Vector();
    this.resize();
};

/**
 * Objet gérant principale gérant l'application
 * @constructor
 */
var Application = function (world, viewport) {

    this.create = function (nbBlocks) {
        if (!nbBlocks||nbBlocks<0)
            nbBlocks = Math.round(this.viewport.size.x * this.viewport.size.y / 3000);
        this.stage.wipe();
        this.blocksGroup.generate(nbBlocks, this.cursor.position);
        this.blocksGroup.move(this.viewport.size.x, this.viewport.size.y);
        this.stage.addGroup(this.blocksGroup);
        this.stage.addShape(this.cursor);
    };

    this.update = function () {
        now = new Date();
        var delta = now - last;
        last = now;
        app.stage.act(delta);
    };

    this.resize = function () {
        this.viewport.resize();
        this.create(-1);
    };

    this.start = function () {
        last = new Date();
        now = new Date();
        loopID = setInterval(this.update, TIME / FPS);
    };

    this.stop = function () {
        clearInterval(loopID);
        loopID = 0;
    };

    this.mouseUpdate = function (x, y) {
        this.cursor.position.set(x, y);
    };

    this.swapState = function () {
        this.blocksGroup.swapState();
    };

    this.setProperties = function (velocity, inertia, detection, bounce, nbBlocks) {
        this.blocksGroup.clear();
        this.create(nbBlocks);
        this.blocksGroup.setProperties(velocity, inertia, detection, bounce);
    };

    this.getProperties = function () {
        return this.blocksGroup.getProperties();
    };

    var now, last,
        loopID = 0;

    this.blocksGroup = new BlockGroup(undefined,undefined);
    this.stage = new Stage(world);
    this.viewport = new Viewport(viewport);
    this.cursor = new Shape(classNames.cursor);
    this.cursor.position.set(-this.viewport.size.x, -this.viewport.size.y);
};

function generateElement(element, className) {
    tmp = document.createElement(element);
    tmp.className = className
    return tmp
}

var
    NAME = "experience-javascript",
    BLUE = "#2196F3",
    RED = "#F44336",
    TIME = 1000,
    FPS = 60;

var classNames = {
    viewport: "ejs-viewport",
    cursor: "ejs-cursor",
    block: "ejs-block",
    world: "ejs-world"
};

var global = document.getElementById(NAME);

var viewport = generateElement("div", classNames.viewport),
    world = generateElement("div", classNames.world);

viewport.appendChild(world);
global.appendChild(viewport);

var app = new Application(world, viewport);

window.addEventListener('resize', function () {
    app.resize();
});

viewport.addEventListener('click', function () {
    app.swapState();
});

viewport.addEventListener('mousemove', function (e) {
    app.mouseUpdate(e.clientX, e.clientY);
});

app.create(-1);
app.start();