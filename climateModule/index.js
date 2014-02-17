// var hardware = require('hardware');
var tessel = require('tessel');
var requestURL = "http://192.168.1.236/api/newdeveloper/lights"; //URL to Philips Hue API

var port = process.argv[2] || 'A';
console.log("Connecting to climate sensor on port", port);

// Climate
var climate = require('climate-si7005').connect(tessel.port(port));

climate.on('connected', function () {
  console.log("Connected to S17005");

  // Uncomment for better humidity readings, worse temperature readings.
  // climate.setHeater(true);

  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        temp_in_c = ((temp-32)/9)*5
        //temp_in_c = temp; //fahrenheit
        console.log('{"Degrees":"' +  temp_in_c.toFixed(1) + '","Humidity":"' + humid.toFixed(1) + '"}');
        //changeHue(1, 32000);
        setTimeout(loop, 1000);
      });
    });
  });
});


function pushToBulbs(url, request){
  var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
  var mimeType = "text/plain";  
  xmlHttp.open('PUT', url, false);  // true : asynchrone false: synchrone  
  xmlHttp.setRequestHeader('Content-Type', mimeType);    
  xmlHttp.send(request); 
    
}


function changeHue(id,value){
  var url = requestURL + "/"+id + "/state";
  var request = '{"hue": '+value+'}';
  pushToBulbs(url, request);
}