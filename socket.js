const Models = require("./models/index");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("connect_user", async function (data) {
      console.log("data", data);
      try {
        const socketId = socket.id;
        console.log("SOCKET ID:", socketId);
        if (!data.userId) {
          let error_message = { error_message: "Enter id first!" };
          socket.emit("connect_listener", error_message);
          return;
        }
        const user = await Models.userModel.findOne({
          where: { id: data.userId },
        });
        if (user) {
          await Models.userModel.update(
            { socketId: socketId, status: user.status },
            { where: { id: data.userId } },
          );
        }
        console.log("<<<<", user.status);
        let success_msg = {
          success_msg: "connected successfully",
        };
        console.log(success_msg);
        console.log("A user connected", socket.id);
        socket.emit("connect_listener", success_msg);
        console.log("connected.......");
      } catch (error) {
        console.log("error");
      }
    });
    socket.on("connect_data", async function (data) {
      try {
        const { receiverId, message } = data;
        console.log("data details", data);
        console.log("socketId", socket.id);
        const userSocket = await Models.userModel.findOne({
          where: { id: receiverId },
        });
        console.log("receiverId", receiverId);
        if (!userSocket || !userSocket.socketId) {
          let error_message = { error_message: "user not connected!" };
          socket.emit("user_listener", error_message);
          return;
        }
        io.to(userSocket.socketId).emit("socket_listener", {
          message,
          senderSocketId: socket.id,
        });
        console.log("Sending to socket:", userSocket.socketId);
        let success_msg = {
          success_msg: "message send successfully",
        };
        socket.emit("userData_listener", success_msg);
      } catch (error) {
        console.log("error", error);
      }
    });
    socket.on("status_update", async function (data) {
      try {
        console.log("<<USERID", data.userId);
        const user = await Models.userModel.findOne({
          where: { id: data.userId },
        });
        if (!user) {
          return socket.emit("status_listener", {
            error_message: "userId not found",
          });
        }
        console.log("socket",user.socketId)
        const newStatus = user.status == 1 ? 0 : 1;
        await Models.userModel.update(
          { status: newStatus },
          { where: { id: data.userId } },
        );
        const update = await Models.userModel.findOne({
          where: { id: data.userId },
        });
        if (!update) {
          return socket.emit("status_listener", {
            error_message: "error ",
          });
        }
        io.to(user.socketId).emit("status_listener", {
          success_msg: "status updated",
          status: newStatus,
        });
      } catch (error) {
        socket.emit("status_listener", {
          error_message: "error",
        });
      }
    });
  });
};
