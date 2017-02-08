
(function() {
    'use strict';
    //alert('I\'m running self' );
    //showlist();
    oldgetdata();
})();

var database = firebase.database();
var auth = firebase.auth();
auth.signInAnonymously();


function showlist() {
    var datatim = new Date().toDateString();
    console.log(datatim);
    var newdItem = document.createElement("A");
    var textdnode = document.createTextNode('data: ' + datatim);
    newdItem.appendChild(textdnode);
    document.getElementById('datenow').appendChild(newdItem);
}



function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('koristuvach/asdasd' ).set({
        userId: 'rqGjDIawe2SI6KMARsw3uS8RuzK2',
        username: 'Janos',
        email: 'man@gmail.com',
        profile_picture : ''
    });
    //alert(name+email+imageUrl);
}



function oldgetdata() {
    var database = firebase.database();
    var auth = firebase.auth();
    var usersPostsRef = firebase.database().ref().child('posts');
    auth.signInAnonymously();
    //var mUId = firebase.auth().currentUser.uid;
    //document.getElementById('asd2').innerHTML = '<h5>Ви зайли й як невідомий користувач</h5>'+mUId;
    usersPostsRef.on("value",
        function(snapshot) {
            console.log(snapshot.val());
        },
        function (errorObject){
            console.log("The read failed:"+errorObject.code);
        });
    usersPostsRef.on("child_added",
        function(snapshot ){
            //, prevChildKey){
            var newPost = snapshot.val();
            var newItem = document.createElement("A");
            var nbr = document.createElement("BR");
            var li = document.createElement("li");
            li.innerText = newPost.title;
            newItem.id = snapshot.key;//li.id = snapshot.key;
            newItem.setAttribute("href", newPost.body);
            var textnode = document.createTextNode(newPost.datetime+" - "+newPost.title);
            newItem.appendChild(textnode);
            document.getElementById('nnn').appendChild(newItem);
            document.getElementById('nnn').appendChild(nbr);
            //document.getElementById('ullist').appendChild(li);
        }
        ,
        function (errorObject){
            alert("The read failed:"+errorObject.code);
        }
    );
}


/***************************
 A SIMPLE PAGINATOR
 *************************/
function Paginator(ref, limit) {
    this.ref = ref;
    this.pageNumber = 0;
    this.limit = limit;
    this.lastPageNumber = null;
    this.currentSet = {};
}

Paginator.prototype = {
    nextPage: function (callback) {
        if( this.isLastPage() ) {
            callback(this.currentSet);
        }
        else {
            var lastKey = getLastKey(this.currentSet);
            // if there is no last key, we need to use undefined as priority
            var pri = lastKey ? null : undefined;
            this.ref.startAt(pri, lastKey)
                .limit(this.limit + (lastKey? 1 : 0))
                .once('value', this._process.bind(this, {
                    cb: callback,
                    dir: 'next',
                    key: lastKey
                }));
        }
    },

    prevPage: function (callback) {
        console.log('prevPage', this.isFirstPage(), this.pageNumber);
        if( this.isFirstPage() ) {
            callback(this.currentSet);
        }
        else {
            var firstKey = getFirstKey(this.currentSet);
            // if there is no last key, we need to use undefined as priority
            this.ref.endAt(null, firstKey)
                .limit(this.limit+1)
                .once('value', this._process.bind(this, {
                    cb: callback,
                    dir: 'prev',
                    key: firstKey
                }));
        }
    },

    isFirstPage: function () {
        return this.pageNumber === 1;
    },

    isLastPage: function () {
        return this.pageNumber === this.lastPageNumber;
    },

    _process: function (opts, snap) {
        var vals = snap.val(), len = size(vals);
        console.log('_process', opts, len, this.pageNumber, vals);
        if( len < this.limit ) {
            // if the next page returned some results, it becomes the last page
            // otherwise this one is
            this.lastPageNumber = this.pageNumber + (len > 0? 1 : 0);
        }
        if (len === 0) {
            // we don't know if this is the last page until
            // we try to fetch the next, so if the next is empty
            // then do not advance
            opts.cb(this.currentSet);
        }
        else {
            if (opts.dir === 'next') {
                this.pageNumber++;
                if (opts.key) {
                    dropFirst(vals);
                }
            } else {
                this.pageNumber--;
                if (opts.key) {
                    dropLast(vals);
                }
            }
            this.currentSet = vals;
            opts.cb(vals);
        }

    }
};

/***************************
 APPLICATION LOGIC
 *************************/
var fb = new Firebase('https://examples-sql-queries.firebaseio.com/widget');
var paginator = new Paginator(fb, 5);
moveForward();

$('#prev').click(moveBackward);
$('#next').click(moveForward);


/***************************
 DEMO UTILS (fluff)
 *************************/

function moveForward() {
    loading();
    paginator.nextPage(loaded);
}

function moveBackward() {
    loading();
    paginator.prevPage(loaded);
}

function loading() {
    $('button').prop('disabled', true);
}

function loaded(vals) {
    console.log('loaded', vals);
    var messages = map(vals, function (v, k) {
        return v.color + ' ' + v.shape + '<br />';
    });
    $('#prev').prop('disabled', paginator.isFirstPage());
    $('#next').prop('disabled', paginator.isLastPage());
    $('div').html(messages.length ? messages.join("\n") : '-no records-');
}

function getLastKey(obj) {
    var key;
    if (obj) {
        each(obj, function (v, k) {
            key = k;
        });
    }
    return key;
}

function getFirstKey(obj) {
    var key;
    if (obj) {
        each(obj, function (v, k) {
            key = k;
            return true;
        });
    }
    return key;
}

function dropFirst(obj) {
    if (obj) {
        delete obj[getFirstKey(obj)];
    }
    return obj;
}

function dropLast(obj) {
    if (obj) {
        delete obj[getLastKey(obj)];
    }
    return obj;
}

function map(obj, cb) {
    var out = [];
    each(obj, function (v, k) {
        out.push(cb(v, k));
    });
    return out;
}

function each(obj, cb) {
    if (obj) {
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                var res = cb(obj[k], k);
                if (res === true) {
                    break;
                }
            }
        }
    }
}

function size(obj) {
    var i = 0;
    each(obj, function () {
        i++;
    });
    return i;
}