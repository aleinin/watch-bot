module.exports = async (message, author) => {
  message.delete();
  const messagesToDelete = await message.channel.messages
    .fetch({ limit: 100 })
    .then(fetchMsgs =>
      fetchMsgs.array().filter(fetchMsg => fetchMsg.author.equals(author))
    );
  message.channel.bulkDelete(messagesToDelete, true);
};
