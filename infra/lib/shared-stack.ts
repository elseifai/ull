import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export class SharedStack extends cdk.Stack {
  readonly zone: route53.PublicHostedZone
  readonly github: iam.OpenIdConnectProvider

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    this.zone = new route53.PublicHostedZone(this, 'Zone', { zoneName: 'ullindia.com' })

    // Copied from the Bluehost zone after the nameserver cutover. Inbound Gmail
    // uses the single current Google Workspace MX. Both site-verification values
    // stay: Search Console and the earlier Workspace verification.
    const mailTtl = cdk.Duration.minutes(5)
    new route53.MxRecord(this, 'GoogleMx', {
      zone: this.zone,
      ttl: mailTtl,
      values: [{ priority: 1, hostName: 'smtp.google.com' }],
    })
    new route53.TxtRecord(this, 'ApexTxt', {
      zone: this.zone,
      ttl: mailTtl,
      values: [
        'google-site-verification=wKsTORHPjPxxH6qXIeq4aB7Jy83ErGDrspUNjDyS5rw',
        'google-site-verification=VT4i7yDCZehDayljsmKRtORpYRHS7MC-qpJJ3h1ZTBo',
        'v=spf1 include:_spf.google.com ~all',
        'zoho-verification=zb41578846.zmverify.zoho.in',
      ],
    })
    new route53.TxtRecord(this, 'GoogleDkim', {
      zone: this.zone,
      recordName: 'google._domainkey',
      ttl: mailTtl,
      values: [
        'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFWCwizfXyruCcH4eOiPCOIF9b7hRj9b0fuNUl0kDWrGSj8FJysmLoNPRojntFsCMoC3neOkucSuYZ5pEc0gmgsx+3gm3j+aMTDzzll4kunE5InktSKDFAdgAqdJatPDf0vVxp9qLiuWx6Sb7k/bS0C/yMNgDwv7uKx4EnCJOR1QIDAQAB',
      ],
    })
    new route53.TxtRecord(this, 'Dmarc', {
      zone: this.zone,
      recordName: '_dmarc',
      ttl: mailTtl,
      values: ['v=DMARC1; p=none'],
    })
    this.github = new iam.OpenIdConnectProvider(this, 'GitHub', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: [
        '6938fd4d98bab03faadb97b34396831e3780aea1',
        '1c58a3a8518e8759bf075b76b750d4f2df264fcd',
      ],
    })

    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(',', this.zone.hostedZoneNameServers ?? []),
    })
  }
}
