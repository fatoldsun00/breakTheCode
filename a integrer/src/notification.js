const WebSocket = require('ws')

let serveur = {
	users: [],
	games: [],
	chat: [],
}

//Init Server
const wss = new WebSocket.Server({port:6325})
//check et ferme les cannaux morts
let checkConnInterval
/*wss.on('listening', async function(ws,req){
	checkConnInterval=setInterval(()=>{
		for (let k of Object.keys(users)){
			for (let i=0;i<usersCo[k].length;i++){
				if (users[k][i].readyState == WebSocket.CLOSED){
					users[k][i].terminate()
					users[k].splice(i,1)
				}
			}
		}
	},30000);
})*/

//Supprime le setinterval check ferme canaux mort
wss.on('close', async function(){
	clearInterval(checkConnInterval)
})

//a la connexion client
wss.on('connection', async (ws,req) => {
	try{
		const arrParams = req.url.substr(req.url.indexOf('?')+1,req.url.length).split('&')
		let params = {}
		for (param of arrParams) {
			const arrKV = param.split('=')
			params[arrKV[0]] = arrKV[1]
		}
		//si on a un query param name
		if (params.name) {
			//et que se nom n'est pas deja prit
			if (!serveur.users.filter((user)=>user.name==params.name).length){
				serveur.users.push({
					name: params.name,
					ws: ws
				})
				ws.send('Bonjour '+ params.name)
			} else {
				throw {error:"Nom d'utilisateur exitant"}
			}
		} else {
			throw {error:"Nom d'utilisateur invalide"}
		}

		//au message
		ws.on('message', function incoming(data) {
			try{
				data = JSON.parse(data)
				switch (data.type) {
					case 'joinChat' :

						break
					case 'joinGame' :

						break
					case 'listGames' : 

						break
					case 'createGame' : 
						serveur.games.push({
							id: data.name,
							nbrJoueurs: data.nbrJoueurs
						})
						// TODO CREATION LOBBY
						break
				}
			} catch (err) {
				ws.send(JSON.stringify(err))
			}
			
		})
	}catch(err){
		ws.send(JSON.stringify(err))
		ws.close()
	}
})