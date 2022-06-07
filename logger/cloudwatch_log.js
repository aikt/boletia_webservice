const { Logger } = require('aws-cloudwatch-log')
require('dotenv').config()
const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: 'us-east-1',
    logGroupName: 'Boletia',
    logStreamName: '',
    uploadFreq: 3000,
    local:false
};

const addLogCloudwatch = (stream,message) => {
    config.logStreamName = "dev/"
    config.logStreamName = config.logStreamName+stream
    const logger = new Logger(config)
    const logResult = logger.log(message)
}

module.exports = {
    addLogCloudwatch
}
  