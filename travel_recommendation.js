const resultsEl = document.getElementById('results');
const inputEl = document.getElementById('searchInput');

// Task 10 (optional): time zone for each place
const timeZones = {
  'Sydney, Australia': 'Australia/Sydney',
  'Melbourne, Australia': 'Australia/Melbourne',
  'Tokyo, Japan': 'Asia/Tokyo',
  'Kyoto, Japan': 'Asia/Tokyo',
  'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
  'São Paulo, Brazil': 'America/Sao_Paulo',
  'Angkor Wat, Cambodia': 'Asia/Phnom_Penh',
  'Taj Mahal, India': 'Asia/Kolkata',
  'Bora Bora, French Polynesia': 'Pacific/Tahiti',
  'Copacabana Beach, Brazil': 'America/Sao_Paulo'
};

function localTime(name) {
  const tz = timeZones[name];
  if (!tz) return '';
  const options = { timeZone: tz, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}

// Task 6: fetch the data
async function getData() {
  const response = await fetch('travel_recommendation_api.json');
  if (!response.ok) throw new Error('Could not load recommendations');
  const data = await response.json();
  console.log(data);
  return data;
}

function showResults(items) {
  resultsEl.innerHTML = '';
  if (items.length === 0) {
    resultsEl.innerHTML = '<p class="msg">No matches. Try "beach", "temple", "country", or a country name like Japan.</p>';
    return;
  }
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    const time = localTime(item.name);
    card.innerHTML =
      '<img src="' + item.imageUrl + '" alt="' + item.name + '" onerror="this.removeAttribute(\'src\')">' +
      '<div class="body"><h3>' + item.name + '</h3><p>' + item.description + '</p>' +
      (time ? '<div class="time" data-place="' + item.name + '">Local time: ' + time + '</div>' : '') +
      '</div>';
    resultsEl.appendChild(card);
  });
}

// Tasks 7 and 8: keyword search
async function search() {
  const keyword = inputEl.value.trim().toLowerCase();
  if (!keyword) return;
  try {
    const data = await getData();
    let matches = [];
    if (keyword.startsWith('beach')) {
      matches = data.beaches;
    } else if (keyword.startsWith('temple')) {
      matches = data.temples;
    } else if (keyword === 'country' || keyword === 'countries') {
      data.countries.forEach(c => matches.push(...c.cities));
    } else {
      // allow searching by a specific country name, e.g. "japan"
      const country = data.countries.find(c => c.name.toLowerCase() === keyword);
      if (country) matches = country.cities;
    }
    showResults(matches);
  } catch (err) {
    console.error(err);
    resultsEl.innerHTML = '<p class="msg">Something went wrong loading recommendations. Serve the folder with a local web server (not file://) and try again.</p>';
  }
}

// Task 9: clear button
function clearResults() {
  resultsEl.innerHTML = '';
  inputEl.value = '';
}

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('resetBtn').addEventListener('click', clearResults);
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });

// keep clocks ticking
setInterval(() => {
  document.querySelectorAll('.time').forEach(el => {
    el.textContent = 'Local time: ' + localTime(el.dataset.place);
  });
}, 1000);