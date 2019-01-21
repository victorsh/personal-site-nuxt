import * as Three from 'three';

var mouseUp = true, mouseDown = false, mouseMove = false, touch, mouse;
var leftOn= false, rightOn = false, upOn = false, downOn = false;
var moveCount = 5;
var preSpeed = 0;
var moveSpeed = 5;
var touchM = new Three.Vector2();
var touchS = new Three.Vector2();
var touchOn = false;

function initInteractions(){
    // Resize Event
    window.addEventListener('resize', onWindowResize, false);

    // Mouse Events
    mouse = new Three.Vector2();
    window.addEventListener('mousedown', handleMouseDown, false);
    window.addEventListener('mousemove', handleMouseMove, false);
    window.addEventListener('mouseup', handleMouseUp, false);

    // Touch Events
    touch = new Three.Vector2();
    window.addEventListener('touchstart', handleTouchStart, false);
    window.addEventListener('touchend', handleTouchEnd, false);
    window.addEventListener('touchcancel', handleTouchCancel, false);
    window.addEventListener('touchmove', handleTouchMove, {passive: false});

    // Keyboard Events
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
}

var speedLock = false;
export function handleKeyDown(e){
    if(e.keyCode === 65 || e.keyCode == 37){
        // console.log('down: a');
        leftOn = true;
    }else if(e.keyCode === 68 || e.keyCode === 39){
        // console.log('down: d');
        rightOn = true;
    }else if(e.keyCode === 87 || e.keyCode === 38){
        // console.log('down: w');
        upOn = true;
    }else if(e.keyCode === 83 || e.keyCode === 40){
        // console.log('down: s');
        downOn = true;
    } else if(e.keyCode === 32) { // space speed up
        if(!speedLock){
            speedLock = true;
            preSpeed = speed;
            speed = 5;
        }
    } 
}

// Handle Keyboard inputs
export function handleKeyUp(e){
    if(e.keyCode === 65 || e.keyCode == 37){
        // console.log('up: a');
        leftOn = false;
    }else if(e.keyCode === 68 || e.keyCode == 39){
        // console.log('up: d');
        rightOn = false;
    }else if(e.keyCode === 87 || e.keyCode == 38){
        // console.log('up: w');
        upOn = false;
    }else if(e.keyCode === 83 || e.keyCode == 40){
        // console.log('up: s');
        downOn = false;
    }else if(e.keyCode === 80){ //p pause
        if(!pause)
            pause = true;
        else
            pause = false;
    } else if(e.keyCode === 32){ // speed
        speedLock = false;
        speed = preSpeed;
        preSpeed = 0;
    }
}

export function handleMovement(delta, player, boardWidth) {
    if(leftOn || rightOn || upOn || downOn){
        if(leftOn){
            if(player.position.x > -boardWidth/2 - 0.3){
                player.position.x -= moveSpeed * delta;
            } else {
                player.position.x = -boardWidth/2 - 0.3;
            }
        }
        if(rightOn){
            if(player.position.x < boardWidth/2 - 0.7){
                player.position.x += moveSpeed * delta;
            } else {
                player.position.x = boardWidth/2 - 0.7;
            }
        }
        if(upOn){
            if(player.position.z > -2){
                player.position.z -= moveSpeed * delta;
            } else {
                player.position.z = -2;
            }
        }
        if(downOn){
            if(player.position.z < 0){
                player.position.z += moveSpeed * delta;
            } else {
                player.position.z = 0;
            }
        }
    }
}

// Mouse Events
function handleMouseDown(e){
    e.preventDefault();
    mouse.x = (e.clientX/window.innerWidth)*2 - 1;
    mouse.y = (e.clientY/window.innerHeight)*2 + 1;
    // console.log(mouse);
}

function handleMouseMove(e){
    e.preventDefault();
    mouse.x = (e.clientX/window.innerWidth)*2 - 1;
    mouse.y = (e.clientY/window.innerHeight)*2 + 1;
    // console.log(mouse);
}

function handleMouseUp(e){
    e.preventDefault();
    mouse.x = (e.clientX/window.innerWidth)*2 - 1;
    mouse.y = (e.clientY/window.innerHeight)*2 + 1;
    // console.log(mouse);
    // console.log(mouse);
}

// //////////////////////////////////////////////// Touch Events
function handleTouchStart(e){
    // if(!pause) e.preventDefault();
    // console.log('touchStart');
    let touches = e.changedTouches;
    for(let i = 0; i<touches.length; i++){
        // console.log(touches[i]);
    }
    touchS.x = touches[0].clientX;
    touchS.y = touches[0].clientY;
    touchM.x = touches[0].clientX;
    touchM.y = touches[0].clientY;
    touchOn = true;
}

function handleTouchEnd(e){
    if(!pause) e.preventDefault();
    // console.log('touchEnd');
    let touches = e.changedTouches;
    for(let i = 0; i<touches.length; i++){
        // console.log(touches[i]);
    }
    leftOn = rightOn = upOn = downOn = false;
    touchOn = false;
}

var ongoingTouches;
function handleTouchCancel(e){
    if(!pause) e.preventDefault();
    // console.log('touchCancel');
    let touches = e.changedTouches;
    for(let i = 0; i<touches.length; i++){
        // console.log(touches[i]);
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);
    }
}

function touchControls(delta){
    if(touchOn){
        let angle = Math.atan2(touchM.y - touchS.y, touchM.x - touchS.x);
        let distance = Math.sqrt(Math.pow((touchM.y - touchS.y),2) + Math.pow((touchM.x - touchS.x), 2));
        if(distance > 0){
            if(player.position.x < -boardWidth/2){
                player.position.x = -boardWidth/2;
            } else if(player.position.x > boardWidth/2 -1){
                player.position.x = boardWidth/2 -1;
            } else {
                player.position.x += Math.cos(angle) * delta * moveSpeed;
            }
            
            if(player.position.z < -2){
                player.position.z = -2;
            } else if(player.position.z > 0){
                player.position.z = 0;
            } else {
                player.position.z += Math.sin(angle) * delta * moveSpeed;
            }
        }
    }
}

function handleTouchMove(e){
    if(!pause) e.preventDefault();
    // console.log('touchMove');
    let touches = e.changedTouches;
    for(let i = 0; i<touches.length; i++){
        // console.log(touches[i]);
    }
    let tx = touches[0].clientX;
    let ty = touches[0].clientY;
    touchM.x = touches[0].clientX;
    touchM.y = touches[0].clientY;
    let angle = Math.atan2(ty - touchS.y, tx - touchS.x);
    // console.log(angle);
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
      var id = ongoingTouches[i].identifier;
      
      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
}

// Movement for Keyboard
// Frame Restricted
// Board Movement Restrictions based on Board Size
// function handleMovement(delta) {
//     let stepper = 10;
//     if(leftOn || rightOn || upOn || downOn){
//         if(moveCount % stepper === 0){
//             if(leftOn){
//                 if(player.position.x !== -boardWidth/2){
//                     player.position.x -= 1;
//                 }
//             }else if(rightOn){
//                 if(player.position.x !== boardWidth/2 - 1){
//                     player.position.x += 1;
//                 }
//             }else if(upOn){
//                 if(player.position.z !== -2){
//                     player.position.z -= 1;
//                 }
//             }else if(downOn){
//                 if(player.position.z !== 0){
//                     player.position.z += 1;
//                 }
//             }
//         }
//         moveCount++;
//     } else {
//         moveCount = stepper;
//     }
// }

// function handleTouchSegmented(angle){
//     if(angle > -22.5 && angle < 22.5){ // Right
//         leftOn = upOn = downOn = false;
//         rightOn = true;
//     } else if(angle < -22.5 && angle > -67.5){ // Down Right
//         leftOn = downOn = false;
//         rightOn = upOn = true;
//     } else if(angle < -67.5 && angle > -112.5){ // Down
//         leftOn = rightOn = downOn = false;
//         upOn = true;
//     } else if(angle < -112.5 && angle < -157.5){ // Down Left
//         rightOn = downOn = false;
//         upOn = leftOn = true;
//     } else if(angle > 157.5 && angle < 180 || angle < -157.5 && angle > -180){ // Left
//         leftOn = rightOn = upOn = downOn = false;
//         leftOn = true;
//     } else if(angle > 112.5 && angle < 157.5){ // Up Left
//         rightOn = upOn = false;
//         downOn = leftOn = true;
//     } else if(angle > 67.5 && angle < 112.5){ // Up
//         leftOn = rightOn = upOn = false;
//         downOn = true;
//     } else if(angle > 22.5 && angle < 67.5){ // Up Right
//         leftOn = upOn = false;
//         downOn = rightOn = true;
//     }
// }