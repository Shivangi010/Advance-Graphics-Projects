//author:Shivangi Shandilya
//filename: shivangi.js
//date" February 17, 2021

//global variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const clock = new THREE.Clock();
const celestialBodies = [];
const stars = [];

//declaring the array of stars
const NUM_STARS = 100;
const RANGE_X_Z = [-200, 200];
const RANGE_Y = [-75, 75];

//defining the properties for DAT.GUI 
 const sceneProps = {
    showBodyMovement: true,
    planetSpeed: 2.5,
    moonSpeed: 2.5,
    numberOfStars: NUM_STARS
}


//Class CelestialBody to hold all bodies 
class CelestialBody {
    /**
     * The constructor for the celestial bodies.
     * 
     * @param {*} radius     The body's radius.
     * @param {*} color      The body's color.
     * @param {*} px         The body's position on x axis.
     * @param {*} py         The body's position on y axis.
     * @param {*} pz         The body's position on z axis.
     * @param {*} emitsLight Flag indicating emit light.
     * @param {*} isStar     Flag indicating the start of the body.
     */
    constructor(radius, color, px, py, pz, emitsLight, isStar) {
        this.numberOfSegments = 25;
        this.radius = radius;
        this.color = color;
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.emitsLight = emitsLight;
        this.isStar = isStar;
        this.light = undefined;
        this.material = undefined;
        this.body = this.createBody();
    }

    
    //createBody method for rendering objects on teh screen
    createBody() {
        const geometry = new THREE.SphereGeometry(this.radius, this.numberOfSegments, this.numberOfSegments)
        this.material = new THREE.MeshLambertMaterial({
            color: this.color,
            emissive: (this.emitsLight ? this.color : 0x000000)
        });
        const body = new THREE.Mesh(geometry, this.material);
        body.position.set(this.px, this.py, this.pz);

        // Checks for light emission.
        if (this.emitsLight) {
            this.light = new THREE.PointLight(0xffffff, 1, this.isStar ? 100 : 0, this.isStar ? 5 : 2);
            this.light.position.set(this.px, this.py, this.pz);
        }

        return body;
    }
}


// An orbiting celestial body having circular orbit around its parent body

class OrbitingCelestialBody extends CelestialBody {
    /**
     * Constructor for orbiting celestial bodies.
     * 
     * @param {*} radius             The body's radius.
     * @param {*} color              The body's color.
     * @param {*} orbitRadius        The body's orbit radius.
     * @param {*} orbitedBody        The orbited body.
     * @param {*} referenceOrbitTime The reference orbit time used to calculate the time proportion for the orbit
     * @param {*} bodyOrbitTime      The body's orbit time
     * @param {*} isMoon             Flag indicating whether the body is a moon.
     */
    constructor(radius, color, orbitRadius, orbitedBody, referenceOrbitTime, bodyOrbitTime, isMoon) {
        super(
            radius,
            color,
            orbitRadius + orbitedBody.px,
            isMoon ? (-0.5 + Math.random()) * orbitedBody.radius + 2 * radius + 0.1 : 0,
            orbitRadius + orbitedBody.pz,
            false
        );

        const random = Math.random();
        const signal = random < 0.50 ? -1 : 1;

        this.orbitRadius = orbitRadius;
        this.orbitedBody = orbitedBody;
        this.bodyOrbitTime = bodyOrbitTime / referenceOrbitTime;
        this.angle = isMoon ? 2 * Math.PI * signal * Math.random() : 0;
        this.delta = 2 * Math.PI / 360;
        this.isMoon = isMoon;
    }

   
     //updating the position of the orbiting's body.
      updatePosition() {
        this.angle += this.delta / this.bodyOrbitTime * (this.isMoon ? sceneProps.moonSpeed : sceneProps.planetSpeed);
        this.px = Math.cos(this.angle) * this.orbitRadius + this.orbitedBody.px;
        this.pz = Math.sin(this.angle) * this.orbitRadius + this.orbitedBody.pz;
        this.body.position.set(this.px, this.py, this.pz);
    }
}


// Body indexes.
const SUN_IDX = 0;
const MERCURY_IDX = 1;
const VENUS_IDX = 2;
const EARTH_IDX = 3;
const MARS_IDX = 4;
const JUPITER_IDX = 5;
const SATURN_IDX = 6;
const URANUS_IDX = 7;
const NEPTUNE_IDX = 8;
const PLUTO_IDX = 9;
const EARTH_MOON_IDX = 10;
const JUPITER_MOONS_IDX = 11;
const SATURN_MOONS_IDX = 16;

//declaring moons for the planets
const EARTH_NUM_MOONS = 1;
const JUPITER_NUM_MOONS = 5;
const SATURN_NUM_MOONS = 3;


 //Radius correction proportions for the sun, small planets and big planets.
const SUN_PROP = 15;
const MED_PLAN_PROP = 70;
const BIG_PLAN_PROP = 40;
const SML_PLAN_PROP = 150;
const DWF_PLAN_PROP = 300;

//Distance correction proportions, so all planets can be viewed in the same screen.
const SML_DIST_PROP = 1.75;
const MED_DIST_PROP = 2.75;
const BIG_DIST_PROP = 4.25;
const VBI_DIST_PROP = 5.25;


//delclaring Planet radius based on sun's. Resources : https://www.bobthealien.co.uk/venus/index.htm
const baseRadius = 695508;
const sunRadius = SUN_PROP * 695508 / baseRadius;
const mercuryRadius = SML_PLAN_PROP * 2440 / baseRadius;
const venusRadius = SML_PLAN_PROP * 6052 / baseRadius;
const earthRadius = SML_PLAN_PROP * 6371 / baseRadius;
const marsRadius = SML_PLAN_PROP * 3397 / baseRadius;
const jupiterRadius = BIG_PLAN_PROP * 71492 / baseRadius;
const saturnRadius = BIG_PLAN_PROP * 60268 / baseRadius;
const uranusRadius = MED_PLAN_PROP * 25559 / baseRadius;
const neptuneRadius = MED_PLAN_PROP * 24766 / baseRadius;
const plutoRadius = DWF_PLAN_PROP * 1185 / baseRadius;
const moonRadius = plutoRadius / 1.25;
const starRadius = 0.1;


//Planet distances from the sun, calculated with with the above proportions for better
const propDist = SUN_PROP + 2.5;
const baseDist = 57900;
const mercuryDist = propDist * 57900 / baseDist;
const venusDist = propDist * 108160 / baseDist / 1.5;
const earthDist = propDist * 149600 / baseDist / 1.5;
const marsDist = propDist * 227937 / baseDist / 1.75;
const jupterDist = propDist * 778369 / baseDist / 3.5;
const saturnDist = propDist * 1427034 / baseDist / 4.5;
const uranusDist = propDist * 2870658 / baseDist / 6.25;
const neptuneDist = propDist * 4496976 / baseDist / 7.5;
const plutoDist = propDist * 5906375 / baseDist / 8.25;
const earthMoonDist = earthRadius + 1;
const jupiterMoonDist = jupiterRadius + 1;
const saturnMoonDist = saturnRadius + 1;


 //Planet times in days to get around the sun. Those times will be used for calculating
 //the orbit time of each planet.

const mercuryTime = 88;
const venusTime = 224;
const earthTime = 365.25;
const marsTime = 687;
const jupiterTime = 4332;
const saturnTime = 10592;
const uranusTime = 30681;
const neptuneTime = 60193;
const plutoTime = 90582;
const earthMoonTime = 28;
const jupiterMoonTime = 125;
const saturnMoonTime = 78;

////function init definition
function init() {
    // The renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Appends the renderer DOM to the document body.
    document.body.appendChild(renderer.domElement);

    // Add Trackball Controls.
    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
}


function setupCameraAndLight() {
    camera.position.set(-100, 50, 35);
    camera.lookAt(scene.position);
}

function createGeometry() {
    // The Stars
    for (let i = 0; i < NUM_STARS; i++) {
        const px = RANGE_X_Z[i % 2] * ((-0.5 + Math.random()) * 2) + 5;
        const py = RANGE_Y[i % 2] * ((-0.5 + Math.random()) * 2) + 5;
        const pz = RANGE_X_Z[i % 2] * ((-0.5 + Math.random()) * 2) + 5;
        stars.push(new CelestialBody(starRadius, 0xffffff, px, py, pz, true, true))
    }

    // The Sun.
    celestialBodies.push(new CelestialBody(sunRadius, 0xf9d71c, 0, 0, 0, true, false));

    //Planets.
    celestialBodies.push(new OrbitingCelestialBody(mercuryRadius, 0xC5C5C5, mercuryDist, celestialBodies[SUN_IDX], mercuryTime, mercuryTime, false));
    celestialBodies.push(new OrbitingCelestialBody(venusRadius, 0xFFFACD, venusDist, celestialBodies[SUN_IDX], mercuryTime, venusTime, false));
    celestialBodies.push(new OrbitingCelestialBody(earthRadius, 0x1E90FF, earthDist, celestialBodies[SUN_IDX], mercuryTime, earthTime, false));
    celestialBodies.push(new OrbitingCelestialBody(marsRadius, 0xD2B48C, marsDist, celestialBodies[SUN_IDX], mercuryTime, marsTime, false));
    celestialBodies.push(new OrbitingCelestialBody(jupiterRadius, 0xFFA500, jupterDist, celestialBodies[SUN_IDX], mercuryTime, jupiterTime, false));
    celestialBodies.push(new OrbitingCelestialBody(saturnRadius, 0xF0E68C, saturnDist, celestialBodies[SUN_IDX], mercuryTime, saturnTime, false));
    celestialBodies.push(new OrbitingCelestialBody(uranusRadius, 0xADD8E6, uranusDist, celestialBodies[SUN_IDX], mercuryTime, uranusTime, false));
    celestialBodies.push(new OrbitingCelestialBody(neptuneRadius, 0xFFA500, neptuneDist, celestialBodies[SUN_IDX], mercuryTime, neptuneTime, false));
    celestialBodies.push(new OrbitingCelestialBody(plutoRadius, 0xFFEBCD, plutoDist, celestialBodies[SUN_IDX], mercuryTime, plutoTime, false));

    // Earth's Moon
    celestialBodies.push(
        new OrbitingCelestialBody(moonRadius, 0xC5C5C5, earthMoonDist, celestialBodies[EARTH_IDX], mercuryTime, earthMoonTime, true));

    // Jupiter's Moons
    for (let i = 0; i < JUPITER_NUM_MOONS; i++) {
        celestialBodies.push(
            new OrbitingCelestialBody(moonRadius, 0xC5C5C5, jupiterMoonDist + Math.random() * 0.75, celestialBodies[JUPITER_IDX], mercuryTime, jupiterMoonTime * (Math.random() + 0.75), true));
    }

    // Saturn's Moons
    for (let i = 0; i < SATURN_NUM_MOONS; i++) {
        celestialBodies.push(
            new OrbitingCelestialBody(moonRadius, 0xC5C5C5, saturnMoonDist + Math.random() * 0.75, celestialBodies[SATURN_IDX], mercuryTime, saturnMoonTime * (Math.random() + 0.75), true));
    }

    // Adding the Sun, the Planets, and the moons to the scene.
    for (body of celestialBodies) {
        scene.add(body.body);
        if (body.emitsLight) {
            scene.add(body.light);
        }
    }

    // Adding the starts to the scene
    for (star of stars) {
        scene.add(star.body);
        if (star.emitsLight) {
            scene.add(star.light);
        }
    }
}

//set up a dat-gui widget
function setupDatGui() {
    let controls = new function () {
        this.showBodyMovement = sceneProps.showBodyMovement;
        this.planetSpeed = sceneProps.planetSpeed;
        this.moonSpeed = sceneProps.moonSpeed;
        this.showMercury = true;
        this.showVenus = true;
        this.showEarth = true;
        this.showMars = true;
        this.showJupiter = true;
        this.showSaturn = true;
        this.showUranus = true;
        this.showNeptune = true;
        this.showPluto = true;
        this.showStars = true;
        this.wireframe = false;
    }

    const gui = new dat.GUI();

    
    const movementFolder = gui.addFolder('Movement Management');
    movementFolder.add(controls, 'showBodyMovement').name('Move Bodies').onChange((move) => sceneProps.showBodyMovement = move);
    movementFolder.add(controls, 'planetSpeed', 1, 25).name('Planets Speed').step(0.1).onChange((speed) => sceneProps.planetSpeed = speed);
    movementFolder.add(controls, 'moonSpeed', 1, 10).name('Moons Speed').step(0.1).onChange((speed) => sceneProps.moonSpeed = speed);
    movementFolder.close();

    
    const bodyFolder = gui.addFolder('Show / Hide Planets');
    bodyFolder.add(controls, 'showMercury').name('Show Mercury').onChange((visible) => celestialBodies[MERCURY_IDX].body.visible = visible)
    bodyFolder.add(controls, 'showVenus').name('Show Venus').onChange((visible) => celestialBodies[VENUS_IDX].body.visible = visible);

    // Hides / shows the Earth and its moon.
    bodyFolder.add(controls, 'showEarth').name('Show Earth').onChange((visible) => {
        celestialBodies[EARTH_IDX].body.visible = visible;              // Hides / shows the Earth
        celestialBodies[EARTH_MOON_IDX].body.visible = visible;             // Hides / shows Earth's moon.
    });

    bodyFolder.add(controls, 'showMars').name('Show Mars').onChange((visible) => celestialBodies[MARS_IDX].body.visible = visible);

    // Hides / shows the Jupiter and its moons.
    bodyFolder.add(controls, 'showJupiter').name('Show Jupiter').onChange((visible) => {
        celestialBodies[JUPITER_IDX].body.visible = visible;              // Hides / shows Jupiter.
        for (let i = JUPITER_MOONS_IDX; i < JUPITER_MOONS_IDX + JUPITER_NUM_MOONS; i++) {     // Hides / shows Jupiter's moons.
            celestialBodies[i].body.visible = visible;
        }
    });

    // Hides / shows the Saturn and its moons.
    bodyFolder.add(controls, 'showSaturn').name('Show Saturn').onChange((visible) => {
        celestialBodies[SATURN_IDX].body.visible = visible;              // Hides / shows Saturn.
        for (let i = SATURN_MOONS_IDX; i < SATURN_MOONS_IDX + SATURN_NUM_MOONS; i++) {      // Hides / shows Saturn's moons.
            celestialBodies[i].body.visible = visible;
        }
    });

    bodyFolder.add(controls, 'showUranus').name('Show Uranus').onChange((visible) => celestialBodies[URANUS_IDX].body.visible = visible);
    bodyFolder.add(controls, 'showNeptune').name('Show Neptune').onChange((visible) => celestialBodies[NEPTUNE_IDX].body.visible = visible);
    bodyFolder.add(controls, 'showPluto').name('Show Pluto').onChange((visible) => celestialBodies[PLUTO_IDX].body.visible = visible);

    
    bodyFolder.close();

    
    gui.add(controls, 'wireframe').name('Wireframe').onChange((wireframe) => {
        for (body of celestialBodies) {
            body.material.wireframe = wireframe;
        }
    });
}


function render() {
    // Updating the controls.
    trackballControls.update(clock.getDelta());

    // Updates the body positions;
    if (sceneProps.showBodyMovement) {
        for (let i = 1; i < celestialBodies.length; i++) {
            celestialBodies[i].updatePosition();
        }
    }

  
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
};
