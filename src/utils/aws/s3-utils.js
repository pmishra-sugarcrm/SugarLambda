/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/Resources/Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */
const AWS = require('aws-sdk');

/**
 * Get JSON uploaded to S3 based on the S3 trigger event
 *
 * @param {Object} event - S3 Trigger Event
 */
async function getJsonFromS3Event(event) {
    // get reference to S3 client
    const s3 = new AWS.S3();
    // Get our bucket and object key from the event
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    let params = {
        Bucket: srcBucket,
        Key: srcKey
    };
    console.log('fetching s3 bucket object\n', params);

    // Fetch object form S3
    const s3Object = await s3.getObject(params, function(err, data) {
        if (err) {
            console.log('error happened');
            console.log(err, err.stack);
        } else {
            return JSON.stringify(data.Body.toString('utf-8'));
        }
    }).promise();

    // Return JSON object
    return JSON.parse(s3Object.Body.toString('utf-8'));
}

module.exports = { getJsonFromS3Event };
