//epeixoto@ipca.pt
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const dotenv = require("dotenv");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  findUser,
  isSubscribed,
  getSubscriptions,
  subscribeRoom,
  UnsubscribeRoom,
} = require("./utils/users");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
dotenv.config({ encoding: "latin1" });

const botName = "RedoChat Bot";

//#region Adaptação BD serviços

/**
 * Database Connection
 * Connection string
 * Arrow function que retorna uma Promise, para informar se a conexão com a base de dados foi bem feita ou não.
 * */

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Conexão com a base de dados realizada com sucesso...");
  })
  .catch((err) => {
    console.log(err);
  });

//#endregion

//#region Gestao de socket

// Run when client connects
io.on("connection", (socket) => {
  console.log("Servidor conectado com sucesso!");
  socket.on("joinRoom", ({ userIn, roomIn }) => {
    //const index = users_data.findIndex((user) => user.name == userIn.username);
    console.log("user ->", userIn);
    //console.log("room ->", roomIn.RoomName);
    if (isSubscribed(getSubscriptions(userIn.username), roomIn.RoomName)) {
      if (!findUser(userIn.username)) {
        //Verify if user already in the room
        const user = userJoin(socket.id, userIn.username, roomIn.RoomName);
        const roomUsers = getRoomUsers(roomIn.RoomName);

        socket.join(user.room);
        // Welcome current user
        socket.emit(
          "message",
          formatMessage(
            botName,
            "Bem-vindo ao RedoChat " +
              userIn.username +
              " ,entrou na sala " +
              roomIn.RoomName
          )
        );

        // Broadcast when a user connects
        socket.broadcast
          .to(user.id)
          .emit(
            "message",
            formatMessage(botName, `${user.username} entrou sala`)
          );

        console.log("Socket ->", roomUsers);
        socket.emit(
          "message",
          formatMessage(
            botName,
            ("Utilizadores na sala:",
            {
              room: user.room,
              users: roomUsers,
            })
          )
        );
      } else {
        socket.emit(
          "message",
          formatMessage(botName, "Utilizador já está presente na sala!!")
        );
      }
    } else
      socket.emit(
        "message",
        formatMessage(botName, "Utilizador não está inscrito na sala!!")
      );
  });

  // Subscribe Room
  socket.on("subscribe", ({ subscription }) => {
    if (subscribeRoom(subscription.username, subscription.room)) {
      socket.emit(
        "message",
        formatMessage(
          botName,
          "Utilizador registado com sucesso na sala " + subscription.room + "!!"
        )
      );
    } else {
      socket.emit(
        "message",
        formatMessage(botName, "Utilizador já está registado nesta sala!!")
      );
    }
  });

  // Unsubscribe Room
  socket.on("Unsubscribe", ({ subscription }) => {
    if (UnsubscribeRoom(subscription.username, subscription.room)) {
      socket.emit(
        "message",
        formatMessage(
          botName,
          "Registo eliminado com sucesso da sala " + subscription.room + "!!"
        )
      );
    } else {
      socket.emit(
        "message",
        formatMessage(botName, "Utilizador não está registado nesta sala!!")
      );
    }
  });

  // Listen for chatMessage
  socket.on("chatMessage", ({ msg }) => {
    if (findUser(msg.username)) {
      io.to(msg.username.room).emit(
        "message",
        formatMessage(msg.username, msg)
      );
    } else {
      socket.emit(
        "message",
        formatMessage(
          botName,
          "Utilizador não está nesta sala, não pode enviar mensagem!!"
        )
      );
    }
  });

  // Listen for show user subscriptions
  socket.on("showSubscriptions", ({ user }) => {
    const subscriptions = getSubscriptions(user.username);
    socket.emit("message", formatMessage(user.username, { subscriptions }));
  });
});

//#endregion

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Servidor a correr na porta: ${PORT}`));
