COURSES

TUTORIALS


LOGIN

SIGN UP

Easy Node Authentication: Linking All Accounts Together

Chris Sevilleja

🕔 January 02, 2014
🏷️ #authentication #node.js
116 COMMENTS
83,545 VIEWS

This will be the final article in our Easy Node Authentication Series. We will be using all of the previous articles together.

Edit 11/18/2017: Updated to reflect Facebook API changes.

This article is part of our Easy Node Authentication series.

Table of Contents
 Linking Accounts Together
 What We'll Be Coding
 User Model Explanation
 Authenticating vs Authorizing
 Routes
 Updating Strategies
 Linking Accounts
 Linking Accounts Works!
 Unlinking Accounts
 Relinking Account After Unlinked
 Conclusion
Getting Started and Local Authentication
Facebook
Twitter
Google
Linking All Accounts Together
Upgrading for ExpressJS 4.0
# Linking Accounts Together
This article will combine all the different Node Passport Strategies so that a user will be able to have one account and link all their social networks together.

node-auth-login There are many changes that need to take place from the previous articles to accomplish this. Here are the main cases we have to account for when moving from authenticating with only 1 account versus multiple accounts.

Scenarios to Account For
Linking Accounts: Check if a user already exists in the database. If they do, then add a social account to their user profile
Account Creation: If a user does not exist in the database, then create a user profile
Unlinking: Unlinking social accounts
Reconnecting: If a user unlinked a social account, but wants to reconnect it
We'll be going through each of these scenarios and updating our previous code to account for them.

# What We'll Be Coding
We'll be working with the Local Strategy and the Facebook Strategy to demonstrate linking accounts. The tactics used for the Facebook Strategy will carry over to Twitter and Google.

In order to add linking accounts to our application, we will need to:

Update our Strategies
Add new routes
Update our views for linking and unlinking
node-auth-not-linked

# User Model Explanation
When looking at the way we set up our user model, we deliberately set up all the user accounts to be set up within their own object. This ensures that we can link and unlink different accounts as our user sees fit. Notice that the social accounts will use token and id while our local account will use email and password.

Related Course: Getting Started with JavaScript for Web Development
// app/models/user.js
...
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});
...

We have also added in email, name, displayName, and username for some accounts just to show that we can pull that information from the respective social connection.

Once a user has linked all their accounts together, they will have one user account in our database, with all of these fields full.

node-auth-profile-all-linked

# Authenticating vs Authorizing
When we originally made these Strategies, we would use passport.authenticate. This is what we should be using upon first authentication of our user. But what do we do if they are already logged in? They will be logged in and their user stored in session when we want to link them to their current account.

Luckily, Passport provides a way to "connect" a users account. They provide passport.authorize for users that are already authenticated. To read more on the usage, visit the Passport authorize docs.

We will update our routes to handle the authorization first, and then we'll update our Passport Strategies to handle the authorization.

# Routes
Let's create our routes first so that we can see how we link everything together. In the past articles, we created our routes for authentication. Let's create a second set of routes for authorization. Once we've done that, we'll change our Strategy to accommodate the new scenarios.

Our old routes will be commented to make a cleaner file.

// app/routes.js
module.exports = function(app, passport) {

// normal routes ===============================================================
    // show the home page (will also have our login links)
    // PROFILE SECTION =========================
    // LOGOUT ==============================

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        // process the login form

        // SIGNUP =================================
        // show the signup form
        // process the signup form

    // facebook -------------------------------
        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------
        // send to twitter to do the authentication
        // handle the callback after twitter has authenticated the user

    // google ---------------------------------
        // send to google to do the authentication
        // the callback after google has authenticated the user

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', {
          scope : ['public_profile', 'email']
        }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

As you can see, we have all the authentication routes and the routes to show our index and profile pages. Now we have added authorization routes which will look incredibly similar to our authentication routes.

With our newly created routes, let's update the Strategy so that our authorization routes are utilized.

# Updating Strategies
We will just update the Facebook and Local Strategies to get a feel for how we can accommodate all our different scenarios.

When using the passport.authorize route, our user that is stored in session (since they are already logged in) will be passed to the Strategy. We will make sure we change our code to account for that.

We're going to show the old Strategy and then the new Strategy. Read the comments to get a full understanding of the changes.

Old Facebook Strategy
// config/passport.js
...
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
...

Now we want the ability to authorize a user.

New Facebook Strategy

...
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });

    }));
...

Now we have accounted for linking an account if a user is already logged in. We still have the same functionality from before, now we just check if the user is logged in before we take action.

# Linking Accounts
Using this new code in our Strategy, we will create a new user if they are not already logged in, or we will add our Facebook credentials to our user if they are currently logged in and stored in session.

Other Strategies: The code for the Facebook Strategy will be the same for Twitter and Google. Just apply that code to both of those to get this working. We will also provide the full code so you can look at and reference.

Now that we have the routes that will pass our user to our new Facebook Strategy, let's make sure our UI lets our user use the newly created routes.

We will update our index.ejs and our profile.ejs to show all the login buttons on the home page, and all the accounts and link buttons on the profile page. Here is the full code for both with the important parts highlighted.

Home Page index.ejs

<!-- views/index.ejs -->
<!doctype html>
<html>
<head>
    <title>Node Authentication</title>
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">
    <style>
        body        { padding-top:80px; }
    </style>
</head>
<body>
<div class="container">

    <div class="jumbotron text-center">
        <h1><span class="fa fa-lock"></span> Node Authentication</h1>

        <p>Login or Register with:</p>

        <a href="/login" class="btn btn-default"><span class="fa fa-user"></span> Local Login</a>
        <a href="/signup" class="btn btn-default"><span class="fa fa-user"></span> Local Signup</a>
        <a href="/auth/facebook" class="btn btn-primary"><span class="fa fa-facebook"></span> Facebook</a>
        <a href="/auth/twitter" class="btn btn-info"><span class="fa fa-twitter"></span> Twitter</a>
        <a href="/auth/google" class="btn btn-danger"><span class="fa fa-google-plus"></span> Google+</a>
    </div>

</div>
</body>
</html>

node-auth-login

Profile Page profile.ejs
<!-- views/profile.ejs -->
<!doctype html>
<html>
<head>
    <title>Node Authentication</title>
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">
    <style>
        body        { padding-top:80px; word-wrap:break-word; }
    </style>
</head>
<body>
<div class="container">

    <div class="page-header text-center">
        <h1><span class="fa fa-anchor"></span> Profile Page</h1>
        <a href="/logout" class="btn btn-default btn-sm">Logout</a>
    </div>

    <div class="row">

        <!-- LOCAL INFORMATION -->
        <div class="col-sm-6">
            <div class="well">
                <h3><span class="fa fa-user"></span> Local</h3>

                <% if (user.local.email) { %>
                    <p>
                        <strong>id</strong>: <%= user._id %><br>
                        <strong>email</strong>: <%= user.local.email %><br>
                        <strong>password</strong>: <%= user.local.password %>
                    </p>

                    <a href="/unlink/local" class="btn btn-default">Unlink</a>
                <% } else { %>
                    <a href="/connect/local" class="btn btn-default">Connect Local</a>
                <% } %>

            </div>
        </div>

        <!-- FACEBOOK INFORMATION -->
        <div class="col-sm-6">
            <div class="well">
                <h3 class="text-primary"><span class="fa fa-facebook"></span> Facebook</h3>

                <!-- check if the user has this token (is the user authenticated with this social account) -->
                <% if (user.facebook.token) { %>
                    <p>
                        <strong>id</strong>: <%= user.facebook.id %><br>
                        <strong>token</strong>: <%= user.facebook.token %><br>
                        <strong>email</strong>: <%= user.facebook.email %><br>
                        <strong>name</strong>: <%= user.facebook.name %><br>
                    </p>

                    <a href="/unlink/facebook" class="btn btn-primary">Unlink</a>
                <% } else { %>
                    <a href="/connect/facebook" class="btn btn-primary">Connect Facebook</a>
                <% } %>

            </div>
        </div>
    </div>

    <div class="row">

        <!-- TWITTER INFORMATION -->
        <div class="col-sm-6">
            <div class="well">
                <h3 class="text-info"><span class="fa fa-twitter"></span> Twitter</h3>

                <!-- check if the user has this token (is the user authenticated with this social account) -->
                <% if (user.twitter.token) { %>
                    <p>
                        <strong>id</strong>: <%= user.twitter.id %><br>
                        <strong>token</strong>: <%= user.twitter.token %><br>
                        <strong>display name</strong>: <%= user.twitter.displayName %><br>
                        <strong>username</strong>: <%= user.twitter.username %>
                    </p>

                    <a href="/unlink/twitter" class="btn btn-info">Unlink</a>
                <% } else { %>
                    <a href="/connect/twitter" class="btn btn-info">Connect Twitter</a>
                <% } %>

            </div>
        </div>

        <!-- GOOGLE INFORMATION -->
        <div class="col-sm-6">
            <div class="well">
                <h3 class="text-danger"><span class="fa fa-google-plus"></span> Google+</h3>

                <!-- check if the user has this token (is the user authenticated with this social account) -->
                <% if (user.google.token) { %>
                    <p>
                        <strong>id</strong>: <%= user.google.id %><br>
                        <strong>token</strong>: <%= user.google.token %><br>
                        <strong>email</strong>: <%= user.google.email %><br>
                        <strong>name</strong>: <%= user.google.name %>
                    </p>

                    <a href="/unlink/google" class="btn btn-danger">Unlink</a>
                <% } else { %>
                    <a href="/connect/google" class="btn btn-danger">Connect Google</a>
                <% } %>

            </div>
        </div>
    </div>

</div>
</body>
</html>

node-auth-not-linked Now we will have the links to each of our login methods. Then after they have logged in with one, the profile will check which accounts are already linked and which are not.

If an account is not yet linked, it will show the Connect Button. If an account is already linked, then it our view will show the account information and the unlink button.

Remember that our user is passed to our profile view from the routes.js file.

Connecting Local
Our social accounts can easily be configured this way. The only problem currently is if a user wanted to connect a local account. The problem comes in because they will need to see a signup page to add their email and password.

We have already created a route to handle showing our new connection form (in our routes.js file: (app.get('connect/local'))). All we need to do is create the view that the route brings up.

Create a file in your views folder: views/connect-local.ejs.

<!-- views/connect-local.ejs -->
<!doctype html>
<html>
<head>
    <title>Node Authentication</title>
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">
    <style>
        body        { padding-top:80px; }
    </style>
</head>
<body>
<div class="container">
<div class="col-sm-6 col-sm-offset-3">

    <h1><span class="fa fa-user"></span> Add Local Account</h1>

    <% if (message.length > 0) { %>
        <div class="alert alert-danger"><%= message %></div>
    <% } %>

    <!-- LOGIN FORM -->
    <form action="/connect/local" method="post">
        <div class="form-group">
            <label>Email</label>
            <input type="text" class="form-control" name="email">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" name="password">
        </div>

        <button type="submit" class="btn btn-warning btn-lg">Add Local</button>
    </form>

    <hr>

    <p><a href="/profile">Go back to profile</a></p>

</div>
</div>
</body>
</html>

This will be look incredibly similar to our signup.ejs form. That's because it really is. We pretty much just changed out the verbiage and the action URL for the form.

Now when someone tries to connect a local account, they will be directed to this form, and then when submitted, they will be directed to our Local Strategy. That links the accounts!

# Linking Accounts Works!
With just those routes and the update to our Passport Strategies, our application can now link accounts together! Take a look at a user in our database that has all their accounts linked using Robomongo:

node-auth-all-database

# Unlinking Accounts
Linking accounts was easy. What about unlinking? Let's say a user no longer wants their Facebook account linked.

For our purposes, when a user wants to unlink an account, we will remove their token only. We will keep their id in the database just in case they realize their mistake of leaving and want to come back to join our application.

We can do this all in our routes file. You are welcome to create a controller and do all this logic there. Then you would just call the controller from the routes. For simplicity's sake, we'll throw that code directly into our routes.

Let's add our unlinking routes after our newly created authorization routes.

// app/routes.js
...

// normal routes
// authentication routes
// authorization routes

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });
...

In these routes, we just pull a user's information out of the request (session) and then remove the correct information. Since we already had created our links to these routes in profile.ejs, they will now work since we have created the routes finally.

Now you can link an account and unlink an account.

node-auth-not-linked When trying to unlink, we will have to do a little more configuration for that to work. Since the id is already stored in the database, we will have to plan for that scenario when a user links account that was already previously linked.

# Relinking Account After Unlinked
After a user is unlinked, their id still lives in the database. Therefore, when a user logs in or relinks an account, we have to check if their id exists in the database.

We will handle this in our Strategy. Let's add to our Facebook Strategy.


// config/passport.js
...
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        // just add our token and profile information
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = profile.emails[0].value;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });

    }));
...

Now just add that same code across the board to all of our Strategies and we have a an application that can register a user, link accounts, unlink accounts, and relink accounts!

Full Code
For those interested in seeing the entire code all together, make sure you check out the Github repo. Also, here are direct links to the two most important files:

routes.js
passport.js
# Conclusion
Hopefully we covered most of the cases that you'll run into when authenticating and authorizing users. Make sure to take a look at the full code and the demo to make sure that everything is working properly. If you see anything that raises questions, just let me know and be sure to go look at the full code for clarification!

Thanks for sticking with us throughout this entire series. We hope you enjoyed it. We'll be expanding on authentication further in the future by doing a Node and Angular authentication tutorial. Until then, happy authenticating!

This article is part of our Easy Node Authentication series.

Getting Started and Local Authentication
Facebook
Twitter
Google
Linking All Accounts Together
Upgrading for ExpressJS 4.0

Chris Sevilleja
173 posts
Founder of Scotch.io. Google Developer Expert in Web Technologies. Slapping the keyboard until something good happens.

Popular In the Community

CODE CHALLENGE #9: BUILD A SCROLL-SPY NAVBAR
Renato Lanziani
2 May
Here is my solutionwith in-view.js: https://codepen.io/renatolb/pen/BxRbRo with plain vanilla javascript (bonus): https://codepen.io/renatolb/pen/YLQdbN
PASSWORD STRENGTH METER IN REACT
CyanCone
8 May
Code is very unfriendly written
ORGANISABLE AND MAINTAINABLE SCSS FRAMEWORK
GreenScissors
5 May
Great article! Never thought before that we can have a framework for CSS aswell :)
MONGODB 3.6: JSON SCHEMA VALIDATION AND EXPRESSIVE QUERY SYNTAX
RedFlower
4d
I take it all the <span> tags in the code are accidental? e.g. VAT: <span class=hljs-number>0.20,
8 AWESOME NEW FEATURES IN SUBLIME TEXT 3.1
mihalmw
5d
Do you have information about full support Angular & Typescript? Auto import library? This is why i leave sublime..
ANNOUNCING THE BOOK ON SERVER SIDE RENDERING FOR REACT WITH NEXT.JS
OrangeGuitar
3d
Hey christian, i have followed all your code but for some reason next doesnt pick up my about.js page and gives me an error saying Client pings, but there's no entry for pages : about.jsThe page is there and is in the right location, why is it not finding it? Thank you
BUILD A SCROLL-SPY NAVBAR (SOLUTION TO CODE CHALLENGE #9)
Zammy13
7 May
I like the challenges you're doing. But I'm sorry to say that this is not a correct solution from the POV of the user. Your solution will highlight multiple items if the viewport is big enough which causes confusion. The user should be able to see where he currently is, and for that he needs only one active item.You could define a horizontal line where the active item changes (with inView its easiest to just use the bottom of the viewport as this line). Then you only need the enter event to highlight the new item and keep track of the last highlighted item to remove the highlight on it.
CONDITIONAL ROUTING WITH REACT ROUTER V4
GoldPizza
6d
Fixed. Thank you, Renato.
NODE API SCHEMA VALIDATION WITH JOI
OrangePlane
4d
https://zebros.in
CODE CHALLENGE #8: BUILD AN ANIMATED IMAGE SEARCH
M. Antonietta Perna
20 Apr
My vanilla JS solution: https://codepen.io/antonietta/pen/xjKQKe/
LIST PROCESSING WITH MAP, FILTER, AND REDUCE
Justyn Clark
16 Apr
Is that correct the third statement of the for loop ? Should it be: i = i + 1 ?
JSON SCHEMA VALIDATION AND EXPRESSIVE QUERY SYNTAX IN MONGODB 3.6
Hackolade
18 Apr
Great article! Thank you. If you want to generate the $jsonschema validator script without any prior JSON Schema knowledge, our data modeling tool for MongoDB lets you build your schema with a few mouse clicks. Check it out at https://hackolade.com
BUILD A VIDEO CHAT SERVICE WITH JAVASCRIPT, WEBRTC, AND OKTA
OrangeStrawberry
16 Apr
Extremely helpful demo and walk through. Do you have demo or tutorial of two people chatting over video but with a page where viewers can ONLY see and hear the chat? Perhaps even type into a chat window to make comments?
ADD LOADING INDICATORS TO YOUR VUE.JS APPLICATION
PurpleBowtie
22 Apr
Awesome thanks
ZERO TO DEPLOY: BUILD A DOCUMENTATION SYSTEM WITH VUE AND VUEPRESS
Titanio Verde
21 Apr
Well... I'm on Linux Mint (Ubuntu based) and I can't execute vuepress command. I'm not even sure if vuepress has been installed at all. I'm running the latest versions of nodejs and npm.Do anyone know any way to be sure if it's installed, or an alternative way to execute vuepress? It seems to be crucial for the next steps.Thank you beforehand.

💖 A side project brought to you from Las Vegas and DC by...
Chris Sevilleja

Nick Cerminara

Easiest Local Dev Environment
Get Started with Vue.js
scotch
Top shelf learning. Informative tutorials explaining the code and the choices behind it all.



Scotch
About
Authors
Contact
Shop
Community
Posts
Top Authors
Slack
Extras
Scotch Box
Angular v5+ Book
Sponsor Scotch
Display Advertising
FAQ
Privacy
Terms
Rules
Hosted by Digital Ocean
1853-2018 © Scotch.io, LLC. All Rights Super Duper Reserved.
 
