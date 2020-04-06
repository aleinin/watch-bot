module.exports = message => {
  message.delete();
  const days = message.content
    .replace("!days", "")
    .replace(/ /g, "")
    .split(",");
  days.forEach(day => {
    message.channel.send(day).then(sent => {
      sent.react("✅");
      sent.react("❌");
      sent.react("❓");
    });
  });
};
