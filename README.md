      ___   _     _    
     / / \ \ \_/ \ \_/ 
     \_\_/ /_/ \  |_|  
    
    a http proxy to aid
    in web development



# feature set

* replace url by other url  (replaceWithUrl)
* replace url by local file (replaceWithFile)



# how to install

    [sudo] npm install -g oxy



# how to use

    oxy <path_to_config_file>



# configuring oxy

* `port`       - integer, local proxy server port

* `logLevel`   - integer. defaults to 0: 0=quiet, 1=log changed requests, 2=log all requests

* `monochrome` - boolean, defaults to falsy. if trueish, the logs are not colored

* `replaceWithFile` - array of rules.
    For each rule:
    * `from`   - string, url to match to
    * `string` - string, file to serve instead
    * `mime`   - optional string, to specify the mime type of not correctly asserted
    
* `replaceWithUrl` - array of rules.
    For each rule:
    * `from`   - string, url to match to
    * `string` - string, url to proxy instead
   
   
A sample configuration follows:
   
```javascript
{
    "port": 8080,

    "logLevel": 1,

    "monochrome": false,

    "replaceWithFile": [
        {
            "from": "http://www.google.com/asd.js",
            "to":   "/asd.js"
            "mime": "text/javascript"
        }
    ],
    "replaceWithUrl": [
        {
            "from": "http://www.asd.com/a.jpg",
            "to":   "http://localhost/a.jpg"
        }
    ]
}
```
