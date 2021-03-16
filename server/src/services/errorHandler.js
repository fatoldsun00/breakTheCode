const i18n = require( './i18n' );

const sError = ( httpCode, errorCode, errStack = undefined ) => {
	let err = new Error( i18n.__( errorCode ) );
	err.statusCode = httpCode;
	err.errorCode = errorCode;
	if (errStack != undefined) err.stack = errStack

	return err;
};

//Gestionnaire d'erreur pour les demandes front
const sFrontError = ( err, req, res, next ) => {
	res.locals.error=({
		status: err.statusCode==undefined?418:err.statusCode,
		message: { 
			code: err.errorCode, 
			errmsg: err.message,
			from:'front' } 
	})

	next(err)
}

//Gestionnaire d'erreur pour tracer les info sur la console
const sLogConsoleError = ( err, req, res, next ) => {
	console.log( err )
	next(err)
}

const sDebugError = ( err, req, res, next ) => {
	if (req.query.debug){
		res.locals.error= {
			status: err.statusCode==undefined?418:err.statusCode,
			message: { 
				/*httpRequete : {
					config:err.config,
					dataSend:err.response.data || 0
				},*/
				status: err.statusCode,
				code: err.errorCode,  
				errmsg: err.message,
				stack: err.stack,
				//fullErr : err,
				from:'debugger' }}
	}
	next(err)	
}

const sendResError = (err,req,res,next) => {
	//res.send(res.locals.error)
	if (res.locals.error !=undefined && res.locals.error.status!=undefined){
		res.status(res.locals.error.status).json(res.locals.error.message);
	}else{
		res.status(err.status).json(err.message);
	}
}
module.exports = {
	sError,
	sLogConsoleError,
	sFrontError,
	sDebugError,
	sendResError
};
  
