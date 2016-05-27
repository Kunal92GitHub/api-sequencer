$( document ).ready(function() {

    // Display some statistics about this computer, using node's os module.

    var os = require('os');
    var prettyBytes = require('pretty-bytes');
	var request = require('request');
	//var request = require('ajax-request');

    $('.stats').append('Number of cpu cores: <span>' + os.cpus().length + '</span>');
    $('.stats').append('Free memory: <span>' + prettyBytes(os.freemem())+ '</span>');
	
	var fs = require('fs');

	var outputFilename = 'myElectronApp.json';
	
	var requestObjArray = new Array();
	
	$('#apiCollection').append("<ul id='requestList'></ul>");
	
	/*$('#submit').click( function () {
		console.log('In submit --->'+JSON.stringify(requestObj))
		if(method == 'POST') {
		$.ajax({
			url: url,
			method: method,
			data: inputData,
			success: function(data)
			{
				console.log(data)
					$('#outputData').text(JSON.stringify(data));
			}
			});
		}
		else {
			$.ajax({
			url: url,
			method: method,
			success: function(data)
			{
				console.log(data)
					$('#outputData').text(JSON.stringify(data));
			}
			});
		}
		$('#addToCollection').show();
		$('#apiCollection').show();
    }); */
	
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
		
		fs.writeFile(outputFilename, JSON.stringify(requestObjArray, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to "+outputFilename);
			window.top.close();
		}
	}); 
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

			
				 /*success: function(data)
				{
					item.response = data;
					console.log(data)
					$('#outputData').text(JSON.stringify(data));
				} */
			});
		
		})
		
	});