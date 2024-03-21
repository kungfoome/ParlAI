import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_cloudfront as cf } from 'aws-cdk-lib';
import { aws_cloudfront_origins as cfo } from 'aws-cdk-lib';


export class S3StaticSite extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticSiteBucket = new s3.Bucket(this, 'parlaidocs', {
      versioned: true,
      accessControl: s3.BucketAccessControl.PRIVATE,
    });


    const originAccessIdentity = new cf.OriginAccessIdentity(this, 'OriginAccessIdentity');
    staticSiteBucket.grantRead(originAccessIdentity);

    new cf.Distribution(this, 'Distribution', {
        defaultRootObject: 'index.html',
        defaultBehavior: {
            origin: new cfo.S3Origin(staticSiteBucket, {originAccessIdentity}),
        },
    })
  }
}

