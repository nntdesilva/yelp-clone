mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: camp.geometry.coordinates,
	zoom: 10
});

const marker1 = new mapboxgl.Marker()
	.setLngLat(camp.geometry.coordinates)
	.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${camp.title}</h5><p>${camp.location}</p>`))
	.addTo(map);
