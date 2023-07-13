# Comando /tiempo
- Ejecución:  /tiempo Madrid
              /tiempo Barcelona
1. Rescatar el nombre de la ciudad
    - Dentro de ctx.message viene el texto completo que estamos enviando (/tiempo Madrid).
    - Del string anterior hay que recuperar la ciudad
2. Hay que llamar a la API de Openweathermap
    - GET https://api.openweathermap.org/data/2.5/weather?q=CIUDAD&appid=12cc61f3282afaca14152a6185f43de0&units=metric 
    - Para hacer la llamada a la API usamos axios
        - Instalar axios
        - Lanzar petición GET con axios

3. Una vez recuperamos la información de la API, respondemos en el bot con:
temperatura actual, temperatura máxima, temperatura mínima y humedad.
