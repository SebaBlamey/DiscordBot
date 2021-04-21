const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./Configs.json")
const fs = require("fs");
const fse = require("fs-extra");
const Canvas = require("canvas");
const snekfecth= require("node-superfetch");
const { format } = require("path");

Array.prototype.remove = function(x){
    return this.filter(function(v){
        return v !== x;
    });
};

client.on("ready",()=>{
    console.log("me prendí");
    client.guilds.cache.map(async guild =>{
        var existe = await DBExiste(guild.id);
        if(!existe){
            crearConfigs(guild.id)
        }
    })
});
const default_configs ={
    "canal_bienvenida": "bienvenida",
    "mensaje_bienvenida": "%user% Bienvenido a mi servidor!",
    "imagen_bienvenida": "https://i.imgur.com/4LJIGkc.jpg", 
    "canal_despedia": "bienvenida",
    "mensaje_despedia": "%user% Se ha marchado ;(",
    "imagen_despedida": "https://i.imgur.com/4LJIGkc.jpg"
}
async function DBExiste(id){
    var patch = `./Configuraciones/${id}.json`;
    try {
        return fs.existsSync(patch);
    }catch(e) {return false};
}
async function crearConfigs(id){
    fse.outputFile(`./Configuraciones/${id}.json`,JSON.stringify(default_configs)).then(()=>{
        console.log(`Configs creadas ${id}`);
    }).catch(err => console.log(err));
}

client.on("guildMemberAdd", async member =>{
    var mensaje = guildDB.mensaje_bienvenida;
    var canal = guildDB.canal_bienvenida;
    /*var existe = await DBExiste(member.guild.id);
    if(!existe) return await crearConfigs(member.guild.id);
    const guildDB = require(`./Configuraciones/${member.guild.id}.json`);
    const canvas = Canvas.createCanvas(700,250);
    const ctx = canvas.getContext("2d");
    var img = guildDB.imagen_bienvenida;
    var mensaje = guildDB.mensaje_bienvenida;
    var canal = guildDB.canal_bienvenida;
    if(img){
        const {body: b} = await snekfecth.get(img);
        const fonfo = await canvas.loadImage(b);
        ctx.drawImage(fondo,0,0,700,250);
    }
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${member.displayName}!`,225,canvas.height/1.8);

    ctx.beginPath();
    ctx.arc(125,125,100,0,Math.PI*2,true);
    ctx.closePath();
    ctx.clip();

    const {body: buffer} = await snekfecth.get(member.user.displayAvatarURL({format:"png",dynamic:true}));
    const avatar = await Canvas.loadImage(buffer);
    ctx.drawImage(avatar,25,25,200,200);

    const final = new Discord.MessageAttachment(canvas.toBuffer(),"img.png");
    member.guild.channels.cache.find(c=> c.name == canal).send(mensaje,final);*/
    member.guild.channels.cache.find(c=>c.name == canal).send(mensaje);
});

client.on("message",async mensaje=>{
    if(mensaje.author.bot) return;
    if(!mensaje.guild) return;
    if(!mensaje.content.startsWith(config.prefix)) return;
    var fullmsg = mensaje.content.split(" ");
    var command = fullmsg[0].replace(config.prefix,"");
    var args = fullmsg.remove(fullmsg[0]);
    var comandos = ["ayuda","help"];
    if(!command) return;
    if(command === "ayuda" || command === "help"){
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.tag,client.user.displayAvatarURL({format : "png",dynamic: true}))
        .setDescription(`${config.prefix}${comandos.join(`\n${config.prefix}`)}`)
        .setColor("RANDOM")
        .setFooter(`${client.user.tag}`)
        .setTimestamp();
        mensaje.channel.send(embed)
    } else
    if(command === "configs"){
        var existe = await DBExiste(mensaje.guild.id);
        if(!existe) return await crearConfigs(mensaje.guild.id);
        const guildDB = require(`./Configuraciones/${mensaje.guild.id}.json`);
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.tag,client.user.displayAvatarURL({format : "png",dynamic: true}))
        .setDescription(`"canal_bienvenida": ${guildDB.canal_bienvenida},
        "mensaje_bienvenida": ${guildDB.mensaje_bienvenida},
        "imagen_bienvenida": ${guildDB.imagen_bienvenida}, 
        "canal_despedia": ${guildDB.canal_despedia},
        "mensaje_despedia": ${guildDB.mensaje_despedia},
        "imagen_despedida": ${guildDB.imagen_despedida}`)
        .setColor("RANDOM")
        .setFooter(`${client.user.tag}`)
        .setTimestamp();
        mensaje.channel.send(embed)
    } else
    if(command.startsWith("stop")){
        mensaje.channel.send("Me marcho")
        client.destroy();
    } else
    if(command === "test"){
        client.emit("guildMemberAdd",mensaje.member)
    }
});

client.login(config.token)