# Isabelle Bot
## v3

It's been a while, the Discord API has changed a lot, and I have a strong urge to try and do programming again. Let's tackle it slowly, piece by piece.

# TODO
- [x] Bring her back online (or at least the test bot)
- [x] Basic functionality and then some
    - [x] Bring back simple commands (/hug and /caw)
- [x] Add /help to list commands
- [x] Logs in logs channel
    - [x] Log edited and deleted posts
    - [x] Safely show edited and deleted posts that contain a link (for safety don't allow it to keep the link clickable)
    - [x] For images make it only show `There was an image` as to not save the image in case someone uploads something embarrassing
- [ ] Reading challenge stuff
    - [x] Track when user leaves their star
        - [x] Set up database
    - [x] Find way to show progress (streaks, highest streak per user, etc)
        - [ ] Add flashier way to show leaderboard (possibly with `@napi-rs/canvas`)
    - [ ] Add reminder for users to post their stars (optional)
    - [x] ~~Find way to allow a user to post a star from previous day if they forget~~ (might be too difficult)
- [ ] Set up machine to host Isabelle Bot on
- [ ] Deploy Isabelle Bot back to the wild
- [ ] Work on bringing in the "fun" commands again (if requested)
- [ ] ~~Dadbot~~
    - [ ] ~~Practice dark arts to reanimate Dadbot once again so he can rule the lands~~