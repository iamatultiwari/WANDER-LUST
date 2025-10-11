
    // mapboxgl.accessToken = mapToken;
    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     center: [75.85773,  22.71957], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //     zoom: 9 // starting zoom
    // });

    //  console.log(coordinates);

    //     const marker1 = new mapboxgl.Marker()
    //     .setLngLat([ 75.82732, 22.668406 ])//listing.geometry.coordinates
    //     .addTo(map);




    // Use the variables defined in EJS from chatgpt


mapboxgl.accessToken = mapToken;

if (!mapboxgl.accessToken) {
  console.error("❌ Mapbox token missing!");
}

if (Array.isArray(coordinates) && coordinates.length === 2) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 9
  });

  console.log(coordinates)

new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)//listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h4>${placeName}</h4><p>Exact location provided after booking</p>`)
  )
  .addTo(map);


} 

else {
  console.error(" Invalid coordinates:", coordinates);
}
