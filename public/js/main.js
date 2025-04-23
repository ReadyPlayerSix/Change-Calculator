// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Get references to DOM elements
  const displayAmount = document.querySelector('.display-amount');
  const numberButtons = document.querySelectorAll('.num-btn');
  const resetButton = document.querySelector('.reset-btn');
  const calculateButton = document.getElementById('calculate-change');
  const checkAmountInput = document.getElementById('check-amount');
  const currentDateElement = document.querySelector('.current-date');

  // Set the current date
  const today = new Date();
  currentDateElement.textContent = today.toLocaleDateString();

  // Get references to all denomination elements
  const twentiesDisplay = document.getElementById('twenties');
  const tensDisplay = document.getElementById('tens');
  const fivesDisplay = document.getElementById('fives');
  const onesDisplay = document.getElementById('ones');
  const quartersDisplay = document.getElementById('quarters');
  const dimesDisplay = document.getElementById('dimes');
  const nickelsDisplay = document.getElementById('nickels');
  const penniesDisplay = document.getElementById('pennies');
  
  // Get references to all denomination slots
  const twentiesSlot = document.getElementById('twenties-slot');
  const tensSlot = document.getElementById('tens-slot');
  const fivesSlot = document.getElementById('fives-slot');
  const onesSlot = document.getElementById('ones-slot');
  const quartersSlot = document.getElementById('quarters-slot');
  const dimesSlot = document.getElementById('dimes-slot');
  const nickelsSlot = document.getElementById('nickels-slot');
  const penniesSlot = document.getElementById('pennies-slot');

  // Variables to track state
  let currentMode = 'amountDue'; // Can be 'amountDue' or 'amountReceived'
  let amountDue = '';
  let amountReceived = '';

  // Update the display based on current mode
  function updateDisplay() {
    if (currentMode === 'amountDue') {
      displayAmount.textContent = '$' + (amountDue || '0.00');
    } else {
      displayAmount.textContent = '$' + (amountReceived || '0.00');
    }
  }

  // Add event listeners to number buttons
  numberButtons.forEach(button => {
    button.addEventListener('click', function () {
      const value = this.textContent;

      // Handle the current mode
      if (currentMode === 'amountDue') {
        // If decimal point is pressed and already exists, do nothing
        if (value === '.' && amountDue.includes('.')) return;

        // Add the digit to the amount due
        amountDue += value;

        // Format for display
        if (value === '.' && amountDue === '.') amountDue = '0.';
      } else {
        // If decimal point is pressed and already exists, do nothing
        if (value === '.' && amountReceived.includes('.')) return;

        // Add the digit to the amount received
        amountReceived += value;

        // Format for display
        if (value === '.' && amountReceived === '.') amountReceived = '0.';
      }

      updateDisplay();
    });
  });

  // Handle the check amount input
  console.log("Check amount input element:", checkAmountInput);
  
  checkAmountInput.addEventListener('click', function() {
    console.log("Check input clicked");
    this.focus();
  });
  
  checkAmountInput.addEventListener('input', function () {
    console.log("Input detected:", this.value);
    // Remove any non-digit or non-decimal characters
    this.value = this.value.replace(/[^\d.]/g, '');

    // Ensure only one decimal point
    const decimalPoints = this.value.match(/\./g) || [];
    if (decimalPoints.length > 1) {
      this.value = this.value.substring(0, this.value.lastIndexOf('.'));
    }

    // Update the amount received
    amountReceived = this.value;
  });

  // Add event listener to the calculate button
  calculateButton.addEventListener('click', function () {
    // Use the value from the check input
    amountReceived = checkAmountInput.value;

    // Calculate change
    calculateChange();
  });

  // Add event listener to the reset button
  resetButton.addEventListener('click', resetCalculator);

  // Function to create visual money elements
  function createMoneyElements(count, type) {
    const container = document.createElement('div');
    container.className = `money-container ${type}-container`;
    
    // Limit the display to a reasonable number
    const displayCount = Math.min(count, 10);
    
    for (let i = 0; i < displayCount; i++) {
      const money = document.createElement('div');
      money.className = `money ${type}`;
      
      // Add slight random rotation for natural look
      const rotation = Math.random() * 10 - 5; // -5 to 5 degrees
      money.style.transform = `rotate(${rotation}deg)`;
      
      // Add text label based on type
      if (type === 'bill-20') money.textContent = '$20';
      if (type === 'bill-10') money.textContent = '$10';
      if (type === 'bill-5') money.textContent = '$5';
      if (type === 'bill-1') money.textContent = '$1';
      
      container.appendChild(money);
    }
    
    // If there are more than we're displaying, add an indicator
    if (count > displayCount) {
      const more = document.createElement('div');
      more.className = 'more-indicator';
      more.textContent = `+${count - displayCount} more`;
      container.appendChild(more);
    }
    
    return container;
  }

  // ============================
  // Function to calculate change
  function calculateChange() {
    // Convert string inputs to numbers
    const due = parseFloat(amountDue) || 0;
    const received = parseFloat(amountReceived) || 0;

    // Check if we can make change (received amount is sufficient)
    if (received < due) {
      alert('The amount received is less than the amount due. Please enter valid amounts.');
      return;
    }

    // Calculate total change
    let totalChange = received - due;

    // Display total change with 2 decimal places
    displayAmount.textContent = '$' + totalChange.toFixed(2);

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
    
    // Clear previous money elements
    twentiesSlot.innerHTML = '';
    tensSlot.innerHTML = '';
    fivesSlot.innerHTML = '';
    onesSlot.innerHTML = '';
    quartersSlot.innerHTML = '';
    dimesSlot.innerHTML = '';
    nickelsSlot.innerHTML = '';
    penniesSlot.innerHTML = '';
    
    // Add visual representation to each slot
    if (results.twenties > 0) {
      twentiesSlot.appendChild(createMoneyElements(results.twenties, 'bill-20'));
    }
    
    if (results.tens > 0) {
      tensSlot.appendChild(createMoneyElements(results.tens, 'bill-10'));
    }
    
    if (results.fives > 0) {
      fivesSlot.appendChild(createMoneyElements(results.fives, 'bill-5'));
    }
    
    if (results.ones > 0) {
      onesSlot.appendChild(createMoneyElements(results.ones, 'bill-1'));
    }
    
    // Add simple text indicators for coins
    if (results.quarters > 0) quartersSlot.textContent = '×' + results.quarters;
    if (results.dimes > 0) dimesSlot.textContent = '×' + results.dimes;
    if (results.nickels > 0) nickelsSlot.textContent = '×' + results.nickels;
    if (results.pennies > 0) penniesSlot.textContent = '×' + results.pennies;

    // Animate the cash drawer or receipt as needed
    document.querySelector('.cash-drawer').classList.add('drawer-open');
  }

  // ============================
  // Function to reset calculator
  function resetCalculator() {
    // Reset input variables
    amountDue = '';
    amountReceived = '';
    currentMode = 'amountDue';

    // Reset the display
    updateDisplay();

    // Reset each denomination display
    twentiesDisplay.textContent = '0';
    tensDisplay.textContent = '0';
    fivesDisplay.textContent = '0';
    onesDisplay.textContent = '0';
    quartersDisplay.textContent = '0';
    dimesDisplay.textContent = '0';
    nickelsDisplay.textContent = '0';
    penniesDisplay.textContent = '0';

    // Clear cash drawer slots
    twentiesSlot.innerHTML = '';
    tensSlot.innerHTML = '';
    fivesSlot.innerHTML = '';
    onesSlot.innerHTML = '';
    quartersSlot.innerHTML = '';
    dimesSlot.innerHTML = '';
    nickelsSlot.innerHTML = '';
    penniesSlot.innerHTML = '';

    // Also clear the check input
    checkAmountInput.value = '';

    // Close the drawer
    document.querySelector('.cash-drawer').classList.remove('drawer-open');
  }

  // Initialize the display
  updateDisplay();
  
  // Try to focus the check input initially
  setTimeout(() => {
    if (checkAmountInput) {
      checkAmountInput.focus();
      console.log("Attempted to focus check input");
    }
  }, 1000);
});