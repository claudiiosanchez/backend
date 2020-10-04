const express = require("express");

const cheerio = require("cheerio");

const request = require("request");

var cors = require('cors')

const app = express();

app.locals.updated = 0;

app.locals.hour = new Date().toLocaleString();

const router = express.Router();

app.use(cors())

app.set("port", process.env.PORT || 4000);

app.use(function(req, res, next) 
{
  
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  res.header("Access-Control-Allow-Methods", "GET");
  
  next();
  
});

app.use(router.get("/",(req, res) => 
{

	url = `https://www.naranja.com/comercios-amigos`;

	request(url, (error, response, html) => 
	{
		
		let data = [{"result":[],"updated":app.locals.hour}];

		if (!error && response.statusCode === 200) 
		{
			
			let $ = cheerio.load(html);

			$(".faq-title_question").each(function(i, obj) 
			{

				data[0].result.push({index:$(this).text().replace(/\s\s+/g, ' '),value:""});

			});

			$(".faq-text div div").each(function(i, obj)  
			{

				if(i<data[0].result.length)
				{

					data[0].result[i].value = $(this).html().toString();

				}

			});

			if(app.locals.updated==data[0].result.length)
			{

			}
			else
			{

				app.locals.updated = data[0].result.length;

				data[0].updated = new Date().toLocaleString();
				
				app.locals.hour = new Date().toLocaleString();
				
			}

			res.json(data);

		}

	});

}));

app.listen(app.get('port'), () =>{});