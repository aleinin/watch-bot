const Discord = require("discord.js");
const client = new Discord.Client();
const postDays = require("./postDays");
const clearBotPosts = require("./clearBotPosts");
const login = require("./login");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", msg => {
  if (msg.content.startsWith("!days")) {
    postDays(msg);
  } else if (msg.content === "!clear") {
    clearBotPosts(msg, client.user);
  }
});
login(client);
