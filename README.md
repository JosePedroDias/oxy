      ___   _     _    
     / / \ \ \_/ \ \_/ 
     \_\_/ /_/ \  |_|  
    
    an HTTP proxy to aid
    in web development



# feature set

* replace URL by other URL  (replaceWithUrl)
* replace URL by local file (replaceWithFile)



# notes

* this proxy doesn't handle HTTPS requests. if you have a simple solution for this I'd love to hear it.



# how to install

    [sudo] npm install -g oxy



# how to use

    oxy <path_to_config_file>



# configuring oxy

The configuration file isn't strict JSON any more.
It is now eval'ed so comments and functions can now be defined.

* `port`       - integer, local proxy server port

* `logLevel`   - integer. defaults to 0: 0=quiet, 1=log changed requests, 2=log all requests

* `monochrome` - boolean, defaults to falsy. if trueish, the logs are not colored

* `replaceWithFile` - array of rules. The first matched rule is applied. If none is applied, uses next plugin...
    For each rule:
    * `from`   - 1) string, url to match to OR 2) a function which receives(reqUrl, req) and which should return a path (string) if replace is to be done
    * `to`     - string, file to serve instead (optional if from is a function)
    * `mime`   - optional string, to specify the mime type if not correctly asserted. oxy uses a lookup table with a couple of common extensions and use the to url's extension to assert the mime type
    
* `replaceWithUrl` - array of rules. The first matched rule is applied...
    For each rule:
    * `from`   - 1) string, url to match to OR 2) a function which receives(reqUrl, req) and which should return a new url (string) if replace is to be done
    * `to`     - string, url to proxy instead (optional if from is a function)
   
   
A sample configuration follows:
   
```javascript
{
    port: 8080, // local proxy server port, defaulting to 8080

    logLevel: 1, //0=quiet, 1=log changed requests, 2=log all requests

    monochrome: false, // false is default. set true do disable console colors

    replaceWithFile: [
        { // regular replace url with local file
            from: "http://www.google.com/asd.js",
            to:   "/home/user/asd.js",
            mime: "text/javascript" // this is asserted automatically from the js extension on the to field
        },
        { // replace URL by local file if having extension...
            from: function(u) {
                var t = u.split('.');
                var ext = t.pop().toLowerCase();
                if (['jpeg', 'jpg', 'png', 'gif'].indexOf(ext) !== -1) {
                    return '/home/user/image.jpg';
                }
            }
        },
    ],
    replaceWithUrl: [
        { // regular replace URL with other URL
            from: "http://www.asd.com/a.jpg",
            to:   "http://localhost/a.jpg"
        },
        { // replaces URLs having text '/asd/', changing host 'x.com' to 'y.com'
            from: function(u) {
                if (u.indexOf('/asd/') === -1) { return; }
                return u.replace('x.com', 'y.com');
            }
        },
        { // replace URL if having extension...
            from: function(u) {
                var t = u.split('.');
                var ext = t.pop().toLowerCase();
                if (['jpeg', 'jpg', 'png', 'gif'].indexOf(ext) !== -1) {
                    return 'http://localhost/image.jpg';
                }
            }
        },
        { // log files not handled yet which have ext js
          from: function(u) {
            if (u.indexOf('.js') === -1) { return; }
            console.log(u);
          }
        }
    ]
}
```


# changelog

## 0.0.2 Monday, the 25th of November 2013

* changed config parsing from `JSON.parse` to strict `eval` (so comments and functions can be defined)
* the plugins now support `from` to be a function instead of a string
