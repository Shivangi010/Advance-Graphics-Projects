//author: Shivangi Shandilya
//filename: 08-shivangi.js
//date: March 12, 2021

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);

var orbitControls, controls, cube,
speed = 0.01,
toRotate = true;

function init()
{
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x004400);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
}

function setupCameraAndLight()
{
    camera.position.set(-100,50,40);
    camera.lookAt(scene.position);

    scene.add(new THREE.AmbientLight(0x666666));

    
    let directionalLight = new THREE.DirectionalLight( 0xffffff);
    directionalLight.position.set( 20, 60, 10 ); 	
    directionalLight.castShadow = true;		
    directionalLight.target = scene;  
    directionalLight.shadow.camera.near = -0.1;  
    directionalLight.shadow.camera.far = 200;   
    directionalLight.shadow.camera.left = -50;    
    directionalLight.shadow.camera.right = 50;    
    directionalLight.shadow.camera.top = 50;    
    directionalLight.shadow.camera.bottom = -50; 
    directionalLight.shadow.mapSize.width = 512; 
    directionalLight.shadow.mapSize.height = 512; 
    scene.add(directionalLight);
        
    let hemiSphereLight = new THREE.HemisphereLight( 0xffffff, 0x080820, 0.5);
    hemiSphereLight.position.set(0,100,0);
    scene.add( hemiSphereLight );

}

function createGeometry()
{
    scene.add(new THREE.AxesHelper(100));
    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40,60),
        new THREE.MeshLambertMaterial({color: "#E743CC"})
    );
    plane.receiveShadow = true;
    plane.rotation.x = Math.PI*0.5;
    scene.add(plane);

    let cubeTexture = createCubeTexture();

    let alpha = new THREE.TextureLoader().load('http://127.0.0.1:5500/assets/textures/general/partial-transparency.png');
    
    let cubeMaterial =  new THREE.MeshStandardMaterial({
        color: 0xffffff,
        envMap: cubeTexture,
        metal: 1,
        roughness: 0

    });
     cube = new THREE.Mesh(
         new THREE.BoxGeometry(10,10,10),
         cubeMaterial
     );
     cube.position.set(0,10,0);
     cube.rotation.set(Math.PI*0.6,0,Math.PI*0.3);
     cube.castShadow = true;
     scene.add(cube);

     let mat = cubeMaterial.clone();
     let textureLoader = new THREE.TextureLoader();
     mat.normalMap = textureLoader.load('http://127.0.0.1:5500/assets/textures/Engraved_Metal_003_NORM.jpg');
     mat.aoMap = textureLoader.load('http://localhost:5500/assets/textures/Engraved_Metal_003_OCC.jpg');
     mat.shininessMap = textureLoader.load('http://127.0.0.1:5500/assets/textures/Engraved_Metal_003_ROUGH.jpg');
    
     mesh = new THREE.Mesh(
         new THREE.SphereGeometry(10,50,50),
         mat);
     
         mesh.position.set(-15,10,-15),
         mesh.castShadow = true;
         scene.add(mesh);

         let sphereMaterial = new THREE.MeshStandardMaterial({
             alphaMap: alpha,
             metal: 0.02,
             roughness: 0.02,
             alphaTest: 0.5

         });
         sphereMaterial.alphaMap.wrapS = THREE.RepeatWrapping;
         sphereMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
         sphereMaterial.alphaMap.repeat.set(5,5);

         mesh = new THREE.Mesh(
             new THREE.SphereGeometry(10,180,180),
             new THREE.MeshStandardMaterial({alphaMap: alpha, metal: 0.02, roughness: 0.07, alphaTest: 0.5})
         );

         mesh.position.set(15,10,15);
         mesh.castShadow = true;
         scene.add(mesh);

    }

    function createCubeTexture()
    {
        let cubeLoader = new THREE.CubeTextureLoader().setPath('http://127.0.0.1:5500/assets/textures/cubemap/park2/');
        let urls = [
            'posx.jpg',
            'negx,jpg',
            'posy.jpg',
            'negy.jpg',
            'posz.jpg',
            'negz.jpg'
        ];
        return cubeLoader.load(urls);
    }

    function setupDatGui(){

        controls =  new function() {
            this.rotate = toRotate;
            this.showSkybox = false;
            this.textures = [];
        };

        let gui = new dat.GUI();
        gui.add(controls, 'rotate').onChange((e) => toRotate = e);
        gui.add(controls, 'showSkybox').onChange((e) => {
            if(e){
                scene.background = createCubeTexture();
            }
            else{
                scene.background = undefined;
            }
        });
        gui.add(controls, 'textures',['none','single','multi','envmap','refraction','reflection'])
        .onChange((mat) => {
            switch(mat){
                case 'none':
                    material = new THREE.MeshBasicMaterial({
                        color: 0x7777ff,
                        name: 'Basic Material',
                        flatShading: true,
                        depthTest: false
                    });
                    cube.material = material;
                    console.log('cube set to Basic Material');
                    break;
                    
                    case 'single':
let texture = new THREE.TextureLoader().setPath('http://127.0.0.1:5500/assets/textures/general/').load('floor-wood.jpg');
                    material = new THREE.MeshBasicMaterial({
                        color: 0x7777ff,
                        name: 'single texture',
                        map: texture
                    });
                    cube.material = material;
                    console.log('cube set to Basic Material');
                    break;

                    case 'multi':
                        let textureLoader = new THREE.TextureLoader().setPath('http://127.0.0.1:5500/assets/textures/cubemap/park2/');

                        let textures = [
                            textureLoader.load('posx.jpg'),
                            textureLoader.load('negx,jpg'),
                            textureLoader.load('posy.jpg'),
                            textureLoader.load('negy.jpg'),
                            textureLoader.load('posz.jpg'),
                            textureLoader.load('negz.jpg')  
                        ];

                        let mat = [];
                        textures.forEach((tex) => mat.push(new THREE.MeshBasicMaterial({map: tex})));
                        cube.material = mat;
                        console.log('cube set to BasicMaterial');
                        break;

                        case 'envmap':
                            let cubeTexture =  createCubeTexture();
                            
                            material = new THREE.MeshStandardMaterial({
                            color: 0xeeeeff,
                            envMap: cubeTexture,
                            metal: 1,
                            roughness: 0,
                          });

                          cube.material = material;
                          console.log('cube set to environment map');
                          break;

                          case 'refraction':
                              let refractionTexture = createCubeTexture();
                              refractionTexture.mapping = THREE.CubeRefractionMapping;

                              material = new THREE.MeshStandardMaterial({
                                  color: 0xffffff,
                                  envMap: refractionTexture,
                                  metal: 1,
                                  roughness: 0
                              });

                            cube.material = material;
                            console.log('cube set to environment map');
                            break;

                            case 'reflection':
                                let reflectionTexture = new THREE.TextureLoader().load('http://localhost:5500/assets/textures/Engraved_Reflection_003_Shine.jpg');
  
                                 material = new THREE.MeshStandardMaterial({
                                    map: reflectionTexture,
                                    envMap: reflectionTexture,
                                    metal: 1,
                                    roughness: 0
                                });
  
                              cube.material = material;
                              console.log('cube set to environment map');
                              break;
                  }
              });

            }

            function render()
            {
                orbitControls.update();
                if(toRotate)
                scene.rotation.y = speed;
                renderer.render(scene, camera);
                requestAnimationFrame(render);
            }   

            window.onload = () => {

                init();
                setupCameraAndLight();
                createGeometry();
                setupDatGui();
                render();
            }
    