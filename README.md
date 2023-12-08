# zk_cube_voting
A voting platform using 3 zk centric products: 1) Anon Aadhaar, 2) Semaphore Protocol and 3) Scroll.

## Why voting on Anon Aadhaar is unsafe?
Let's say the app_id of an application is *A*, PDF hash for person *P* is *H* and the corresponding nullifier is *N*. Person *P*'s hash remains the same always, so as long as the app_id is different across different applications, the nullifier's will be different.

If an attacker makes a new application with the same app_id *A*, the nullifier produced for *P* will be the same, i.e., *N*. If this malicious application links personally identifiable information to this transaction, person *P*'s usage of the previous application is disclosed (e.g. what *P* voted for).

## The solution
Using Anon Aadhaar, register on Semaphore. Semaphore Protocol allows anonymous signalling, only once per external nullifier. Thus, a user's application usage (e.g. their vote) cannot be tracked even if their nullifier is used to deanonimize them.