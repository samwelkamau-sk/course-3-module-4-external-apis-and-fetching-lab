// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');
j
fetchBtn.addEventListener('click', () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();

  // Step 3: Clear UI and previous errors
  resetUI();

  // Step 5: Input Validation
  if (stateAbbr.length !== 2 || !/^[A-Z]+$/.test(stateAbbr)) {
    showError("Please enter a valid 2-letter state abbreviation.");
    return;
  }

  fetchWeatherAlerts(stateAbbr);
  
  // Step 3: Clear input field
  stateInput.value = '';
});

// Step 1: Fetch Weather Alerts
function fetchWeatherAlerts(state) {
  // Step 5: Loading Indicator
  alertsDisplay.innerHTML = '<p>Loading...</p>';

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch alerts. Please check the state code.');
      }
      return response.json();
    })
    .then(data => {
      // Log the data for testing
      console.log(data);
      displayAlerts(data, state);
    })
    .catch(errorObject => {
      // Step 1 & 4: Handle network and API errors
      console.log(errorObject.message);
      showError(errorObject.message);
    });
}

// Step 2: Display the Alerts on the Page
function displayAlerts(data, state) {
  alertsDisplay.innerHTML = '';

  // Summary message using title property and number of features
  const summary = document.createElement('h2');
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  if (data.features.length === 0) {
    const noAlerts = document.createElement('p');
    noAlerts.textContent = "No active watches, warnings, or advisories.";
    alertsDisplay.appendChild(noAlerts);
    return;
  }

  // List of alert headlines
  const list = document.createElement('ul');
  data.features.forEach(alert => {
    const listItem = document.createElement('li');
    // Accessing properties.headline
    listItem.textContent = alert.properties.headline;
    list.appendChild(listItem);
  });

  alertsDisplay.appendChild(list);
}

// Step 3 & 4: Reset UI helper
function resetUI() {
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

// Step 4: Show error message
function showError(message) {
  alertsDisplay.innerHTML = ''; // Clear loading text
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}