const fetch = require('node-fetch');

module.exports = (io) => {
  io.on("connection", async (socket) => {
    let initCoords = await getCoords();
    
    console.log("New client connected");

    socket.emit("message", "Hola mundo");
    
    socket.emit("initCoords", initCoords);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    /*
      PARA EMITIR COORDENADAS DE LOS USUARIOS, FALTA PODER RECIBIRLOS, AL RECIBIRLOS ESTOS SE EMITEN
    */

    // socket.on('userCoordinates', (coords) => {
    //   console.log(coords);
    //   socket.broadcast.emit('newUserCoordinates', coords);
    // });
  });
};

const getCoords = async () => {
  const url = "http://34.66.55.146:5000/bus/getDataAllLastCoordsUnitsByUser";
  console.log(url);
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fk_id_cliente: "bd349ca2-7d46-11eb-8c69-42010a800003",
    })
  })
    .then(res => res.json())
    .then(data => data.datos);

  return JSON.stringify(response);
}