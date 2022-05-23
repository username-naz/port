class InputController {
    constructor(){
        this.initialize();
    }

    initialize = ()=>{
        this.current = {
            leftButton: false,
            rightButton: false,
            mouseX:0,
            mouseY:0
        };

        this.previous = null;
        this.keys = {};
        this.previousKeys = {};

        document.addEventListener('mousedown', (e)=>{this.onMouseDown(e), false});
        document.addEventListener('mouseup', (e)=>{this.onMouseUp(e), false});
        document.addEventListener('mousemove', (e)=>{this.onMouseMove(e), false});
        document.addEventListener('keydown', (e)=>{this.onKeyDown(e), false});
        document.addEventListener('keyup', (e)=>{this.onKeyUp(e), false});

        onMouseDown = (e)=>{
            switch(e.button){
                case 0:
                    this.current.leftButton = true;
                    break;
                case 2:
                    this.current.rightButton = true;
                    break;
            }
        }
        
        onMouseUp = (e)=>{
            switch(e.button){
                case 0:
                    this.current.leftButton = false;
                    break;
                case 2:
                    this.current.rightButton = false;
                    break;
            }
        }

        onMouseMove = (e)=>{
            this.current.mouseX = e.pageX - window.innerWidth/2;
            this.current.mouseY = e.pageY - window.innerHeight/2

            if(!this.previous) this.previous = {...this.current};
        }

        onkeyUp = (e) =>{
            this.keys[e.keyCode] = true;
            
        }
        onKeyDown = (e) =>{
            this.keys[e.keyCode] = true;

        }
        
        update = ()=>{

        }


    }
}


class FPControls {
    constructor(camera, canvas){
        this.camera = camera;
        this.canvas = canvas;
        this.input =  new InputController();
    }
    
    update = ()=>{
        this.camera.rotation.x  = this.input.current.mouseX/100;
    }





}


export {FPControls}