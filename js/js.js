function start() {

    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo

    var podeAtirar = true;
    var fimdejogo=false;

    //Variáveis de placar
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    
    //Var de energia
    var energiaAtual=3;
    
	var jogo = {}
	var velocidade=5;
    var posicaoY = parseInt(Math.random() * 334);
	var TECLA = {
        W: 87,
        S: 83,
        D: 68
        }
    
    jogo.pressionou = [];

    /* Sons do jogo */
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    //Evento que deixa a música em loop
    musica.play();
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    

    //Verifica se o usuário pressionou alguma tecla	
	$(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    
    
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

	//Game Loop

	jogo.timer = setInterval(loop,30);
	
	function loop() {
	
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
	
	} // Fim da função loop()



    //Função que movimenta o fundo do jogo
	
	function movefundo() {
	
	esquerda = parseInt($("#fundoGame").css("background-position"));
	$("#fundoGame").css("background-position",esquerda-1);
	
    } // fim da função movefundo()
    
    function movejogador() {
	
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);

            if (topo<=0) {
		
                $("#jogador").css("top",topo+10);
            }
        
        }
        
        if (jogo.pressionou[TECLA.S]) {
            
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);
            
            if (topo>=434) {	
                $("#jogador").css("top",topo-10);
                    
            }
        }
        
        if (jogo.pressionou[TECLA.D]) {
            
            //Chama função Disparo
            disparo();
        }
    
    } // fim da função movejogador()

    function moveinimigo1() {

        posicaoX = parseInt($("#inimigo1").css("left"));
            $("#inimigo1").css("left",posicaoX-velocidade);
            $("#inimigo1").css("top",posicaoY);
            
            if (posicaoX<=0) {
                posicaoY = parseInt(Math.random() * 334);
                $("#inimigo1").css("left",694);
                $("#inimigo1").css("top",posicaoY);
                
            }
    } //Fim da função moveinimigo1()

    function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX-3);
				
		if (posicaoX<=0) {
			
		    $("#inimigo2").css("left",775);
					
		}
    } // Fim da função moveinimigo2()

    function moveamigo() {
	
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
                    
        if (posicaoX>906) {
                
            $("#amigo").css("left",0);
                        
        }
    
    } // fim da função moveamigo()

    function disparo() {
	
        if (podeAtirar==true) {

            somDisparo.play();
            
            podeAtirar=false;
        
            topo = parseInt($("#jogador").css("top")) //Posição top do jogador
            posicaoX= parseInt($("#jogador").css("left")) //Posição left do jogador
            //Abaixo: recebe a posição inicial quando for disparado (tecla D)
            tiroX = posicaoX + 190;
            topoTiro=topo+37;
            //Abaixo: mostra a div disparo
            $("#fundoGame").append("<div id='disparo'></div");
            //Abaixo: mostra a posição inicial quando for disparado
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            //Abaixo: Variável de tempo, executaDisparo a cada 30 segundos
            var tempoDisparo=window.setInterval(executaDisparo, 60);
        
        } //Fecha podeAtirar
     
        function executaDisparo() {
            //Abaixo: recebe posição left do disparo
            posicaoX = parseInt($("#disparo").css("left"));
            //Abaixo: aumetna 15 na posição left para o disparo 'se movimentar'
            $("#disparo").css("left",posicaoX+15); 
            //Abaixo: verifica se o disparo chegou ao final da tela
            if (posicaoX>900) {
                            
                window.clearInterval(tempoDisparo);//Para a variável de tempo
                tempoDisparo=null;
                $("#disparo").remove();//Remove a imagem do disparo
                podeAtirar=true;
                        
            }
        } // Fecha executaDisparo()
    } // Fecha disparo()

    function colisao() {
        //Abaixo: colisao1 recebe resultado da função jquery collision
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        // verificando colisão jogador com o inimigo1
        if (colisao1.length>0) {

            energiaAtual--; //diminui 1 de energia

            //Abaixo: no momento da explosão, chamado a explosao1 no lugar atual do inimigo1
            inimigo1X = parseInt($("#inimigo1").css("left"));
	        inimigo1Y = parseInt($("#inimigo1").css("top"));
	        explosao1(inimigo1X,inimigo1Y);
		
            
            //Abaixo: troca posição do inimigo1 quando há colisão
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }
        
        // jogador com o inimigo2 = verificando colisão
        if (colisao2.length>0) {

            energiaAtual--; //diminui 1 de energia
        
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
                    
            $("#inimigo2").remove();
                
            //função que irá mostrar o inimigo2 novamente, após alguns segundos da colisão
            reposicionaInimigo2();
                
        }

        // Disparo com o inimigo1 = verificando colisão
	    if (colisao3.length>0) {

            velocidade=velocidade+0.3; //aumenta veloc do inimigo1 quando ele renasce
            
            pontos=pontos+100; //aumenta o placar
		
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
                
            explosao1(inimigo1X,inimigo1Y);
            //Reposiciona o disparo se houver colisão
            $("#disparo").css("left",950);
            //Reposiciona inimigo1 randomicamente                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
                
        }

        // Disparo com o inimigo2 = verificando colisão	
        if (colisao4.length>0) {

            pontos=pontos+50; //aumenta placar
            
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();              
        }

        // jogador com o amigo = verificando colisão			
        if (colisao5.length>0) { 
            somResgate.play(); 
            salvos++; //dois saltos          
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Inimigo2 com o amigo = verificando colisão
        if (colisao6.length>0) {

            perdidos++; //placar amigo foi atropelado(inimigo2)
                
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();
                    
        }

        //Para teste utilizar: console.log(colisao1);    
    } //Fim da função colisao()

    //Explosão 1
    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
	    $("#fundoGame").append("<div id='explosao1'></div"); //criando div explosao1
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");//indicando imagem background da div explosao1
        
	    var div=$("#explosao1");//criando variável div para facilitar o chamado
	    div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        /* 
        Abaixo: animação jquery tem inicio no tamanho da imagem
        até um total de width:200 e opacity:0
         */
        div.animate({width:200, opacity:0}, "slow");
        
        //Abaixo: variável de tempo para remover explosao1 após 2s
	    var tempoExplosao=window.setInterval(removeExplosao, 2000);
	
		function removeExplosao() {//função para remover a explosão após o uso da div
			
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
			
		}		
    } // Fim da função explosao1()
    
    //Reposiciona Inimigo2	
	function reposicionaInimigo2() {
	
        var tempoColisao4=window.setInterval(reposiciona4, 5000);//após 5s
            
        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
            
            //Abaixo: só irá mostrar a div inimigo2 se o jogo ainda não acabou
            if (fimdejogo==false) {
            
                $("#fundoGame").append("<div id=inimigo2></div");
            
            }
        }	
    } // Fim da função reposicionaInimigo2()

    //Explosão2	
	function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
	
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
        function removeExplosao2() {
            
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2=null;
            
        }            
    } // Fim da função explosao2()

    //Reposiciona Amigo	
	function reposicionaAmigo() {	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
        
            if (fimdejogo==false) {
        
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
        
            }            
        }        
    } // Fim da função reposicionaAmigo()

    //Explosão3	
    function explosao3(amigoX,amigoY) {

        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3=null;           
        }
    } // Fim da função explosao3

    function placar() {
	
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    } //fim da função placar()

    //Barra de energia
    function energia() {
        
        if (energiaAtual==3) {
            
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual==2) {
            
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual==1) {
            
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual==0) {
            
            $("#energia").css("background-image", "url(imgs/energia0.png)");
            
            //Game Over
            gameOver();
        }

    } // Fim da função energia()

    //Função GAME OVER
	function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer); //Parando loop 
        jogo.timer=null;
        
        //Remove toodas as divs do jogo e adiciona a div fin de jogo
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    } // Fim da função gameOver();

} // Fim da função start()

/* Reinicia Jogo */
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
} //Fim da função reiniciaJogo