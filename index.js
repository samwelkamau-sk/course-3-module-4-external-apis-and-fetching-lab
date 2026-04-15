const weatherApi = "https://api.weather.gov/alerts/active?area="

const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

fetchBtn.addEventListener('click', () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();

  // Step 3 & 4: Clear UI and Hide Error using the 'hidden' class
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');

  // Step 5: Input Validation
  if (stateAbbr.length !== 2 || !/^[A-Z]+$/.test(stateAbbr)) {
    showError("Please enter a valid 2-letter state abbreviation.");
    stateInput.value = '';
    return;
  }

  fetchWeatherAlerts(stateAbbr);
  
  // Step 3: Clear the input field
  stateInput.value = '';
});

function fetchWeatherAlerts(state) {
  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch alerts. Please check the state code.');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayAlerts(data);
    })
    .catch(errorObject => {
      console.log(errorObject.message);
      showError(errorObject.message);
    });
}

function displayAlerts(data) {
  alertsDisplay.innerHTML = '';

  // Step 2: Show summary
  const summary = document.createElement('h2');
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  if (data.features.length === 0) {
    const noAlerts = document.createElement('p');
    noAlerts.textContent = "No active alerts for this area.";
    alertsDisplay.appendChild(noAlerts);
    return;
  }

  // Step 2: Show list
  const list = document.createElement('ul');
  data.features.forEach(alert => {
    const listItem = document.createElement('li');
    listItem.textContent = alert.properties.headline;
    list.appendChild(listItem);
  });

  alertsDisplay.appendChild(list);
}

// Step 4: Show error message by removing the 'hidden' class
function showError(message) {
  alertsDisplay.innerHTML = ''; 
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}