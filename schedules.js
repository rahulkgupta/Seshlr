// Scraping Made Easy with jQuery and SelectorGadget 
// (http://blog.dtrejo.com/scraping-made-easy-with-jquery-and-selectorga)
// by David Trejo
// 
// Install node.js and npm:
//    http://joyeur.com/2010/12/10/installing-node-and-npm/
// Then run
//    npm install jsdom jquery http-agent
//    node numresults.js
// 
var util = require('util')
  , url = require('url')
  , httpAgent = require('http-agent')
  , jsdom = require('jsdom').jsdom;

function getClasses(agent) { 
  var window = jsdom(agent.body).createWindow()
    , $ = require('jquery').create(window);
  
  //
  // Now you can use jQuery to your heart's content!
  //
  var titles = $('.b')
    , points = $('.subtext span');
    

  
  console.log($(titles).text());
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

// Start scraping
agent.start();
