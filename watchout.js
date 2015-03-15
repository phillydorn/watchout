// start slingin' some d3 here.

var width = 600;
var height = 400;

var svg = d3.select('body').append('svg')
  .attr('width', 700)
  .attr('height', 450)


var rectangle = d3.select('svg').append('rect')
  .attr('width', width)
  .attr('height',height)
  .attr('fill', 'black')

var Enemy = function() {
  this.radius = 10;
  this.color = 'yellow';
  this.x = this.createPositionX();
  this.y = this.createPositionY();
}

Enemy.prototype.createPositionX = function() {
  return Math.random()*width;
}
Enemy.prototype.createPositionY = function() {
  return Math.random()*height;  
}
var numEnemies = 10;
var enemyArray = [];
for (var i = 0; i< numEnemies; i++) {
  enemyArray[i] = new Enemy();
}


var enemies = d3.select('svg').selectAll('circle')
  .data (enemyArray)
  .enter().append('circle')
  // .attr('background-image', 'asteroid.png')
  // .attr('width', function(d) {return d:x})
  // .attr('height',function(d) {return d:y})
  .attr('r', function(d) {return d.radius})
  .attr('cy', function (d) {return d.y})
  .attr('cx',function (d) {return d.x})
  .attr('fill', function(d) {return d.color})
