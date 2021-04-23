//author: Shivangi Shandilya
//filename: breakingglass.js
//purpose: breaking glass game

//challenge1: In creating exact location of boxes to reach all levels
//challenge2: In making use of PhysiJS logic, since it becomes complex when you have
//loops involved for creating boxes.            

let scene;
let renderer;
let camera;
//let controls;
let clock, orbitControll;
let controls;
toRotate = true;


//lights
let ambientLight;
//lights' colors
let ambientLightColor = 0x404040;
//visual helpers
let control;
let axesHelper;
let gridHelper;
let obj;

const Strike = [1, 2, 3, 4, 5];
const Credit = [100, 1000, 10000];
let score = 0;

let plane;

let objects = [];
let x,y,z;

let block = parseJson();

function init()
 {

    
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x337733);
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


function createCameraAndLights() {
  
    camera = new THREE.PerspectiveCamera(
        20,                                        
        window.innerWidth / window.innerHeight,   
        0.1,                                      
        100                                       
    );
 
    camera.position.set(15, 40, 50);
 
    camera.lookAt(scene.position);
    clock = new THREE.Clock();
    orbitControll = new THREE.OrbitControls( camera, renderer.domElement );
  
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    ambientLight = new THREE.AmbientLight(ambientLightColor, 3.0);
    ambientLight.position.set(0, 50, 0);
    ambientLight.visible = true;
    
    scene.add(ambientLight);
    
}

//createGeometry
function createGeometry() 
{
  
    // gridHelper = new THREE.GridHelper(15,15, 0xff0000,0x0000ff);
    // scene.add(gridHelper);

    scene.add(new THREE.AxesHelper(20));
    let mat = new THREE.MeshBasicMaterial({ color:0xeeeeee,map: new THREE.TextureLoader().load('http://localhost:5500/assets/textures/table.jpg') });
    let geo = new THREE.PlaneBufferGeometry(15, 15);
    let plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    Score.innerText = "0";
    
}

function setupDatGui()
{
    controls =  new function() {
        this.rotate = toRotate;
        this.levels = [];
        this.filename = 'shivangi[0].json';
    };

    let gui = new dat.GUI();
    gui.add(controls, 'rotate').onChange((e) => toRotate = e);
  
    gui.add(controls, 'levels',['Level1','Level2','Level3','Level4','Level5'])
    .onChange((e) => {
        switch(e){
                case 'Level1':
              
                console.log('Welcome to Level1');
                  
     let numberOfCubes = 11;
     x = -5.5;
     y = 0.5;
     z = 0.5; 

     for(let i = 0; i < numberOfCubes; i++)
     {
         for(let j = 0; j < i; j++)
         {
         geo = new THREE.BoxGeometry(1, 1, 1);
         mat = new THREE.MeshStandardMaterial({ color:0xeeeeee,map: new THREE.TextureLoader().load('http://localhost:5500/assets/textures/red.png') });
         let box = new THREE.Mesh(geo, mat);
  
         box.position.set(x,y,z);
         scene.add(box);
         objects.push(box);
         }
         x=x+1;

    
    }
                break;
                
                case 'Level2':

                console.log('Welcome to Level2');
                let noOfCubes = 9;
    x = -4.5;
    y = 1.5;
    z = 0.5; 
    for(let k = 0; k < noOfCubes; k++)
    {
        for(let l = 0; l < k; l++)
        {
        geo = new THREE.BoxGeometry(1, 1, 1);
        mat = new THREE.MeshStandardMaterial({  color:0xeeeeee,map: new THREE.TextureLoader().load('http://localhost:5500/assets/textures/hyper-blue.jpg')  });
        let boxe = new THREE.Mesh(geo, mat);
     
        boxe.position.set(x,y,z);
        objects.push(boxe);
        scene.add(boxe);
       
    }
    x=x+1;
   
   }
                break;

                case 'Level3':
              
                console.log('Welcome to Level3');
                let Cubeno = 7;
                x = -3.5;
                y = 2.5;
                z = 0.5; 
                for(let m = 0; m < Cubeno; m++)
                {
                    for(let n = 0; n < m; n++)
                    {
                    geo = new THREE.BoxGeometry(1, 1, 1);
                    mat = new THREE.MeshStandardMaterial({ color:0xeeeeee,map: new THREE.TextureLoader().load('http://localhost:5500/assets/textures/yellow.jpg') });
                    let boxm = new THREE.Mesh(geo, mat);
                 
                    boxm.position.set(x,y,z);
                    objects.push(boxm);
                    scene.add(boxm);
                }
                x=x+1;
               }
                break;

                case 'Level4':
                  
                    console.log('Welcome to Level4');
                     //Cubeno = 5;
                    x = -2.5;
                    y = 3.5;
                    z = 0.5; 
                    for(let m = 0; m < 5; m++)
                    {
                        for(let n = 0; n < m; n++)
                        {
                        geo = new THREE.BoxGeometry(1, 1, 1);
                        mat = new THREE.MeshStandardMaterial({ color:0xeeeeee,map: new THREE.TextureLoader().load('http://localhost:5500/assets/textures/hyper-blue.jpg') });
                        let boxmn = new THREE.Mesh(geo, mat);
                     
                        boxmn.position.set(x,y,z);
                        objects.push(boxmn);
                        scene.add(boxmn);
                    }
                    x=x+1;
                   }
                break;

                case 'Level5':
                  
                    console.log('Welcome to Level5');
                    //  Cubeno = 3;
                    x = -1.5;
                    y = 4.5;
                    z = 0.5; 
                    for(let m = 0; m < 3; m++)
                    {
                        for(let n = 0; n < m; n++)
                        {
                        geo = new THREE.BoxGeometry(1, 1, 1);
                        mat = new THREE.MeshStandardMaterial({ color:0xeeeeee,map: new THREE.TextureLoader().load('http://localhost:5500/assets/textures/yellow.jpg') });
                        let boxmno = new THREE.Mesh(geo, mat);
                     
                        boxmno.position.set(x,y,z);
                        objects.push(boxmno);
                        scene.add(boxmno);
                    }
                    x=x+1;
                   }
                break;
       
              }
          });

}


function parseJson()
{
    let box = new Physijs.BoxMesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    Physijs.createMaterial(new THREE.MeshLambertMaterial({transparent: true, opacity: 0.7, color: 0xffffff}),1, 1), 50);
    box.castShadow = true;
    box.receiveShadow = true;
    return box;
}



function mouseDownHandler(event)
{
   
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth)*2-1;
    mouse.y = -(event.clientY / window.innerHeight)*2+1;
    mouse.z = 0;

    raycaster.setFromCamera(mouse, camera);
    let intersections = raycaster.intersectObjects(objects);

    intersections.some(element => {
    scene.remove(element.object);
    score += Credit[0] + (Math.round(Credit[0]*Strike[0])); 
    Score.innerText = score.toString(); 
    if(score>3000)
    {
        msg.innerText ="Winner!";
       
    }
    else
    {
     msg.innerText ="Keep clicking the yellow and blue ones!";
    } 
    
    
});
    
}

function render() {
   
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    orbitControll.update(clock.getDelta());
}


window.onload = function () {
    init();
    createCameraAndLights();
    createGeometry();
    setupDatGui();
    window.addEventListener('click', mouseDownHandler,false);  
    render();
}
