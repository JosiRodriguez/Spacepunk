function initCanvas(){
    var som;
    som= document.getElementById("som");
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); 
    var enemiespic1  = new Image(); 
    var pontoacao =0 



    
    //imagens

    backgroundImage.src = "Image/fondo_2.jpg"; 
    naveImage.src       = "Image/nave.png"; 
    enemiespic1.src     = "Image/enemigo-1.png";
     
   

    //variaveis canvas ancho e largo

    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px




    //funcao que retorna a estructura de um objeto 
    
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

 
    var enemies = [

                 // primer grupo de inimigos 
                   new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy4", x:100,  y:-400,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x:225,  y:-200,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x:350,  y:-100,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                   new enemyTemplate({id: "enemy11", x: 800, y: -50, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy12", x: 755, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy13", x: 780, y: -90, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy14", x:690,  y:-120, w:70,  h: 30}),
                   new enemyTemplate({id: "enemy15", x:795,  y:-240,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy16", x:20,  y:+5,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy17", x:55,  y:+50,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy18", x:75,  y:-209,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy19", x:600,  y:-300,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy20",x:500, y: -220, w: 70, h: 30}),
                  ];

    // mostrar inimigos
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            //console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h); //isto faz com que o inimigo comece a descer

            //Detecta quando chegam a um nivel inferior 
            launcher.hitDetectLowerLevel(enemyList[i]);
            
        }
    }


    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);

    }

    

    function Launcher(){
        // ubicacao dos disparos 
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", 
        this.misiles = [];
         
         
         this.gameStatus = {
            over: false, 
            fillStyle: 'grey',
            font: '50px Orbitron',
        }

    

        //como se desliza de um lado para outro. Verificar o valor da propriedadade direccion 
        
        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); 
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); 

            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); 
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){          // quando a bala chega ao topo ou seja menor que 0, se apaga a bala 
                    this.misiles.splice(i,1); 
                    
                }
            }
            
            if (enemies.length === 0) {
                clearInterval(animateInterval); 
                ctx.fillStyle = 'violet';
                ctx.font = this.gameStatus.font ;
                ctx.fillText('WINNER!', cW * .5 - 80, 50);
                
            }
        }



        
        // Detetar impacto do missil 
        this.hitDetect = function (m, i) {
            console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                som.play();
               

                // verificar a ubicacao de Y , e ubicacao da bala e do inimigo 
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){




                    this.misiles.splice(this.misiles[i],1); // apaga o missil
                    enemies.splice(i, 1); // apaga o missil que o enemigo bateu 
                    pontoacao += 1 
                    document.querySelector(".num").innerHTML=pontoacao
                    
                }
            }
        }
        //  Perguntar a nave se um inemigo passa ou bate a nave 
        this.hitDetectLowerLevel = function(enemy){
            // se a ubicacao da nave é superior a 700 até ali passa o limite y perde
            if(enemy.y > 700){
                this.gameStatus.over = true;
                this.gameStatus.message = 'Game Over';
            }
            // isto deteta um choque da nave com os inimigos
            //console.log(this);
            // this.y -> onde se encontra a nave espacial 


            if(enemy.id === 'enemy3'){
                
                console.log(this.x);
            }
            // a) Se o  inimigo  Y é maior do que this.y - 25 => há uma colisao 
            // b) Se o inimigo X é maior do que  this.x + 45 && enemy x > this.x - 45  há colisao 
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // comprovar ubicacao do inimigo (der-izq)
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'GAME OVER'
                    
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // para o jogo 
                ctx.fillStyle = this.gameStatus.fillStyle; // estabelecer cor do texto 
                ctx.font = this.gameStatus.font;
                // muestra el texto en el canvas 
                
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // text x , y
            }
        }
    }

    // movimento do teclado 
    

    var animateInterval = setInterval(animate, 6);

    var left_btn  = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn  = document.getElementById('fire_btn'); 

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // seta izq
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){   // Funcao que permite que nao saia das coordenadas 
                launcher.x+=0;
                launcher.direccion = '';  // '' cadena vacia
            }
       }    
    });

    document.addEventListener('keyup', function(event) {   // se deixar de presionar o botao 
        if(event.keyCode == 37)
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // seta direita 
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {    // se deixar de presionar o botao 
        if(event.keyCode == 39) // seta direita 
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // seta up 
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){   //distancia para que nao suba mais
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){      // se deixar de presionar o botao 
         if(event.keyCode == 38) // seta up
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // seta down 
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){       // se deixar de presionar o botao 
         if(event.keyCode == 40) // seta down 
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){   
         if(event.keyCode == 82) // restart game
         {
          location.reload();
         }
    });



    // control de botao por mouse 

    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });


    //dispara balas
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    // dispara com o botao de espaco
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

window.addEventListener('load', function(event) {
    initCanvas();
});



//som do jogo e botoes

function removersom(){
    som.volume=0;
}

function colocarsom(){
    som.volume=1;
}

function retornar(){
    location.reload()
}


function ajuda(){
    img6.style.display="block"
}

function desaparece(){
    img6.style.display="none"
}

function home(){
    window.location.href="index.html"
}