//=============================== - [ Consts ] - ===================================
const Discord = require("discord.js");

const bot = new Discord.Client();

const { Util } = require("discord.js");

const timezone = require("moment-timezone");

const YouTube = require("simple-youtube-api");

const fs = require("fs");

const request = require("request");

const bannedwords = ["@here", "@everyone"];

const ytdl = require("ytdl-core");

const prefix = "x!";

const queue = new Map();

bot.on("ready", () => console.log("🤖Ready Bot In Online🤖"));

bot.on("message", message => {
  if (message.content === "x!help") {
    const embed = new Discord.RichEmbed()
      .setColor("BLUE")
      .setImage(
        "https://cdn.discordapp.com/attachments/741000252684763136/774322683776729098/PicsArt_11-06-12.02.31.png"
      )
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/741000252684763136/774322708317732944/PicsArt_11-06-12.06.28.png"
      ).setDescription(`**COMAND HELP MENU**


**The prefix for the bot is: x!**

** x!antibots on **

** x!antibots off **

** x!anti ban            [1 to 3] **

** x!anti kick           [1 to 3] **

** x!anti role           [1 to 3] **

** x!anti channel        [1 to 3] **

** x!anti time           [1 to 3] **

** x!inv **
`);
    message.channel.sendEmbed(embed);
  }
});

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("ready", () => {
  console.log(`[!]-------------------------------------[!]`);
  console.log(`Display Name : ${bot.user.username}`);
  console.log(`Public Prefix : ${prefix}`);
  console.log(`Version : 0.0.1`);
  console.log(`[!]-------------------------------------[!]`);
});


bot.on("ready", () => {
  bot.user.setActivity("x!help It's time to secure your server!", {
    type: "PLAYING"
  });
  bot.user.setStatus();
});
let anti = JSON.parse(fs.readFileSync("./antigrefff.json", "UTF8"));
let config = JSON.parse(fs.readFileSync("./server.json", "UTF8"));
bot.on("message", message => {
  if (!message.channel.guild) return;
  let user = anti[message.guild.id + message.author.id];
  let num = message.content
    .split(" ")
    .slice(2)
    .join(" ");
  if (!anti[message.guild.id + message.author.id])
    anti[message.guild.id + message.author.id] = {
      actions: 0
    };
  if (!config[message.guild.id])
    config[message.guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  if (message.content.startsWith(prefix + "anti")) {
    if (message.author.id !== message.guild.owner.user.id)
      return message.channel.send("**just Ownership can on**");
    if (message.content.startsWith(prefix + "anti ban")) {
      if (!num) return message.channel.send("[1 to 3]|justnumbersend! **");
      if (isNaN(num)) return message.channel.send("[1 to 3] | only number! **");
      config[message.guild.id].banLimit = num;
      message.channel.send(
        `** lock = | changed: ${config[message.guild.id].banLimit} **`
      );
    }
    if (message.content.startsWith(prefix + "anti kick")) {
      if (!num) return message.channel.send(" [1 to 3]| justnumbersend!  **");
      if (isNaN(num)) return message.channel.send("[1 to 3] |only number ! **");
      config[message.guild.id].kickLimits = num;
      message.channel.send(
        `** lock = |changed  : ${config[message.guild.id].kickLimits}**`
      );
    }

    if (message.content.startsWith(prefix + "anti role")) {
      if (!num) return message.channel.send("[1 to 3]| justnumbersend! **");
      if (isNaN(num))
        return message.channel.send(" [1 to 3]| only number!**");
      config[message.guild.id].roleCrLimits = num;
      message.channel.send(
        `** lock = |  changed: ${config[message.guild.id].roleCrLimits}**`
      );
    }

    if (message.content.startsWith(prefix + "anti channel")) {
      if (!num) return message.channel.send(" [1 to 3]| justnumbersend! **");
      if (isNaN(num)) return message.channel.send(" [1 to 3]|only number ! **");
      config[message.guild.id].chaCrLimit = num;
      message.channel.send(
        `** lock = | changed : ${config[message.guild.id].chaCrLimit}**`
      );
    }
    if (message.content.startsWith(prefix + "anti time")) {
      if (!num) return message.channel.send(" ** [1 to 3]| justnumbersend! **");
      if (isNaN(num))
        return message.channel.send(" ** [1 to 3]|only number ! **");
      config[message.guild.id].time = num;
      message.channel.send(
        `** lock = | changed: ${config[message.guild.id].time}**`
      );
    }
  }
  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});
bot.on("channelDelete", async channel => {
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "CHANNEL_DELETE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("test");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].chaDelLimit
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username}tried to delete many channels **`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

bot.on("channelCreate", async channel => {
  if (!["text", "category", "voice"].includes(channel.type.toLowerCase()))
    return;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "CHANNEL_CREATE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;

  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("test");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].chaCrLimit
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username}  tried to create many channels**`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
      if (e) throw e;
    });
    fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
      e
    ) {
      if (e) throw e;
    });
  }
});
bot.on("roleDelete", async channel => {
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "ROLE_DELETE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("test");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].roleDelLimit
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username} ‎tried to create many roles**`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

bot.on("roleCreate", async channel => {
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "ROLE_CREATE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("test");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].roleCrLimits
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username}tried to delete many roles **`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

bot.on("guildBanAdd", async (guild, user) => {
  const entry1 = await guild
    .fetchAuditLogs({
      type: "MEMBER_BAN_ADD"
    })
    .then(audit => audit.entries.first());
  console.log("ban: " + entry1.executor.username);
  const entry = entry1.executor;
  if (!config[guild.id])
    config[guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  if (!anti[guild.id + entry.id]) {
    anti[guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[guild.id + entry.id].actions = 0;
    }, config[guild.id].time * 1000);
  } else {
    anti[guild.id + entry.id].actions = Math.floor(
      anti[guild.id + entry.id].actions + 1
    );
    setTimeout(() => {
      anti[guild.id + entry.id].actions = 0;
    }, config[guild.id].time * 1000);
    if (anti[guild.id + entry.id].actions >= config[guild.id].banLimit) {
      guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          guild.owner.send(`**⇏ | ${entry.username}  tried to ban members**`)
        );
      anti[guild.id + entry.id].actions = 0;
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

bot.on("guildKickAdd", async (guild, user) => {
  const entry1 = await guild
    .fetchAuditLogs({
      type: "MEMBER_KICK"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[guild.id])
    config[guild.id] = {
      banLimit: 2,
      chaDelLimit: 2,
      chaCrLimit: 2,
      roleDelLimit: 2,
      kickLimits: 2,
      roleCrLimits: 2,
      time: 30
    };
  if (!anti[guild.id + entry.id]) {
    anti[guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[guild.id + entry.id].actions = 0;
    }, config[guild.id].time * 1000);
  } else {
    anti[guild.id + entry.id].actions = Math.floor(
      anti[guild.id + entry.id].actions + 1
    );
    console.log("test");
    setTimeout(() => {
      anti[guild.id + entry.id].actions = 0;
    }, config[guild.id].time * 1000);
    if (anti[guild.id + entry.id].actions >= config[guild.id].banLimit) {
      guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          guild.owner.send(`**⇏ | ${entry.username}  tried to kick members**`)
        );
      anti[guild.id + entry.id].actions = 0;
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

bot.on("guildMemberRemove", async member => {
  const entry1 = await member.guild
    .fetchAuditLogs()
    .then(audit => audit.entries.first());
  if (entry1.action === "MEMBER_KICK") {
    const entry2 = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_KICK"
      })
      .then(audit => audit.entries.first());
    const entry = entry2.executor;
    if (!config[member.guild.id])
      config[member.guild.id] = {
        banLimit: 2,
        chaDelLimit: 2,
        chaCrLimit: 2,
        roleDelLimit: 2,
        kickLimits: 2,
        roleCrLimits: 2,
        time: 30
      };
    if (!anti[member.guild.id + entry.id]) {
      anti[member.guild.id + entry.id] = {
        actions: 1
      };
      setTimeout(() => {
        anti[member.guild.id + entry.id].actions = 0;
      }, config[member.guild.id].time * 1000);
    } else {
      anti[member.guild.id + entry.id].actions = Math.floor(
        anti[member.guild.id + entry.id].actions + 1
      );
      console.log("test");
      setTimeout(() => {
        anti[member.guild.id + entry.id].actions = 0;
      }, config[member.guild.id].time * 1000 || 30000);
      if (
        anti[member.guild.id + entry.id].actions >=
        config[member.guild.id].kickLimits
      ) {
        member.guild.members
          .get(entry.id)
          .ban()
          .catch(e =>
            member.owner.send(`**⇏ | ${entry.username} tried to kick members**`)
          );
        anti[member.guild.id + entry.id].actions = 0;
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
          e
        ) {
          if (e) throw e;
        });
        fs.writeFile(
          "./antigreff.json",
          JSON.stringify(anti, null, 2),
          function(e) {
            if (e) throw e;
          }
        );
      }
    }

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
      if (e) throw e;
    });
    fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
      e
    ) {
      if (e) throw e;
    });
  }
});

//=========={Anit-Bot}========//

let antibots = JSON.parse(fs.readFileSync("./antibot.json", "utf8")); //require antihack.json file
bot.on("message", message => {
  if (message.content.startsWith(prefix + "antibots on")) {
    if (!message.member.hasPermission("Ownership")) return message.reply(":");
    antibots[message.guild.id] = {
      onoff: "On"
    };
    message.channel.send(`** You have disabled anti bot!**`);
    fs.writeFile("./antibot.json", JSON.stringify(antibots), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});

///////////////////////////

bot.on("message", message => {
  if (message.content.startsWith(prefix + "antibots off")) {
    if (!message.member.hasPermission("Ownership")) return message.reply(":");
    antibots[message.guild.id] = {
      onoff: "Off"
    };
    message.channel.send(`**You have enabled anti bot! **`);
    fs.writeFile("./antibot.json", JSON.stringify(antibots), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});
bot.on("guildMemberAdd", member => {
  if (!antibots[member.guild.id])
    antibots[member.guild.id] = {
      onoff: "Off"
    };
  if (antibots[member.guild.id].onoff === "Off") return;
  if (member.user.bot) return member.kick();
});

fs.writeFile("./antibot.json", JSON.stringify(antibots), err => {
  if (err)
    console.error(err).catch(err => {
      console.error(err);
    });
});
//////===============linke bot========================\\\\\
bot.on("message", message => {
  if (message.content === "x!inv") {
    if (!message.channel.guild)
      return message.reply(
        "**Please Do not type bot commands in bot private chat**"
      );
    let embed = new Discord.RichEmbed()
      .setColor("BLUE")
      .setTitle("• BOT INVITE •")
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=737370841460768859&permissions=8&scope=bot"
      ) // Type Your Link here after ''
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/741000252684763136/774322708317732944/PicsArt_11-06-12.06.28.png"
      )

      .setFooter(" ™ Security #3040", message.author.avatarURL);
    message.channel.sendEmbed(embed);
  }
});

/////////////ABOUT///////////////////

bot.on("message", async console => {
  const mm = console.mentions.members.first() || console.member;
  if (console.content === "x!about") {
    var user = console.guild.member(
      console.mentions.members.first() || console.author
    );

    var embed = new Discord.RichEmbed()

      .setColor("BLUE")

      .setTitle("{            **Bot Info**            }")

      .addField("**Name** ", " ™ Security #3040")

      .addField("**ID** ", "667309579675369482")

      .addField("**Guilds** ", `${bot.guilds.size}`)

      .addField("**Users** ", `${bot.users.size}`)

      .addField("**Owner Bot** ", "–•™Mr.X™•–#0007")

      .setThumbnail(
        "https://cdn.discordapp.com/attachments/741000252684763136/774322708317732944/PicsArt_11-06-12.06.28.png"
      );

    console.channel.send(embed);

    console;
  }
});

//////============token================////
bot.login("NzM3MzcwODQxNDYwNzY4ODU5.Xx8YHA.lOR4Sz17Mv0hooa8OxOuJOQcqw4");
