rooms_data = require("../public/Salas.json");
const roomIn = { RoomName, Capacity, id, hosts };

// Join user to chat
function userJoinRoom(username, room) {
  roomIn.id = rooms_data.findIndex((item) => item.RoomName == room);
  rooms_data[roomIn].hosts.push(username);
  return roomIn;
}

function showHosts(room) {
  roomIn.id = rooms_data.findIndex((item) => item.RoomName === room);
  return rooms_data[roomIn].hosts;
}

module.exports = {
  userJoinRoom,
  showHosts,
};
