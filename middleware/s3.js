const AWS = require('aws-sdk')
const s3 = new AWS.S3()
AWS.config.update({
  accessKeyId: 'id-omitted',
  secretAccessKey: 'key-omitted',
  region: 'us-east-1'
})

function generatePresignedUrl(filename) {
  const myBucket = 'methleague'
  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl('getObject', {
    Bucket: myBucket,
    Key: filename,
    Expires: signedUrlExpireSeconds
  })

  return url
}
