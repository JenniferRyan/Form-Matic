/************************************************************************************
  Function: storeByName - store all "name-value" pairs 
  							  
*************************************************************************************/
function storeByName(nameKey, value){
	if(appAPI.db.get(nameKey) ){						// check if there is a value already stored for this namekey
		var oldValue = appAPI.db.get(nameKey);
		var newValues = [oldValue, value];				// if so, append new value with old value(s)
		
		if(oldValue.localeCompare(value)  !== 0 ){  	// check the 2 values are not equal
			appAPI.db.set(nameKey, newValues);
		}
	}
	else{
		appAPI.db.set(nameKey, value);					// else nameKey not previously stored
	}
}

/************************************************************************************
  Function: storeByURL - store URL as key and all form data as one value (object)
  							  
*************************************************************************************/
function storeByURL(urlKey, urlDataArray){
	appAPI.db.async.set(urlKey, appAPI.JSON.stringify(urlDataArray));

}

/************************************************************************************
  Function: matchURLdata - take data stored for a URL and match with form fields
  							  
*************************************************************************************/
function matchURLdata(urlObject){
	
	var input = document.getElementsByTagName("input"); 
	var data = appAPI.JSON.parse(urlObject);	
	
	var obj = data[0];							//>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEED TO CHANGE !
	var keys = Object.keys(obj);
	
//	var values = Object.values(obj);  ---> experimental technology, not implemented yet
	for(var i = 0; i < keys.length; i++) {
	    
	    var key = keys[i];
	    var value = obj[keys[i]];
	    
	    for(var j=0; j < input.length; j++){
			if(input[j].getAttribute('id') === key || input[j].getAttribute('name') === key){
				input[j].value = value;
			}
		}
	}
}

/************************************************************************************
  Function: extractFormData - get form data 
  							  using Crossrider app
*************************************************************************************/
function extractFormData(current_url, urlFound){
	var input = document.getElementsByTagName("input"); 
	var names = [];
	var values = [];
 	var urlData = []; 
	var obj = {};
	
	for(var i=0; i < input.length; i++){
		
		var type = input[i].getAttribute('type');

		if(type === 'text' || type === 'email' || type === 'url' || type === 'tel'  ){					    		
			if(document.getElementById(input[i].getAttribute('id')) ){ 	
				names[i] = input[i].getAttribute('id');
				values[i] = document.getElementById(input[i].getAttribute('id')).value;
			} else {												
		    	names[i] = input[i].getAttribute('name');
		    	values[i] = input[i].value;
			}
		}
		else if(type === 'password'){
			// Ask the user's permission before storing a password 
			var popup = window.confirm("Would you like Form-Matic to store your password?");
			
			if(popup === true) {
				if(document.getElementById(input[i].getAttribute('id')) ){
					names[i] = input[i].getAttribute('id');
					values[i] = document.getElementById(input[i].getAttribute('id')).value;
				} else {
			    	names[i] = input[i].getAttribute('name');
			    	values[i] = input[i].value;
				}
			} 
		}
		
		if( values[i] ){ 
			storeByName(names[i], values[i]); // Call Function to store all non-empty "name-value" pairs (one by one)
			
			obj[names[i]] = values[i];		  // Also, create a dict object
			urlData.push(obj);				  // and add the value, and corresponding name key to the urlData Array
		}
	} 
	
	if(urlFound === true){	
		var confirm = window.confirm("Would you like Form-Matic to overwrite details previously stored for this website?");
		
		if(confirm === true) {
			storeByURL(current_url, urlData); 
		} 
	}
	else{
		storeByURL(current_url, urlData);
    }
}


/************************************************************************************
  Function: appAPI.ready() - anything within this scope, runs on page load
  							 
*************************************************************************************/
appAPI.ready(function($) { 

    appAPI.resources.jQuery('1.8.3');
    appAPI.resources.jQueryUI('1.9.2');
	appAPI.resources.includeCSS("jquery-ui.css");
	
	// Message listener to receive actions from the toolbar button popup menu
	appAPI.message.addListener(function(msg) {
		switch(msg.action) {
			case 'alert': 
				var confirm = window.confirm(msg.data); 
				if(confirm === true) {
					appAPI.db.removeAll(); 
					appAPI.db.async.removeAll(function(){
				        alert("Form-Matic\r\n" + " successfully removed all stored data");
				    });
				} 
				break;
			case 'info': 
				alert('Form-Matic Details:\r\n' + msg.data); 
				break;
			default: 
				alert('unknown request: ', msg.action);
		}
	});
	
    var url = [location.protocol, '//', location.host, location.pathname].join(''); 
	var urlFound = false;	
	var form = document.getElementsByTagName("form");
	
	if(form){	
		appAPI.db.async.get(url, function(value) {
	        if(value === '[]' || value === undefined){	
	        	urlFound = false;		
	        }
	        else if(value !== null ){ 	
	        	urlFound = true;
	        	// Retrieve all keys-value pairs from local database (urlStore)
	    		appAPI.db.async.getList(function(arrayOfItems) {
			        // Process the result
			        for(var i = 0; i < arrayOfItems.length; i++) {
			        	
			        	if(arrayOfItems[i].key === url){
			        		var urlData = arrayOfItems[i].value;
			        		matchURLdata(urlData);	
			        	}
			        }
			    });
	        	
	        }
	        else{					
	        	urlFound = false;
	        	searchStoredData();		// call function to search local database (NameStore)
	        }
		});
		
	
	
	// Search through form fields for data extraction, listening for a "submit" event
		for(var i=0; i < form.length; i++){
			
		/*	var hasChangedCount = 0;
			
			form[i].addEventListener("click", function(){
				hasChangedCount++;
			//	alert(hasChangedCount);
			}, false);
		*/
		
		//	if(hasChangedCount > 0){
		//		alert("true");
				form[i].addEventListener("submit", function(){
					extractFormData(url, urlFound);
				}, false);
		//	}
		}
		
	}
	
/************************************************************************************
	  Function: searchStoredData - get data stored by Name key 
	  							  using Crossrider app
*************************************************************************************/	
function searchStoredData(){   
		
	var input = document.getElementsByTagName("input"); 
	var storedItems = appAPI.db.getList(); // returns a list of key-pair values from local database
	var excludeSearch = null;

	for(var i=0; i < input.length; i++){
		
	    for(var j=0; j<storedItems.length; j++) {
	    	// pattern match against stored data for any key with "search" or "q" - to be excluded, in order to prevent autofilling form search fields
	    	excludeSearch = (storedItems[j].key).match(/search|q/i); // returns null if no match is found (i=ignore case)
	       
	        if((storedItems[j].key === input[i].getAttribute('id') || storedItems[j].key === input[i].getAttribute('name')) && excludeSearch === null){	// check for a match     
	        
	        	if(typeof(storedItems[j].value) === 'object'){ 
		    		
		    		var storedValues = appAPI.JSON.stringify(storedItems[j].value);
		    		var regEx = /\s*,\s*/;						
					var valueList = storedValues.split(regEx);  
					
					var arrayOfValues = appAPI.JSON.parse(valueList);
					var textBoxName="";
					var attributeType="";
					
					if(input[i].getAttribute('id')){
						textBoxName = input[i].getAttribute('id');
						attributeType="id";
					}
					else{
						textBoxName = input[i].getAttribute('name');
						attributeType="name";
					}
					appendOptions(arrayOfValues, textBoxName, attributeType); 
		    	
	    		}
	    		else{ 
	    			input[i].value = storedItems[j].value; 	
	    		}
	        }
	    } 
	} 
}
	
/************************************************************************************
  Function: appendOptions 
  						
*************************************************************************************/	
function appendOptions(arrayOfValues, textBoxName, attributeType){

	if(attributeType === "id"){
		$("input[id*= " + textBoxName + "]").autocomplete({
		  autoFocus: true,
		  source: arrayOfValues,
		  minLength: 0,
		  scroll: true
		}).focus(function() {
		  	$(this).autocomplete("search", "");  
        	//I moved the autoFocus option to be triggered here (inside the .Focus event (NOT WORKING!!!!)
        //	$("input[id*= " + textBoxName + "]").autocomplete({ autoFocus: true });
		});
	}
	else{
		$("input[name*= " + textBoxName + "]").autocomplete({
		  source: arrayOfValues,
		  minLength: 0,
		  scroll: true
		}).focus(function() {
		  $(this).autocomplete("search", ""); 
		});
	}
} 
		
		    
});