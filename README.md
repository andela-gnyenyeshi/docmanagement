######Circle CI : [![Circle CI](https://circleci.com/gh/andela-gnyenyeshi/docmanagement.svg?style=svg)](https://circleci.com/gh/andela-gnyenyeshi/docmanagement)

DOCUMENT MANAGEMENT SYSTEM
==========================

Document Management System is an application that helps users manage their documents in an organized way. A User can be able to upload a document, edit it and share it with other users. Aside from enabling users to properly document their work with regard to category, the application permits users to work collaboratively on documents.

Development
-----------
This application has been created using Nodejs environment and implementing [**Express**](http://expressjs.com/) as the routing framework and [**Mongoose**](http://mongoosejs.com/), an object modeling package, to interact with MongoDB. Authentication has been implemented using [**Passport**](http://passportjs.org/). For this version, only local strategy has been used.

Installation.
-------------
1. Install [**Nodejs**](www.nodejs.org) and [**MongoDB**](www.mongodb.org)
2. Clone this repo or download the zipped file.
3. Navigate to the master branch.
4. Run
    ```
    npm i

    ```
    This will install the required dependencies.
5. Run
  ```
  gulp

  ```
and enjoy.

Testing.
--------
This application has been tested using [**supertest**](https://www.npmjs.com/package/supertest), which is a Super-agent driven library for testing Node.js HTTP servers using a fluent API and [**Mocha**](https://mochajs.org), which is a feature-rich JavaScript test framework running on Node.js and the browser, making asynchronous testing simple and fun.

circleci tests: [![Circle CI](https://circleci.com/gh/andela-gnyenyeshi/docmanagement.svg?style=svg)](https://circleci.com/gh/andela-gnyenyeshi/docmanagement)
