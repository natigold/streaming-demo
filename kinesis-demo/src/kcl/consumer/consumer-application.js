import kcl  from 'aws-kcl';
import util from 'util';
import { logger } from '../../util/logger.js';

const MAX_PROCESS_RECORDS = 10;

const recordProcessor = () => {
  const log = logger().getLogger('recordProcessor');
  let shardId;

  return {
    initialize: function(initializeInput, completeCallback) {
      shardId = initializeInput.shardId;

      completeCallback();
    },

    processRecords: function(processRecordsInput, completeCallback) {
      if (!processRecordsInput || !processRecordsInput.records) {
        completeCallback();
        return;
      }

      let records = processRecordsInput.records;
      let record, data, sequenceNumber, partitionKey;

      for (let i = 0 ; i < records.length && i < MAX_PROCESS_RECORDS ; ++i) {
        record = records[i];
        data = new Buffer.from(record.data, 'base64').toString();
        sequenceNumber = record.sequenceNumber;
        partitionKey = record.partitionKey;

        log.info(util.format('ShardID: %s, Record: %s, SeqenceNumber: %s, PartitionKey:%s', shardId, data, sequenceNumber, partitionKey));
      }

      if (!sequenceNumber) {
        completeCallback();
        return;
      }

      // If checkpointing, completeCallback should only be called once checkpoint is complete.
      processRecordsInput.checkpointer.checkpoint(sequenceNumber, function(err, sequenceNumber) {
        log.info(util.format('Checkpoint successful. ShardID: %s, SeqenceNumber: %s', shardId, sequenceNumber));
        completeCallback();
      });
    },

    leaseLost: function(leaseLostInput, completeCallback) {
      log.info(util.format('Lease was lost for ShardId: %s', shardId));
      completeCallback();
    },

    shardEnded: function(shardEndedInput, completeCallback) {
      log.info(util.format('ShardId: %s has ended. Will checkpoint now.', shardId));
      shardEndedInput.checkpointer.checkpoint(function(err) {
        completeCallback();
      });
    },

    shutdownRequested: function(shutdownRequestedInput, completeCallback) {
      shutdownRequestedInput.checkpointer.checkpoint(function (err) {
        completeCallback();
      });
    }
  };
}

kcl(recordProcessor()).run();