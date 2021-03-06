const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
//When Online
client .on("ready", () => {
	console.log(`NeyBOT has booted up, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
	client.user.setActivity(`Wobbling ${client.guilds.size} Servers`);
});
//Joining or Leaving Servers
client.on("guildCreate", guild => {
	console.log(`NeyBOT joined Guild: ${guild.name} (id: ${guild.id}) with ${guild.memberCount} members`);
	client.user.setActivity(`Wobbling ${client.guilds.size} Servers`);
});
client.on("guildDelete", guild => {
	console.log(`NeyBOT left Guild: ${guild.name} (id: ${guild.id})`)
	client.user.setActivity(`Wobbling ${client.guilds.size} Servers`);
});
//When a player Joins
client.on("guildMemberAdd", member => {
	console.log('User ' + member.user.username + ' has joined the server')
	let role = member.guild.roles.find("name", "Unknown");
	member.addRole(role).catch(console.error);
});

//Bot Config
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	//ping
	if(command === "ping") {
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency = ${m.createdTimestamp - message.createdTimestamp}ms, API Latency = ${Math.round(client.ping)}ms`);
	}
	//8ball
	if(command === "8ball") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)", "Immortal (Members)", "Mortals (Sketchy)"].includes(r.name)) )
			return message.reply("You're mentally not strong enough for this command");
		if(!args[2])
			return message.reply("Please ask a full question");
		let replies = [
		"It is certain",
		"It is decidedly so",
		"Without a doubt",
		"Yes, definetly",
		"You may rely on it",
		"As I see it, yes",
		"Most likely",
		"Outlook good",
		"Yes",
		"Signs point to yes",
		"Reply hazy, try again",
		"Ask again later",
		"Better not tell you now",
		"Cannot predict now",
		"Concentrate and ask again",
		"Don't count on it",
		"My rely is no",
		"My sources say no",
		"Outlook not so good",
		"Very doubtful"];
		let result = Math.floor((Math.random() * replies.length));
		let question = args.slice(1).join(" ");
		let ballembed = new Discord.RichEmbed()
		.setAuthor(message.author.tag)
		.setColor("#FF9900")
		.addField("Question", question)
		.addField("Answer", replies[result]);
		message.channel.send(ballembed);
	}
	//help
	if(command === "help") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)", "Immortal (Members)", "Mortals (Sketchy)", "Unknown"].includes(r.name)) )
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
	message.author.sendMessage("```+ping - shows the latency between you and the server and the bot``` ");
	message.author.sendMessage("```+8ball - ask the all powerful 8 ball anything you want```");
	message.author.sendMessage("```+animetit - sends you a sexy anime girl pic```");
	}
	//staffcommands
	//modhelp
	if(command === "modhelp") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)"].includes(r.name)) ) 
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
	message.author.sendMessage("```+purge #ofmessages - currently broken```");
	message.author.sendMessage("```+mute @player time- currently broken```");
	message.author.sendMessage("```+kick @player reason - kicks player from the server```");
	message.author.sendMessage("```+ban @player reason - bans player from the server```");
	}
	//kick
	if(command === "kick") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)"].includes(r.name)) ) 
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if(!member)
			return message.reply("Please mention a Valid Member of this server");
		if(!member.kickable)
			return message.reply("Your role does not have valid permission to kick this player");
		let reason = args.slice(1).join(' ');
		if(!reason) reason = "No reason provided";
		await member.kick(reason)
			.catch(error => message.reply(`Sorry ${message.author}, I couldnt kick the player because: ${error}`));
			message.reply(`Player: ${member.user.tag} has been kicked by ${message.author.tag} because ${reason}`);
	}
	//ban
	if(command === "ban") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)"].includes(r.name)) )
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if(!member)
			return message.reply("Please mention a Valid Member of this server");
		if(!member.bannable)
			return message.reply("Your role does not have valid permission to ban this player");
		let reason = args.slice(1).join(' ');
		if(!reason) reason = "No reason provided";
		await member.ban(reason)
			.catch(error => message.reply(`Sorry ${message.author}, I couldnt ban the player because: ${error}`));
			message.reply(`Player: ${member.user.tag} has been banned by ${message.author.tag} because ${reason}`);
	}
	//purge
	if(command === "purge") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)"].includes(r.name)) )
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
		const deleteCount = parseInt(args[0], 10);
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
		const fetched = await message.channel.fetchMessages({count: deleteCount});
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}
	//Mute
	if(command === "mute") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)"].includes(r.name)) )
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
		const ms = require("ms")
		.catch(error => message.reply(`Sorry, couldn't mute ${member.user.tag} because ${error}`));
		let member = message.mentions.members.first();
		if(!member) return message.reply("Please mention a Valid Member of this server");
		let muteRole = message.guild.roles.find("name", "Muted");
		if(!muteRole) return message.reply("Role: Muted does not exist");
		let args = message.content.split(" ").slice(1);
		let time = args[1];
		if(!time) return message.reply("Please provide a valid time span");

		member.addRole(muteRole.id);
		message.channel.send(`${member.user.tag} has been muted by ${message.author.tag} for ${ms(ms(time), {long: true})}`)
		.catch(error => message.reply(`Sorry, couldn't mute ${member.user.tag} because ${error}`));

		setTimeout(function() {
			member.removeRole('name', 'Muted');
			message.channel.send(`${message.user.tag} has been unmuted`)
		}, ms(time));
	}
	//Unmute
	if(command === "unmute") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)"].includes(r.name)) )
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
		let member = message.mentions.members.first();
		if (!member)
			return message.reply("Please mention a Valid Member of this server");
		let muteRole = message.guild.roles.find("name", "Muted");
		if(!muteRole)
			return message.reply("Role: Muted does not exist");
		let args = message.content.split(" ").slice(1);
		member.removeRole(muteRole.id);
		messsage.reply(`${message.user,tag} has been unmuted`);
	}
	//nsfwanimetits
	if(command === "animetit") {
		if(!message.member.roles.some(r=>["God", "Deity (Admin)", "Seraph (Moderator)", "Immortal (Members)", "Mortals (Sketchy)"].includes(r.name)) )
			return message.reply("Sorry, you do not have permission to do this. Please contact staff if there is a problem.");
		message.author.sendMessage("**8===D---**");
		message.author.sendMessage("**Ha NiBBa YoU GaY!**");
	}
});

client.login(config.token);
