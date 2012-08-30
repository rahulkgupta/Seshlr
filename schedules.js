
var util = require('util')
  , url = require('url')
  , httpAgent = require('http-agent')
  , jsdom = require('jsdom').jsdom
  , mongoose = require('mongoose');

var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');


// DB Schema

mongoose.connect(configdata.db);
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
       agent.addUrl('/OSOC/osoc?p_term=FL&p_dept=' + dept + '&p_course=' + $(classes[i+1]).text().trim())
    }

}

var pattr = new RegExp(' P .* [A-z]')


//hacky as hell
function addClass(agent) {
 // console.log('adding class' + agent.url)
  var window = jsdom(agent.body).createWindow()
    , $ = require('jquery').create(window)
    var title = $('.coursetitle')
    var dept = $('input[name=p_dept]').val()
    var num = $('input[name=p_course]').val()
    // console.log(num)
    var name = $('input[name=p_title]').val()
    for (var i = 0; i < title.length; i++) {
      //console.log($(title).html())
      var details = $(title[i]).parent().parent().parent().parent().parent().parent().children('tr')
      var header  = $(details[0]).children().next().next().text()
      var ccn = $(details[4]).children().next().text()
      var type = header.substring(header .length-4, header.length)
      var pieces = header.split(" ")
      // console.log(pieces[2])
      var subnum = pieces[pieces.length-3]
      // console.log(header)
      var instance = new Class();
      instance.dept = dept;
      instance.num = num;
      instance.type = type
      instance.subnum = subnum
      if (ccn != "SEE DEPT " && ccn != "SEE NOTE ") instance.ccn = ccn
      instance.name = header
      instance.save();
    }
}


var urls = ['/OSOC/osoc?p_term=SP&p_list_all=Y'];
//var urls = ['/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=185X']
var agent = httpAgent.create('osoc.berkeley.edu', urls);
console.log('Scraping', urls.length, 'pages from', agent.host);

var first = true;
agent.addListener('next', function (err, agent) {
  if (!err) {
    if (first) {
      console.log('first')
      getClasses(agent)
      first = false;
    } else {
      addClass(agent)
    }
    //console.log();
    agent.next();
  }
 
});

agent.addListener('stop', function (err, agent) {
  if (err) console.log(err);
  console.log('All done!');
});

agent.start();

/*/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=185X

adding class/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=186A

adding class/OSOC/osoc?p_term=SP&p_dept=VIS STD&p_course=280*/

