
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
  , lec   : String
});

var sched = mongoose.model('Class',Class); 
// Start scraping




function getClasses(agent) {
  console.log('getting classes')
  var window = jsdom(agent.body).createWindow()
    , $ = require('jquery').create(window)

  //
  // Now you can use jQuery to your heart's content!
  //
  //array of departments and classes
  var dept = $('b')
    , classes = $('.b');
    
  for (var i = 0; i < classes.length - 2; i+=3) {
      //console.log('/OSOC/osoc?p_term=SP&p_dept=' + $(classes[i]).text() + '&p_course=' + $(classes[i+1]).text().trim());
      var dept = $(classes[i]).text().replace(/ /g, "%20")
       agent.addUrl('/OSOC/osoc?p_term=SP&p_dept=' + dept + '&p_course=' + $(classes[i+1]).text().trim())
    }

}

var pattr = new RegExp(' P .* [A-z]')

function addClass(agent) {
  console.log('adding class' + agent.url)
  var window = jsdom(agent.body).createWindow()
    , $ = require('jquery').create(window)
    var title = $('.coursetitle')
    var dept = $('input[name=p_dept]').val()
    var num = $('input[name=p_course]').val()
    var name = $('input[name=p_title]').val()
    for (var i = 0; i < title.length; i++) {
      //console.log($(title).html())
      var details = $(title[i]).parent().parent().parent().parent().parent().parent().children('tr')
      //console.log($(details[0]).text())
      var lec = pattr.exec($(details[0]).text())
      if (lec)
        console.log(lec[0])
      //for (var j = 0; j < details.length; j++) {
        
      //}
    }
}


var urls = ['/OSOC/osoc?p_term=SP&p_list_all=Y'];
//var urls = ['/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=185X']
var agent = httpAgent.create('osoc.berkeley.edu', urls);
console.log('Scraping', urls.length, 'pages from', agent.host);

var first = true;
agent.addListener('next', function (err, agent) {
  if (first) {
    console.log('first')
    getClasses(agent)
    first = false;
  } else {
    addClass(agent)
  }
  console.log();
  agent.next();
});

agent.addListener('stop', function (err, agent) {
  if (err) console.log(err);
  console.log('All done!');
});

agent.start();

/*/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=185X

adding class/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=186A

adding class/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=280*/

