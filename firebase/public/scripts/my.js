
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

