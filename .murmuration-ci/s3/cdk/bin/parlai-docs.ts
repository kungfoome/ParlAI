#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3StaticSite } from '../lib/static-site';

const app = new cdk.App();
new S3StaticSite(app, 'ParlAIStaticSite', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});