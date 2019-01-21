var speed = 1;
var gameReset = false;
var timeCounter = 0;
var level = 0;
var creationCount = 0;
var blockDistance = 2;
var createCount = 0;

function gameLogic(delta){
        // Create New Objects
    if(timeCounter <= 0) {
        // timeCounter set to 2 alternates creation
        if(level > 6){
            timeCounter = blockDistance - 0.5;
        } else {
            timeCounter = blockDistance;
        }
        
        createObjects(delta);
    }
    timeCounter -= speed * delta;
    progressLevel();
    handleObstacles(delta);
    handleCoins(delta);

    // Check Health
    if(health < 0){
        gameReset = true;
    }
    // Reset Game
    if(gameReset){
        pause = true;
        gameOverMenu();
    }
}


var coinGeom = new THREE.CylinderGeometry(0.20, 0.20, 0.1, 20, 32);
var coinMat = new THREE.MeshLambertMaterial({color: 0xFFF20C});
var boxGeom = new THREE.BoxGeometry(0.85, 0.85, 0.85);
var boxMat = new THREE.MeshLambertMaterial({color: 0x27AD35});
/* TO-DO: Re-Create procedural generation to move objects into 
place instead of creating and removing */
function createObjects(delta){
    let obstacleCount = 1;
    for(let i = 0; i<boardWidth; i++){
        let choice = Math.floor(Math.random() * 100);
        let pos = i - boardWidth/2;
        if(choice > 95 ){
            let coin = new THREE.Mesh(
                coinGeom,
                coinMat
            );
            // coin.rotation.x = Math.PI/2;
            coin.position.z = -boardHeight;
            coin.position.x = pos;
            coin.position.y = -0.5;
            
            scene.add(coin);
            coins.push(coin.id);
            coin.geometry.computeBoundingBox();
            coin.geometry.boundingBox.min.z = coin.geometry.boundingBox.min.y;
        } else if(choice > 30 && choice < 90){
            if(obstacleCount < boardWidth - 1){
                let obstacle = new THREE.Mesh(
                    boxGeom,
                    boxMat
                ); 
                obstacle.position.z = -boardHeight;
                obstacle.position.x = pos;
                obstacle.position.y = -0.90;
                obstacle.geometry.computeBoundingBox();
                scene.add(obstacle);
                // Pushing Id of obstacle into obstacle array to call in loop below
                obstacles.push(obstacle.id);
                obstacleCount++;
            }
        }
    }
    createCount++
}

function progressLevel(){
    // Check creation iterations
    if(createCount > 5){
        speed = speed + 0.1;
        createCount = 0;
        level = level + 1;
        let playerLevel = document.getElementById('player-level');
        playerLevel.innerHTML = 'Level: ' + level.toString();

    }
}

// Handles Block Obstacles
function handleObstacles(delta){
    // Animate Block Obstacles and Handle Collision
    let obsRmList = [];
    let holdList = [];
    for(let i = 0; i < obstacles.length; i++){
        var obstacle = scene.getObjectById(obstacles[i], true);
        obstacle.position.z += speed * delta; // <-- Animation

        if(checkCollision(obstacle, player, true)){
            obsRmList.push(i);
            health -= 1;
    
            let playerHealth = document.getElementById('player-health');
            playerHealth.innerHTML = 'Health: ' + health.toString();
        } else {
            // Remove old obstacle and create new one
            if(obstacle.position.z >= 1){
                obsRmList.push(i);
            }else{
                holdList.push(obstacles[i]);
            }
        }
    }

    // Remove Obstacles
    for(let i = 0; i<obsRmList.length; i++){
        var obstacle = scene.getObjectById(obstacles[obsRmList[i]], true);
        scene.remove(obstacle)
    }
    obstacles = holdList;
}

function handleCoins(delta){
    // Animate Coins and Handle Collision
    let coinRmList = [];
    let coinHoldList = [];
    for(let i = 0; i < coins.length; i++){
        var coin = scene.getObjectById(coins[i], true);
        coin.position.z += speed * delta; // <-- Animation
        if(checkCollision(coin, player, false)){
            coinRmList.push(i);
            let playerCoins = document.getElementById('player-coins');
            coinsCollected += 1;
            playerCoins.innerHTML = 'Coins: ' + coinsCollected.toString();
        } else { // remove if collision is detected
            if(coin.position.z >= 1){
                coinRmList.push(i);
            } else {
                coinHoldList.push(coins[i]);
            }
        }
    }

    // Remove Coins
    for(let i = 0; i<coinRmList.length; i++){
        var coin = scene.getObjectById(coins[coinRmList[i]], true);
        scene.remove(coin)
    }
    coins = coinHoldList;
}

function resetGame(){
    // Reset Obstacles
    for(let i = 0; i<obstacles.length; i++){
        var obstacle = scene.getObjectById(obstacles[i], true);
        scene.remove(obstacle);
    }
    obstacles = [];

    // Reset Coins
    for(let i = 0; i<coins.length; i++){
        var coin = scene.getObjectById(coins[i], true);
        scene.remove(coin);
    }
    coins = [];

    // Reset Stats
    health = 3;
    let playerHealth = document.getElementById('player-health');
    playerHealth.innerHTML = 'Health: ' + health.toString();

    coinsCollected = 0;
    let playerCoins = document.getElementById('player-coins');
    playerCoins.innerHTML = 'Coins: 0';
    
    level = 0;
    let playerLevel = document.getElementById('player-level');
    playerLevel.innerHTML = 'Level: 0';

    // Reset Logic
    gameReset = false;
    pause = false;
    frames = 0;
    timeCounter = 0;
    speed = 1;
    createCount = 0;
}

// view-source:https://stemkoski.github.io/Three.js/Collision-Detection.html
// function checkCollision(object1, object2){
//     let playerPoint = object2.position.clone();
//     for(let i = 0; i<object2.geometry.vertices.length; i++){
//         let localVertex = object2.geometry.vertices[i].clone();
//         let globalVertex = localVertex.applyMatrix4(object2.matrix);
//         let directionVector = globalVertex.sub(object2.position);

//         let ray = new THREE.Raycaster(playerPoint, directionVector.clone().normalize());
//         let collisionResults = ray.intersectObject(object1);
//         if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
//             return true;
//         } else {
//             return false;
//         }
//     }
// }

function checkCollision(object1, object2, print){
    // console.log('obstacle: ' + i + ' position z: ' + obstacles[i].position.z);
    let obDim, obxmin, obxmax, obzmin, obzmax, obymin, obymax;
    object1.geometry.computeBoundingBox();
    obDim = object1.geometry.boundingBox;
    obxmin = object1.position.x - obDim.max.x;
    obxmax = object1.position.x + obDim.max.x;
    obzmin = object1.position.z - obDim.max.z;
    obzmax = object1.position.z + obDim.max.z;
    obymin = object1.position.y - obDim.max.y;
    obymax = object1.position.y + obDim.max.y;

    let playerDim, cbxmin, cbxmax, cbzmin, cbzmax, cbymin, cbymax;
    object2.geometry.computeBoundingBox();
    // playerDim = object2.geometry.parameters;
    playerDim = object2.geometry.boundingBox;
    // cbxmin = object2.position.x - playerDim.width/2;
    // cbxmax = object2.position.x + playerDim.width/2;
    // cbzmin = object2.position.z - playerDim.depth/2;
    // cbzmax = object2.position.z + playerDim.depth/2;
    // cbymin = object2.position.y - playerDim.height/2;
    // cbymax = object2.position.y + playerDim.height/2;
    cbxmin = object2.position.x - playerDim.max.x;
    cbxmax = object2.position.x + playerDim.max.x;
    cbzmin = object2.position.z - playerDim.max.z;
    cbzmax = object2.position.z + playerDim.max.z;
    cbymin = object2.position.y - playerDim.max.y;
    cbymax = object2.position.y + playerDim.max.y;

    // console.log(object1, object2);

    // console.log(obxmin, obxmax, obymin, obymax, obzmin, obzmax);
    // console.log(cbxmin, cbxmax, cbymin, cbymax, cbzmin, cbzmax);
    // if(print) console.log(obDim, playerDim);
    
    if((obxmin <= cbxmax && obxmax >= cbxmin)&&
        (obzmin <= cbzmax && obzmax >= cbzmin)&&
        (obymin <= cbymax && obymax >= cbymin)){
        return true;
    } else {
        return false;
    }
}

// function basicCollision(object1, object2){
//     if(object1.position.x === object2.position.x && object1[i].position.z === object2.position.z){
//         console.log('collision');
//     }
// }

// function createObjects(delta){
    //     let numOfObs = Math.floor(Math.random() * 3) + 8;
    //     let rands = [];
    //     for(let i = 0; i<numOfObs; i++){
    //         let xrand = Math.floor(Math.random() * boardWidth) - boardWidth/2;
    //         let pass = false;
    //         if(rands.length === 0){
    //             rands.push(xrand);
    //             pass = true;
    //         } else if(rands.length >= boardWidth - 1){
    //             pass = false;
    //         } else {
    //             let nfound = false
    //             while(!nfound){
    //                 nfound = true;
    //                 for(let j = 0; j<rands.length; j++){
    //                     if(rands[i] === xrand){
    //                         xrand = Math.floor(Math.random() * boardWidth) - boardWidth/2;
    //                         nfound = false;
    //                     }
    //                 }
    //             }
    //             rands.push(xrand);
    //             pass = true;
    //         }
    
    //         // If Passed, create Obstacle
    //         // On reason why it shouldn't pass is because the numOfOrbs is 0
    //         if(pass) {
    //             if(i === numOfObs - 1){
    //                 let coin = new THREE.Mesh(
    //                     new THREE.CylinderGeometry(0.25, 0.25, 0.1, 20, 32),
    //                     new THREE.MeshLambertMaterial({color: 0xFFF20C})
    //                 );
    //                 coin.position.z = -boardHeight;
    //                 coin.position.x = xrand;
    //                 coin.rotation.x = Math.PI/2;
    //                 coin.geometry.computeBoundingBox();
    //                 scene.add(coin);
    //                 coins.push(coin.id);
    //             } else {
    //                 let obstacle = new THREE.Mesh(
    //                     new THREE.BoxGeometry(1, 1, 1),
    //                     new THREE.MeshLambertMaterial({color: 0x59FF56})
    //                 ); 
    //                 obstacle.position.z = -boardHeight;
    //                 obstacle.position.x = xrand;
    //                 obstacle.geometry.computeBoundingBox();
    //                 scene.add(obstacle);
    //                 // Pushing Id of obstacle into obstacle array to call in loop below
    //                 obstacles.push(obstacle.id);
    //             }
    //         }
    //     }
    //     createCount++;
    // }