const Discord = require("discord.js");
const client = new Discord.Client();
const postReactables = require("./postReactable");
const clearBotPosts = require("./clearBotPosts");
const login = require("./login");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", msg => {
  if (msg.content.startsWith("!react ")) {
    postReactables(msg);
  } else if (msg.content === "!clear") {
    clearBotPosts(msg, client.user);
  }
});
login(client);
