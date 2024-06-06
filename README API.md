ช่วยเขียนโค้ดในส่วนของ Swagger Docs ให้หน่อยโดยดูจากโค้ดที่ฉันส่งไป และอธิบายเป็นภาษาไทย 

// create config file for auth
module.exports = {
    secret : "worapakorn-secret-key",
    
    // jwtExpiration:3600, // 1 hour
    // jwtRefreshExpiration:86400, //24 hours
    
    /* For test*/
    jwtExpiration:60, // 1 minute
    jwtRefreshExpiration:120, //2 minute
   
}

// create config file for auth
module.exports = {

    DOMAIN: "http://localhost:8080",
   
}


'use server';

require("dotenv").config();
const mysql2 = require('mysql2'); // นำเข้า mysql2

module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: null,
  DB: "dicedreams",
  // dialect: "mysql",
  dialect: "mysql",
  // dialectModule: require('mysql2'),
  dialectModule: mysql2, // ใช้ตัวแปร mysql2 ที่ import มา
  pool: {
    max: 5, // จำนวนสูงสุดของ connection ใน pool
    min: 0, // จำนวนต่ำสุดของ connection ใน pool
    acquire: 30000, // ระยะเวลาสูงสุดในการพยายามเชื่อมต่อก่อนจะขึ้นข้อผิดพลาด
    idle: 10000 // ระยะเวลาสูงสุดที่ connection สามารถว่างได้ก่อนจะถูกปิด
  },
};

// console.log('Using mysql2 version:', require('mysql2').version);



// create controller for postActivity
const db = require("../models");


const Chat = db.chat;
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.message) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }


    // Create a game
    const chat = {
      message: req.body.message,
      datetime_chat: req.body.datetime_chat,
      user_id: req.body.user_id, // ส่งรูปเกมไปเก็บในระบบ
      post_games_id: req.body.post_games_id,
    };

    // Save game in the database async
    const data = await Chat.create(chat);

    
     //select postgame by post_game_id
     const postGame = await db.post_games.findByPk(req.body.post_games_id);
         // insert table notification
         const notification = {
          type: "chat",
          read: false,
          time: new Date(),
          user_id: postGame.dataValues.users_id,
          entity_id: data.dataValues.chat_id,
        };
        await db.notification.create(notification);
    
        // ส่งข้อมูลกลับไปที่ client หลังจากทำการอัพเดท และสร้าง notification สำเร็จ socket.io จะทำการอัพเดทข้อมูลให้ทุกๆ client ที่เชื่อมต่อ แต่ละ client จะต้องเขียนโค้ดเพื่อรับข้อมูลที่ถูกส่งกลับมา
        const messages = [];
    
        // get table notification by user_id where read = false
        const notifications = await db.notification.findAll({
          where: { user_id: postGame.dataValues.users_id, read: false },
        });
        for (let i = 0; i < notifications.length; i++) {
          if (notifications[i].type === "participate") {
            //  ดึงข้อมูลจาก table participate โดยใช้ entity_id ที่ได้จาก table notification
            const participate = await db.participate.findByPk(
              notifications[i].entity_id
            );
            messages.push({
              type: "participate",
              data: participate,
              notification_id: notifications[i].notification_id,
              entity_id: notifications[i].entity_id,
              read: notifications[i].read,
              time: notifications[i].time,
            });
          } else if (notifications[i].type === "chat") {
            //  ดึงข้อมูลจาก table chat โดยใช้ entity_id ที่ได้จาก table notification
            const chat = await db.chat.findByPk(notifications[i].entity_id);
            messages.push({
              type: "chat",
              data: chat,
              notification_id: notifications[i].notification_id,
              entity_id: notifications[i].entity_id,
              read: notifications[i].read,
              time: notifications[i].time,
            });
          }
        }
    
        // get socketio from app.js and emit to client
    
        req.app
          .get("socketio")
          .emit("notifications_" + postGame.dataValues.users_id, messages);

    res
      .status(201)
      .json({ message: "Game was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all games from the database.
exports.findAll = (req, res) => {
  Chat.findAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving games.",
      });
    });
};

// Find a single game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Chat.findByPk(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving game with id=" + id,
      });
    });
};

// Update a game by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await Chat.update(req.body, {
      where: { chat_id: id },
    });
    if (data == 1) {

          // get in table chat by id
          const chat = await Chat.findByPk(id);

          // insert table notification
          const notification = {
            type: "chat",
            read: false,
            time: new Date(),
            user_id: chat.dataValues.user_id,
            entity_id: id,
          };
          await db.notification.create(notification);
    
          // ส่งข้อมูลกลับไปที่ client หลังจากทำการอัพเดท และสร้าง notification สำเร็จ socket.io จะทำการอัพเดทข้อมูลให้ทุกๆ client ที่เชื่อมต่อ แต่ละ client จะต้องเขียนโค้ดเพื่อรับข้อมูลที่ถูกส่งกลับมา
          const messages = [];
    
          // get table notification by user_id where read = false
          const notifications = await db.notification.findAll({
            where: { user_id: chat.dataValues.user_id, read: false },
          });
          for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].type === "participate") {
              //  ดึงข้อมูลจาก table participate โดยใช้ entity_id ที่ได้จาก table notification
              const participate = await db.participate.findByPk(
                notifications[i].entity_id
              );
              messages.push({
                type: "participate",
                data: participate,
                notification_id: notifications[i].notification_id,
                entity_id: notifications[i].entity_id,
                read: notifications[i].read,
                time: notifications[i].time,
              });
            } else if (notifications[i].type === "chat") {
              //  ดึงข้อมูลจาก table chat โดยใช้ entity_id ที่ได้จาก table notification
              const chat = await db.chat.findByPk(notifications[i].entity_id);
              messages.push({
                type: "chat",
                data: chat,
                notification_id: notifications[i].notification_id,
                entity_id: notifications[i].entity_id,
                read: notifications[i].read,
                time: notifications[i].time,
              });
            }
          }
    
          // get socketio from app.js and emit to client
    
          req.app
            .get("socketio")
            .emit("notifications_" + chat.dataValues.user_id, messages);

      res.status(200).json({
        message: "Game was updated successfully.",
      });
    } else {
      res.status(400).json({
        message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a game with the specified id in the request
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await Chat.destroy({
      where: { chat_id: id },
    });
    if (data == 1) {
      res.status(200).json({
        message: "Game was deleted successfully!",
      });
    } else {
      res.status(400).json({
        message: `Cannot delete game with id=${id}. Maybe game was not found!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete all games from the database.
exports.deleteAll = async (req, res, next) => {
  try {
    const data = await Chat.destroy({
      where: {},
      truncate: false,
    });
    res.status(200).json({ message: `${data} Games were deleted successfully!` });
  } catch (error) {
    next(error);
  }
};

// Find all published games
exports.findAllPublished = (req, res) => {
  Chat.findAll({ where: { published: true } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving games.",
      });
    });
};

// Find all games by user
exports.findAllByUser = (req, res) => {
  const user_id = req.params.user_id;
  Chat.findAll({ where: { user_id: user_id } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving games.",
      });
    });
};

// Find all games by post_games_id
exports.findAllByPostGamesId = (req, res) => {
  const post_games_id = req.params.post_games_id;
  Chat.findAll({ where: { post_games_id: post_games_id } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving games.",
      });
    });
};
 


const db = require("../models");
const Notification = db.notification;
const Participate = db.participate;
const User = db.user; // Ensure you have correct model name here
const Chat = db.chat; // Add this line to import the Chat model
const PostGame = db.post_games;

// Define the relationships
Participate.belongsTo(User, { foreignKey: "user_id" });
Participate.belongsTo(PostGame, { foreignKey: "post_games_id" });
PostGame.belongsTo(User, { foreignKey: "users_id" });

// get all notifications
exports.findAll = async (req, res, next) => {
  try {
    const messages = [];
    const notifications = await Notification.findAll({
      where: { user_id: req.user.users_id },
    });

    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].type === "participate") {
        const participate = await Participate.findByPk(
          notifications[i].entity_id,
          {
            include: [
              {
                model: User,
                attributes: ["first_name", "last_name", "user_image"],
              },
              {
                model: PostGame,
                include: [
                  {
                    model: User,
                    attributes: ["first_name", "last_name", "user_image"],
                  },
                ],
              },
            ],
          }
        );

        if (participate && participate.user && participate.post_game) {
          const postParticipants = await Participate.count({
            where: {
              post_games_id: participate.post_games_id,
              participant_status: "active",
            },
          });

          messages.push({
            type: "participate",
            data: {
              ...participate.toJSON(),
              first_name: participate.user.first_name,
              last_name: participate.user.last_name,
              user_image: participate.user.user_image,
              name_games: participate.post_game.name_games,
              detail_post: participate.post_game.detail_post,
              participants: postParticipants + 1, // เพิ่มการนับผู้เข้าร่วมที่ถูกต้อง
              num_people: participate.post_game.num_people,
              date_meet: participate.post_game.date_meet,
              time_meet: participate.post_game.time_meet,
              game_user_first_name: participate.post_game.user.first_name,
              game_user_last_name: participate.post_game.user.last_name,
              game_user_image: participate.post_game.user.user_image,
            },
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      }
    }

    res.status(200).json({ messages: messages });
  } catch (error) {
    console.error("Error in findAll:", error);
    next(error);
  }
};

// update read notification
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    // get req.body.notification_id is array of notification_id to update read = true
    for (let i = 0; i < req.body.notification_id.length; i++) {
      const updated = await Notification.update(
        { read: true },
        {
          where: { notification_id: req.body.notification_id[i] },
        }
      );
    }

    // update socket.io to update notification to all client

    req.app.get("socketio").emit("notifications_" + req.user.users_id, []);

    res.status(200).json({ message: "Notification was updated successfully." });
  } catch (error) {
    next(error);
  }
};

// New endpoint to mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      {
        where: { user_id: req.user.users_id },
      }
    );

    req.app.get("socketio").emit("notifications_" + req.user.users_id, []);

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};




// create controllers/participateController.js

const db = require("../models");
const Participate = db.participate;

// Create and Save a new Participate
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.user_id) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // check if the user already participate
    const user_id = req.body.user_id;
    const post_games_id = req.body.post_games_id;
    const check = await Participate.findOne({
      where: { user_id: user_id, post_games_id: post_games_id },
    });
    if (check) {
      res.status(400).send({
        message: "You already participate this game!",
      });
      return;
    }

    // Create a Participate
    const participate = {
      participant_apply_datetime: req.body.participant_apply_datetime,
      participant_status: req.body.participant_status,
      user_id: req.body.user_id,
      post_games_id: req.body.post_games_id,
    };

    // Save Participate in the database async
    const data = await Participate.create(participate);

    //select postgame by post_game_id
    const postGame = await db.post_games.findByPk(post_games_id);

  
    
     // insert table notification
     const notification = {
      type: "participate",
      read: false,
      time: new Date(),
      user_id: postGame.dataValues.users_id,
      entity_id: data.dataValues.part_Id,
    };
    await db.notification.create(notification);

    // ส่งข้อมูลกลับไปที่ client หลังจากทำการอัพเดท และสร้าง notification สำเร็จ socket.io จะทำการอัพเดทข้อมูลให้ทุกๆ client ที่เชื่อมต่อ แต่ละ client จะต้องเขียนโค้ดเพื่อรับข้อมูลที่ถูกส่งกลับมา
    const messages = [];

    // get table notification by user_id where read = false
    const notifications = await db.notification.findAll({
      where: { user_id: postGame.dataValues.users_id, read: false },
    });
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].type === "participate") {
        //  ดึงข้อมูลจาก table participate โดยใช้ entity_id ที่ได้จาก table notification
        const participate = await Participate.findByPk(
          notifications[i].entity_id
        );
        messages.push({
          type: "participate",
          data: participate,
          notification_id: notifications[i].notification_id,
          entity_id: notifications[i].entity_id,
          read: notifications[i].read,
          time: notifications[i].time,
        });
      } else if (notifications[i].type === "chat") {
        //  ดึงข้อมูลจาก table chat โดยใช้ entity_id ที่ได้จาก table notification
        const chat = await db.chat.findByPk(notifications[i].entity_id);
        messages.push({
          type: "chat",
          data: chat,
          notification_id: notifications[i].notification_id,
          entity_id: notifications[i].entity_id,
          read: notifications[i].read,
          time: notifications[i].time,
        });
      }
    }

    // get socketio from app.js and emit to client

    req.app
      .get("socketio")
      .emit("notifications_" + postGame.dataValues.users_id, messages);

    res
      .status(201)
      .json({ message: "Participate was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates from the database.
exports.findAll = (req, res) => {
  Participate.findAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving Participates.",
      });
    });
};

// Find a single Participate with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Participate.findByPk(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving Participate with id=" + id,
      });
    });
};

// Update a Participate by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  try {
    // update เสร็จให้ return ข้อมูลกลับไปที่ client

    const updated = await Participate.update(req.body, {
      where: { part_Id: id },
    });

    if (updated) {
      // get in table participate by id
      const parti = await Participate.findByPk(id);

      // insert table notification
      const notification = {
        type: "participate",
        read: false,
        time: new Date(),
        user_id: parti.dataValues.user_id,
        entity_id: id,
      };
      await db.notification.create(notification);

      // ส่งข้อมูลกลับไปที่ client หลังจากทำการอัพเดท และสร้าง notification สำเร็จ socket.io จะทำการอัพเดทข้อมูลให้ทุกๆ client ที่เชื่อมต่อ แต่ละ client จะต้องเขียนโค้ดเพื่อรับข้อมูลที่ถูกส่งกลับมา
      const messages = [];

      // get table notification by user_id where read = false
      const notifications = await db.notification.findAll({
        where: { user_id: parti.dataValues.user_id, read: false },
      });
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].type === "participate") {
          //  ดึงข้อมูลจาก table participate โดยใช้ entity_id ที่ได้จาก table notification
          const participate = await Participate.findByPk(
            notifications[i].entity_id
          );
          messages.push({
            type: "participate",
            data: participate,
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        } else if (notifications[i].type === "chat") {
          //  ดึงข้อมูลจาก table chat โดยใช้ entity_id ที่ได้จาก table notification
          const chat = await db.chat.findByPk(notifications[i].entity_id);
          messages.push({
            type: "chat",
            data: chat,
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      }

      // get socketio from app.js and emit to client

      req.app
        .get("socketio")
        .emit("notifications_" + parti.dataValues.user_id, messages);
      res
        .status(200)
        .json({ message: "Participate was updated successfully." });
    } else {
      res.status(404).json({
        message: `Cannot update Participate with id=${id}. Maybe Participate was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a Participate with the specified id in the request
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    const deleted = await Participate.destroy({
      where: { part_Id: id },
    });
    if (deleted) {
      res
        .status(200)
        .json({ message: "Participate was deleted successfully." });
    } else {
      res.status(404).json({
        message: `Cannot delete Participate with id=${id}. Maybe Participate was not found!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete all Participates from the database.
exports.deleteAll = async (req, res, next) => {
  try {
    const deleted = await Participate.destroy({
      where: {},
      truncate: false,
    });
    res
      .status(200)
      .json({ message: `${deleted} Participates were deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates by post_games_id
exports.findAllByPostGamesId = async (req, res, next) => {
  const post_games_id = req.params.id;
  try {
    const data = await Participate.findAll({
      where: { post_games_id: post_games_id },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates by user_id
exports.findAllByUserId = async (req, res, next) => {
  const user_id = req.params.userId; // Change req.params.id to req.params.userId
  try {
    const data = await Participate.findAll({
      where: { user_id: user_id },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};





const db = require("../models");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const PostActivity = db.post_activity;

exports.create = async (req, res, next) => {
  try {
    const {
      name_activity,
      status_post,
      creation_date,
      detail_post,
      date_activity,
      time_activity,
      post_activity_image,
      store_id,
    } = req.body;

    const data = {
      name_activity: name_activity,
      status_post: status_post,
      creation_date: creation_date,
      detail_post: detail_post,
      date_activity: moment(date_activity, "MM-DD-YYYY"),
      time_activity: time_activity,
      store_id: store_id,
      post_activity_image: post_activity_image
        ? await saveImageToDisk(post_activity_image)
        : post_activity_image,
    };
    const post_activity = await PostActivity.create(data);
    res.status(201).json(post_activity);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    console.log(`Received search query for activities: ${search}`); // เพิ่ม log เพื่อตรวจสอบคำค้นหา

    const condition = search
      ? {
          [Op.or]: [
            { name_activity: { [Op.like]: `%${search}%` } },
            { detail_post: { [Op.like]: `%{search}%` } },
          ],
          status_post: { [Op.not]: "unActive" },
        }
      : {
          status_post: { [Op.not]: "unActive" },
        };

    const post_activity = await PostActivity.findAll({ where: condition });
    post_activity.map((post_activity) => {
      post_activity.post_activity_image = `${req.protocol}://${req.get(
        "host"
      )}/images/${post_activity.post_activity_image}`;
    });
    res.status(200).json(post_activity);
  } catch (error) {
    next(error);
  }
};

// ฟังก์ชันใหม่: ดึงโพสต์ทั้งหมดของร้านค้าตาม store_id
exports.findAllStorePosts = async (req, res, next) => {
  try {
    const storeId = req.params.storeId; // รับ ID ร้านค้าจากพารามิเตอร์ URL
    console.log(`Fetching posts for store ID: ${storeId}`); // เพิ่ม log เพื่อตรวจสอบการดึงโพสต์

    const post_activity = await PostActivity.findAll({
      where: { store_id: storeId }, // ค้นหาโพสต์ที่มี store_id ตรงกับ ID ที่ส่งมา
    });

    console.log(`Found posts: ${post_activity.length}`); // เพิ่ม log เพื่อตรวจสอบจำนวนโพสต์ที่พบ

    post_activity.forEach((post) => {
      if (post.post_activity_image) {
        post.post_activity_image = `${req.protocol}://${req.get(
          "host"
        )}/images/${post.post_activity_image}`;
      }
    });

    res.status(200).json(post_activity);
  } catch (error) {
    console.error("Failed to fetch store posts:", error.message); // เพิ่ม log ข้อผิดพลาด
    next(error);
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;
    const post_activity = await PostActivity.findByPk(post_activity_id);
    post_activity.post_activity_image = `${req.protocol}://${req.get(
      "host"
    )}/images/${post_activity.post_activity_image}`;
    res.status(200).json(post_activity);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;

    if (req.body.post_activity_image) {
      if (req.body.post_activity_image.search("data:image") != -1) {
        const postactivity = await PostActivity.findByPk(post_activity_id);
        const uploadPath = path.resolve("./") + "/src/app/api/public/images/";

        fs.unlink(
          uploadPath + postactivity.post_activity_image,
          function (err) {
            console.log("File deleted!");
          }
        );

        req.body.post_activity_image = await saveImageToDisk(
          req.body.post_activity_image
        );
      }
    }
    req.body.date_activity = moment(req.body.date_activity, "MM-DD-YYYY");
    await PostActivity.update(req.body, {
      where: {
        post_activity_id,
      },
    });
    res.status(200).json({ message: "PostActivity was updated successfully." });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;
    const post_activity = await PostActivity.destroy({
      where: {
        post_activity_id,
      },
    });
    res.status(204).json({ message: "PostActivity was deleted successfully." });
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const post_activity = await PostActivity.destroy({
      where: {},
      truncate: false,
    });
    res.status(204).json(post_activity);
  } catch (error) {
    next(error);
  }
};

async function saveImageToDisk(baseImage) {
  const projectPath = path.resolve("./");

  const uploadPath = `${projectPath}/src/app/api/public/images/`;

  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4()}.svg`;
  } else {
    filename = `${uuidv4()}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);

  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}




const db = require("../models");
const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const PostGames = db.post_games;
// create fucntion to create a new game and save it to the database
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.name_games) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    console.log(req.body.date_meet, "date_meet");
    // Create a game
    const game = {
      name_games: req.body.name_games,
      detail_post: req.body.detail_post,
      num_people: req.body.num_people,
      date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
      time_meet: req.body.time_meet,
      games_image: req.body.games_image
        ? await saveImageToDisk(req.body.games_image)
        : req.body.games_image, // ส่งรูปเกมไปเก็บในระบบ
      status_post: req.body.status_post,
      creation_date: req.body.creation_date,
      users_id: req.body.users_id,
    };

    // Save game in the database async
    const data = await PostGames.create(game);
    res
      .status(201)
      .json({ message: "Game was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// postGameController.js
// exports.create = async (req, res, next) => {
//   try {
//     // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ส่งเข้ามา
//     console.log("Received data:", req.body);

//     // Validate request
//     if (!req.body.name_games) {
//       res.status(400).send({
//         message: "Content can not be empty!",
//       });
//       return;
//     }

//     console.log(req.body.date_meet, "date_meet");
//     // Create a game
//     const game = {
//       name_games: req.body.name_games,
//       detail_post: req.body.detail_post,
//       num_people: req.body.num_people,
//       date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
//       time_meet: req.body.time_meet,
//       games_image: req.body.games_image
//         ? await saveImageToDisk(req.body.games_image)
//         : req.body.games_image, // ส่งรูปเกมไปเก็บในระบบ
//       status_post: req.body.status_post,
//       creation_date: req.body.creation_date,
//       users_id: req.body.users_id,
//     };

//     // Save game in the database async
//     const data = await PostGames.create(game);
//     res
//       .status(201)
//       .json({ message: "Game was created successfully.", data: data });
//   } catch (error) {
//     console.error("Error creating game:", error); // เพิ่ม log ข้อผิดพลาด
//     res.status(500).send({
//       message: "An error occurred while creating the game.",
//       error: error.message, // เพิ่มการส่งข้อความข้อผิดพลาดกลับไปยัง client
//     });
//   }
// };

// Update functions and other functions similarly

// exports.create = async (req, res, next) => {
//   try {
//     // Log the received data for debugging
//     console.log("Received data:", req.body);

//     // Validate request
//     if (!req.body.name_games) {
//       res.status(400).send({
//         message: "Content can not be empty!",
//       });
//       return;
//     }

//     console.log(req.body.date_meet, "date_meet");

//     // Create a game
//     const game = {
//       name_games: req.body.name_games,
//       detail_post: req.body.detail_post,
//       num_people: req.body.num_people,
//       date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
//       time_meet: req.body.time_meet,
//       games_image: req.body.games_image ? await saveImageToDisk(req.body.games_image) : req.body.games_image,
//       status_post: req.body.status_post,
//       creation_date: req.body.creation_date,
//       users_id: req.body.users_id,
//     };

//     // Log the data before inserting into the database
//     console.log("Inserting data into database:", game);

//     // Save game in the database
//     const data = await PostGames.create(game);
//     res.status(201).json({ message: "Game was created successfully.", data: data });

//   } catch (error) {
//     // Log the error message
//     console.error("Error creating game:", error);

//     // Send error message to the client
//     res.status(500).send({
//       message: "An error occurred while creating the game.",
//       error: error.message,
//     });
//   }
// };

// exports.create = async (req, res, next) => {
//   try {
//     // Log the received data for debugging
//     console.log("Received data:", req.body);

//     // ตรวจสอบ `users_id`
//     const userId = req.body.users_id;
//     console.log("Received users_id:", userId);

//     // ตรวจสอบว่ามี `users_id` และมีอยู่ในฐานข้อมูล
//     if (!userId) {
//       return res.status(400).json({
//         message: "Users ID is missing",
//       });
//     }

//     const user = await db.users.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // Validate request
//     if (!req.body.name_games) {
//       res.status(400).send({
//         message: "Content can not be empty!",
//       });
//       return;
//     }

//     console.log(req.body.date_meet, "date_meet");

//     // Create a game
//     const game = {
//       name_games: req.body.name_games,
//       detail_post: req.body.detail_post,
//       num_people: req.body.num_people,
//       date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
//       time_meet: req.body.time_meet,
//       games_image: req.body.games_image
//         ? await saveImageToDisk(req.body.games_image)
//         : req.body.games_image,
//       status_post: req.body.status_post,
//       creation_date: req.body.creation_date,
//       users_id: userId,
//     };

//     // Log the data before inserting into the database
//     console.log("Inserting data into database:", game);

//     // Save game in the database
//     const data = await PostGames.create(game);
//     res
//       .status(201)
//       .json({ message: "Game was created successfully.", data: data });
//   } catch (error) {
//     // Log the error message
//     console.error("Error creating game:", error);

//     // Send error message to the client
//     res.status(500).send({
//       message: "An error occurred while creating the game.",
//       error: error.message,
//     });
//   }
// };

// Retrieve all games from the database.
exports.findAll = (req, res) => {
  //   const name_games = req.query.name_games;
  //   var condition = name_games
  //     ? { name_games: { [Op.like]: `%${name_games}%` } }
  //     : null;
  const { search } = req.query;
  console.log(`Received search query for games: ${search}`); // เพิ่ม log เพื่อตรวจสอบคำค้นหา

  const condition = search
    ? {
        [Op.or]: [
          { name_games: { [Op.like]: `%${search}%` } },
          { detail_post: { [Op.like]: `%${search}%` } },
        ],
        status_post: { [Op.not]: "unActive" },
      }
    : {
        status_post: { [Op.not]: "unActive" },
      };

  PostGames.findAll({ where: condition })
    .then((data) => {
      data.map((post_games) => {
        if (post_games.games_image) {
          post_games.games_image = `${req.protocol}://${req.get(
            "host"
          )}/images/${post_games.games_image}`;
        }
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

// ดึงโพสต์ทั้งหมดของผู้ใช้เฉพาะ
exports.findAllUserPosts = (req, res) => {
  const userId = req.params.userId; // รับ ID ผู้ใช้จากพารามิเตอร์

  PostGames.findAll({
    where: { users_id: userId }, // ค้นหาโพสต์ที่มี users_id ตรงกับ ID ที่ส่งมา
  })
    .then((data) => {
      data.forEach((post) => {
        if (post.games_image) {
          post.games_image = `${req.protocol}://${req.get("host")}/images/${post.games_image}`;
        }
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "มีข้อผิดพลาดเกิดขึ้นขณะดึงข้อมูลโพสต์",
      });
    });
};

// Find a single game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  PostGames.findByPk(id)
    .then((data) => {
      if (data.games_image) {
        data.games_image = `${req.protocol}://${req.get("host")}/images/${
          data.games_image
        }`;
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving game with id=" + id,
      });
    });
};

// Update a game by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  //   check image is updated
  if (req.body.games_image) {
    if (req.body.games_image.search("data:image") != -1) {
      const postGames = await PostGames.findByPk(id);
      const uploadPath = path.resolve("./") + "/src/app/api/public/images/";

      fs.unlink(uploadPath + postGames.games_image, function (err) {
        console.log("File deleted!");
      });

      req.body.games_image = await saveImageToDisk(req.body.games_image);
    }
  }
  req.body.date_meet = moment(req.body.date_meet, "MM-DD-YYYY");

  PostGames.update(req.body, {
    where: { post_games_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating game with id=" + id,
      });
    });
};

// Delete a game with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  PostGames.destroy({
    where: { post_games_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete game with id=${id}. Maybe game was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete game with id=" + id,
      });
    });
};

// Delete all games from the database.
exports.deleteAll = (req, res) => {
  PostGames.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Games were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all games.",
      });
    });
};

async function saveImageToDisk(baseImage) {
  const projectPath = path.resolve("./");

  const uploadPath = `${projectPath}/src/app/api/public/images/`;

  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4()}.svg`;
  } else {
    filename = `${uuidv4()}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);

  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}




// create controller for store
const db = require("../models");
const Store = db.store;

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

// Create and Save a new Store
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.name_store) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // Create a Store
    const store = {
      name_store: req.body.name_store,
      phone_number: req.body.phone_number,
      house_number: req.body.house_number,
      province: req.body.province,
      district: req.body.district,
      sub_district: req.body.sub_district,
      road: req.body.road,
      alley: req.body.alley,
      store_image: req.body.store_image
        ? await saveImageToDisk(req.body.store_image)
        : req.body.store_image,
      users_id: req.body.users_id,
    };

    // Save Store in the database async
    const data = await Store.create(store);
    res
      .status(201)
      .json({ message: "Store was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all Stores from the database.
exports.findAll = (req, res) => {
  Store.findAll()
    .then((data) => {
      data.map((store) => {
        if (store.store_image) {
          store.store_image = `${req.protocol}://${req.get("host")}/images/${
            store.store_image
          }`;
        }
      });
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving Stores.",
      });
    });
};

// Find a single Store with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Store.findByPk(id)
    .then((data) => {
      if (data) {
        if (data.store_image) {
          data.store_image = `${req.protocol}://${req.get("host")}/images/${data.store_image}`;
        }
        res.status(200).json(data);
      } else {
        res.status(404).send({
          message: `Cannot find Store with id=${id}.`
        });
      }
    })
    .catch((err) => {
      console.error("Error retrieving Store with id=", id, "error:", err);
      res.status(500).send({
        message: "Error retrieving Store with id=" + id
      });
    });
};

// Update a Store by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.store_image) {
    //   check image is updated
    if (req.body.store_image.search("data:image") != -1) {
      const store = await Store.findByPk(id);
      const uploadPath = path.resolve("./") + "/src/app/api/public/images/";

      fs.unlink(uploadPath + store.store_image, function (err) {
        console.log("File deleted!");
      });

      req.body.store_image = await saveImageToDisk(req.body.store_image);
    }
  }

  Store.update(req.body, {
    where: { store_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "Store was updated successfully.",
        });
      } else {
        res.status(400).json({
          message: `Cannot update Store with id=${id}. Maybe Store was not found or req.body is empty!`,
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};

// Delete a Store with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Store.destroy({
    where: { store_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "Store was deleted successfully!",
        });
      } else {
        res.status(400).json({
          message: `Cannot delete Store with id=${id}. Maybe Store was not found!`,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not delete Store with id=" + id,
      });
    });
};

// Delete all Stores from the database.
exports.deleteAll = (req, res) => {
  Store.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        .status(200)
        .json({ message: `${nums} Stores were deleted successfully!` });
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while removing all Stores.",
      });
    });
};
// Retrieve all Stores by user_id
exports.findAllByUserId = (req, res) => {
  const id = req.params.id;
  Store.findAll({
    where: { user_id: id },
  })
    .then((data) => {
      if (data.store_image) {
        data.store_image = `${req.protocol}://${req.get("host")}/images/${
          data.store_image
        }`;
      }
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving Store with id=" + id,
      });
    });
};

async function saveImageToDisk(baseImage) {
  const projectPath = path.resolve("./");

  const uploadPath = `${projectPath}/src/app/api/public/images/`;

  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4()}.svg`;
  } else {
    filename = `${uuidv4()}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);

  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}




// create function  in src/controllers/userController.js:
const db = require("../models");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const config = require("../configs/config");

const User = db.user;

exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.username) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    let birthday = moment(req.body.birthday, "MM-DD-YYYY");
    if (!birthday.isValid()) {
      res.status(400).send({
        message: "Invalid date format, please use MM-DD-YYYY",
      });
      return;
    }

    //hash password
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    // Create a user
    const user = {
      // เอาจาก model user.js
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: passwordHash,
      email: req.body.email,
      birthday: birthday,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      user_image: req.body.user_image
        ? await saveImageToDisk(req.body.user_image)
        : req.body.user_image,
    };
    // Save user in the database ใช้ async await แทนการใช้ promise

    await User.create(user);

    res.status(201).json({
      message: "User was registered successfully!",
    });
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    // find all User information from database ใช้ async await แทนการใช้ promise is not return password
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    const usersWithPhotoDomain = await users.map((user, index) => {
      return {
        ...user.dataValues,
        user_image: `${config.DOMAIN}/images/${user.user_image}`,
      };
    });

    res.status(200).json(usersWithPhotoDomain);
  } catch (error) {
    next(error);
  }
};

exports.findOne = (req, res, next) => {
  try {
    const users_id = req.params.id;

    User.findByPk(users_id, {
      attributes: { exclude: ["password"] },
    })
      .then(async (data) => {
        data.user_image = `${config.DOMAIN}/images/${data.user_image}`;

        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error retrieving User with id=" + users_id,
        });
      });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const users_id = req.params.id;

    if (req.body.user_image) {
      if (req.body.user_image.search("data:image") != -1) {
        const user = await User.findByPk(users_id);
        const uploadPath = path.resolve("./") + "/src/app/api/public/images/";

        fs.unlink(uploadPath + user.user_image, function (err) {
          console.log("File deleted!");
        });

        req.body.user_image = await saveImageToDisk(req.body.user_image);
      }
    }
    req.body.birthday = moment(req.body.birthday, "MM-DD-YYYY");

    User.update(req.body, {
      where: { users_id: users_id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update User with id=${users_id}. Maybe User was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with id=" + users_id,
        });
      });
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    const users_id = req.params.id;

    User.destroy({
      where: { users_id: users_id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${users_id}. Maybe User was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete User with id=" + users_id,
        });
      });
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = (req, res) => {
  res.send({ message: "DeleteAll handler" });
};

async function saveImageToDisk(baseImage) {
  const projectPath = path.resolve("./");

  const uploadPath = `${projectPath}/src/app/api/public/images/`;

  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4()}.svg`;
  } else {
    filename = `${uuidv4()}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);

  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}



module.exports.isAdmin = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ admin เท่านั้น'
            }
        });
    }
}

module.exports.isUser = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'user') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ user เท่านั้น'
            }
        });
    }
}

module.exports.isStore = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'store') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ store เท่านั้น'
            }
        });
    }
}

module.exports.isStoreOrUser = (req, res, next) => {
    const { role } = req.user;

    if ( role === 'store'|| role === 'user') {
        next();
    } else {
        return res.status(403).json({
            error: {
                message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะ store หรือ user เท่านั้น'
            }
        });
    }
}



module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        error: {
            status_code: statusCode,
            message: err.message,
            validation: err.validation
        }
    });
}



const db = require("../models/index"); // นำเข้าโมเดลฐานข้อมูล (ORM) ซึ่งใช้ในการสอบถามข้อมูลผู้ใช้จากฐานข้อมูล
const passport = require('passport'); // นำเข้า Passport.js, middleware สำหรับการรับรองความถูกต้องใน Express.js
const config = require('../configs/auth.config'); // นำเข้าไฟล์การตั้งค่าเกี่ยวกับระบบการรับรองความถูกต้อง, เช่น คีย์สำหรับการเซ็น JWT

const JwtStrategy = require('passport-jwt').Strategy, // นำเข้า Strategy สำหรับการใช้งาน JWT
    ExtractJwt = require('passport-jwt').ExtractJwt; // นำเข้าฟังก์ชันสำหรับการแยก JWT ออกจากข้อความร้องขอ
const opts = {} //สร้าง object สำหรับการตั้งค่า option ของ JwtStrategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // ตั้งค่าให้ Passport แยก JWT ออกจาก Authorization header ในรูปแบบ Bearer Token
opts.secretOrKey = config.secret; //ซึ่งควรเป็นค่าที่รักษาความปลอดภัยและไม่ควรเปิดเผย
//opts.issuer = 'accounts.examplesoft.com'; //10-12. บรรทัดเหล่านี้เป็นตัวอย่างที่ถูกคอมเมนต์ไว้ ซึ่งแสดงวิธีการตั้งค่า issuer และ audience สำหรับ JWT แต่ไม่ได้ถูกใช้งานในโค้ดนี้
//opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => { //13-24. ใช้ JwtStrategy กับ Passport โดยมี function ที่รับ jwt_payload (ข้อมูลที่เก็บอยู่ใน JWT) และ done (callback function) เพื่อการตรวจสอบและยืนยันผู้ใช้
    try {
        console.log(jwt_payload);
        const user = await db.user.findOne({ //ใช้ db.user.findOne สำหรับค้นหาผู้ใช้ในฐานข้อมูลที่มี id ตรงกับ jwt_payload.users_id
            where: {
            users_id: jwt_payload.users_id,
            },
        });

       if (!user) { //หากไม่พบผู้ใช้ (if (!user)), จะเรียก done พร้อมกับ error และ null (ไม่มีข้อมูลผู้ใช้)
           return done(new Error('ไม่พบผู้ใช้ในระบบ'), null);
       }

       return done(null, user); //หากพบผู้ใช้, เรียก done พร้อม null (ไม่มี error) และข้อมูลผู้ใช้ (user)

    } catch (error) {
        done(error);
    }
}));

module.exports.isLogin = passport.authenticate('jwt', { session: false }); //ส่งออก middleware ที่ใช้ Passport ในการรับรองความถูกต้องด้วย JWT โดยไม่ใช้ session (stateless)




const { DataTypes } = require("sequelize");
const { generateRandomId } = require("../utils/generateRandomId"); // เรียกใช้ function generateRandomId จากไฟล์ generateRandomId.js

module.exports = (sequelize, Sequelize) => {

const Chat = sequelize.define('chat', {
  // ระบุ attribute ของตาราง
  chat_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    defaultValue: generateRandomId // ใช้ function generateRandomId เพื่อสร้างค่าเริ่มต้น
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  datetime_chat: {
    type: DataTypes.STRING(20), // อาจจะเป็น DataTypes.DATE ถ้าคุณต้องการเก็บวันที่จริง
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'users_id',
    },
    allowNull: false
  },
  post_games_id: {
    type: DataTypes.UUID,
    references: {
      model: 'post_games',
      key: 'post_games_id',
    },
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // เพิ่ม `createdAt` และ `updatedAt` โดยอัตโนมัติ
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `chat` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));


return Chat;

};


const config = require("../configs/db.config")

const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host:config.HOST,
    dialect: config.dialect,
    // dialectOptions:{
    //     ssl:{
    //         required:false,
    //         rejectUnauthorized:false
    //     }
    // },
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    }
});


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post_activity = require("./post_activity")(sequelize, Sequelize);
db.post_games = require("./post_games")(sequelize, Sequelize);
db.chat = require("./chat")(sequelize, Sequelize);
db.participate = require("./participate")(sequelize, Sequelize);
db.store = require("./store")(sequelize, Sequelize);
db.notification = require("./notification")(sequelize, Sequelize);


// กำหนดความสัมพันธ์
db.user.hasOne(db.store, { foreignKey: 'users_id', as: 'store' });
db.store.belongsTo(db.user, { foreignKey: 'users_id' });


module.exports = db;



const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
const Notification = sequelize.define('notification', {
  // ระบุ attribute ของตาราง
  notification_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
    primaryKey: true // กำหนดเป็น Primary Key
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false // อนุญาตให้เป็น null ได้หากเบอร์โทรศัพท์ไม่จำเป็น
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users', // ชื่อตารางของ users
      key: 'users_id', // คีย์ที่ถูกอ้างอิง
    },
    allowNull: false
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // หากคุณต้องการใช้ `createdAt` และ `updatedAt`
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `Notification` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));

  return Notification;
};



const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {

const Participate = sequelize.define('participate', {
  // ระบุ attribute ของตาราง
  part_Id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
    primaryKey: true, // กำหนดเป็น Primary Key
  },
  participant_apply_datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  participant_status: {
    type: DataTypes.STRING(20), // อาจจะเป็น DataTypes.DATE ถ้าคุณต้องการเก็บวันที่จริง
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'users_id',
    },
    allowNull: false
  },
  post_games_id: {
    type: DataTypes.UUID,
    references: {
      model: 'post_games',
      key: 'post_games_id',
    },
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // เพิ่ม `createdAt` และ `updatedAt` โดยอัตโนมัติ
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `Participate` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));


return Participate;

};



const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PostActivity = sequelize.define(
    "post_activity",
    {
      // ระบุ attribute ของตาราง
      post_activity_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
        primaryKey: true, // กำหนดเป็น Primary Key
      },
      name_activity: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status_post: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      creation_date: {
        type: DataTypes.DATE, // ใช้ DATE สำหรับ datetime
        allowNull: false,
      },
      detail_post: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date_activity: {
        type: DataTypes.DATEONLY, // ใช้ DATEONLY สำหรับ date
        allowNull: false,
      },
      time_activity: {
        type: DataTypes.TIME, // ใช้ TIME สำหรับ time
        allowNull: false,
      },
      post_activity_image: {
        type: DataTypes.STRING(255), // ใช้ STRING สำหรับการเก็บ URL หรือเส้นทางของรูปภาพ
        allowNull: true,
      },
      store_id: {
        type: DataTypes.UUID,
        references: {
          model: 'store', // ชื่อตารางของ store
          key: 'store_id', // คีย์ที่ถูกอ้างอิง
        },
        allowNull: false
      }
    },
    {
      // ตัวเลือกเพิ่มเติม
      freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
      timestamps: false, // หากคุณไม่ต้องการ `createdAt` และ `updatedAt`
    }
  );

  // สร้างตารางตามโมเดลหากยังไม่มี
  sequelize
    .sync()
    .then(() =>
      console.log("Table `post_activity` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return PostActivity;
};



const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PostGames = sequelize.define(
    "post_games",
    {
      // ระบุ attribute ของตาราง
      post_games_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
        primaryKey: true, // กำหนดเป็น Primary Key
      },
      name_games: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      detail_post: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      num_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date_meet: {
        type: DataTypes.DATEONLY, // ใช้ DATEONLY สำหรับวันที่โดยไม่มีเวลา
        allowNull: false,
      },
      time_meet: {
        type: DataTypes.TIME, // ใช้ TIME สำหรับเวลา
        allowNull: false,
      },
      games_image: {
        type: DataTypes.STRING(255), // ใช้สำหรับเก็บ URL หรือเส้นทางของรูปเกม
        allowNull: true, // อนุญาตให้เป็น null ได้หากรูปเกมไม่จำเป็น
      },
      creation_date: {
        type: DataTypes.DATE, // ใช้ DATE สำหรับวันที่และเวลา
        defaultValue: Sequelize.NOW, // กำหนดค่าเริ่มต้นเป็นเวลาปัจจุบัน
        allowNull: false,
      },
      status_post: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "users", // ชื่อตารางของ user
          key: "users_id", // คีย์ที่ถูกอ้างอิง
        },
        allowNull: false,
      },
    },
    {
      // ตัวเลือกเพิ่มเติม
      freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
      timestamps: false, // ปิดการใช้งาน timestamps หากคุณไม่ต้องการ `createdAt` และ `updatedAt`
    }
  );

  // สร้างตารางตามโมเดลหากยังไม่มี
  sequelize
    .sync()
    .then(() =>
      console.log("Table `post_games` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return PostGames;
};




const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
const Store = sequelize.define('store', {
  // ระบุ attribute ของตาราง
  store_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
    primaryKey: true // กำหนดเป็น Primary Key
  },
  name_store: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true // อนุญาตให้เป็น null ได้หากเบอร์โทรศัพท์ไม่จำเป็น
  },
  house_number: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  alley: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  road: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sub_district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  store_image: {
    type: DataTypes.STRING(255), // ใช้สำหรับเก็บ URL หรือเส้นทางของรูปภาพ
    allowNull: true // อนุญาตให้เป็น null ได้หากรูปร้านค้าไม่จำเป็น
  },
  users_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users', // ชื่อตารางของ users
      key: 'users_id', // คีย์ที่ถูกอ้างอิง
    },
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // หากคุณต้องการใช้ `createdAt` และ `updatedAt`
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `store` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));

  return Store;
};



const { DataTypes } = require('sequelize');
const db = require('./index');


module.exports = (sequelize, Sequelize) =>{
  const User = sequelize.define("users", {
    users_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
      primaryKey: true // กำหนดเป็น Primary Key
    },
    role: {
      type: DataTypes.ENUM('user', 'admin' , 'store'), // กำหนดให้ role เป็น ENUM ที่มีค่าเป็น 'user' หรือ 'admin' หรือ 'store'
      allowNull: false,
      defaultValue: 'user' // กำหนดค่าเริ่มต้นเป็น 'user'
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATEONLY, // ใช้ DATEONLY สำหรับวันที่โดยไม่มีเวลา
      allowNull: true // อนุญาตให้เป็น null ได้หากวันเกิดไม่จำเป็น
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true // กำหนดให้ username เป็น unique
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true // กำหนดให้ email เป็น unique
    },
    
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true // อนุญาตให้เป็น null ได้หากเบอร์โทรศัพท์ไม่จำเป็น
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true // อนุญาตให้เป็น null ได้หากเพศไม่จำเป็น
    },
    user_image: {
      type: DataTypes.STRING(255), // ใช้สำหรับเก็บ URL หรือเส้นทางของรูปภาพ
      allowNull: true // อนุญาตให้เป็น null ได้หากรูปผู้ใช้ไม่จำเป็น
    }
  },
  {
    freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
    timestamps: true // หากต้องการเพิ่ม `createdAt` และ `updatedAt`
  });

  // สร้างตารางตามโมเดลหากยังไม่มี
 sequelize.sync()
.then(() => console.log('Table `users` has been created successfully.'))
.catch(error => console.error('or table already exist users'));


  return User;
};



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;
const Store = db.store; // ต้องมีการอ้างอิงไปยัง model Store

// login route
router.post("/", async (req, res) => {
  const { identifier, password } = req.body; // เปลี่ยน `username` เป็น `identifier`

  try {
    // ค้นหาผู้ใช้ด้วยอีเมลหรือชื่อผู้ใช้
    const user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: identifier }, // ค้นหาโดย `username`
          { email: identifier }, // ค้นหาโดย `email`
        ],
      },
      include: [
        {
          model: Store,
          as: "store", // อ้างอิงตามชื่อ alias ที่คุณใช้ในการผูกกับ User model
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "User Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password !" });
    }

    // สมมติว่าคุณมีการเข้าถึง store_id จากผู้ใช้ที่ login
    // เพิ่ม store_id ลงใน payload ของ JWT ถ้ามี
    const token = jwt.sign(
      {
        users_id: user.users_id,
        store_id: user.store?.store_id, // ต้องตรวจสอบว่า store object มีอยู่จริงหรือไม่
      },
      config.secret,
      { expiresIn: 86400 }
    );

    console.log("JWT Payload:", {
      users_id: user.users_id,
      store_id: user.store_id,
    });
    console.log("JWT Token:", token);

    const expires_in = jwt.decode(token);

    return res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;



// create router for comment

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new comment
router.post("/",[passportJWT.isLogin,authentication.isUser], chatController.create);

// Retrieve all comments
router.get("/",[passportJWT.isLogin,authentication.isUser], chatController.findAll);

// Retrieve a single comment with id
router.get("/:id",[passportJWT.isLogin,authentication.isUser], chatController.findOne);

// Update a comment with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], chatController.update);

// Delete a comment with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], chatController.delete);

// Delete all comments
router.delete("/",[passportJWT.isLogin,authentication.isUser], chatController.deleteAll);

// Retrieve all comments by post_games_id
router.get("/post/:id",[passportJWT.isLogin,authentication.isUser], chatController.findAllByPostGamesId);

module.exports = router;




// create router for notification
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Retrieve all notification
router.get("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.findAll);

// Update a notification with id
router.put("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.update);

// Mark all notifications as read
router.put("/mark-all-as-read", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.markAllAsRead);

module.exports = router;



// create router for participate

const express = require("express");
const router = express.Router();
const participateController = require("../controllers/participateController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new participate
router.post("/",[passportJWT.isLogin,authentication.isUser], participateController.create);

// Retrieve all participates
router.get("/", participateController.findAll);

// Retrieve a single participate with id
router.get("/:id",[passportJWT.isLogin,authentication.isUser], participateController.findOne);

// Retrieve all participates by post_games_id
router.get("/post/:id",[passportJWT.isLogin,authentication.isStoreOrUser], participateController.findAllByPostGamesId);

// In router file, add this route
router.get("/user/:userId", [passportJWT.isLogin, authentication.isStoreOrUser], participateController.findAllByUserId);

// Update a participate with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], participateController.update);

// Delete a participate with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], participateController.delete);

// Delete all participates
router.delete("/",[passportJWT.isLogin,authentication.isUser], participateController.deleteAll);

module.exports = router;



// create router for postActivity
const express = require("express");
const router = express.Router();
const postActivityController = require("../controllers/postActivityController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

router.post("/", [passportJWT.isLogin, authentication.isStore], postActivityController.create);
router.get("/", postActivityController.findAll);
router.get("/:id", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findOne);
router.put("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.update);
router.delete("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.delete);
// เส้นทางใหม่: ดึงโพสต์ทั้งหมดของร้านค้าตาม store_id
router.get("/store/:storeId", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findAllStorePosts);

module.exports = router;



// create a new file named postGame.js in the routers folder and add the following code:

const express = require("express");
const router = express.Router();
const postGameController = require("../controllers/postGameController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new game
router.post("/",[passportJWT.isLogin,authentication.isUser], postGameController.create);

// Retrieve all games
router.get("/", postGameController.findAll);

// Retrieve all games by a specific user
router.get("/user/:userId",[passportJWT.isLogin, authentication.isStoreOrUser], postGameController.findAllUserPosts);

// Retrieve a single game with id
router.get("/:id",[passportJWT.isLogin,authentication.isStoreOrUser], postGameController.findOne);

// Update a game with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], postGameController.update);

// Delete a game with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], postGameController.delete);

// Delete all games
router.delete("/",[passportJWT.isLogin,authentication.isUser], postGameController.deleteAll);


module.exports = router;



// create router for store
const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new store
router.post("/",[passportJWT.isLogin,authentication.isUser], storeController.create);

// Retrieve all stores
router.get("/", storeController.findAll);

// Retrieve a single store with id
router.get("/:id",[passportJWT.isLogin,authentication.isStoreOrUser], storeController.findOne);

// Retrieve all stores by user_id
router.get("/user/:id",[passportJWT.isLogin,authentication.isUser], storeController.findAllByUserId);

// Update a store with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], storeController.update);

// Delete a store with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], storeController.delete);

// Delete all stores
router.delete("/",[passportJWT.isLogin,authentication.isUser], storeController.deleteAll);

module.exports = router;



// create router for users

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

// Create a new user
router.post('/', userController.create);

// Retrieve all users
router.get('/', userController.findAll);

// Retrieve a single user with id
router.get('/:id',[passportJWT.isLogin], userController.findOne);

// Update a user with id
router.put('/:id',[passportJWT.isLogin], userController.update);

// Delete a user with id
router.delete('/:id', userController.delete);

// Delete all users
router.delete('/', userController.deleteAll);

module.exports = router;




// generateRandomId.js
const { v4: uuidv4 } = require('uuid');

// สร้าง function สำหรับสร้างค่าเริ่มต้นของ comment_id
const generateRandomId = () => {
  return uuidv4().split('-').join('');
};

module.exports = { generateRandomId };



'use server';

const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const cors = require("cors");
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const db = require("./models/index");

const errorHandler = require('./middleware/errorHandler');
const routerUser = require("./routers/users");
const routerAuth = require("./routers/auth");
const routerPostActivity = require("./routers/postActivity");
const routerPostGame = require("./routers/postGame");
const routerChat = require("./routers/chat");
const routParticipate = require("./routers/participate");
const routerStore = require("./routers/store");
const routerNotification = require("./routers/notification");

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and resync DB");
//   });

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//init passport
app.use(passport.initialize());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Worapakorn Jarusiriphot application." });
});

app.get('/testnotification', (req, res) => {
  // req.user send users id to send notification to 


  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/api/auth', routerAuth);
app.use('/api/users', routerUser);
app.use('/api/postActivity', routerPostActivity);
app.use('/api/postGame', routerPostGame);
app.use('/api/chat', routerChat);
app.use('/api/participate', routParticipate);
app.use('/api/store', routerStore);
app.use('/api/notification', routerNotification);




app.use(errorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// console.log('Using mysql2 version:', require('mysql2').version);