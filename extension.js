/************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/


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
	var data = appAPI.JSON.parse(urlObject);	// convert the retrived data back into an Object
	
	var obj = data[0];						// NEED TO CHANGE !

	// get the keys 
	var keys = Object.keys(obj);
	
	// get the values 
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
  Function: searchStoredData - get data stored by Name key 
  							  using Crossrider app
*************************************************************************************/
function searchStoredData(){ // search the NameStore 
	
	var input = document.getElementsByTagName("input"); 
	var storedItems = appAPI.db.getList(); // returns a list of key-pair values from local database
	var checkIfSearch = null;


	for(var i=0; i < input.length; i++){
		
		    for(var j=0; j<storedItems.length; j++) {
		    	// pattern match against stored data for any key with "search" or "q" - to be excluded, in order to prevent autofilling form search fields
		    	checkIfSearch = (storedItems[j].key).match(/search|q/i); // returns null if no match is found (i=ignore case)
		       
		        if((storedItems[j].key === input[i].getAttribute('id') || storedItems[j].key === input[i].getAttribute('name')) && checkIfSearch === null){	// check for a match against "id"     
		        
		        	if(typeof(storedItems[j].value) === 'object'){ // if the matching stored value is an object
			    		
			    		var storedValues = appAPI.JSON.stringify(storedItems[j].value);
			    		var regEx = /\s*,\s*/;						// look for 0 or more spaces, followed by a commma
						var valueList = storedValues.split(regEx);  // valueList is the array returned as a result of split()
						
				//		var data = appAPI.JSON.parse(valueList);
						
						var keys = Object.keys(valueList);
						
						alert("keys: " + keys);
			    		input[i].value = valueList.slice(0,1).pop();      // populate the field with the 1st value that was store
			    		// when the user clicks on the field, allow the user to select an alternative value, from valueList array
						
		    		}
		    		else{
		    			input[i].value = storedItems[j].value; 	
		    		}
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
/**************************************  TEXT  **************************************/
		if(input[i].getAttribute('type') === 'text'){					    		
			if(document.getElementById(input[i].getAttribute('id')) ){ 	// if an "id" value found  
				names[i] = input[i].getAttribute('id');
				values[i] = document.getElementById(input[i].getAttribute('id')).value;
			} else {													// else get the "name" value
		    	names[i] = input[i].getAttribute('name');
		    	values[i] = input[i].value;
			}
		}
/**************************************  EMAIL  **************************************/
		else if(input[i].getAttribute('type') === 'email'){						
			if(document.getElementById(input[i].getAttribute('id')) ){
				names[i] = input[i].getAttribute('id');
				values[i] = document.getElementById(input[i].getAttribute('id')).value;
			} else {
		    	names[i] = input[i].getAttribute('name');
		    	values[i] = input[i].value;
			}
		}
/**************************************  PASSWORD  ***********************************/
		else if(input[i].getAttribute('type') === 'password'){
			// Ask the user's permission before storing a password (alerts on submit button click)
			var popup = window.confirm("Would you like Form-Matic to store your password?");
			
			if(popup === true) {
				if(document.getElementById(input[i].getAttribute('id')) ){
					names[i] = input[i].getAttribute('id');
					values[i] = document.getElementById(input[i].getAttribute('id')).value;
				} else {
			    	names[i] = input[i].getAttribute('name');
			    	values[i] = input[i].value;
				}
			} // else do not store password 
		}
/***************************************  TEL  ***************************************/
		else if(input[i].getAttribute('type') === 'tel'){								
			if(document.getElementById(input[i].getAttribute('id')) ){
				names[i] = input[i].getAttribute('id');
				values[i] = document.getElementById(input[i].getAttribute('id')).value;
			} else {
		    	names[i] = input[i].getAttribute('name');
		    	values[i] =input[i].value;
			}
		}
/**************************************  URL   **************************************/
		else if(input[i].getAttribute('type') === 'url'){							
			if(document.getElementById(input[i].getAttribute('id')) ){
				names[i] = input[i].getAttribute('id');
				values[i] = document.getElementById(input[i].getAttribute('id')).value;
			} else {
		    	names[i] = input[i].getAttribute('name');
		    	values[i] = input[i].value;
			}
		}
		
		// Everytime a value exists (ie. value is not null)
		if( values[i] ){ 
			storeByName(names[i], values[i]); // Call Function to store all non-empty "name-value" pairs (one by one)
			
			obj[names[i]] = values[i];		  // Also, create a dict object
			urlData.push(obj);				  // and add the value, and corresponding name key to the urlData Array
		}
		
	} // end 'for' loop
		
	if(urlFound === true){	// ask user's premission before overwriting stored data
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
  Function: appAPI.ready() - runs on page load
  							 When form detected, call extractFormData function 
*************************************************************************************/
appAPI.ready(function($) { // The $ object is the extension's jQuery object

	var url = [location.protocol, '//', location.host, location.pathname].join('');
	var urlFound = false;	
	var form = document.getElementsByTagName("form");
	
	// if the page contains a form - check local database
	if(form){	
		appAPI.db.async.get(url, function(value) {
	        if(value === '[]'){			// check if url stored is empty
	        	urlFound = false;		// then take it not to be stored
	        }
	        else if(value !== null ){ 	// check if url already stored
	        	urlFound = true;
	        	
	        	// Retrieve all keys-value pairs from local database (urlStore)
	    		appAPI.db.async.getList(function(arrayOfItems) {
			        // Process the result
			        for(var i = 0; i < arrayOfItems.length; i++) {
			        	
			        	if(arrayOfItems[i].key === url){
			        		var urlData = arrayOfItems[i].value;
			        		matchURLdata(urlData);	// call function to match stored data with form fields
			        	}
			        }
			    });
	        	
	        }
	        else{						// if not, go to NameStore and check for any matches
	        	urlFound = false;
	        	searchStoredData();		// call function to search local database (NameStore)
	        }
		});
		
		
	// Search through form fields for data extraction, listening for a "submit" event
		for(var i=0; i < form.length; i++){
				form[i].addEventListener("submit", function(){
					extractFormData(url, urlFound);
				}, false);
		}
		
	}
	
		    
});
