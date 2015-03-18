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

function updateScore () {
  currentScoreNode.text(currentScore++);

}
setInterval(updateScore, 500);
// set the height and width of the master container
var width = 1000;
var height = 600;
//create the svg container for all the shapes
var container = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)

//create the colored rectangle to hold all the enemies
var rectangle = container.append('rect')
  .attr('width', width)
  .attr('height',height)
  .attr('fill', 'black')
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

//create one hero Dot
var player = new Dot('blue', width/2, height/2);
//functionality for hero to be dragged around
var dragmove = function() {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this)
  .attr('cx', x)
  .attr('cy', y)
}
//drag event handler
var drag = d3.behavior.drag()
  .on('drag', dragmove)

//place the hero at the center of the board
var hero = container.append('circle')
  .data([player])
  .attr('r', function(d) {return d.radius})
  .attr('cx', function(d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('fill', function(d) {return d.color})
  .call(drag)

//create an array of Enemy objects 
var numEnemies = 20;
var enemyArray = [];
for (var i = 0; i< numEnemies; i++) {
  enemyArray[i] = new Enemy();
}

//places all the enemies inside the container rectangle
var enemies = container.selectAll('circle')
  .data (enemyArray)
  .enter().append('circle')
  // .attr('background-image', 'asteroid.png')
  // .attr('width', function(d) {return d:x})
  // .attr('height',function(d) {return d:y})
  .attr('class', 'enemies')
  .attr('r', function (d) {return d.radius})
  .attr('cx', function (d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('fill', function(d) {return d.color})
 
 //tween function to track enemies paths during transition
  function makePath (d) {
    var enemy = d3.select(this);
    var startX = enemy.attr('cx');
    var startY = enemy.attr('cy');
    var endX = d.newX;
    var endY = d.newY;
    var interpolateX = d3.interpolate(startX, endX);
    var interpolateY = d3.interpolate(startY, endY);
    return function (t) {
      enemy.attr('cx', interpolateX(t));
      enemy.attr('cy', interpolateY(t));
      if (doesCollide(enemy)) {
        collisionUpdate();
      }
    }    
  }
  function doesCollide(enemy) {
    if (Math.abs(+enemy.attr('cx') - +hero.attr('cx')) < hero.attr('r') && 
          Math.abs(+enemy.attr('cy') - +hero.attr('cy')) < hero.attr('r')) {
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
  

