/***
Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
***/

export const config = {
  aws: {
    region : 'eu-west-1'
  },

  kinesis : {
    region : 'eu-west-1'
  },

  singleShardStream : {
    streamName : 'kinesis-demo-KinesisStreamSingle-TdXeW66aQijZ',
    shards : 1,
    waitBetweenDescribeCallsInSeconds : 5,
    shardId: 'shardId-000000000000',
    shardIteratorType: 'TRIM_HORIZON'
  }
};
