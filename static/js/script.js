/* ready function */
(function(){
	console.log('script read');
	bodyClicks();
})();
function editQuoReady(e) {
	if (e.which == 13 || e.keyCode == 13) {
		e.preventDefault();
		e.stopPropagation();
		e.target.blur();
	}
	return false;
}
function bodyClicks() {
	document.addEventListener('click', function(e) {
		var target = e.target;
		if (target.className) {
		 	var index = (" " + target.className + " ").replace(/[\n\t]/g, " ").indexOf(" j-edit-quo ");
		 	if (index < 0) {
		 		console.log('body click reset');
		 	}
		}
	});
}
function toggleAllCheckbox(_this) {
	var chkboxArr = document.querySelectorAll('.j-sel-quo');
	for(var i = 0; i < chkboxArr.length; i++) {
	  chkboxArr[i].checked = _this.checked;
	}
}
function handleSelAll() {
	var chkboxArr = document.querySelectorAll('.j-sel-quo');
	var counter = 0;
	for(var i = 0; i < chkboxArr.length; i++) {
		if (chkboxArr[i].checked == false) {
			document.querySelector('.j-sel-quo-all').checked = false;
			break;
		}
		counter++;
	}
	if (counter == chkboxArr.length) {
		document.querySelector('.j-sel-quo-all').checked = true;
	}
}
function toggleEditThis(_this) {
	if (_this.attributes.contenteditable.nodeValue == "false") {
		_this.attributes.contenteditable.nodeValue = true;
		_this.style.background = "aqua";
		_this.focus();
	}
}

function requestQuoDB(url, params, successCallback, errorCallback) {
	var http = new XMLHttpRequest();
	http.open("POST", url, true);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4) {
	    	if(http.status == 200) {
		    	console.log(' updated response -> ' + http.responseText);
		    	if (successCallback) successCallback();
	    	} else {
	    		console.log('Error -> ' + http.statusText);
	    		if (errorCallback) errorCallback();
	    	}
		}
	};
	http.send(params);
	console.log('params->', params);
}

/*function saveQuo() {
	var url = "saveQuotes";
	var _name = document.querySelector('.j-save-name');
	var _quote = document.querySelector('.j-save-quote');
	var params = "name=" + _name + "&quote=" + _quote;
	var successCallback = function() {
		window.location.reload();//better append data in ejs & render
	};
	var errorCallback = function() {
		//show error msg;
	};
	requestQuoDB(url, params, successCallback, errorCallback);
}*/


function delThis(_this) {
	var _id;
	if (_this.attributes.objid) {
		_id = _this.attributes.objid.value;
	}
	delQuo(_id);
}
function delSelected() {
	var selectedChkboxArr = document.querySelectorAll('.j-sel-quo:checked');
	for (var i = 0; i < selectedChkboxArr.length; i++) {
		delQuo(selectedChkboxArr[i].attributes.objid.value);
	}
}
function delQuo(_id) {
	var http = new XMLHttpRequest();
	var url = "deleteQuote";
	var params = "_id="+_id;
	var successCallback = function() {
		document.querySelector('.j-quote[objid="'+ _id +'"]').style.display = 'none';
	};
	var errorCallback = function() {
		//show error msg;
	};
	requestQuoDB(url, params, successCallback, errorCallback);
}

function resetEditQuo(_this) {
	_this.attributes.contenteditable.nodeValue = false;
	_this.style.background = "white";
	if (_this.innerHTML.length > 0 && _this.innerHTML  == _this.attributes.olddata.value) {
		return false;
	}
	//update
	console.log('modified');
	updateQuo(_this.attributes.objid.value);
}

function updateQuo(_objId) {
	var editLoader = document.querySelector('.j-edit-loader[objid="' + _objId + '"]');
	editLoader.style.display = 'block';
	var url = "updateQuote";
	var _name = document.querySelector('.j-edit-name[objid="' + _objId + '"]').textContent;
	var _quote = document.querySelector('.j-edit-quote[objid="' + _objId + '"]').textContent;
	var params = "_id=" + _objId + "&name=" + _name + "&quote=" + _quote;
	var successCallback = function() {
		var name = document.querySelector('.j-edit-name[objid="' + _objId + '"]');
		name.attributes.olddata.value = name.innerHTML;
		var quote = document.querySelector('.j-edit-quote[objid="' + _objId + '"]');
		quote.attributes.olddata.value = quote.innerHTML;
		editLoader.style.display = 'none';
	};
	var errorCallback = function() {
		var name = document.querySelector('.j-edit-name[objid="' + _objId + '"]');
		name.innerHTML = name.attributes.olddata.value;
		var quote = document.querySelector('.j-edit-quote[objid="' + _objId + '"]');
		quote.innerHTML = quote.attributes.olddata.value;
		editLoader.style.display = 'none';
	};
	requestQuoDB(url, params, successCallback, errorCallback);
}
function focusOn(_objId) {
	var characterName = document.querySelector('.j-edit-name[objid="' + _objId + '"]');
	characterName.click();//clicking makes it editable, that's why not used focus()
}

