module.exports = (content, channel) => {
  const reactables = content.replace(/, /g, ",").split(",");
  reactables.forEach(reactable => {
    channel.send(reactable).then(sent => {
      sent.react("✅");
      sent.react("❌");
      sent.react("❓");
    });
  });
};
