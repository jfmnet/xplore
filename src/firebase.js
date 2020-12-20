var firebaseapp = function (param) {
    let self = this;
    param = param || {};

    let firebaseConfig = {
        apiKey: "AIzaSyDsxu5ffr5_C9MB6Y1B4GJmmdzrw_5yh-0",
        authDomain: "ait-internship.firebaseapp.com",
        projectId: "ait-internship",
        storageBucket: "ait-internship.appspot.com",
        messagingSenderId: "595671583334",
        appId: "1:595671583334:web:7ac1e4305800cf14fdfba7",
        measurementId: "G-CV3D05MBS3"
    };

    //Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            self.user = user;
            if (param.onlogin)
                param.onlogin(user);
        } else {
            delete self.user;
        }
    });

    this.Show = function () {
        let form = new xplore.Form({
            text: "Login",
            id: "firebaseui-auth-container"
        });

        form.Show();

        let ui = new firebaseui.auth.AuthUI(firebase.auth());

        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
                    requireDisplayName: false
                },
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ]
        });

        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    };
};