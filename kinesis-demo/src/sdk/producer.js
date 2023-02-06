import AWS from 'aws-sdk';
import { config } from './config.js';

AWS.config.update({
    region: config.aws.region
});

const kinesis = new AWS.Kinesis({region : config.kinesis.region});

const produceRecord = (partitionKey, record) => {

  const params = {
    StreamName: config.singleShardStream.streamName,
    Data: record,
    PartitionKey: String(partitionKey)
  };

  kinesis.putRecord(params, (err, data) => {
    if (err) {
        console.error(err);
        return err;
    }

    let data_string = JSON.stringify(record);
    console.log(`Record sent to Kinesis: ${data_string}, SEQ: ${data['SequenceNumber']}`);
  });
}

for (let i = 1000; i < 1100; i++) {
  let data = JSON.stringify({
    "key": i,
    "productName": "Test #7 for item: " + i
  });

  produceRecord(i, data);
}  

// write a Kinesis listener