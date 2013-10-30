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



# sample configuration with comments

    {
        "port": 8080         // integer, local proxy server port

        "logLevel": 1,       // integer. defaults to 0: 0=quiet, 1=log changed requests, 2=log all request

        "monochrome": false, // boolean, defaults to falsy

        "replaceWithFile": [ // array of rules
            {
                "from": "http://www.google.com/asd.js", // string, url to match to
                "to":   "/asd.js"                       // string, file to serve instead
                "mime": "text/javascript"               // optional string, to specify the mime type of not correctly asserted
            }
        ],
        "replaceWithUrl": [ // array of rules
            {
                "from": "http://www.asd.com/a.jpg", // string, url to match to
                "to":   "http://localhost/a.jpg"    // string, url to proxy instead
            }
        ]
    }
