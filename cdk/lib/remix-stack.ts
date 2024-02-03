import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {FunctionUrl, FunctionUrlAuthType, Runtime} from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";

export class RemixStack extends cdk.Stack {
  public handler: NodejsFunction
  public url: FunctionUrl;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.handler = new NodejsFunction(this, 'Handler', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../server.index.ts'),
      bundling: {
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return ['npm run build'];
          },
          beforeInstall(inputDir: string, outputDir: string): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [];
          }
        }
      }
    });

    this.url = this.handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE
    })
  }
}
