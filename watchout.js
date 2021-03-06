// start slingin' some d3 here.
var highScore = 0;
var currentScore = 0;
var collisions = 0;
var  collisionNode = d3.select('.collisions')
      .select('span');
var highScoreNode =  d3.select('.high')
      .select('span')
var currentScoreNode =  d3.select('.current')
      .select('span')
var heading = 0;
function updateScore () {
  currentScoreNode.text(currentScore++);

}
setInterval(updateScore, 300);
// set the height and width of the master container
var width = 1000;
var height = 600;
//create the svg container for all the shapes
var container = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)

//create the colored rectangle to hold all the enemies
var rectangle = container.append('image')
  .attr('width', width)
  .attr('height',height)
  .attr('xlink:href', 'space.jpg')
//create superclass for hero and enemies to inherit
var Dot = function(color, x, y) {
  this.radius = 10;
  this.color = color;
  this.x = x;
  this.y = y;
  this.pos = [x,y];
}

//create Enemy subclass - giving them random start positions
var Enemy = function() {
  Dot.call(this, 'yellow', this.createPositionX(), this.createPositionY())
}

Enemy.prototype = Object.create(Dot.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.createPositionX = function() {
  return Math.random()*width;
}
Enemy.prototype.createPositionY = function() {
  return Math.random()*height;  
}

//functionality for hero to be dragged around
var dragmove = function() {
  var x = d3.event.x;
  var y = d3.event.y;
  var newHeading = Math.floor(Math.atan(d3.event.dy/d3.event.dx)*180/Math.PI);
  var angle = newHeading-heading;
  heading = newHeading;
  debugger;
  d3.select(this)
  .attr('x', x-25)
  .attr('y', y-25)
  .attr('transform', 'rotate('+ angle + 'deg)')
}
//drag event handler
var drag = d3.behavior.drag()
  .on('drag', dragmove)

//place the hero at the center of the board

var hero = container.append('svg')

hero.attr('class', 'hero')
    .attr('x', 0)
    .attr('y',0)
    .attr('height', height)
    .attr('width', width)
var rocket = hero.append('image')
    .attr('class','rocket')
    .attr('width', 50)
    .attr('height', 50)
    .attr('x', width/2)
    .attr('y', height/2)
    .attr('xlink:href', 'rocket.png')
    .call(drag)
   
//create an array of Enemy objects 
var numEnemies = 10;
var enemyArray = [];
for (var i = 0; i< numEnemies; i++) {
  enemyArray[i] = new Enemy();
}

//places all the enemies inside the container rectangle

var enemies = container.selectAll('image')
  .data (enemyArray)
  .enter().append('image')
  .attr('class', 'enemies')
  .attr('width', 50)
  .attr('height', 50)
  .attr('x',function (d) {return d.x})
  .attr('y', function (d) {return d.y})
  .attr('xlink:href', 'asteroid.png')
 
 
 //tween function to track enemies paths during transition
  function makePath (d) {
    var enemy = d3.select(this);
    var startX = enemy.attr('x');
    var startY = enemy.attr('y');
    var endX = d.newX;
    var endY = d.newY;
    var interpolateX = d3.interpolate(startX, endX);
    var interpolateY = d3.interpolate(startY, endY);
    return function (t) {
      enemy.attr('x', interpolateX(t));
      enemy.attr('y', interpolateY(t));
      if (doesCollide(enemy)) {
        collisionUpdate();
      }
    }    
  }
  function doesCollide(enemy) {
    if (Math.abs(+enemy.attr('x')+25 - +rocket.attr('x') +rocket.attr('width')/2) < 25 && 
          Math.abs(+enemy.attr('y')+25 - +rocket.attr('y')+ rocket.attr('height')/2) < 25) {
      return true;
    }
    return false;
  }
  
  function collisionUpdate() {
    collisionNode.text(++collisions)
    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreNode.text(highScore);
    }
    currentScore = 0;
  }

//recursive self-calling function to have the enemies continuously moving
  changePosition();

  function changePosition () {
    enemyArray.forEach(function (val) {
      val.newX = val.createPositionX();
      val.newY = val.createPositionY();})
    enemies.transition().duration(1000)
      .tween('attr', function (d) { return makePath.call(this,d)})
      .each('end', changePosition)
  }
  

