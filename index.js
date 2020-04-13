const Discord = require("discord.js");
const client = new Discord.Client();
const postReactions = require("./postReactions");
const postQuestion = require("./postQuestion");
const clearBotPosts = require("./clearBotPosts");
const login = require("./login");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", msg => {
  if (msg.author.id === client.user.id) {
    return;
  }
  if (msg.content.startsWith("!react ")) {
    msg.delete();
    postReactions(msg.content.replace("!react ", ""), msg.channel);
  } else if (msg.content.startsWith("!reactq ")) {
    postQuestion(msg);
  } else if (msg.content === "!clear") {
    clearBotPosts(msg, client.user);
  }
});
login(client);
