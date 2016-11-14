var database = firebase.database();
var auth = firebase.auth();

function showlist() {
   // var mUId = firebase.auth().currentUser.uid;
    //var usersPostsRef = firebase.database().ref('user-posts/' + mUId);

    var d = new Date();
    var d1 = d.getDate();
    //var d2 = d.now();
    var d3 =d.toDateString();
    console.log(d3);
    var newdItem = document.createElement("A");
    var textdnode = document.createTextNode("d: " + d + '!!!, database'+ database
        + ', d1   ' +d1+ ', d3   '+ d3);
    newdItem.appendChild(textdnode);
    document.getElementById('datenow').appendChild(newdItem);

    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
        var accessToken = result.credential.accessToken;
        var newItem = document.createElement("A");
        var textnode = document.createTextNode("     accessToken: "+accessToken);
        newItem.appendChild(textnode);
        document.getElementById('datenow').appendChild(newItem);

    });

    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User signed in!
            var uid = user.uid;
            console.log(uid);
            document.getElementById('userids').innerText= uid;
        } else {
            // User logged
            var uid1 = 'not auth';
            auth.signInAnonymously();
            alert(user);
            alert(user.name);
            //document.getElementById('userids').appendChild(uid1);
        }
    });
/////end showlist()
}
///write data

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' ).set({
        userId: 'rqGjDIawe2SI6KMARsw3uS8RuzK2',
        username: 'Janos',
        email: 'man@gmail.com',
        profile_picture : ''
    });
    alert(name+email+imageUrl);
}
function oldgetdata() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log('user signed-in.', user);
            alert("Ви зайли й як користувач:"+ user)
            //document.getElementById('file').disabled = false;
        } else {
            console.log('There was no anonymous session. Creating a new anonymous user.');
            // Sign the user in anonymously since accessing Storage requires the user to be authorized.
            auth.signInAnonymously();
            alert("Ви зайли й як невідомий користувач");
            document.getElementById('asd2').innerHTML = '<h1>Ви зайли й як невідомий користувач</h1>'+ user;
        }
    });

    var mUId = firebase.auth().currentUser.uid;
    var usersPostsRef = firebase.database().ref();
    //var usersPostsRef = firebase.database().ref('user-posts/rqGjDIawe2SI6KMARsw3uS8RuzK2');
//
    usersPostsRef.on("value",
        function(snapshot) {
            console.log(snapshot.val());
        },
        function (errorObject){
            console.log("The read failed:"+errorObject.code)
        });
    usersPostsRef.on("child_added",
        function(snapshot ){//, prevChildKey){
            var newPost = snapshot.val();
            var newItem = document.createElement("A");
            var nbr = document.createElement("BR");
            newItem.setAttribute("href",newPost.body);
            var textnode = document.createTextNode("Скачати: "+newPost.title);
            newItem.appendChild(textnode);
            document.getElementById('nnn').appendChild(newItem);
            document.getElementById('nnn').appendChild(nbr);
        }
    );

}
