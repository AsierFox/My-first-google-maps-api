///////////////////////////////////////////////////////////////////////////////
////////////////       AJAX Methods     ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function createHttp () {
	   if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function httpRequest (http, file) {
	// Realizar peticion HTTP
 	http.open('GET', file, true);
 	http.send(null);
}

///////////////////////////////////////////////////////////////////////////////
////////////////       XML Methods     ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function loadProvincias () {
	var peticionHttp = createHttp();
	
 	peticionHttp.onreadystatechange = function () {
 	    if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
 	        var xml        = peticionHttp.responseXML;
 	        var rootxml    = xml.childNodes[0];
 	        var provincias = rootxml.getElementsByTagName('provincia');
 	        var select     = document.getElementById('selProvincias');
			
 	        for (var i = 0; i < provincias.length; i++) {
 	        	var opt = document.createElement('option');
 	        	var nombreProvincia = provincias[i].getElementsByTagName('nombre')[0].firstChild.nodeValue;
 	        	opt.appendChild(document.createTextNode(nombreProvincia));
 	        	select.add(opt);
 	        }
		}
 	};

 	httpRequest(peticionHttp, 'paises.xml');
}

function showAll () {
	var peticionHttp = createHttp();
	
 	peticionHttp.onreadystatechange = function () {
 	    if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
 	        var xml           = peticionHttp.responseXML;
 	        var rootxml       = xml.childNodes[0];
 	        var provincias    = rootxml.getElementsByTagName('provincia');
 	        var numProvincias = provincias.length;

 	        var txt = '';
			for (var i = 0; i < numProvincias; i++) {
				txt += '<div class="galeria"><div class="pure-menu pure-menu-open">';
				var nombreProvincia = provincias[i].getElementsByTagName('nombre')[0].firstChild.nodeValue;
				txt += '<div class="pure-menu-heading">' + nombreProvincia + '</div>';
				txt += '<ul>';
 	        	var ciudades = provincias[i].getElementsByTagName('ciudad');

				for (var j = 0; j < ciudades.length; j++) {
					txt += '<li><a href="#">' + ciudades[j].firstChild.nodeValue + '</a></li>';
				}
				txt += '</ul></div></div>';
			}
 	        
 	        document.getElementById('res').innerHTML = txt;
		}
 	};

 	httpRequest(peticionHttp, 'paises.xml');
}

function loadCiudades () {
	var peticionHttp = createHttp();
	
 	peticionHttp.onreadystatechange = function () {
 	    if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
 	        var xml                   = peticionHttp.responseXML;
 	        var rootxml               = xml.childNodes[0];
 	        var provinciaSeleccionada = document.getElementById('selProvincias').options[document.getElementById('selProvincias').selectedIndex].value;
			var provincias            = rootxml.getElementsByTagName('provincia');
			var numProvincias         = rootxml.getElementsByTagName('provincia').length;
			
			var idProvincia = 0;
 	    	for (var i = 0; i < numProvincias; i++) {
 	    		if (provincias[i].getElementsByTagName('nombre')[0].firstChild.nodeValue == provinciaSeleccionada) {
 	    			idProvincia = i;
 	    			break;
 	    		}
 	    	}
 	    	
 	    	var txt = '';
 	    	var nombreProvincia = provincias[idProvincia].getElementsByTagName('nombre')[0].firstChild.nodeValue;
 	    	var ciudades = provincias[idProvincia].getElementsByTagName('ciudad');
 	    	var numCiudades = provincias[idProvincia].getElementsByTagName('ciudad').length
 	    	
 	    	txt += '<div class="galeria pure-form pure-form-stacked" style="margin-top: 2.4em;"><label><select onchange="loadMap(this.value)">';
 	    	txt += '<option></option>';
 	    	for (var i = 0; i < numCiudades; i++) {
 	    		var nombreCiudad = ciudades[i].firstChild.nodeValue;
 	    		txt += '<option>' + nombreCiudad + '</option>';
 	    	}
 	    	txt += '</select></label></div>';
 	    	
 	    	document.getElementById('res').innerHTML = txt;
 	    }
 	};

 	httpRequest(peticionHttp, 'paises.xml');
}

// Google Maps API
function loadMap (ciudad) {
	new google.maps.Geocoder().geocode({ 'address': ciudad }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var map = new google.maps.Map(document.getElementById("googleMap"), {
				center : new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
				zoom : 14,
				region: ciudad,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			});
		}
	});
}

function searchProvincia (reqProvincia) {
	var peticionHttp = createHttp();
	
 	peticionHttp.onreadystatechange = function () {
 	    if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
 	        var xml           = peticionHttp.responseXML;
 	        var rootxml       = xml.childNodes[0];
 	        var provincias = rootxml.getElementsByTagName('provincia');

 	        var txt = '';
 	        for (var i = 0; i < provincias.length; i++) {
 	        	var provincia = provincias[i].getElementsByTagName('nombre')[0];
 	        	if (firstMayus(reqProvincia) == provincia.firstChild.nodeValue) {
					txt += '<div class="galeria"><div class="pure-menu pure-menu-open">';
 	        		txt += '<div class="pure-menu-heading">' + provincia.firstChild.nodeValue + '</div>';
 	        		txt += '<ul>';

 	        		var ciudades = provincias[i].getElementsByTagName('ciudad');
 	        		for (var j = 0; j < ciudades.length; j++) {
 	        			txt += '<li><a href="#">' + ciudades[j].firstChild.nodeValue + '</a></li>';
 	        		}
					txt += '</ul></div></div>';
 	        	}
 	        }
 	       
 	        document.getElementById('res').innerHTML = txt;
		}
 	};

 	httpRequest(peticionHttp, 'paises.xml');
}

function firstMayus (s) { return s.charAt(0).toUpperCase() + s.slice(1); }