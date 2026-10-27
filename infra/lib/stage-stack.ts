import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cdk from 'aws-cdk-lib'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import type { Construct } from 'constructs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const account = '862330373376'

export interface StageProps extends cdk.StackProps {
  stageName: 'uat' | 'prod'
  hosts: string[]
  cdnHost: string
  zone: route53.IHostedZone
  github: iam.IOpenIdConnectProvider
  certificate?: cdk.aws_certificatemanager.ICertificate
}

export class StageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props)
    const { stageName, hosts, cdnHost, zone, github, certificate } = props

    const siteBucket = new s3.Bucket(this, 'Site', {
      bucketName: `ull-${stageName}-site-${account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    })
    const mediaBucket = new s3.Bucket(this, 'Media', {
      bucketName: `ull-${stageName}-media-${account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      versioned: true,
    })
    // Applicant documents, recordings and reports. Never behind CloudFront: the CMS checks access,
    // then hands out a 5-minute presigned link.
    const privateBucket = new s3.Bucket(this, 'Private', {
      bucketName: `ull-${stageName}-private-${account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
    const backupBucket = new s3.Bucket(this, 'Backup', {
      bucketName: `ull-${stageName}-backup-${account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      versioned: true,
      lifecycleRules: [{ expiration: cdk.Duration.days(30) }],
    })

    const repository = new ecr.Repository(this, 'Cms', {
      repositoryName: `ull-${stageName}`,
      imageScanOnPush: true,
      lifecycleRules: [{ maxImageCount: 10 }],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      emptyOnDelete: false,
    })

    const payloadSecret = new secretsmanager.Secret(this, 'PayloadSecret', {
      secretName: `ull/${stageName}/payload-secret`,
      generateSecretString: { excludePunctuation: true, passwordLength: 48 },
    })
    const postgresSecret = new secretsmanager.Secret(this, 'PostgresSecret', {
      secretName: `ull/${stageName}/postgres-password`,
      generateSecretString: { excludePunctuation: true, passwordLength: 32 },
    })
    const hookSecret = new secretsmanager.Secret(this, 'HookSecret', {
      secretName: `ull/${stageName}/deploy-hook-token`,
      description: 'Replace the generated value with a GitHub PAT (actions:write) so publishing a page rebuilds this stage.',
      generateSecretString: { excludePunctuation: true, passwordLength: 40 },
    })

    const role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')],
    })
    repository.grantPull(role)
    mediaBucket.grantReadWrite(role)
    privateBucket.grantReadWrite(role)
    backupBucket.grantPut(role)
    backupBucket.grantRead(role)
    payloadSecret.grantRead(role)
    postgresSecret.grantRead(role)
    hookSecret.grantRead(role)
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: [`arn:aws:ses:ap-south-1:${account}:identity/*`],
    }))

    const vpc = vpcOf(this)
    const securityGroup = new ec2.SecurityGroup(this, 'CmsSg', {
      vpc,
      description: `ULL ${stageName} CMS, reachable from CloudFront only`,
      allowAllOutbound: true,
    })
    securityGroup.addIngressRule(
      ec2.Peer.prefixList('pl-9aa247f3'),
      ec2.Port.tcp(3000),
      'CloudFront origin-facing prefix list',
    )

    const userData = ec2.UserData.forLinux()
    userData.addCommands(readFileSync(path.join(repoRoot, 'deploy/ec2-init.sh'), 'utf8').replace(/^#![^\n]*\n/, ''))

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      machineImage: ec2.MachineImage.latestAmazonLinux2023({ cpuType: ec2.AmazonLinuxCpuType.X86_64 }),
      securityGroup,
      role,
      userData,
      httpTokens: ec2.HttpTokens.REQUIRED,
      httpPutResponseHopLimit: 2,
      instanceName: `ull-${stageName}`,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(20, { encrypted: true, volumeType: ec2.EbsDeviceVolumeType.GP3 }),
        },
        {
          deviceName: '/dev/sdf',
          volume: ec2.BlockDeviceVolume.ebs(30, {
            encrypted: true,
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            deleteOnTermination: false,
          }),
        },
      ],
    })
    const eip = new ec2.CfnEIP(this, 'Eip', { domain: 'vpc' })
    new ec2.CfnEIPAssociation(this, 'EipAssoc', { allocationId: eip.attrAllocationId, instanceId: instance.instanceId })
    const originDomain = cdk.Fn.join('', [
      'ec2-',
      cdk.Fn.join('-', cdk.Fn.split('.', eip.attrPublicIp)),
      '.ap-south-1.compute.amazonaws.com',
    ])

    const pretty = new cloudfront.Function(this, 'PrettyUrls', {
      code: cloudfront.FunctionCode.fromFile({ filePath: path.join(repoRoot, 'deploy/cloudfront-function.js') }),
      runtime: cloudfront.FunctionRuntime.JS_1_0,
    })
    const cmsOrigin = new origins.HttpOrigin(originDomain, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      httpPort: 3000,
      readTimeout: cdk.Duration.seconds(60),
      keepaliveTimeout: cdk.Duration.seconds(60),
      customHeaders: { 'X-Forwarded-Proto': 'https' },
    })
    const apiBehavior: cloudfront.BehaviorOptions = {
      origin: cmsOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    }
    const siteCertificate = certificate
      ? { certificate, domainNames: hosts, minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021 }
      : {}
    const siteDistribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      ...siteCertificate,
      comment: `ULL ${stageName} site`,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [{ function: pretty, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
      },
      additionalBehaviors: {
        '/api/*': apiBehavior,
        '/admin*': apiBehavior,
        // Payload admin scripts. The public site publishes its own Next files under /_site.
        '/_next/*': apiBehavior,
      },
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: cdk.Duration.minutes(1) },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: cdk.Duration.minutes(1) },
      ],
    })

    const immutable = new cloudfront.ResponseHeadersPolicy(this, 'ImmutableMedia', {
      customHeadersBehavior: {
        customHeaders: [{ header: 'Cache-Control', value: 'public, max-age=31536000, immutable', override: true }],
      },
    })
    const cdnCertificate = certificate
      ? { certificate, domainNames: [cdnHost], minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021 }
      : {}
    const cdnDistribution = new cloudfront.Distribution(this, 'CdnDistribution', {
      ...cdnCertificate,
      comment: `ULL ${stageName} media`,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(mediaBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: immutable,
      },
    })

    const alias = new targets.CloudFrontTarget(siteDistribution)
    const cdnAlias = new targets.CloudFrontTarget(cdnDistribution)
    for (const host of hosts) {
      const recordName = host === 'ullindia.com' ? undefined : host.replace(/\.ullindia\.com$/, '')
      new route53.ARecord(this, `SiteA${recordName ?? 'Apex'}`, {
        zone,
        recordName,
        target: route53.RecordTarget.fromAlias(alias),
      })
      new route53.AaaaRecord(this, `SiteAaaa${recordName ?? 'Apex'}`, {
        zone,
        recordName,
        target: route53.RecordTarget.fromAlias(alias),
      })
    }
    const cdnRecord = cdnHost.replace(/\.ullindia\.com$/, '')
    new route53.ARecord(this, 'CdnA', { zone, recordName: cdnRecord, target: route53.RecordTarget.fromAlias(cdnAlias) })
    new route53.AaaaRecord(this, 'CdnAaaa', { zone, recordName: cdnRecord, target: route53.RecordTarget.fromAlias(cdnAlias) })

    const githubRole = new iam.Role(this, 'GitHubRole', {
      roleName: `ull-${stageName}-github`,
      assumedBy: new iam.WebIdentityPrincipal(github.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          'token.actions.githubusercontent.com:sub': `repo:elseifai/ull:ref:refs/heads/${stageName}`,
        },
      }),
    })
    repository.grantPullPush(githubRole)
    siteBucket.grantReadWrite(githubRole)
    mediaBucket.grantReadWrite(githubRole)
    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: ['cloudfront:CreateInvalidation'],
      resources: [
        `arn:aws:cloudfront::${account}:distribution/${siteDistribution.distributionId}`,
        `arn:aws:cloudfront::${account}:distribution/${cdnDistribution.distributionId}`,
      ],
    }))
    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: ['cloudformation:DescribeStacks'],
      resources: [cdk.Stack.of(this).stackId],
    }))
    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: ['ssm:SendCommand'],
      resources: [
        `arn:aws:ec2:ap-south-1:${account}:instance/${instance.instanceId}`,
        `arn:aws:ssm:ap-south-1:${account}:managed-instance/${instance.instanceId}`,
        'arn:aws:ssm:ap-south-1::document/AWS-RunShellScript',
      ],
    }))
    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: ['ssm:GetCommandInvocation', 'ssm:ListCommandInvocations'],
      resources: ['*'],
    }))

    const siteHost = certificate ? hosts[0] : siteDistribution.distributionDomainName
    const mediaHost = certificate ? cdnHost : cdnDistribution.distributionDomainName
    new cdk.CfnOutput(this, 'SiteBucketName', { value: siteBucket.bucketName })
    new cdk.CfnOutput(this, 'MediaBucketName', { value: mediaBucket.bucketName })
    new cdk.CfnOutput(this, 'PrivateBucketName', { value: privateBucket.bucketName })
    new cdk.CfnOutput(this, 'BackupBucketName', { value: backupBucket.bucketName })
    new cdk.CfnOutput(this, 'SiteDistributionId', { value: siteDistribution.distributionId })
    new cdk.CfnOutput(this, 'CdnDistributionId', { value: cdnDistribution.distributionId })
    new cdk.CfnOutput(this, 'SiteUrl', { value: `https://${siteHost}` })
    new cdk.CfnOutput(this, 'AltOrigin', {
      value: certificate ? `https://${siteDistribution.distributionDomainName}` : `https://${hosts[0]}`,
    })
    new cdk.CfnOutput(this, 'CdnHost', { value: mediaHost })
    new cdk.CfnOutput(this, 'InstanceId', { value: instance.instanceId })
    new cdk.CfnOutput(this, 'EcrRepositoryUri', { value: repository.repositoryUri })
    new cdk.CfnOutput(this, 'PayloadSecretArn', { value: payloadSecret.secretArn })
    new cdk.CfnOutput(this, 'PostgresSecretArn', { value: postgresSecret.secretArn })
    new cdk.CfnOutput(this, 'HookSecretArn', { value: hookSecret.secretArn })
    new cdk.CfnOutput(this, 'GithubRoleArn', { value: githubRole.roleArn })
  }
}

function vpcOf(scope: Construct) {
  return ec2.Vpc.fromVpcAttributes(scope, 'Vpc', {
    vpcId: 'vpc-0a0e05eb9d140c429',
    availabilityZones: ['ap-south-1a', 'ap-south-1b', 'ap-south-1c'],
    publicSubnetIds: [
      'subnet-04f56d9cd5e8c675f',
      'subnet-032442a9154755fb5',
      'subnet-05b8d70de55a52501',
    ],
  })
}
