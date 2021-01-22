var colonne, ligne, current;
var t = 50;                                      
var grid = [];
var stack = [];
var ch = [];
var solv = [];
var ktop, kbot, kright, kleft = false;
chargement = false;
finii = false;
s = 16;
test = false;

function setup() {
  this.complete = false;
  //frameRate(5);                           
  createCanvas(500,500);                   
  colonne = floor(width/t);
  ligne = floor(height/t);
  fin = (colonne*ligne)-1;
  
  for(var y = 0; y < ligne; y++){
    for(var x = 0; x < colonne; x++){
     var cellule = new Cellule(x,y);
     grid.push(cellule);                       
    }
  }
  current = grid[0];                             
}

function draw() {
  background(51);

if(finii === true){
  
  if(test === false){
    if(s < 32){
      s = s + 0.7;
    }
  }
  
  if(test === true){
    if(s > 16){
      s = s - 0.7;
    }    
  }
  
  if(s >= 32){
    test = true;
  }
  
  if(s <= 16){
    test = false;
  }
  
  fill(255);
  textSize(s);
  textAlign(CENTER);
  text("You win !", random(width/2, width/2.1), random(height/2, height/2.1));
}

if (finii === false){  
  
if(chargement === false){  
  for(var i = 0; i < grid.length; i++){
    grid[i].show();                             
  }
}  
  if(this.complete === true){
    var prochaine = current.move();
    current.solved = true;
  if(chargement === true){  
    current.shape();
    current.startEnd();
      for(var i = 0; i < grid.length; i++){
    grid[i].show();                             
  }
  }
    
    if(prochaine){
      prochaine.solved = true;
      solv.push(current);
      current = prochaine;
      keyPressed();
      setzero();
      if(current == grid[fin]){
        finii = true;
        
      }
    }
  }
  
  if(this.complete === false){
  var suivante = current.checkVoisins();    
  current.visite = true;                       
  current.startEnd();

  
  if(suivante){                                 
    suivante.visite = true;
    ch.push(current);
    stack.push(current);                        
    retireMur(current, suivante);              
    current = suivante;
  }else if(stack.length > 0){
   current = stack.pop();
  }else if(current == grid[0]){
   this.complete = true;
   chargement = true;
   }
  }
 }
}


function index(x,y){                                      
  if(x < 0 || y < 0 || x > colonne-1 || y > ligne-1){      
    return -1;                                             
  }
  return x + y * colonne;                       
}                                               

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function setzero(){
  ktop = false;
  kright = false;
  kbot = false;
  kleft = false;
}

function keyPressed(){
 if(keyCode === UP_ARROW){
  ktop = true;
  }else if(keyCode === DOWN_ARROW){
  kbot = true;
  }

 if(keyCode === LEFT_ARROW){
  kleft = true;
 }else if(keyCode === RIGHT_ARROW){
  kright = true;
 }
}


function Cellule(x, y) {
  this.x = x;
  this.y = y;
  this.mur = [true, true, true, true];         
  this.visite = false;
  
  this.move = function(){
    var next = [];
    var dessus = grid[index(x    , y - 1)];     
    var droite = grid[index(x + 1, y    )];    
    var bas    = grid[index(x    , y + 1)];   
    var gauche = grid[index(x - 1, y    )];     
    
    
   if(dessus && dessus.mur[2] === false && ktop === true){
    next.push(dessus);
    ktop = false;
   }  
   if(droite && droite.mur[3] === false && kright === true){
    next.push(droite);
    kright = false;
   }  
   if(bas && bas.mur[0] === false && kbot === true){
    next.push(bas);
    kbot = false;
    }  
   if(gauche && gauche.mur[1] === false && kleft === true){
    next.push(gauche);
    kleft = false;
   }
   
   if(next.length > 0){
    var r = floor(random(0, next.length));        
    return next[r];
   }else{
    return undefined;                                
   }
  }
  
  this.checkVoisins = function(){               
    var voisins = [];
    var dessus = grid[index(x    , y - 1)];      
    var droite = grid[index(x + 1, y    )];      
    var bas    = grid[index(x    , y + 1)];     
    var gauche = grid[index(x - 1, y    )];     
    
    if(dessus && !dessus.visite){
      voisins.push(dessus);                       
    }
     if(droite && !droite.visite){
      voisins.push(droite);                          
    }
     if(bas && !bas.visite){
      voisins.push(bas);                            
    }
     if(gauche && !gauche.visite){
      voisins.push(gauche);                          
    }
    
    if(voisins.length > 0){
      var r = floor(random(0, voisins.length));         
      return voisins[r];
    }else{
      return undefined;                                
    }
  }
  
  
  this.startEnd = function(){
   noStroke();
    fill(240, 195, 0, 100);
    rect(0, 0, t, t);
    rect(width - t, height - t, width, height);
  }
  
  this.highlight = function(){
   var x = this.x*t;
   var y = this.y*t;
   noStroke();                                       
    fill(0,255,100,100);
    rect(x, y, t, t);
  }
  
  this.shape = function(){
  radius = t/2;

  beginShape();
  stroke(255);
  fill(0, 255, 255, 100)
  for (var a = 0; a < TWO_PI; a += 0.10) {
    var offset = map(sin(a*35 + frameCount * 0.1), -1, 1, -7, 7);
    var x = this.x*t;
    var y = this.y*t;
    var r = radius + offset;
    var i = r * cos(a)+ x + t/2;
    var j = r * sin(a)+ y + t/2;
    vertex(i, j);
  }
  endShape();
    
  }  
  
  this.show = function() {                     
    var x = this.x*t;
    var y = this.y*t;
    stroke(255);
    
    if(this.mur[0]){
     line(x     ,y     ,x + t ,y    );}                
    
    if(this.mur[1]){ 
     line(x + t ,y     ,x + t ,y + t);}                
    
    if(this.mur[2]){
     line(x + t ,y + t ,x     ,y + t);}                
    
    if(this.mur[3]){
     line(x     ,y + t ,x     ,y    );}                
    
    // if (this.solved){
    //  noStroke();
    //  fill(102, 102, 102, 100);  
    //  rect(x, y, t, t);
    //}
  }
}

function retireMur(a, b){
 var x = a.x - b.x;         
  if(x === 1){
    a.mur[3] = false;        
    b.mur[1] = false;
  }else if(x === -1){
    a.mur[1] = false;
    b.mur[3] = false;
  }
 var y = a.y - b.y;         
  if(y === 1){
   a.mur[0] = false;        
   b.mur[2] = false;
  }else if(y === -1){
   a.mur[2] = false;
   b.mur[0] = false;
  }
}



















