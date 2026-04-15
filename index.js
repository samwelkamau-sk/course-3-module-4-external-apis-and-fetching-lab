const weatherApi = "https://api.weather.gov/alerts/active?area="

const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

fetchBtn.addEventListener('click', () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();

  // Step 3: Clear UI and Error Message before new request
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';

  // Step 5: Simple Validation
  if (stateAbbr.length !== 2) {
    showError("Please enter a valid 2-letter state code.");
    stateInput.value = '';
    return;
  }

  fetchWeatherAlerts(stateAbbr);

  // Step 3: Clear the input field
  stateInput.value = '';
});

// Step 1: Fetch Weather Alerts
function fetchWeatherAlerts(state) {
  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Log data to console for testing
      console.log(data);
      displayAlerts(data);
    })
    .catch(errorObject => {
      // Step 4: Handle errors using the message key
      console.log(errorObject.message);
      showError(errorObject.message);
    });
}

// Step 2: Display the Alerts on the Page
function displayAlerts(data) {
  // Clear any loading text or old data
  alertsDisplay.innerHTML = '';

  // Summary message: "Title: Number of Alerts"
  const summary = document.createElement('h2');
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  // Create list of headlines
  const ul = document.createElement('ul');
  data.features.forEach(feature => {
    const li = document.createElement('li');
    // Accessing properties.headline
    li.textContent = feature.properties.headline;
    ul.appendChild(li);
  });

  alertsDisplay.appendChild(ul);
}

// Step 4: Implement Error Handling UI
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  // If your CSS uses the .hidden class, use this instead:
  // errorMessage.classList.remove('hidden');
}