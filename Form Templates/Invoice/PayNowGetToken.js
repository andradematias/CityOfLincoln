const request = require('request');

const querystring = require('querystring');

const logger = require('../log');

module.exports.getCredentials = function () {
    var options = {};
    options.customerAlias = "CityofLincoln";
    options.databaseAlias = "Main";
    options.userId = "749b9853-911f-428f-8ee2-9b04cb4a103f";
    options.password = "E1hZjVT+bNS8epZYKiHcXzFH/b4BsN1OZ7krjZEvkiE=";
    options.clientId = "749b9853-911f-428f-8ee2-9b04cb4a103f";
    options.clientSecret = "E1hZjVT+bNS8epZYKiHcXzFH/b4BsN1OZ7krjZEvkiE=";
    return options;
};


//PRODUCTION
const payPalUrl = 'https://payflowpro.paypal.com';
const payPaylHost = 'payflowpro.paypal.com';
const payPalVendor = 'BSLicense';
const payPalUser = 'VisualVaultAPI';
const payPalPassword = '$Licenses7521';
const payFlowLinkUrl = 'https://payflowlink.paypal.com?';

//SANDBOX
// const payPalUrl = 'https://pilot-payflowpro.paypal.com';
// const payPaylHost = 'pilot-payflowpro.paypal.com';
// const payPalVendor = 'visualvault1';
// const payPalUser = 'vvpaypalapi';
// const payPalPassword = '5Idh8ijjNUX';
// const payFlowLinkUrl = 'https://pilot-payflowlink.paypal.com?';

const GenerateTokenId = () => {
    return Math.random().toString(36).slice(2);
}

var logTraceToken = GenerateTokenId();
var logUrl;

module.exports.main = async function (ffCollection, vvClient, response) {
    /*Script Name: PayNowGetToken
    Customer: City of Lincoln
    Purpose: Builds the redirect token to use with PayPal / merchant services for credit card and ACH transactions
    Parameters:
            REVISIONID: form revision id
            Amount: payment amount (as string)
            Type: either 'ACH' or 'CC'
    Psuedo code: 
    Date of Dev: 07/22/2019
    Last Rev Date: 09/16/2019
    Revision Notes:
        07/22/2019 - JM - Initial release
        09/26/2019 - Kendra Austin: Update PayPal credentials to production account. 
    */

    try {

        logUrl = `${vvClient.getBaseUrl()}/CityofLincoln/Main`;

        logger.info(`${logUrl} TraceToken:${logTraceToken} PayNowGetToken Start`);

        let fieldValues = await validateAndSanitizeFormFields(ffCollection);

        let queryString = await buildQueryString(fieldValues.revisionId, fieldValues.amount, fieldValues.type, fieldValues.redirectUrl);

        let tokenData = await getToken(queryString, fieldValues.revisionId);

        return response.json(200, [
            'Success',
            tokenData
        ]);
    }
    catch (error) {
        logger.info(error.message);

        return response.json(200, [
            'Error',
            error.message
        ]);
    }
}

const buildQueryString = (revisionId, amount, type, redirectUrl) => {

    let data = {
        PARTNER: 'PayPal',
        VENDOR: payPalVendor,
        USER: payPalUser,
        PWD: payPalPassword,
        TRXTYPE: 'S',
        AMT: amount,
        CREATESECURETOKEN: 'Y',
        SECURETOKENID: GenerateTokenId(),
        URLMETHOD: 'GET',
        USER1: revisionId,
        USER2: '2',
        USER3: '1234',
        USER4: '2019-08-28',
        VERBOSITY: 'HIGH',
        SILENTTRAN: 'TRUE'
    };

    if (type === 'ACH') {
        data.TENDER = 'A';
        data.AUTHTYPE = 'WEB';
        data.SILENTTRAN = 'TRUE';
    } else {
        data.TENDER = 'C';
    }

    let qs = querystring.stringify(data);

    qs += '&RETURNURL[' + redirectUrl.length + ']=' + redirectUrl;
    qs += '&ERRORURL[' + redirectUrl.length + ']=' + redirectUrl;
    qs += '&CANCELURL[' + redirectUrl.length + ']=' + redirectUrl;

    return qs;
}

const getToken = async (qs, revisionId) => {
    let tokenResponse = await makeUrlEncodedPostRequest(qs, revisionId);

    let tokenData = {
        SECURETOKENID: tokenResponse.SECURETOKENID,
        SECURETOKEN: tokenResponse.SECURETOKEN,
        PAYMENTURL: payFlowLinkUrl
    }

    return tokenData;
}

//////////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////////

const validateAndSanitizeFormFields = (ffCollection) => {
    const validateFormFieldExists = (fieldName, prettyName) => {
        if (ffCollection.getFormFieldByName(fieldName) && ffCollection.getFormFieldByName(fieldName).value) {
            return ffCollection.getFormFieldByName(fieldName).value;
        }
        else {
            throw new Error(prettyName + ' required.');
        }
    }

    const validateExistsAndNumberOverZero = (fieldName, prettyName) => {
        if (ffCollection.getFormFieldByName(fieldName) && ffCollection.getFormFieldByName(fieldName).value) {
            if (isNaN(ffCollection.getFormFieldByName(fieldName).value)) {
                throw new Error(prettyName + ' is not a number');
            }
            else {
                return ffCollection.getFormFieldByName(fieldName).value;
            }
        }
        else {
            throw new Error(prettyName + ' required.');
        }
    }

    const validateFormFieldIsValidOption = (fieldName, prettyName, validOptions) => {
        if (ffCollection.getFormFieldByName(fieldName) && ffCollection.getFormFieldByName(fieldName).value) {
            if (validOptions.includes(ffCollection.getFormFieldByName(fieldName).value)) {
                return ffCollection.getFormFieldByName(fieldName).value
            }
            else {
                throw new Error(prettyName + ' is not valid');
            }
        }
        else {
            throw new Error(prettyName + ' required.');
        }
    }

    let values = {
        //siteId: validateFormFieldExists('SITEID', 'Site id'),
        revisionId: validateFormFieldExists('REVISIONID', 'Revision id'),
        amount: validateExistsAndNumberOverZero('Amount', 'Payment amount'),
        type: validateFormFieldIsValidOption('Payment Method', 'Payment type', ['ACH', 'Credit Card']),
        redirectUrl: validateFormFieldExists('RedirectURL', 'Redirect URL')
        //recordId: validateFormFieldExists('RECORDID', 'Record id')
    }

    return Promise.resolve(values);
}

const makeUrlEncodedPostRequest = (qs, revisionId) => {
    return new Promise((resolve, reject) => {

        let requestId = revisionId.replace(/\D/g, '');

        var requestHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-VPS-REQUEST-ID': `${requestId}`,
            'Content-Length': `${qs.length}`,
            'Content-Type': 'text/name value',
            'Host': `${payPaylHost}`
        };

        logger.info(`${logUrl} TraceToken:${logTraceToken} ${payPalUrl} post url:${payPalUrl} body:${qs.replace(payPalPassword, 'redacted')} headers:${requestHeaders.toString()}`);

        request.post(
            {
                url: payPalUrl,
                headers: requestHeaders,
                body: qs
            },
            (error, response, body) => {
                if (error) {
                    logger.info(`${logUrl} TraceToken:${logTraceToken} ${payPalUrl} response code: ${response} error: ${error}`);
                    reject(error);
                }
                else {
                    let resultData = querystring.parse(body);
                    logger.info(`${logUrl} TraceToken:${logTraceToken} ${payPalUrl} response body: ${body}`);
                    resolve(resultData);
                }
            }
        )
    });
}