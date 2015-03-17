// start slingin' some d3 here.

var width = 1000;
var height = 600;

var container = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)


var rectangle = container.append('rect')
  .attr('width', width)
  .attr('height',height)
  .attr('fill', 'black')

var Dot = function(color, x, y) {
  this.radius = 10;
  this.color = color;
  this.x = x;
  this.y = y;
}


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
var player = new Dot('blue', width/2, height/2);

var dragmove = function(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this)
  .attr('cx', x)
  .attr('cy',y )
}
var drag = d3.behavior.drag()
  .on('drag', dragmove)

var hero = container.append('circle')
  .data([player])
  .attr('r', function(d) {return d.radius})
  .attr('cx', function(d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('fill', function(d) {return d.color})
  .call(drag)

var numEnemies = 20;
var enemyArray = [];
for (var i = 0; i< numEnemies; i++) {
  enemyArray[i] = new Enemy();
}


var enemies = container.selectAll('circle')
  .data (enemyArray)
  .enter().append('circle')
  // .attr('background-image', 'asteroid.png')
  // .attr('width', function(d) {return d:x})
  // .attr('height',function(d) {return d:y})
  .attr('class', 'enemies')
  .attr('r', function (d) {return d.radius})
  .attr('cy', function (d) {return d.y})
  .attr('cx',function (d) {return d.x})
  .attr('fill', function(d) {return d.color})
 
 
  

  var changePosition = function() {
    enemies.transition().duration(1000)
    .attr('cx', function(d) {return d.createPositionX()})
    .attr('cy', function(d) {return d.createPositionY()});
  }
setInterval (changePosition, 1000)

