var SqsCommands = function(queue){
	this.queue = queue;
	var _this = this;

	SqsCommands.prototype.recv = function(callback){
		_this.queue.receiveMessage(function(err, data){
			if(err) { callback(err); return; }
			callback(null, {Body : data.Body,
				MD5OfBody : data.MD5OfBody})
		});
	}
}



module.exports = SqsCommands;