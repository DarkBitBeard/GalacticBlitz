// Galactic Blitz

const canvas = document.getElementById("galacticBlitzCanvas");
const ctx = canvas.getContext("2d");

// Load high scores from localStorage or initialize an empty array
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Player spaceship
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 65,
    width: 60,
    height: 60,
    sprite: new Image(),
    spriteSrc: "./Assets/Images/Space ship.png", // Adjust the path accordingly
    speed: 5,
  };
  
  // Load player sprite
  player.sprite.onload = () => {
    // Start the game loop only after the sprite is loaded
    gameLoop();
  };
  player.sprite.src = player.spriteSrc;
  

// Bullet array
const bullets = [];
const bulletSpeed = 8;

// Enemy array
const enemies = [];
const enemyWidth = 30;
const enemyHeight = 20;
const enemySpeed = 2;
let score = 0;

// Function to save high scores to localStorage
function saveHighScores() {
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Function to display high scores
function viewHighScores() {
  const highScoresList = highScores.map(score => `${score.initials}: ${score.score}`).join('\n');
  alert(`High Scores:\n${highScoresList}`);
}

// Display a prompt to enter initials when the game is over and a high score is achieved
function enterInitials() {
  const initials = prompt('Congratulations! You achieved a high score! Enter your initials:');
  if (initials) {
    const highScore = { initials, score };
    highScores.push(highScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10); // Keep only the top 10 scores
    saveHighScores(); // Save high scores to localStorage
    alert('High score submitted successfully!');
  }
}

// Draw the player
function drawPlayer() {
    ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);
  }
  
  // Game loop using requestAnimationFrame
  function gameLoop() {
    // Update the game state
    // ...
  
    // Draw the player
    drawPlayer();
  
    // Request the next frame
    requestAnimationFrame(gameLoop);
  }

// Draw bullets
function drawBullets() {
  ctx.fillStyle = "#00ff00"; // Green color for bullets
  for (const bullet of bullets) {
    ctx.beginPath();
    ctx.rect(bullet.x, bullet.y, 5, 10); // Bullet size
    ctx.fill();
    ctx.closePath();
  }
}

// Draw enemies
function drawEnemies() {
  ctx.fillStyle = "#ff0000"; // Red color for enemies
  for (const enemy of enemies) {
    ctx.beginPath();
    ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fill();
    ctx.closePath();
  }
}

// Function to create new enemies
function createEnemies() {
  const newEnemy = {
    x: Math.random() * (canvas.width - enemyWidth),
    y: 0,
    width: enemyWidth,
    height: enemyHeight,
  };

  enemies.push(newEnemy);
}

// Update the game state
function update() {
  // Update player position
  if (leftKeyPressed && player.x > 0) {
    player.x -= player.speed;
  }
  if (rightKeyPressed && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }

  // Update bullet positions
  for (const bullet of bullets) {
    bullet.y -= bulletSpeed;

    // Check for collision with enemies
    for (const enemy of enemies) {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + 5 > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + 10 > enemy.y
      ) {
        // Bullet hit an enemy
        bullets.splice(bullets.indexOf(bullet), 1);
        enemies.splice(enemies.indexOf(enemy), 1);
        score++;

        // Play enemy died sound effect
        document.getElementById("enemyDiedSound").play();
      }
    }

    // Remove bullets that go beyond the canvas
    if (bullet.y < 0) {
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  }

  // Update enemy positions
  for (const enemy of enemies) {
    enemy.y += enemySpeed;
  }

  // Create new enemies
  if (Math.random() < 0.02) {
    createEnemies();
  }

  // Check for collision with player
  for (const enemy of enemies) {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // Collision detected, reset game
      alert("Game Over! Your score: " + score);
      enemies.length = 0;
      bullets.length = 0;
      score = 0;

      // Check for a new high score after the player dies
      if (score > 0 && score > (highScores.length > 0 ? highScores[0].score : 0)) {
        enterInitials();
      }

      // Stop the background music
      document.getElementById("bgMusic").pause();
    }
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player, bullets, and enemies
  drawPlayer();
  drawBullets();
  drawEnemies();

  // Display the score
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 10, 20);

  // Request the next frame
  requestAnimationFrame(update);
}

// Handle keyboard input
let leftKeyPressed = false;
let rightKeyPressed = false;
let spacebarPressed = false;

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    leftKeyPressed = true;
  } else if (event.code === "ArrowRight") {
    rightKeyPressed = true;
  } else if (event.code === "Space" && !spacebarPressed) {
    // Ensure that spacebarPressed is false to prevent continuous shooting
    spacebarPressed = true;

    // Create a new bullet when spacebar is pressed
    const bullet = {
      x: player.x + player.width / 2 - 2.5, // Center the bullet horizontally
      y: player.y,
    };
    bullets.push(bullet);

    // Play shoot sound effect
    document.getElementById("shootSound").play();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    leftKeyPressed = false;
  } else if (event.code === "ArrowRight") {
    rightKeyPressed = false;
  } else if (event.code === "Space") {
    spacebarPressed = false;
  }
});

// Start the game loop
update();
