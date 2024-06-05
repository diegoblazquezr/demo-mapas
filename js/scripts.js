// Map
const map = L.map('map').setView([40.4299, -3.6691], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const eqAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';


// Marker for my current position
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        // console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);
        const myPos = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        myPos.bindPopup("Aquí estás!");
    });
} else {
    console.warn("Tu navegador no soporta Geolocalización!! ");
}

// Variables
const selectMag = document.querySelector('#selectMag');
let featuresEQ = [];
let arrMarkers = [];

// Event Listeners
selectMag.addEventListener('change', ({ target }) => {
    filterEQ(target.value);
})

document.querySelector('#submitDates').addEventListener('click', function() {
    // Get the values of the date inputs
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    
    console.log(startDate, endDate);
});

// Functions
const getEQ = async () => {
    try {
        const responseEQ = await fetch(eqAPI);
        const dataEQ = await responseEQ.json();
        featuresEQ = dataEQ.features;

        return paintEQ(featuresEQ);
    } catch (error) {
        throw error;
    }
}

const paintEQ = (arr) => {
    // let markerEQ;
    // if (markerEQ !== undefined) {
    //     markerEQ.clearLayers();
    //     console.log('limpiado');
    // }

    arr.forEach(element => {
        const coord = element.geometry.coordinates;
        const prop = element.properties;

        // Marker info
        const markerEQ = L.marker([coord[1], coord[0]]).addTo(map);
        markerEQ.bindPopup(`Title: ${prop.title} <br> Date: ${new Date(prop.time)} <br> Place: ${prop.place} <br> Code: ${prop.code} <br> Magnitude ${prop.mag} ${prop.magType}`);
        arrMarkers.push(markerEQ); // Push markers into a global array

        // Color change
        if (prop.mag >= 7) {
            markerEQ._icon.classList.add("seven");
        } else if (prop.mag >= 6) {
            markerEQ._icon.classList.add("six");
        } else if (prop.mag >= 5) {
            markerEQ._icon.classList.add("five");
        } else if (prop.mag >= 4) {
            markerEQ._icon.classList.add("four");
        } else if (prop.mag >= 3) {
            markerEQ._icon.classList.add("three");
        } else if (prop.mag >= 2) {
            markerEQ._icon.classList.add("two");
        } else if (prop.mag >= 1) {
            markerEQ._icon.classList.add("one");
        } else if (prop.mag >= 0) {
            markerEQ._icon.classList.add("zero");
        }

    });

}

const filterEQ = (target) => {
    // Clean all painted markers
    arrMarkers.forEach(marker => map.removeLayer(marker));
    arrMarkers = []; // Reset array

    if (target === 'all') {
        paintEQ(featuresEQ);
        console.log(featuresEQ);
    } else {
        const filteredFeaturesEQ = featuresEQ.filter((element) => element.properties.mag >= parseFloat(target) && element.properties.mag < (parseFloat(target) + 1));
        console.log(filteredFeaturesEQ);
        paintEQ(filteredFeaturesEQ);
    }
}

getEQ();