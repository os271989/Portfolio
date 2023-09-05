const fs = require("fs");
const path = require("path");
users_data = require("../utils/Users_data.json");

const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  console.log("Array->", users);
  console.log(user);
  return user;
}

//Get Subscriptions
function getSubscriptions(username) {
  const index = users_data.findIndex((user) => user.name == username);
  if (index != undefined) {
    console.log("Subscriptions -> ", users_data[index].subscribed);
    return users_data[index].subscribed;
  }
  return null;
}

//Verify subscription
function isSubscribed(rooms, room) {
  if (rooms.includes(room)) {
    return true;
  }
  return false;
}

//Subscribe an user to a room
function subscribeRoom(usernameSub, roomSub) {
  const subscriptions = getSubscriptions(usernameSub);
  if (isSubscribed(subscriptions, roomSub)) {
    return false;
  }
  const indexSub = users_data.findIndex((x) => x["name"] === usernameSub);
  users_data[indexSub].subscribed.push(roomSub);
  fs.writeFileSync(
    path.resolve(__dirname, "Users_data.json"),
    JSON.stringify(users_data)
  );
  return true;
}

//Unsubscribe an user to a room
function UnsubscribeRoom(usernameSub, roomSub) {
  const subscriptions = getSubscriptions(usernameSub);
  if (!isSubscribed(subscriptions, roomSub)) {
    return false;
  }
  const indexSub = users_data.findIndex((x) => x["name"] === usernameSub);
  const indexAux = users_data[indexSub].subscribed.findIndex(
    (x) => x == roomSub
  );
  users_data[indexSub].subscribed.splice(indexAux, 1);
  fs.writeFileSync(
    path.resolve(__dirname, "Users_data.json"),
    JSON.stringify(users_data)
  );
  return true;
}

// Find an user in the room
function findUser(username) {
  const found = users.find((x) => x.username == username);
  console.log("Presente->", found);
  if (found === undefined) {
    return false;
  }
  return true;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(socket) {
  console.log(socket.id);
  const index_aux = users.findIndex((user) => user.id === socket);

  if (index !== -1) {
    return users.splice(index_aux, 1)[0];
  }
}

function userLeave2(username) {
  console.log(socket.id);
  const index_aux = users.findIndex((user) => user.username == username);
  console.log(index_aux);

  if (index !== -1) {
    return users.splice(index_aux, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  console.log("sala->", room);
  return users.filter((user) => user.room == room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  findUser,
  isSubscribed,
  getSubscriptions,
  subscribeRoom,
  UnsubscribeRoom,
};
