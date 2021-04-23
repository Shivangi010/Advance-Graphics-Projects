//author: Shivangi Shandilya
//filename: 10-shivangi.js
//date: March 23, 2021

let Shaders = {}
Shaders.BasicShader9B0 = {

	name: 'BasicShader9B0',

	uniforms: {

		'time': { type: 'f', value: 0.0 }

	},
	
	vertexShader: 
	
	`uniform float time;

	varying vec2  vUv;


	void main() 
	{

		   vec3 pos = position;
       	   vUv = uv;    //sends the uv value to the fragment program
		   pos.x += 1.4 *sin( time * 10.0 ) + 0.2 * sin( time * 10.0 );
		   pos.y += 0.8 * sin( time * 10.0 ) + 0.2 * sin( time * 10.0 );
		   pos.z += 10.4 * sin( time * 10.0 ) + 0.2 * sin( time * 10.0 );
gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

	}`,


	fragmentShader:

 ` 
 varying vec2 vUv;
 uniform float time;
 
void main() 
{
gl_FragColor = vec4( vec3(vUv, 0.512),  1.0);

	}`
};

Shaders.BasicShader9B1 = {

	name: 'BasicShader9B1',

    uniforms: {
        'time': { type: 'f', value: 0.0}  
        },
    vertexShader:
        `uniform float time;

        varying vec2  vUv;
    
    
        void main() 
        {
    
            vec3 pos = position;
               vUv = uv;    //sends the uv value to the fragment program
               pos.z += 10.4 * sin( time * 10.0 ) + 0.2 * sin( time * 10.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,

    fragmentShader:

        `varying vec2 vUv;
        uniform float time;
 
    void main() 
   {
     gl_FragColor = vec4( vec3(vUv, 0.990),  1.0);

	}`
};



const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
const scene = new THREE.Scene();
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
const __shaderA = Shaders.BasicShader9B0;
const __shaderB = Shaders.BasicShader9B1;

let mesh, sphere, geo;
let knot, geometry, wireknot;
let cube, geom, wire;
let cone, geomet, wr;


let controls, light,
    shaderMaterial,
    speed = 0.01,
    toRotate = true;

function init() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x004400);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    scene.position.set(0, -10, 0);
}

function setupCameraAndLight() {
    camera.position.set(-30, 10, 30);
    camera.lookAt(scene.position);
    scene.add(new THREE.AmbientLight(0x666666));

    light = new THREE.DirectionalLight(0xeeeeee);
    light.position.set(20, 60, 10);
    light.castShadow = true;
    light.target = scene;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 200;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    let hemiSphereLight = new THREE.HemisphereLight(0x7777cc, 0x00ff00, 0.6);
    hemiSphereLight.position.set(0, 100, 0);
    scene.add(hemiSphereLight);
}

function createGeometry() {
    scene.add(new THREE.AxesHelper(100));

    shaderMaterial = new THREE.ShaderMaterial(
        {
            uniforms: __shaderA.uniforms,
            vertexShader: __shaderA.vertexShader,
            fragmentShader: __shaderA.fragmentShader,
            transparent: true
        }
    );

    
   let plane = new THREE.Mesh(
       new THREE.PlaneGeometry(60, 30, 1, 1),
    shaderMaterial
    );
    plane.position.set(0,0,0);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

 
    mesh = new THREE.ShaderMaterial(
        {
            uniforms: __shaderA.uniforms,
            vertexShader: __shaderA.vertexShader,
            fragmentShader: __shaderA.fragmentShader,
            transparent: true
        });
        geo = new THREE.SphereBufferGeometry( 6, 32, 32);
        sphere = new THREE.Mesh(geo, mesh);
        sphere.position.set(10, 10, 10);
        sphere.castShadow = true;
        scene.add(sphere);


    wr = new THREE.ShaderMaterial(
        {
            uniforms: __shaderA.uniforms,
            vertexShader: __shaderA.vertexShader,
            fragmentShader: __shaderA.fragmentShader,
            transparent: true
        });
        geomet = new THREE.ConeGeometry( 4, 8, 12);
        cone = new THREE.Mesh(geomet, wr);
        cone.position.set(-16, 7, 10);
        cone.castShadow = true;
        scene.add(cone);



    wire = new THREE.ShaderMaterial(
        {
            
            vertexShader: __shaderB.vertexShader,
            fragmentShader: __shaderB.fragmentShader,
            transparent: true
        });
    geom = new THREE.BoxBufferGeometry(8, 8, 8);
    cube = new THREE.Mesh(geom, wire);
    cube.position.set(-1, 6, 1);
    cube.castShadow = true;
    scene.add(cube);  


    wireknot = new THREE.ShaderMaterial(
        {
            vertexShader: __shaderB.vertexShader,
            fragmentShader: __shaderB.fragmentShader,
            transparent: true
        });
        geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
        knot = new THREE.Mesh(geometry, wireknot);
        knot.position.set(-10,10,-10);
        knot.scale.set(.5,.5,.5)
        knot.castShadow = true;
        scene.add(knot);


}

function setupDatGui() 
{
       control = new function () 
       {
        this.DirectionalLight = true;
        this.AmbientLight = true;
    
    }
    let gui = new dat.GUI();

    gui.add(control, "DirectionalLight").onChange((e) => {
        DirectionalLight.visible = e;
    })
    gui.add(control, "AmbientLight").onChange((e) => {
        ambientLight.visible = e;
    })
};

function render() {
    
    orbitControls.update();
   __shaderA.uniforms.time.value = clock.getElapsedTime();
   __shaderB.uniforms.time.value = clock.getElapsedTime();
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();
}
