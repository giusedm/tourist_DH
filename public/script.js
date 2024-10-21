let map, userMarker, destinationMarker, routeLayer, deviationLayers = [], poiMarkers = [];
let formVisible = false;

function initMap() {
    map = L.map('map', {
        center: [37.5079, 15.0830],
        zoom: 12,
        zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    geolocateUser();
}

function toggleForm() {
    const formContainer = document.getElementById('formContainer');
    const menuIcon = document.getElementById('menuIcon');
    
    if (formVisible) {
        formContainer.classList.add('form-hidden');
        menuIcon.classList.remove('hidden');
    } else {
        formContainer.classList.remove('form-hidden');
        menuIcon.classList.add('hidden');
    }

    formVisible = !formVisible;
}

async function geolocateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const userCoords = [userLat, userLon];

                document.getElementById('startInput').value = `${userLat}, ${userLon}`;

                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                userMarker = L.marker(userCoords, { icon: L.icon({
                    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
                }) }).addTo(map).bindPopup('Posizione corrente');

                map.setView(userCoords, 13);
            },
            error => {
                console.error('Errore nella geolocalizzazione:', error);
                alert('Geolocalizzazione non consentita. Inserisci manualmente la posizione di partenza.');

                document.getElementById('startInput').placeholder = 'Inserisci manualmente il punto di partenza';
            }
        );
    } else {
        alert('La geolocalizzazione non è supportata dal tuo browser.');
        document.getElementById('startInput').placeholder = 'Inserisci manualmente il punto di partenza';
    }
}

async function calculateRoute() {
    const startInput = document.getElementById('startInput').value;
    const destinationInput = document.getElementById('destinationInput').value;
    const poiPreference = document.getElementById('poiPreferences').value;

    try {
        const startCoords = startInput.split(',').map(coord => parseFloat(coord.trim()));
        const destCoords = await geocodeAddress(destinationInput);

        const payload = {
            start: startCoords,
            destination: destCoords,
            poiPreference: poiPreference
        };

        const response = await fetch('/api/calculateRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        displayDeviations(data.deviations);
        displayMainRoute(data.mainRoute);
        displayMarkers(startCoords, destCoords);
        displayPOIs(data.pois);

        // Minimizza il form dopo aver calcolato il percorso
        toggleForm();

    } catch (error) {
        console.error('Errore nel calcolo del percorso:', error);
        alert('Errore nel calcolo del percorso.');
    }
}

async function geocodeAddress(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const results = await response.json();
    if (results.length === 0) {
        throw new Error('Indirizzo non trovato: ' + address);
    }
    return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
}

function displayMainRoute(routeGeoJSON) {
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }
    routeLayer = L.geoJSON(routeGeoJSON, { color: 'blue', weight: 5, opacity: 0.9 }).addTo(map);
    map.fitBounds(routeLayer.getBounds());
}

function displayDeviations(deviationGeoJSONs) {
    if (deviationLayers.length > 0) {
        deviationLayers.forEach(layer => map.removeLayer(layer));
        deviationLayers = [];
    }

    deviationGeoJSONs.forEach(geoJSON => {
        const layer = L.geoJSON(geoJSON, { color: 'orange', weight: 3, opacity: 0.7 }).addTo(map);
        deviationLayers.push(layer);
    });
}


function displayMarkers(startCoords, destCoords) {
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
    }

    userMarker = L.marker(startCoords, { icon: L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
    }) }).addTo(map).bindPopup('Punto di Partenza');

    destinationMarker = L.marker(destCoords, { icon: L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
    }) }).addTo(map).bindPopup('Destinazione');
}

function displayPOIs(pois) {
    if (poiMarkers.length > 0) {
        poiMarkers.forEach(marker => map.removeLayer(marker));
        poiMarkers = [];
    }

    pois.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lon], { icon: L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
        }) }).addTo(map)
            .bindPopup(`<strong>${poi.name}</strong><br>Tipo: ${poi.type}`);
        poiMarkers.push(marker);
    });
}

window.onload = initMap;


