const fetch = require('node-fetch');
const id_cliente_test = "bd349ca2-7d46-11eb-8c69-42010a800003";
let webClients = [];
let javaClient = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("client-type", (args) => {
      console.log(args);
      if (args === "js-client") {
        socket.join("web client");
        // webClients.push(socket.id);
      }

      if (args === "java-client") {
        socket.join("java client");
        // javaClient.push(socket.id);
      }
    });

    socket.on("clientCoordinates", async (args) => {
      let responseSetCoords = await setCoords(args[0], args[1]);
      
      if (responseSetCoords[0] === "001") {
        let lastCoords = await getCoords(id_cliente_test);
        io.sockets.in("web client").emit("getAllCoordinates", lastCoords);
        console.log(responseSetCoords[1]);
      } else {
        console.log(responseSetCoords[1]);
      }
    });

    // ON EVENTS
    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });
  });

  io.on("connection", async (socket) => {
    const initCoords = await getCoords(id_cliente_test);

    // EMIT EVENTS
    socket.emit("initCoordinates", initCoords);
  });
};

const getCoords = async (id_cliente) => {
  const url = `${process.env.URL_COORDS}bus/getDataAllLastCoordsUnitsByUser`;
  
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fk_id_cliente: id_cliente,
    })
  })
    .then(res => res.json())
    .then(data => data.datos);

  return JSON.stringify(response);
}

const setCoords = async (id_unidad, coords) => {
  const url = `${process.env.URL_COORDS}bus/updateUnitCoordinates`;
  
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fk_id_unidad: id_unidad,
      coordenadas: coords,
    })
  })
    .then(res => res.json())
    .then(data => [data.codigo, data.respuesta])
    .catch(err => console.log(err));

  return response;
}