module.exports = message => {
  message.delete();
  const reactables = message.content
    .replace("!react ", "")
    .replace(/, /g, ",")
    .split(",");
  reactables.forEach(reactable => {
    message.channel.send(reactable).then(sent => {
      sent.react("✅");
      sent.react("❌");
      sent.react("❓");
    });
  });
};
