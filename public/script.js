import * as THREE from 'three';


const sizes = {
    height: window.innerHeight,
    width: window.innerWidth
};

window.addEventListener('resize', ()=>{
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const scene =  new THREE.Scene();

const cubes= [];
for(let i=0; i<1000; i++){
    const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color:0xbb88aa}))
    cube.position.set(
        (Math.random() -0.5)*200,
        0,
        (Math.random() -0.5)*200
    )
    
    scene.add(cube);
    cubes.push(cube);
}




const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({color:'blue'}));
plane.rotation.x = -Math.PI/2;
plane.position.y = -2;

scene.add(plane);



const camera = new THREE.PerspectiveCamera(70, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0, 0, 4);
scene.add(camera);

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(sizes.width, sizes.height);

const color = 0x000000;  // white
const near = 1;
const far = 10;
scene.fog = new THREE.Fog(color, near, far);

const input={
    x:0,
    y:0,
    deltaX:0,
    deltaY:0,
    keys:[]
}

document.addEventListener('mousemove', (e)=>{
    let x = e.movementX/window.innerWidth;
    if(input.x!=0) input.deltaX = input.x- input.deltaX;
    else input.deltaX = x;
    input.x = x;

    let y = e.movementY/window.innerHeight;
    if(input.y!=0) input.deltaY = input.y-input.deltaY;
    else input.deltaY = x;
    input.y = y;
    
})

document.addEventListener('mousedown', (e)=>{
    canvas.requestPointerLock();
    switch(e.button){
        case 0: input.keys['mouse1'] = true; break;
        case 1: input.keys['mouse3'] = true; break;
        case 2: input.keys['mouse2'] = true; break;
    }
})
document.addEventListener('mouseup', (e)=>{
    switch(e.button){
        case 0: input.keys['mouse1'] = false; break;
        case 1: input.keys['mouse3'] = false; break;
        case 2: input.keys['mouse2'] = false; break;
    }
})

document.addEventListener('keydown', (e)=>{
    input.keys[e.code] = true;

})
document.addEventListener('keyup', (e)=>{
    input.keys[e.code] = false;
})

const updatePosition = (elapsedTime)=>{
    const y = camera.position.y;
    const height = 2;
    let bop=false;
    const speed = input.keys['ShiftLeft']? 0.1:0.05;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    
    const localZ = new THREE.Vector3(0, 1, 0);
    localZ.copy(dir);
    localZ.multiplyScalar(speed);
    if(input.keys['KeyW']){
        camera.position.add(localZ);
        bop=true;
    }
    if(input.keys['KeyS']){
        camera.position.sub(localZ);
        bop=true;
    }
    
    const localX = new THREE.Vector3(0, 1, 0);
    localX.cross(dir);
    localX.multiplyScalar(speed);

    if(input.keys['KeyA']){
        camera.position.add(localX);
        bop=true;
    }
    if(input.keys['KeyD']){
        camera.position.sub(localX);
        bop=true;
    }

    if(bop) camera.position.y = height + Math.sin(elapsedTime*100*speed)*speed;
    else camera.position.y = height;
}


const updateRotation = ()=>{
    const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );


    _euler.setFromQuaternion( camera.quaternion );

    _euler.y -= input.x;
    _euler.x -= input.y;
    input.x = 0;
    input.y=0

    _euler.x = Math.max( Math.PI / 2 - Math.PI, Math.min( Math.PI / 2 - 0, _euler.x ) );

    camera.quaternion.setFromEuler( _euler );

 
  
}


const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3();
rayOrigin.copy(camera.position);

const rayDirection = new THREE.Vector3();
camera.getWorldDirection(rayDirection);
rayDirection.normalize();

raycaster.set(rayOrigin, rayDirection);
const updateRaycaster = ()=>{
    rayOrigin.copy(camera.position);
    camera.getWorldDirection(rayDirection);
    rayDirection.normalize();
    raycaster.set(rayOrigin, rayDirection);
}



const clock = new THREE.Clock();
const tick = () =>
{   
    const elapsedTime = clock.getElapsedTime();
    updateRotation();
    updatePosition(elapsedTime);
    updateRaycaster();

    const intersects = raycaster.intersectObjects(cubes);
    cubes.forEach((child)=>{
         child.material.color.set(0xabab6c);
    })
    
    
    let fObj = null;
    if(intersects[0]) fObj = intersects[0].object;
    
    if(fObj){
        console.log(fObj);
        fObj.material.color.set(0x5b9bac);
        if(input.keys['mouse1'] && fObj.position.y<3) fObj.position.y = -5;
        if(input.keys['mouse2'] && fObj.position.y>0) fObj.position.y -= 0.01;
    }

    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()