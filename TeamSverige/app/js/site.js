var requestURL = "http://192.168.1.236/api/newdeveloper/lights"; 
var groupRequestURL = "http://192.168.1.236/api/newdeveloper/groups/0"; 
var tesselURL = "http://192.168.1.38:8000";
var xmlHttp;
var temperatureRequest = new XMLHttpRequest();
var bulbs;
var monitoringTemperature = false;
var discoMode = false;
var allBulbsOn = false;

var temp = 0;
var humidity = 0;


function initialize() {
	var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
    var mimeType = "text/plain";  
    xmlHttp.open('GET', requestURL, true);  // true : asynchrone false: synchrone  
    xmlHttp.setRequestHeader('Content-Type', mimeType);    
    xmlHttp.send();
    xmlHttp.onreadystatechange=function()
	  {
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {
	    	bulbs = JSON.parse(xmlHttp.response);
	    	getBulbState();
	    }
	  }
 }  

 function getBulbState(){
 	var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
 	var mimeType = "text/plain";  
    xmlHttp.open('GET', groupRequestURL , true);  // true : asynchrone false: synchrone  
    xmlHttp.setRequestHeader('Content-Type', mimeType);    
    xmlHttp.send();

    xmlHttp.onreadystatechange=function()
	  {
		  if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {
	    	var response = JSON.parse(xmlHttp.response);
	    	for(var i = 1; i <= Object.size(bulbs); i++){
	    		bulbs[i].on = response.action.on;
	    	}
	    }
	  }
 }

function getTempAndHumidity() {
	$.ajax({
		url: tesselURL,
		dataType: 'jsonp',
		jsonpCallback: 'test',
		jsonp: 'callback'
	});

}

function test(data){		

	var response = data;
   
	temp = response.Degrees;
	humidity = response.Humidity;
	document.getElementById('temperature').innerHTML = temp;
	document.getElementById('humidity').innerHTML = humidity;

	var minTemp = 10;
	var maxTemp = 32;
	var maxHue = 65535;
	var minHue = 40000;

	hue = minHue + ((temp - minTemp) * (maxHue - minHue)) / (maxTemp - minTemp);

	if(hue > 65535) {
		hue -= 65535;
	}

	changeAllSat(255);
	changeAllBri(255);
	changeAllHue(Math.round(hue));
}


function toggleAll(){
	var url = groupRequestURL + '/action';
	var request = '{"on": ' + !allBulbsOn + '}';
	allBulbsOn =!allBulbsOn;
	pushToBulbs(url, request);
}



function toggle(id){
	var url = requestURL + "/"+id + "/state";
	var request = '{"on": '+!bulbs[id].on+'}';
	bulbs[id].on = !bulbs[id].on;
	pushToBulbs(url, request);
}



function changeAllXY(value){
	var url = groupRequestURL + '/action';
	var request = '{"xy": '+value+'}';
	pushToBulbs(url, request);
}



function changeXY(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"xy": '+value+'}';
	pushToBulbs(url, request);
}

function changeAllBri(value){
	var url = groupRequestURL + '/action';
	var request = '{"bri": '+value+'}';
	pushToBulbs(url, request);
}


function changeBri(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"bri": '+value+'}';
	pushToBulbs(url, request);
}


function changeAllSat(value){
	var url = groupRequestURL + '/action';
	var request = '{"sat": '+value+'}';
	pushToBulbs(url, request);
}
function changeSat(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"sat": '+value+'}';
	pushToBulbs(url, request);
}

function changeAllHue(value){
	var url = groupRequestURL + '/action';
	var request = '{"hue": '+value+'}';
	pushToBulbs(url, request);
}

function changeHue(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"hue": '+value+'}';
	pushToBulbs(url, request);
}

function pushToBulbs(url, request){
	var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
	var mimeType = "text/plain";  
	xmlHttp.open('PUT', url, false);  // true : asynchrone false: synchrone  
    xmlHttp.setRequestHeader('Content-Type', mimeType);    
    xmlHttp.send(request); 
    
}

var rangeList = document.querySelectorAll("input[type='range']");

rangeArray = [].slice.call(rangeList);

for(var i = 0; i<rangeArray.length; i++){
	rangeArray[i].addEventListener("change",function(){
		if(this.dataset.mode === 'hue') {
			changeHue(this.id.split("_")[1],this.value);
		} else if(this.dataset.mode === 'sat') {
			changeSat(this.id.split("_")[1],this.value);
		} else if(this.dataset.mode === 'bri') {
			changeBri(this.id.split("_")[1],this.value);
		}
	});
}

function discoModeOn(){
	var button = document.getElementById('discoMode');
	if(discoMode) {
		button.value="LET'S PARTY!";
	}
	else {
		button.value="Disco!";	
	}

	var bri = Math.round(Math.random() * 255);
    var hue = Math.round(Math.random() * 32000);
	var sat = Math.round(Math.random() * 255);    
	/*
    sat = Math.round(Math.random() * 255);
    changeSat(1,sat);
    sat = Math.round(Math.random() * 255);
	changeSat(2,sat);
    sat = Math.round(Math.random() * 255);
    changeSat(3,sat);
	
    bri = Math.round(Math.random() * 255);
	changeBri(1,bri);
	bri = Math.round(Math.random() * 255);
	changeBri(2,bri);
	bri = Math.round(Math.random() * 255);
	changeBri(3,bri);
	*/

	hue = Math.round(Math.random() * 32000);
	changeHue(1,Math.round(hue));
	hue = Math.round(Math.random() * 32000);
	changeHue(2,Math.round(hue));
	hue = Math.round(Math.random() * 32000);
    changeHue(3,Math.round(hue));
	
	if(!discoMode) {
		return false;
	} else {
		setTimeout(discoModeOn,100);
	}

}


Object.size = function(obj){
	var size = 0, key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function monitorTemperature() {
	var button = document.getElementById('monitorTemperature');
	if(monitoringTemperature) {
		button.value="Monitoring temperature";
	}
	else {
		button.value="How hot is it?";	
	}

	getTempAndHumidity();
	if(!monitoringTemperature) {
		return false;
	} else {
		setTimeout(monitorTemperature,1000);
	}
}

function getColorFromCam(){
	
	colorScanner($("#color").text().substring(21));
}

function colorScanner(hex){
	r = hexToRgb(hex).r;
	g = hexToRgb(hex).g;
	b = hexToRgb(hex).b;

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    h = Math.floor(h*360);
    s = Math.floor(s * 100);
    var minTemp = 0;
	var maxTemp = 255;
	var maxHue = 65535;
	var minHue = 0;

	h = minHue + ((h - minTemp) * (maxHue - minHue)) / (maxTemp - minTemp);
	if(h > 65535) {
		h -= 65535;
	}
   	

	var X = 0.4124 * r + 0.3576 * g + 0.1805*b;
	var Y = 0.2126 * r + 0.7152 * g + 0.0722*b;
	var Z = 0.0193 * r + 0.1192 * g + 0.9505*b;

	var x = X / (X+Y+Z);
	var y = Y / (X+Y+Z);

	
	changeAllXY("["+x+","+y+"]");

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}





if(document.getElementById('discoMode')){
	document.getElementById('discoMode').addEventListener('click', function(){	
		var audio = document.getElementById('funkyTown');
		
		if(!discoMode){
			if(!allBulbsOn) {
				toggleAll();
			}
			audio.play();
			$("#discoStu").show();
		}
		else{
			if(allBulbsOn) {
				toggleAll();
			}
			audio.pause();
			$("#discoStu").hide();
		}

		
		monitoringTemperature = false;
		discoMode = !discoMode;
		changeAllBri(255);
		changeAllSat(255);
		discoModeOn();
	});
}

if(document.getElementById('monitorTemperature')){
	document.getElementById('monitorTemperature').addEventListener('click', function(){	
		discoMode = false;
		if(!allBulbsOn) {
			toggleAll();
		} else if(allBulbsOn) {
			toggleAll();
		}
		monitoringTemperature = !monitoringTemperature;
		monitorTemperature();
	});
}

function onError(errorId,errorMsg) {
				alert(errorMsg);
			}			
			function changeCamera() {
				$.scriptcam.changeCamera($('#cameraNames').val());
			}
			function onWebcamReady(cameraNames,camera,microphoneNames,microphone,volume) {
				$.each(cameraNames, function(index, text) {
					$('#cameraNames').append( $('<option></option>').val(index).html(text) )
				}); 
				$('#cameraNames').val(camera);
			}
			function onMotion(motion,brightness,color,motionx,motiony) {
				$('#motion').html('Motion (0 or 1): '+motion);
				$('#brightness').html('Brightness level (0-255): '+brightness);
				$('#color').html('Average color (hex): '+color);
				$('#colordiv').css('background-color','#'+color);
				$('#motionx').html('Motion x: '+motionx);
				$('#motiony').html('Motion y: '+motiony);
			}
	
