/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Function:  		storeByName 
 *  
 * Parameters:		nameKey:String, value:String
 *
 * Description:
 *   This function is called to store data all non-empty form input fields in key-value pairs
 *   where the key is the id/name attribute value and the value stored is the value which 
 *   has been entered into the form input field.
 *   It checks if a value already exists for the key, if so, it appends the two values.
 *
 * Usage:
 *  - Every non-empty form input element is stored in this way.
 *  - Called from the extractFormData function 
 *    within a loop the length of the form, storing one record at a time.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */						  
function storeByName(nameKey, value){
	
	if(appAPI.db.get(nameKey) ){						
		var oldValue = appAPI.db.get(nameKey);
		var newValues = [oldValue, value];				
		
		if(oldValue.localeCompare(value)  !== 0 ){  	
			appAPI.db.set(nameKey, newValues);
		}
	}
	else{
		appAPI.db.set(nameKey, value);					
	}
	
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Function:  		storeByURL 
 *  
 * Parameters:		urlKey:String, urlData:Object
 * 
 * Description:
 *   This function is called to store all data from a form as one record
 *   where the key is the website url and the value is an object of key-pair values
 *
 * Usage:
 *  - Data is stored in this way only when the url has not been previously stored 
 *    or if the user chooses to overwrite previously stored data.
 *  - Useful when populating a previously submitted form
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */  
function storeByURL(urlKey, urlData){
	var size = Object.keys(urlData).length;

	if(size > 1){
		appAPI.db.async.set(urlKey, appAPI.JSON.stringify(urlData));
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Function:  matchURLdata 
 *  
 * Description:
 *   This function is called to get the all key-pair values which have been stored
 *   as one value (as an "object") where the key is the website url 
 *   and the value is an object of key-pair values.
 *   Each of the keys is compared to the id/name attribute value of the form,
 *   when a match is found, the stored value is output into the matching textbox.
 *
 * Usage:
 *  Data is output in this way when the user revisits a form that has been 
 *  previously subitted.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */  
function matchURLdata(urlObject){
	
	var input = document.getElementsByTagName("input"); 
	var data = appAPI.JSON.parse(urlObject);	
	var obj = data[0];							
	var keys = Object.keys(obj);
	
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Function:  		extractFormData 
 *
 * Parameters:		currentUrl:String, urlFound:Boolean
 *  
 * Description:
 *   This function is called to get all data that is input into a web form, as well as 
 *   the id/name attribute value given to each of the input elements.
 *
 * Usage:
 *   Called on page load when a page contains a form 
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
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
			var id = input[i].getAttribute('id');
			var name = input[i].getAttribute('name');
			
			if((appAPI.db.get(id) === null || appAPI.db.get(name) === null) && input[i].value !== ""){
		    	var popup = window.confirm("Would you like Form-Matic to store your password?");

				if(popup === true) {
					if( id  ){
						names[i] = id;
						values[i] = document.getElementById(input[i].getAttribute('id')).value;
					} else {
				    	names[i] = name;
				    	values[i] = input[i].value;
					}
				} 
			}
		}
		
		if(values[i]){ 
			storeByName(names[i], values[i]); 
			obj[names[i]] = values[i];		 
			urlData.push(obj);				  
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


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * appAPI.ready() 
 *
 * Description:
 *   Every extension that runs on every page, must have a single appAPI.ready method
 *  
 * Usage:
 *   Everything within this scope is run when the page's DOM is ready 
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
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
	var hasChanged = false;
	
	if(form){	
		appAPI.db.async.get(url, function(value){
	        if(value === '[]' || value === undefined){	
	        	urlFound = false;		
	        }
	        else if(value !== null ){ 	
	        	urlFound = true;
	    		appAPI.db.async.getList(function(arrayOfItems) {
			        for(var i = 0; i < arrayOfItems.length; i++) {
			        	if(arrayOfItems[i].key === url){
			        		var urlData = arrayOfItems[i].value;
			        		matchURLdata(urlData);	
			        	}
			        }
			    });
			    
				$('input').bind('change', function(e) {
					for(var i=0; i < form.length; i++){
						form[i].addEventListener("submit", function(){
							extractFormData(url, urlFound);
						}, false);
					} 
				}); 
	        }
	        else{					
	        	urlFound = false;
	        	searchStoredData();		
	        }
	        
	        if(urlFound === false){
				for(var i=0; i < form.length; i++){
					form[i].addEventListener("submit", function(){
						extractFormData(url, urlFound);
					}, false);
				} 
			}
	        
		});
	
	}
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Function:  		searchStoredData 
	 *  
	 * Description:
	 *   This function is called to search through all indiividually stored key-pair values
	 *
	 * Usage:
	 *   - Called when the url for the form has not been found, i.e. it's the first visit
	 *     to this form.
	 *   - Pattern matching used to exclude stored values for search input fields
	 *
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
	function searchStoredData(){   
			
		var input = document.getElementsByTagName("input"); 
		var storedItems = appAPI.db.getList(); 
		var excludeSearch = null;
	
		for(var i=0; i < input.length; i++){
			
		    for(var j=0; j<storedItems.length; j++) {
		    	// pattern match against stored data for any key with "search" or "q" - to be excluded, in order to prevent autofilling form search fields
		    	excludeSearch = (storedItems[j].key).match(/search|q/i); // returns null if no match is found 
		       
		        if((storedItems[j].key === input[i].getAttribute('id') || storedItems[j].key === input[i].getAttribute('name')) && excludeSearch === null){    
		        
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
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Function:  		appendOptions 
	 *
	 * Parameters:		arrayOfValues:Array, textBoxName:String, attributeType:String
	 *  
	 * Description:
	 *   This function is called when multiple values have been stored for a particular 
	 *   key. It allows the user to select which value to insert into the textbox.
	 *
	 * Usage:
	 *   - Called from searchStoredData, only if required
	 *   - Must be called on page load for jQuery dependancies
	 *
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
	function appendOptions(arrayOfValues, textBoxName, attributeType){
	
		if(attributeType === "id"){
			$("input[id*= " + textBoxName + "]").autocomplete({
			  autoFocus: true,
			  source: arrayOfValues,
			  minLength: 0,
			  scroll: true
			}).focus(function() {
			  	$(this).autocomplete("search", "");  
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
