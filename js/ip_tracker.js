//Initialize LeafletJS map
const mymap = L.map("mapid", {
  zoomControl: false,
}).setView([0, 0], 1);

//TileLayer for the map by maptiler.com
L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ARNvuJofN1lmosfwG1r8",
  {
    minZoom: 2,
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright"target="_blank">&copy; OpenStreetMap contributors</a>',
  }
).addTo(mymap);

//Initialize marker.
const marker = L.marker([50.5, 30.5]).addTo(mymap);

//IP Geolocation API by IPify
const api_url = "https://geo.ipify.org/api/v1?";
const api_key = "apiKey=at_9vEb5lhWCsiMKFiyPMs7BrG1hbA2E";

//Get form from the dom.
const form = document.querySelector(".form");
//Listen for a submit event.
initialIp();

form.addEventListener("submit", getLocation);

async function getLocation(e) {
  //Stop default POST action from the form.
  e.preventDefault();
  //Get the value from the search input.
  const inputValue = document.getElementById("input-search").value;

  //Loading animation.
  loading();

  const search = await fetch(api_url + api_key + "&domain=" + inputValue)
    .then((res) => {
      if (res.status != 200) {
        document.querySelector(".result").innerHTML = `
        <div class="error-message">
          <p>Invalid ip please, try again.</p>
        </div>
      `;
      } else {
        return res.json();
      }
    })
    .then((data) => {
      setLocation(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Functions

//Loading gif ?).
function loading() {
  document.querySelector(".result").innerHTML = `<div class="load">
    <img src="images/loading.gif"/>
  </div>`;
}

//Set initial value to the user ip.
function initialIp() {
  fetch(api_url + api_key + "&domain")
    .then((res) => res.json())
    .then((data) => {
      setLocation(data);
    });
}

//Set location.
function setLocation(results) {
  const { ip, location, isp } = results;

  let output = "";
  output += `
           <div class="separator">
             <span>Ip addres</span>
             <h2>${ip}</h2>
           </div>
           <div class="separator">
            <span>Location</span>
            <h2>${location.country}<br>${location.region}<br>${location.city}</h2>
           </div>
           <div class="separator">
             <span>Timezone</span>
             <h2>UTC ${location.timezone}</h2>
           </div>
           <div class="separator">
             <span>ISP</span>
             <h2>${isp}</h2>
           </div>
          `;

  document.querySelector(".result").innerHTML = output;
  //Set location.
  mymap.flyTo([location.lat, location.lng], 15, { duration: 4 });
  //Update marker.
  marker.setLatLng([location.lat, location.lng]).bindPopup(ip);
}
