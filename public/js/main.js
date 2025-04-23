// Wait for the DOM to fully load before running the script

document.addEventListener('DOMContentLoaded', function() {
  // Get references to DOM elements
  const amountDueInput = document.getElementById('amount-due');
  const amountReceivedInput = document.getElementById('amount-received');
  const calculateButton = document.getElementById('calculate-change');
  const resetButton = document.getElementById('reset-calculation');
  const totalChangeDisplay = document.getElementById('total-change');
  
  // Get references to all denomination elements
  const twentiesDisplay = document.getElementById('twenties');
  const tensDisplay = document.getElementById('tens');
  const fivesDisplay = document.getElementById('fives');
  const onesDisplay = document.getElementById('ones');
  const quartersDisplay = document.getElementById('quarters');
  const dimesDisplay = document.getElementById('dimes');
  const nickelsDisplay = document.getElementById('nickels');
  const penniesDisplay = document.getElementById('pennies');
  
  // Add event listener to the calculate button
  calculateButton.addEventListener('click', calculateChange);

  // Add event listener to the reset button
  resetButton.addEventListener('click', resetCalculator);
  
  // ============================
  // Function to calculate change
  function calculateChange() {
    // Get input values and convert to numbers
    const amountDue = parseFloat(amountDueInput.value) || 0;
    const amountReceived = parseFloat(amountReceivedInput.value) || 0;
    
    // Check if we can make change (received amount is sufficient)
    if (amountReceived < amountDue) {
      alert('The amount received is less than the amount due. Please enter valid amounts.');
      return;
    }
    
    // Calculate total change
    let totalChange = amountReceived - amountDue;
    
    // Display total change with 2 decimal places
    totalChangeDisplay.textContent = '$' + totalChange.toFixed(2);
    
    // Convert total change to cents to avoid floating-point issues
    let remainingChangeInCents = Math.round(totalChange * 100);
    
    // Calculate each denomination
    const denominations = {
      twenties: 2000,  // $20 in cents
      tens: 1000,      // $10 in cents
      fives: 500,      // $5 in cents
      ones: 100,       // $1 in cents
      quarters: 25,    // 25¢
      dimes: 10,       // 10¢
      nickels: 5,      // 5¢
      pennies: 1       // 1¢
    };
    
    // Calculate and update the number of each denomination
    const results = {};
    
    for (const [denom, value] of Object.entries(denominations)) {
      results[denom] = Math.floor(remainingChangeInCents / value);
      remainingChangeInCents %= value;
    }
    
    // Update the display for each denomination
    twentiesDisplay.textContent = results.twenties;
    tensDisplay.textContent = results.tens;
    fivesDisplay.textContent = results.fives;
    onesDisplay.textContent = results.ones;
    quartersDisplay.textContent = results.quarters;
    dimesDisplay.textContent = results.dimes;
    nickelsDisplay.textContent = results.nickels;
    penniesDisplay.textContent = results.pennies;

    // Add the drawer-open class to animate the drawer
    document.querySelector('.output-section').classList.add('drawer-open');
  }

  // ============================
  // Function to reset calculator
  function resetCalculator() {
    // Reset input fields
    amountDueInput.value = '';
    amountReceivedInput.value = '';

    // Reset the total change display
    totalChangeDisplay.textContent = '$0.00';

    // Reset each denomination display
    twentiesDisplay.textContent = '0';
    tensDisplay.textContent = '0';
    fivesDisplay.textContent = '0';
    onesDisplay.textContent = '0';
    quartersDisplay.textContent = '0';
    dimesDisplay.textContent = '0';
    nickelsDisplay.textContent = '0';
    penniesDisplay.textContent = '0';

    // Close the drawer
    document.querySelector('.output-section').classList.remove('drawer-open');
  }
});
