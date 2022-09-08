A very simple bot I use to query the availability of server members. This bot will create messages and react with a ✅, ❌, or ❓ so that users can choose what choice fits best for them

# commands

### !wb react a, b, c...

Sends a message for every choice and reacts with the above emojis. <br /><br />
example: !wb react Monday, Tuesday, Wednesday <br />
Spaces after "," are optional

### !wb reactq question? a, b, c...

First sends the question to the chat, then sends a message for every choice and reacts with the above emojis. <br />
example: !wb reactq What days are you all available? Monday, Tuesday, Wednesday <br />
The "? " is required <br />
Spaces after "," are optional

### !wb clear

Clears all bot messages (limit 100)

### !wb help

Posts a message describing the bots functionality

### !wb repeat

Repeats your last recorded command. !wb repeat and !wb clear are not recorded

# development

The information described below is only relevant if you want to run the bot locally. For usage, see above.

## .env

In order to start, WatchBot needs to be provided a bot token in a .env file as shown below:

```
WATCH_BOT_TOKEN=YOUR_TOKEN_HERE
```

If you're unsure how to get a token, see [Discord's Developer Portal](https://discord.com/developers/docs/getting-started)

## running locally

1. Create a .env file in the project root as described above
2. npm i
3. npm run build
4. npm run start
