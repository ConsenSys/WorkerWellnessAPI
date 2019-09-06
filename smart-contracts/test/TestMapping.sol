pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SurveyMapping.sol";

contract TestMapping {

    SurveyMapping surveyMapping = SurveyMapping(DeployedAddresses.SurveyMapping());
    string _hash = "survey-hash";

    function testRegisterSurvey() public {
        surveyMapping = new SurveyMapping();
        
        surveyMapping.RegisterSurvey("SV_9soLp9xtDjAKP53", _hash);

        Assert.notEqual(surveyMapping.ReturnHash("SV_9soLp9xtDjAKP53"), "", "Mapping is empty");
    }

    function testIsValidHash() public {
        Assert.equal(surveyMapping.ReturnHash("SV_9soLp9xtDjAKP53"), _hash, "The hash doesn't match");
    }
}