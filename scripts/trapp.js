var tree;

var time = document.getElementById("time");

function insertObservation()
{
	var survey = "TCD Cricket Ground";
	var date = document.getElementById('time').innerHTML;
	var testnotes = document.getElementById('note').value;
	
	var error = "";	
	
	if(date == ""){error += "The date of the observation is not valid<br/>";}
	if(latlon == ""){error += "The GPS location of the observation is not valid<br/>";}
	if(tree == ""){error += "Please select a tree<br/>";}
	
	var pictureUpload = document.getElementById("getPict");	
	var image = pictureUpload.files[0];
	if(!image){error += "Please take a photo of the tree<br/>";}
	
	if(error != "")
	{
		document.getElementById("error").style.visibility="visible";
		document.getElementById("error").innerHTML = error;
		return;
	}
	else
	{
		insert(survey, latlon, date, tree, uploadPictureToGoogle(), testnotes);
		alert("You have inserted your observation of a " + tree + " tree into the observation database.");
		reset();
	}
}

function uploadPictureToGoogle()
{
	var pictureUpload = document.getElementById("getPict");	
	var image = pictureUpload.files[0];
	var accessToken = gapi.auth.getToken().access_token;
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
				});
	guid = guid + ".jpg";
				
	var gmetadata = {
		'title': guid,
		'parents':[{"id":"0B-Vf057173DDNmNvc05sbkVudUU"}]
	}
	
	var uploader = new MediaUploader(
	{
		file: image,
		token: accessToken,
		url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable',
		metadata: gmetadata,
		
	});
	uploader.upload();
	
	return "http://googledrive.com/host/0B-Vf057173DDNmNvc05sbkVudUU/" + guid;
}


function getTrees()
{
	var leafShape, buds, stemColour, fruitType, fruitColour;
	var allTrees = loadTrees();
	var filteredTrees = new Array();
	var slides = document.getElementById("slides");	
	var slidesHTML = "";
	
	leafShape = document.getElementById("leafShape").options[document.getElementById("leafShape").selectedIndex].text;
	buds = document.getElementById("buds").options[document.getElementById("buds").selectedIndex].text;
	fruitType = document.getElementById("fruitType").options[document.getElementById("fruitType").selectedIndex].text;
	fruitColour = document.getElementById("fruitColour").options[document.getElementById("fruitColour").selectedIndex].text;
	
	if(leafShape == '-Leaf Shape' || leafShape == 'N/A'){ leafShape = "";}
	if(buds == '-Buds' || buds == 'N/A'){ buds = "";}
	if(fruitType == '-Fruit Type' || fruitType == 'N/A'){ fruitType = "";}
	if(fruitColour == '-Fruit Colour' || fruitColour == 'N/A'){ fruitColour = "";}
	
	for(var i = 0; i < allTrees.length; i++)
	{
		if(	(leafShape == "" || allTrees[i].leafshape == leafShape)
			&& (buds == "" || allTrees[i].buds == buds)
			&& (fruitType == "" || allTrees[i].fruittype == fruitType)
			&& (fruitColour == "" || allTrees[i].fruitcolor == fruitColour))
		{
			filteredTrees.push(allTrees[i]);
		}
	}	
	
	filteredTrees.sort(compare);
	
	for(var i = 0; i < filteredTrees.length; i++)
	{
		slidesHTML += "<li><img src='images/trees/" + filteredTrees[i].photo + "'/><p>" + filteredTrees[i].name + "</p></li>";
	}

	if(slidesHTML == "")
		slidesHTML = "<li><p>No Trees Match Your Filter Selection</p></li>";
	
	slides.innerHTML = "";
	$('.flexslider').removeData("flexslider");				
						
	slides.innerHTML = slidesHTML;
	flexInit();
	
}

function compare(a,b) 
{
	if (a.name < b.name)
		return -1;
	if (a.name > b.name)
		return 1;
	return 0;
}

function flexInit() 
{
	$('.flexslider').flexslider({
	animationLoop: false,
	animation: "fade",
	slideshow: false,
	controlNav: false,
	after: function(slider){setSelectedTree();},
	start: function(slider){setSelectedTree();}
	});
}
//this remove flexslider form element dataset



function setSelectedTree()
{
	var save = document.getElementById("upload-button");
	var currentSlide = $('.flexslider').data('flexslider').currentSlide + 1;
	var treeName = $(".flexslider li:nth-child(" + currentSlide + ") p").text();
	
	tree = treeName;
	save.value = ""; //seems to not clesar otherwise
	save.value = "Register " + treeName;
	
	document.getElementById("error").style.visibility="hidden";
}


function getPicture()
{
	$('#getPict').show();
	$('#getPict').focus();
	$('#getPict').click();
	$('#getPict').hide();
}

function reset()
{
	var fileDisplayArea = document.getElementById("pict");
	fileDisplayArea.innerHTML = "<img src='images/shutter.png'/>";
	var pictureUpload = document.getElementById("getPict");	
	pictureUpload.files[0] = "";
	document.getElementById("error").style.visibility="hidden";
}

function loadPicture()
{
	var pictureUpload = document.getElementById("getPict");	
	var file = pictureUpload.files[0];
	var fileDisplayArea = document.getElementById("pict");
	var imageType = /image.*/;

	if (file.type.match(imageType)) 
	{
	  var reader = new FileReader();

	  reader.onload = function(e) 
	  {
		fileDisplayArea.innerHTML = "";

		// Create a new image.
		var img = new Image();
		// Set the img src property using the data URL.
		img.src = reader.result;
		img.height = "200";
		img.width = "300";

		// Add the image to the page.
		fileDisplayArea.appendChild(img);
	  }

	  reader.readAsDataURL(file); 
	} 
	else 
	{
	  fileDisplayArea.innerHTML = "File not supported!";
	}
}

function getTime()
{
	var now     = new Date(); 
	var year    = now.getFullYear();
	var month   = now.getMonth()+1; 
	var day     = now.getDate();
	var hour    = now.getHours();
	var minute  = now.getMinutes();
	var second  = now.getSeconds(); 
	if(month.toString().length == 1) {
		var month = '0'+month;
	}
	if(day.toString().length == 1) {
		var day = '0'+day;
	}   
	if(hour.toString().length == 1) {
		var hour = '0'+hour;
	}
	if(minute.toString().length == 1) {
		var minute = '0'+minute;
	}
	if(second.toString().length == 1) {
		var second = '0'+second;
	}   
	var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
	time.innerHTML = dateTime;
	time = dateTime;
	
	setTimeout("getTime()",1000);
}

