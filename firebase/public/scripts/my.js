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
    var mUId = firebase.auth().currentUser.uid;
    var usersPostsRef = firebase.database().ref().child('posts');
    auth.signInAnonymously();
    document.getElementById('asd2').innerHTML = '<h5>Ви зайли й як невідомий користувач</h5>'+mUId;
    usersPostsRef.on("value",
        function(snapshot) {
            console.log(snapshot.val());
        },
        function (errorObject){
            console.log("The read failed:"+errorObject.code)
        });
    usersPostsRef.on("child_added",
        function(snapshot ){
            //, prevChildKey){
            var newPost = snapshot.val();
            var newItem = document.createElement("A");
            newItem.setAttribute("href", newPost.body);
            var textnode = document.createTextNode("Скачати: "+newPost.title);
            newItem.appendChild(textnode);
            document.getElementById('nnn').appendChild(newItem);

        }
    );

}
