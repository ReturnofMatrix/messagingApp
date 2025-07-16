# messagingApp
* post will be the first feature i will be building. 
    things involved in db of post.
    post has id, who created post, who liked post, who commented on post.
    time of creation, actual content.


core features 
1) Authorization
    here i will do first signup and then login. token saved in users browsers when user requests token is verified for authentication.
    i will use passport for passport for password encryption and passport token.

2) Sending messages to another user
    he can send message to any available message. 
    there will be list of people like whatsapp where user can select and send message which will be text only initially.

3) Customizing a user profile
    i can reset my password, change name, age, add bio, birthdays, hobbies.

BACKEND 
i will have 
1) post('/signup') 
    will send email, username, password, confirm password, bio, birthday, hobbies.
    bcrypt password.

2) post('/login')
    will authenticate username against password.
    and create json jwt token as cookies.

3) get('/home')
    will get all the signed up users of the app as a list to message.
    
4) get('/profile')
    will have all the data inserted during signup. and edit button to edit the data.

5) get('/message')
    once user chooses a receiver. message popup window will appear to type.

6) post('/message')
    after typing a text of message a user sends the text.

Database
    TABLES 
1) user -> id, email, username, bcrypted password, name, age, bio, birthday, hobbies.

2) message -> id, senderId, receiverId, messageContent, sentTime

//learned how to do authentication with passport, cookie, protecting routes. integration of frontend and backend. loved all the things about this project had mad mad fun.

