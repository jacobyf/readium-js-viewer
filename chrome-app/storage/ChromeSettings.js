//  Copyright (c) 2014 Readium Foundation and/or its licensees. All rights reserved.
//  
//  Redistribution and use in source and binary forms, with or without modification, 
//  are permitted provided that the following conditions are met:
//  1. Redistributions of source code must retain the above copyright notice, this 
//  list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice, 
//  this list of conditions and the following disclaimer in the documentation and/or 
//  other materials provided with the distribution.
//  3. Neither the name of the organization nor the names of its contributors may be 
//  used to endorse or promote products derived from this software without specific 
//  prior written permission.

define(['URIjs'],function(URI){


    //URI library doesn't handle correctly combination of "filesystem:chrome-extension:"
	// uri hack for filesystem urls. No other place to put it.
	var oldAbsoluteTo = URI.prototype.absoluteTo;
		//old;
	URI.prototype.absoluteTo = function(base){

        if (!(base instanceof URI)) {
			base = new URI(base);
		}

        if (base._parts.protocol == 'filesystem'){
            if (this._parts.protocol == 'filesystem'){
                return this.clone();
            }

            var retUri;

            //if we have both - filesystem: and chrome-extension:
            if(base._parts.path.indexOf("chrome-extension:") !== -1) {
                var tempURI = oldAbsoluteTo.call(this, base._parts.path);
                retUri = new URI('filesystem:' + tempURI.toString());
            }
            else {
                retUri = oldAbsoluteTo.call(this, base._parts.path);
            }

            return retUri;
        }
        else if (this._parts.protocol == 'filesystem'){
            return this.clone();
        }
        else{
            return oldAbsoluteTo.call(this, base);
        }
	};

	Settings = {
		put : function(key, val, callback){
			var obj = {};
			obj[key] = JSON.stringify(val);
			chrome.storage.local.set(obj, callback);
		},
		get : function(key, callback){
			chrome.storage.local.get(key, function(val){
				if (val[key]){
					callback(JSON.parse(val[key]));
				}
				else{
					callback(null);
				}
			});
		},
		getMultiple : function(keys, callback){
			chrome.storage.local.get(keys, function(val){
				callback(val);
			});
		}
	}
	return Settings;
})