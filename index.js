const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require("axios");
const { chatGPT, chatGPTv2 } = require('./utils');
const googleTTS = require('google-tts-api');

const User = require('./models/user.model');

// config .env
require('dotenv').config()

// config db
require('./config/db')

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

//Config Telegraf
app.use(bot.webhookCallback('/telegram-bot'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`);

app.post('/telegram-bot', (req, res) => {
    res.send('LALALA LILILI');
});

//Middleware
bot.use( async (ctx, next) => {
    ctx.from.telegram_id = ctx.from.id;

    const user = await User.findOne({ telegram_id: ctx.from.id }) //comprobar si existe el usuario y no añadirlo en ese caso

    if (!user)
        await User.create(ctx.from);

    next();
})

//comandos
bot.command('test', async ctx => {
    await ctx.reply(`Hola ${ctx.from.first_name}. ¿Sabes cómo se maneja una Promise?`);
    await ctx.replyWithDice();
    console.log(ctx.message)
});

bot.command('tiempo', async ctx => {
    const city = ctx.message.text.slice(8) // extraigo de un array a partir del 8º caracter (/tiempo ). También se puede hacer con substring(8).
    try {
        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        let tempActual = data.main.temp;
        let tempMax = data.main.temp_max;
        let tempMin = data.main.temp_min;
        let humidity = data.main.humidity;

        await ctx.reply(`La temperatura actual en ${city} es: ${tempActual}ºC.
      La temperatura máxima será de: ${tempMax}ºC y la mínima de ${tempMin}ºC.
      La humedad es del ${humidity}%.`);
        await ctx.replyWithLocation(data.coord.lat, data.coord.lon)
    } catch (error) {
        ctx.reply('Ha ocurrido un error, vuelve a intentarlo.');
    }
    });

bot.command('receta', async ctx => {
    const ingredientes = ctx.message.text.slice (8)
    const response = await chatGPT(ingredientes);
    ctx.reply(response)
});

bot.command('chat', async ctx => {
    // /chat Hola amigui
    const mensaje = ctx.message.text.slice(6)

    const count = await User.countDocuments();
    const randomNum = Math.floor(Math.random() * count); //numero aleatorio de 0 a 9 (sin incluir 9)
    const user = await User.findOne().skip(randomNum)

    bot.telegram.sendMessage(user.telegram_id, mensaje);
    ctx.reply(`Mensaje enviado a ${user.first_name}`)
});

// eventos
bot.on('text', async ctx => {
    // const response = await chatGPTv2(ctx.message.text);
    const response = ctx.message.text;
    const url = googleTTS.getAudioUrl(response, {
        lang: 'es', slow: false, host: 'https://translate.google.com'
    });

    await ctx.reply(response);
    await ctx.replyWithAudio(url);
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
