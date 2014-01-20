      ___   _     _    
     / / \ \ \_/ \ \_/ 
     \_\_/ /_/ \  |_|  
    
    an HTTP proxy to aid
    in web development



# feature set, implemented as plugins:

* replace URL with other URL  (replaceWithUrl)
* replace URL with local file (replaceWithFile)



# notes

This proxy doesn't handle HTTPS requests.  
If you have a simple solution for this I'd love to hear it.



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
    * `from`         - 1) string to match to OR 2) regexp to match to OR 3) a function which receives `(url, req)` and which should return a path (string) if replace is to be done
    * `to`           - string: file to serve instead (optional if `from` is a function). regexp match replaces `$1`, `$2` accordingly
    * `partialMatch` - if from is a string, partial matches are accepted and replaced (`from` partial match is replaced with `to`)
    * `mime`         - optional string: to specify the mime type if not correctly asserted. oxy uses a lookup table with a couple of common extensions and use the to url's extension to assert the mime type
    
* `replaceWithUrl` - array of rules. The first matched rule is applied...
    For each rule:
    * `from`         - 1) string to match to OR 2) regexp to match to OR 3) a function which receives `(url, req)` and which should return a new URL (string) if replace is to be done
    * `to`           - string, URL to proxy instead (optional if `from` is a function). regexp match replaces `$1`, `$2` accordingly
    * `partialMatch` - if from is a string, partial matches are accepted and replaced (`from` partial match is replaced with `to`)
   
   
A sample configuration follows:
   
```javascript
{
    port: 8080, // local proxy server port, defaulting to 8080

    logLevel: 1, //0=quiet, 1=log changed requests, 2=log all requests

    monochrome: false, // false is default. set true do disable console colors

    replaceWithFile: [
        { // regular replace URL with local file
            from: "http://www.google.com/asd.js",
            to:   "/home/user/asd.js",
            mime: "text/javascript" // this is asserted automatically from the js extension on the to field
        },
        { // regular replace URL with file (regexp)
            from: /http:\/\/aaa\.bbb\.com/,
            to:   '/home/user/clown.png'
        }
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
        { // regular URL replace (partial)
            from: 'http://aaa.com/Bundles/Video',
            to:   'http://localhost/Bundles/Video',
            partialMatch: true
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


# plugin interface

Everything in the `lib` folder besides `index.js` are plugins.

Plugins are loaded only if mentioned in the configuration (as keys).

A plugin is a function with the following interface:

`function(req, res, cfgAll, log, warn, error)`

`req` and `res` are respectively the request and response HTTP objects.  
`cfgAll` is the parsed JS for the loaded configuration file.  
`log`, `warn` and `error` are functions passed for sharing console output methods between plugins (this should be revised, kinda ugly).



# roadmap

* HTTPS support (would love this, even if simple passthru)

* reload configuration on change?

* refactor plugin interface

* DOM manipulation plugin? (haven't think this through because so far I didn't need this feature for my work)

* NOTICE: I may drop this project in favor of other similar project (such as nProxy or magicProxy), given it fulfills these objectives



# changelog

## 0.0.3 Monday, the 25th of November 2013

* support for regexps in `from`
* support for `partialMatch` with `from` strings


## 0.0.2 Monday, the 25th of November 2013

* changed config parsing from `JSON.parse` to strict `eval` (so comments and functions can be defined)
* the plugins now support `from` to be a function instead of a string
