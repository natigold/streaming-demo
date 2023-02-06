import AWS from 'aws-sdk';
import { config } from './config.js';

AWS.config.update({
    region: config.aws.region
});

const kinesis = new AWS.Kinesis({region : config.kinesis.region});

const params = {
  ShardId: config.singleShardStream.shardId,
  ShardIteratorType: config.singleShardStream.shardIteratorType,
  StreamName: config.singleShardStream.streamName
};

const getRecords = () => {
  // Get a shard iterator
  kinesis.getShardIterator(params, function(err, data) {
    console.log('shard', err, data);
    if (err) {
      console.log(err, err.stack);
    } else {
      const shardIterator = data.ShardIterator;

      // Use the shard iterator to read data from the shard
      const params = {
        ShardIterator: shardIterator,
        Limit: 10
      };

      kinesis.getRecords(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log(data);
          console.log(data.Records);
        }
      });
    }
  });
}

const sleep = async(ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

while(true) {
  getRecords();

  console.log("Waiting for records...");
  await sleep(1000);
}
