
var util = require('util')
  , url = require('url')
  , httpAgent = require('http-agent')
  , jsdom = require('jsdom').jsdom
  , mongoose = require('mongoose');

var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');


// DB Schema

mongoose.connect(configdata.db);
var Schema = mongoose.Schema


var Class = new Schema ({
    dept  : String
  , num   : String
  , name  : String
});

var sched = mongoose.model('Class',Class); 
// Start scraping




function getClasses(agent) {
  var window = jsdom(agent.body).createWindow()
    , $ = require('jquery').create(window)

  //
  // Now you can use jQuery to your heart's content!
  //
  //array of departments and classes
  var dept = $('b')
    , classes = $('.b');
    
  for (var i = 0; i < classes.length - 2; i+=3) {
      var instance = new sched();
      instance.dept = $(classes[i]).text();
      instance.num = $(classes[i+1]).text().trim();
      instance.name = $(classes[i+2]).text();
      instance.save();
      //console.log($(classes[i]).text() + '\t' + $(classes[i+1]).text() + '\t' + $(classes[i+2]).text() + '\n');
      
    }

  }

var urls = ['/OSOC/osoc?p_term=SP&p_list_all=Y'];
var agent = httpAgent.create('osoc.berkeley.edu', urls);
console.log('Scraping', urls.length, 'pages from', agent.host);

agent.addListener('next', function (err, agent) {
  getClasses(agent);
  console.log();
  agent.next();
});

agent.addListener('stop', function (err, agent) {
  if (err) console.log(err);
  console.log('All done!');
});

agent.start();


