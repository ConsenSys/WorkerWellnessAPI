
var SurveyMapping = artifacts.require("./SurveyMapping.sol");

contract('SurveyMapping', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  const validHash = "valid-hash";
  const invalidHash = "invalid-hash";

  const validSurveryId = "SV_9soLp9xtDjAKP53";
  const invalidSurveyId = "SV_9soLp9xtDjAKP53";

  it("should add a new survey hash", async () => {
    const surveyMapping = await SurveyMapping.deployed();

    await surveyMapping.RegisterSurvey(validSurveryId, validHash, {from: owner});
    const hash = await surveyMapping.ReturnHash.call(validSurveryId);

    assert.notEqual(hash, "", "Should not be empty ");
  });

  it("should return a valid survey hash", async () => {
    const surveyMapping = await SurveyMapping.deployed();

    await surveyMapping.RegisterSurvey(validSurveryId, validHash, {from: owner});
    const hash = await surveyMapping.ReturnHash.call(validSurveryId);
    await surveyMapping.ReturnHash(validSurveryId, {from: owner});

    assert.equal(hash, validHash, "Should match hash");
  });

  it("should return a different survey hash", async () => {
    const surveyMapping = await SurveyMapping.deployed();

    await surveyMapping.RegisterSurvey(validSurveryId, invalidHash, {from: owner});
    const hash = await surveyMapping.ReturnHash.call(validSurveryId);
    await surveyMapping.ReturnHash(validSurveryId, {from: owner});

    assert.notEqual(hash, validHash, "Should not match hash");
  });

});