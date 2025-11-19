commit 74ebfdd64fdbb8fc08a64d30d1a6a09db22ef4b4 (HEAD -> main)
Date:   Tue Nov 18 19:17:33 2025 +0530
    Added the real time messaging feature with the help of socket.io

commit 28cef526820e92b28a0c83f57123dba4fe514a06 (origin/main, origin/HEAD)
Date:   Mon Aug 25 15:56:49 2025 +0530
    changed the backend service from render to railway

commit f1b2ded2a624aa7fdf9326557f2279d1b0b7ca62
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Mon Aug 25 14:59:10 2025 +0530
    changed the token system previous passport session to jwt token.Pushed the local db to the neon db.  

commit b920cd628c79bbbc5425e6a41b6c0f61a7c73ed8
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Fri Aug 22 11:48:22 2025 +0530

    Added the extra functionality to passport session with connect-pg-simple where it will persist the session id in session table all of the manipulations where automatic. previous authentication used to fail because session data used to stored in ram of server.

commit 6aa6fcb52469fabfff8060740e6e7f1c803b48a3
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Thu Aug 21 11:25:46 2025 +0530

    dint add https:// to the vercel domain added that.added the domain name to the cors.removed the exposed neon db link from file.i updates the .env files in server and client to switch between the production and development modes.

commit 811e84697542c166cc90c66e846a6c69662a7d25
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Tue Aug 19 16:13:43 2025 +0530

    Added the backend render server link to the fetch in the components to fetch.

commit 63cfe2972e37afcec746ba1fb748ed36bb602ba1
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Tue Aug 19 13:49:35 2025 +0530

    Made the media file [post images and profile pics] to be stored on cloudinary platform. make ui optimization to create post and update profile pic by storing the image in context and using that to show in preview till the actual image is getting uploaded in the background. when image upload is successfull the whole ui is updated with actually stored links.

commit 0b4f8905a95fe61d71e4727fb51f2979b8df0492
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Sat Aug 2 20:40:42 2025 +0530

    made edit profile to update image. with the use of multer. messaging is allowed only with if both are friends.profile will have user posts as well. i have made seperate sections for my friends, friend requests to me, friend requests i have sent. all based on pending and accepted status in friends table.

commit 154566d6a223365356046c163a32638f18ede1a9
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Thu Jul 24 11:55:06 2025 +0530

    post is the home index page where user can see his and his followings post in asc timing order. if clicked on comments post is shown in detail. with all the comments, likes count. comment and likes function logic is written in seperate util file and used in post and single component.

commit 585fd8a4dd2c83a1ab6b83e6d72499b5ccf7558a
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Wed Jul 16 12:33:44 2025 +0530

    create, getAll and delele routes are built for posts, comments and likes. add, accept and reject friend is like the instagram request format, so i have built a friends table and pending and accepted attribute to determine the friend or not status. getIndexpage will get all the posts of the user and its friends based on the created at in ascending order.

commit f8b4c951374ab50a447f2f8ede9738f66d55fba1
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Thu Jul 10 15:22:32 2025 +0530

    Had lot of fun coding react frontend and integrating frontend and backend. but most of the css is done by chatgpt i dint really put much of thought to it. i really focused on core functionality for this project.

commit 989c6ffc9677f05b0598d6391a367c1b0231fa99
Author: ReturnofMatrix <roshanbhogan007@gmail.com>
Date:   Fri Jul 4 12:19:45 2025 +0530

    Revised how to do authentication with passport-local strategy and coocie setting with express-session built /signup and /login routes.

commit 66b64feae787f5a785b4b6a4331191d0146d7c87
Date:   Wed Jul 2 10:36:13 2025 +0530