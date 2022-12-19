const server_ip = '5.181.217.24';
const mapStyle = {
  version: 8,
  name: 'Land',
  sources: {
    map: {
      type: 'raster',
      tiles: ['https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'],
      // tiles: ['http://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'],
      tileSize: 256,
      minzoom: 1,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#ffffff',
      },
    },
    {
      id: 'map',
      type: 'raster',
      source: 'map',
      paint: {
        'raster-fade-duration': 100,
      },
    },
  ],
};
const helper = {
	mapStyle,
  rp:'₹',
  site_url:'http://t.buskhabri.com/',
  server_url:`http://${server_ip}:8080/`,
  static_url:`http://${server_ip}:9191/`,
  socket_url:`ws://${server_ip}:8080/ws/?city_id=`,
  tracking_url:'http://t.buskhabri.com/',
	accessToken:'pk.eyJ1IjoiZGVlcGFrNDU2IiwiYSI6ImNqcmFudjExeDAyeGs0Nm1yYWMyendmdnoifQ.DOdaXwOfEgNEs2T6lzKQwg',
  EVENT_AGENT_LOCATION_UPDATE :"agent_location_update",
}
export default helper;