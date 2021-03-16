const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const { sendResError } = require('./src/Services/errorHandler')
const { mode, corsAllowURL, port} = require('./src/config')
require('./src/Controllers/WSServerController')

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*app.use(cors({
	credentials: true,
  origin: corsAllowURL,
  optionsSuccessStatus: 204
}))*/

app.use(cors())

app.use(cookieParser())

//Front routes
app.use('/api',require( './src/Routes/indexRoutes' ))

app.listen(port || 8000,'localhost', () => {
	console.log( `Running on PORT: ${port}` );
	//console.log( i18n.__( "MSG_LOG_PORT: %s", port ) );
	console.log( `Mode: ${mode}` );
});

//Error send
app.use(sendResError)

/**************** Serveur WebSocket *************************/


/****************Uncaught execption fallback*****************/
process.on('uncaughtException', function(err) {  
	console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!uncaught exception:!!!!!!!!!!!!!!!!!!!!!!!!!!!', err.stack || err);
  });

/****************Fermeture *****************/
process.on('SIGINT', async function() {
	try{
	 //TODO
	}catch(err){
	  console.log("Erreur de fermeture \n",err);
	}finally{
	  console.log("Comme l'a si bien dit Giscard : Au revoir");
	  process.exit();
	}
  });
