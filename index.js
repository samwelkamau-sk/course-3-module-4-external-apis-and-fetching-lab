const weatherApi = "https://api.weather.gov/alerts/active?area="

const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

fetchBtn.addEventListener('click', () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();

  // Step 3: Clear and Reset the UI
  // Clear alerts, clear error text, and hide error div immediately
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');

  // Step 3: Clear the input field immediately after clicking
  stateInput.value = '';

  // Only proceed if there is an input (Simple validation)
  if (!stateAbbr) {
    showError("Please enter a state abbreviation.");
    return;
  }

  fetchWeatherAlerts(stateAbbr);
});

// Step 1: Fetch Weather Alerts
function fetchWeatherAlerts(state) {
  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        // This triggers the .catch block
        throw new Error('Could not fetch data for that state code.');
      }
      return response.json();
    })
    .then(data => {
      // Log for testing as requested
      console.log(data);
      displayAlerts(data);
    })
    .catch(errorObject => {
      // Step 4: Display error message and log it
      console.log(errorObject.message);
      showError(errorObject.message);
    });
}

// Step 2: Display the Alerts on the Page
function displayAlerts(data) {
  // Clear previous data
  alertsDisplay.innerHTML = '';

  // 1. Create Summary Message
  // Using title property and length of features array
  const summary = document.createElement('h2');
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  // 2. Create list of alert headlines
  const ul = document.createElement('ul');
  data.features.forEach(feature => {
    const li = document.createElement('li');
    // Each headline is under properties.headline
    li.textContent = feature.properties.headline;
    ul.appendChild(li);
  });

  alertsDisplay.appendChild(ul);
  
  // Ensure error is hidden on success
  errorMessage.classList.add('hidden');
}

// Step 4: Implement Error Handling UI
function showError(message) {
  // Clear alerts display when an error occurs
  alertsDisplay.innerHTML = '';
  
  // Update the dedicated error div
  errorMessage.textContent = message;
  
  // Step 4 Requirement: Ensure the div is NOT hidden
  errorMessage.classList.remove('hidden');
}