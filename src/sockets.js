module.exports = io => {
    io.on('connection', client => {
  
      console.log('new client connected');
  
      client.on('userCoordinates', (coords) => {
        console.log(coords);
        client.broadcast.emit('newUserCoordinates', coords);
      });
    });
  };