import * as cdk from 'aws-cdk-lib';
import {Fn, PhysicalName, RemovalPolicy, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {IFunctionUrl} from "aws-cdk-lib/aws-lambda";
import {
    AllowedMethods,
    CachePolicy,
    Distribution,
    OriginAccessIdentity,
    OriginProtocolPolicy,
    OriginRequestPolicy,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {HttpOrigin, S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {Bucket} from "aws-cdk-lib/aws-s3";

export interface CdnStackProps extends StackProps {
    originUrl: IFunctionUrl
}

export class CdnStack extends cdk.Stack {
    private distribution: Distribution;

    constructor(scope: Construct, id: string, props: CdnStackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'StaticBucket', {
            bucketName: PhysicalName.GENERATE_IF_NEEDED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            publicReadAccess: false
        })

        const originDomain = Fn.select(2, Fn.split('/', props.originUrl.url));
        this.distribution = new Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: new HttpOrigin(originDomain, {
                    protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
                }),
                originRequestPolicy: OriginRequestPolicy.fromOriginRequestPolicyId(this, 'OriginRequestPolicy', 'b689b0a8-53d0-40ab-baf2-68738e2966ac'),
                allowedMethods: AllowedMethods.ALLOW_ALL,
                cachePolicy: CachePolicy.CACHING_DISABLED,
                compress: true,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            additionalBehaviors: {
                'static/*': {
                    origin: new S3Origin(bucket, {
                        originAccessIdentity: new OriginAccessIdentity(this, 'OriginAccessIdentity')
                    }),
                    allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
                    cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                    compress: true
                }
            }
        })
    }
}
