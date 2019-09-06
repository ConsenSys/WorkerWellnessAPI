# Workers Rights API -- MVP v1.0
The following repository seeks to provide an open source solution that can be appended to ongoing worker wellness surveying efforts facilitated at manufacturing factories. The solution will need to accomplish the following:

1. Anonymization of survey responses: Employees’ identity and privacy will be protected.
2. Immutable Reporting: Self-reported employee data will be secure and free from external manipulation.
3. Data Accessibility: Stakeholders throughout the supply chain (including workers, factory managers and leadership, supplier companies, and retailers), and possibly predetermined external stakeholders, will be able to access survey results. This will empower workers, while providing the employer data to better serve workers’ needs.
4. Scalability: The solution will be designed in such a way that it can be scaled quickly beyond the retailer supply chain, making it possible for the survey to establish itself as a universal benchmark and communicate how businesses impact their employees’ well-being.

## Repository Breakdown
In this implementation, the survey will need to leverage the Qualtrics platform, which provides for Python and JAVA programming interfaces within their new survey response export API, and additionally provides support for R and NodeJS in their legacy v3 export API. The following repository, which is the MVP v1 iteration of the survey listener, will leverage the Python 3 (newest) Qualtrics API in an effort to address gaps in functionality that the newer API has yet to address.

The customized API will have two parts:

1. Survey Listener Service (SLS): An Python 3-based AWS Elastic Beanstalk service that watches for new survey responses being submitted, and upon recognizing new responses, makes a call to our Smart Contract API

2. Smart Contract API (SCA): A NodeJS-based Smart Contract API that, once it receives a POST call from the SLS, commits the data to the PostgreSql database and hashes the survey response to our smart contract. The SCA will be comprised of the following components

This repository fulfills the second part of the solution. The first part can be found here: https://github.com/ConsenSys/QualtricsSurveyListener

## Project structure

    .
    ├── SensuiMod                   # Contains the SensuiMod code, where both endpoints are built
    ├── smart-contracts             # SurveyMapping smart contract folder, including tests
    └── README.md

## Resources

```
RINKEBY ADDRESS: 0x54a42f060f244384ec9bf8cbfb786c60d4b084f0
KOVAN ADDRESS: 0xb43404c5f013F91041FAE7fcc208A13b129509EE

IAM User: workers-well-serverless

DB Instance Name: ***************
DB Name: ************
DB Port: ****
DB User/Password: ******/**********
DB Endpoint: workers-well-db.********.us-west-1.rds.amazonaws.com:****
```

## Running the project

### Smart contracts

In order to run and test the SurveyMapping smart contract, both `truffle` and `ganache` need to be installed

```code
   truffle compile
```
```code
   truffle migrate
```
```code
   truffle test
```

Truffle is already set-up to deploy to Rinkeby, by using the following command:

```code
    truffle migrate --reset --network "rinkeby"
```

### SensuiMod

Deploying SensuiMod into AWS

```code
    npm install -g serverless
```
```code
    serverless config credentials --provider aws --key **************** --secret ****************
```
```code    
    sls encrypt -n SECRETS:SEED -v "****************" -k **************** -s develop
```
```code    
    sls encrypt -n SECRETS:PG_URL -v postgresql://******:**********@workers-well-db.*************.us-west-1.rds.amazonaws.com:****/********** -k **************** -s develop
```
```code    
    serverless deploy
```
Unit testing SensuiMod locally
```code
    npm run test
```
Testing SensuiMod's endpoints, locally

* Register Survey
```code
    serverless invoke local --function registerSurvey -d '{"surveyId": "surveyId","report": "{\"name\":\"name\"}", "methodName": "RegisterSurvey","blockchain": "kovan"}'
```
* Return Hash
```code
    serverless invoke local --function returnHash -d '{"surveyId": "surveyId", "methodName": "ReturnHash","blockchain": "kovan"}'
```

## API Endpoints

### Root URL
 > https://*************.execute-api.us-west-1.amazonaws.com/develop/

----
### Register Survey

  Receives a survey, hashes it, and sends it to the smart contract mapping against the surveyId

* **URL**

  `/registerSurvey`

* **Method:**

  `POST`
  
*  **URL Params**
 
   `none`

*  **Authentication**
 
   `type:` AWS Signature <br />
   `Access key:` **************** <br />
   `Secret key:` ****************

* **Data Params**

  `surveyId` [string] <br />
  `report` [JSON] <br />
  `methodName` [string]  - in this case, this value should be `RegisterSurvey` <br />
  `blockchain` [string]

* **Success Response:**
  
```javascript
  {
    "status": "success",
    "data": "0xfb76b965269dfb249271059322c61e8107cd20da10fdb757eb85f8ca1cc9103d"
  }
```

* **Sample Call:**

```javascript
  { 
    "surveyId": "surveyId_5",
    "report": "{\"name\":\"name_5\"}",
    "methodName": "RegisterSurvey",
    "blockchain": "kovan"
  }
  ```

* **Notes:**

  Nothing to add here

----
### Return Hash

  Receives a surveyId and returns the corresponding survey hash

* **URL**

  `/returnHash`

* **Method:**

  `POST`
  
*  **URL Params**
 
   `none`

*  **Authentication**
 
   `type:` AWS Signature <br />
   `Access key:` **************** <br />
   `Secret key:` ****************

* **Data Params**

  `surveyId` [string] <br />
  `methodName` [string]  - in this case, this value should be `ReturnHash` <br />
  `blockchain` [string]

* **Success Response:**
  
```javascript
  {
    "status": "success",
    "data": "c38536972c4bed325d071d8071680d0ef7c2d2a561a448db51d806d21bf13a31"
  }
```

* **Sample Call:**

```javascript
  { 
    "surveyId": "surveyId_5",
    "methodName": "ReturnHash",
    "blockchain": "kovan"
  }
  ```

* **Notes:**

  Nothing to add here
----
