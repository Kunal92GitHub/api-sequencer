/* const remote = require('electron').remote;
	
document.getElementById("max-btn").addEventListener("click", function (e) {
   var appWindow = remote.getCurrentWindow();
   if (!appWindow.isMaximized()) {
	   appWindow.maximize();          
   } else {
	   appWindow.unmaximize();
   }
});

document.getElementById("close-btn").addEventListener("click", function (e) {
   var appWindow = remote.getCurrentWindow();
   appWindow.close();
}); */

$( document ).ready(function() {
	
	const remote = require('electron').remote;
	var appWindow = remote.getCurrentWindow();
	
	var request = require('request');
	var fs = require('fs');

	var outputFilename = './tmp/collected-apis.json';
	
	var requestObjArray = new Array();
	
	$('#apiCollection').append("<ul id='requestList'></ul>");
	
	$('#addToCollection').click( function() {
		
		var url = $('#serviceUrl').val(),
			method = $('#methodName :selected').text(),
			inputData = $('#inputData').val(),
			requestObj = {
				url: url,
				method: method,
				data: inputData,
				response: null
			};
			
		requestObjArray.push(requestObj);
		
	  $("#requestList").append("<li>"+requestObj.method + ":" + requestObj.url+"</li>");
	});
	
	$('#closeBtn').click( function() {
		console.log('Writting to file: '+outputFilename);
		fs.writeFile(outputFilename, JSON.stringify(requestObjArray, null, 4), function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("JSON saved to "+outputFilename);
				window.top.close();
			}
		});
	});
	
	$('#fullscreenBtn').click( function() {
		if (!appWindow.isMaximized()) {
			appWindow.maximize();
			$('#fullscreenExitBtn').removeClass('hidden');
			$(this).addClass('hidden');
		} else {
			console.log('The window is in maximized mode.');
		}
	});
	
	$('#fullscreenExitBtn').click( function() {
		if (appWindow.isMaximized()) {
			appWindow.unmaximize();
			$('#fullscreenBtn').removeClass('hidden');
			$(this).addClass('hidden');
		} else {
			console.log('The window is in unmaximized mode.'); 
		}
	});
	
	$('#buildBtn').click( function() {
		if (!appWindow.webContents.isDevToolsOpened()) {
			appWindow.webContents.openDevTools();
		}
	});
	
	$('#sendBtn').click( function() {
		
		$('#progressBar').removeClass('el-loading-done').addClass("el-loading");
		$('#responseData').html('');
		setTimeout(function() {
			$('#progressBar').addClass("el-loading-done");
			$('#responseData').html('<p>Response Data<br><small>This is the expected behavior from a web service call. Once the requested server responds, this will be used to show the content.</small></p>');
		}, 2000);
	});
	
	$(".dropdown-menu li a").click(function(){
		$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="icon margin-left-sm">keyboard_arrow_down</span>');
		$(this).parents(".dropdown").find('.btn').val($(this).data('value'));
	});
	
	$('#runCollection').click( function() {
		console.log('Inside run method')
		$.each(requestObjArray, function(index, item) {
			
			console.log(item.url);
		
			var options ={
				url: item.url,
				method: item.method,
				body: item.data
			}
		request(options, function (error, response, body) {
		  if (error) throw new Error(error);

		  $('#outputData').text(JSON.stringify(response));;
		});

			});
		
		})
		
	});