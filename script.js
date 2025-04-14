document.addEventListener('DOMContentLoaded', function() {
    // Create stars
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }
    
    // Limit the number of meteors
    let activeMeteors = 0;
    const MAX_METEORS = 10;
    
    // Create initial meteors
    for (let i = 0; i < 5; i++) {
        createMeteor();
    }
    
    // Game variables
    let secretNumber;
    let attempts = 0;
    let gameOver = false;
    
    // DOM elements
    const numbersContainer = document.getElementById('numbers');
    const messageBox = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    const restartBtn = document.getElementById('restart-btn');
    
    // Initialize game
    function initGame() {
        // Reset game state
        secretNumber = Math.floor(Math.random() * 50) + 1;
        attempts = 0;
        gameOver = false;
        
        // Update UI
        messageBox.textContent = 'Select a number to begin your cosmic quest!';
        attemptsDisplay.textContent = `Attempts: ${attempts}`;
        
        // Clear and create number cards
        numbersContainer.innerHTML = '';
        for (let i = 1; i <= 50; i++) {
            const card = document.createElement('div');
            card.classList.add('number-card');
            card.textContent = i;
            card.dataset.number = i;
            card.addEventListener('click', handleNumberClick);
            numbersContainer.appendChild(card);
        }
        
        console.log('Secret number is:', secretNumber); // For debugging
    }
    
    // Handle number card click
    function handleNumberClick(event) {
        if (gameOver) return;
        
        const selectedNumber = parseInt(event.target.dataset.number);
        attempts++;
        attemptsDisplay.textContent = `Attempts: ${attempts}`;
        
        if (selectedNumber === secretNumber) {
            // Correct guess
            event.target.classList.add('correct');
            
            // Create centered, properly formatted success message
            messageBox.innerHTML = '';
            
            const successTitle = document.createElement('div');
            successTitle.classList.add('success-message');
            successTitle.textContent = '✨ COSMIC SUCCESS! ✨';
            messageBox.appendChild(successTitle);
            
            const successDetails = document.createElement('div');
            successDetails.classList.add('success-details');
            successDetails.textContent = `You found the secret number ${secretNumber} in ${attempts} attempts!`;
            messageBox.appendChild(successDetails);
            
            gameOver = true;
            
            // Mark all other cards as wrong
            document.querySelectorAll('.number-card').forEach(card => {
                if (parseInt(card.dataset.number) !== secretNumber) {
                    card.classList.add('wrong');
                }
            });
            
            // Create celebration meteors (limited number)
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createMeteor(), i * 300);
            }
            
        } else {
            // Wrong guess
            event.target.classList.add('wrong');
            
            if (selectedNumber < secretNumber) {
                messageBox.innerHTML = `<span style="color: #ff9966">Aim higher!</span><br>The cosmic number is greater than ${selectedNumber}.`;
                
                // Remove all cards with numbers less than or equal to the selected number
                document.querySelectorAll('.number-card').forEach(card => {
                    if (parseInt(card.dataset.number) <= selectedNumber) {
                        card.classList.add('wrong');
                    }
                });
                
            } else {
                messageBox.innerHTML = `<span style="color: #66ccff">Aim lower!</span><br>The cosmic number is less than ${selectedNumber}.`;
                
                // Remove all cards with numbers greater than or equal to the selected number
                document.querySelectorAll('.number-card').forEach(card => {
                    if (parseInt(card.dataset.number) >= selectedNumber) {
                        card.classList.add('wrong');
                    }
                });
            }
        }
    }
    
    // Create a meteor animation with proper cleanup
    function createMeteor() {
        // Only create a new meteor if we're below the maximum
        if (activeMeteors >= MAX_METEORS) {
            return;
        }
        
        activeMeteors++;
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        
        // Keep meteors within the viewport
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * Math.min(300, window.innerHeight / 2);
        meteor.style.left = `${startX}px`;
        meteor.style.top = `${startY}px`;
        
        // Fixed position to prevent page growth
        meteor.style.position = 'fixed';
        
        document.body.appendChild(meteor);
        
        // Trigger animation
        meteor.style.animation = `meteor ${Math.random() * 2 + 1}s linear`;
        
        // Remove after animation
        meteor.addEventListener('animationend', function() {
            meteor.remove();
            activeMeteors--;
            
            // Create a new meteor after some delay to keep them coming
            // but only if we're below the maximum limit
            if (activeMeteors < MAX_METEORS) {
                setTimeout(createMeteor, Math.random() * 2000 + 500);
            }
        });
    }
    
    // Restart game
    restartBtn.addEventListener('click', initGame);
    
    // Initialize game on load
    initGame();
});