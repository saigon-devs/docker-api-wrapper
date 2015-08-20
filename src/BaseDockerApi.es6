export default class BaseDockerApi{
	constructor(serverIp, port) {
		this.serverIp = serverIp
		this.port = port
	}

	getDefaultOptions(){
		return {
			serverIp: this.serverIp,
			port: this.port,
		}
	}

}