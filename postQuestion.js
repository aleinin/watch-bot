const postReactions = require("./postReactions.js");

module.exports = message => {
  message.delete();
  const questionAndContent = message.content
    .replace("!reactq ", "")
    .split("? ");
  if (questionAndContent.length !== 2) {
    return;
  }
  message.channel.send(`${questionAndContent[0]}?`);
  postReactions(questionAndContent[1], message.channel);
};
