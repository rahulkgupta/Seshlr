var mongoose = require('mongoose');

exports.user = function(req, res) {
	var userId = req.params.id
	mongoose.model('User')
	.findById(userId)
	.run(function (err, usr) {
		var userdata = {
			'id': userId,
			'name': usr.name,
			'picture': usr.picture,
			'link': usr.link
		}
		res.send(userdata)
	});
}