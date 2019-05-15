// create an s3 bucket on our minio container if it doesn't already exist
const retry = require('promise-retry')
const AWS = require('aws-sdk')

async function go() {
  const s3Client = new AWS.S3({
    endpoint: new AWS.Endpoint('http://localhost:9001'),
    s3ForcePathStyle: true,
    accessKeyId: 'b@dpass',
    secretAccessKey: 'r3alb@dpass'
  })
  const bucketNames = ['beautiful-portland-carousel-photos']
  await retry(
    tryAgain => ensureS3Ready(s3Client).catch(error => tryAgain(error)),
    { factor: 1 }
  )
  await Promise.all(bucketNames.map(async name => { createBucket(s3Client, name) } ))
}
  
async function ensureS3Ready(s3Client) {
  return s3Client.listBuckets().promise()
}
  
async function createBucket(s3Client, bucketName) {
  console.log(`creating bucket ${bucketName}`)
  return s3Client.createBucket({ Bucket: bucketName }).promise()
}
  
go()