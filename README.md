# Study Tracker - Firebase login, sign up & quiz history setup

This is a renamed copy of the earlier project with one thing added:
you can now **create your own account** (Sign Up) instead of only logging
in with an account someone else made for you in the Firebase console.
Everything else - the tense pages, the quiz, the History page - works
exactly the same as before.

## 1. Create a Firebase project (if you haven't already)

1. Go to https://console.firebase.google.com and create a new project.
2. Inside the project, click "Add app" and choose the web icon (`</>`).
   Firebase will show you a config object with keys like `apiKey`,
   `authDomain`, etc.
3. Open `lib/firebaseclient.js` in this folder and paste your own values
   into the `firebaseConfig` object near the top.
4. In the Firebase console, go to **Authentication > Sign-in method** and
   enable **Email/Password**.

That's it for Authentication - you don't need to manually add a user
anymore, since the site can create one now through the Sign Up page.

## 2. Turn on Firestore (the database)

1. In the Firebase console, find **Firestore Database** in the sidebar
   (it may be under "Build").
2. Click **Create database**. Choose a location close to you, and start
   in **production mode** (we're supplying our own rules below anyway).
3. Once it's created, click the **Rules** tab.
4. Delete whatever is there and paste in the contents of
   `firestore.rules` from this folder, then click **Publish**.

These rules make sure a logged in user can only see and save *their own*
data - not anyone else's quiz scores or profile.

## 3. Run it with a local server (important)

Because `lib/firebaseclient.js` uses `import`, browsers will only load it
over `http://`, not by double-clicking the HTML file. In VS Code:

1. Install the **Live Server** extension (by Ritwick Dey).
2. Right-click `index.html` → **Open with Live Server**.

(Or run `python -m http.server` in this folder and visit
`http://localhost:8000` if you'd rather not install anything.)

## 4. Using it

- `signup.html` - create an account with an email and password (at least
  6 characters, Firebase's minimum). This also saves a small profile
  document for that user in Firestore.
- `index.html` - log in with an account you already made.
- Everything else (`home.html`, `tense.html`, `quiz.html`, `history.html`,
  `about.html`, `contact.html`) is unchanged from before.

## 5. What changed under the hood

- `lib/firebaseclient.js` - added `firebaseSignup(email, password)`,
  which creates the Firebase Auth account **and** writes a matching
  document to a `users` collection in Firestore (`{ email, createdAt }`).
- `signup.html` (new page) - the sign up form, with a link back to
  `index.html` to log in instead.
- `index.html` - now links to `signup.html` for people who don't have an
  account yet.
- `script.js` - added the submit handler for the sign up form, including
  checking the password is at least 6 characters and that the two
  password fields match.
- `firestore.rules` - added a `users` collection rule so each account can
  only create/read its own profile document.
- The tense list, examples, quiz questions, and quiz history all work
  exactly like the previous version - nothing about them changed.
