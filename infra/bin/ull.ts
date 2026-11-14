import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { SharedStack } from '../lib/shared-stack.ts'
import { StageStack } from '../lib/stage-stack.ts'

const app = new cdk.App()
const account = '862330373376'
const mumbai = { account, region: 'ap-south-1' }
const virginia = { account, region: 'us-east-1' }
const attach = app.node.tryGetContext('attachDomains') === true || app.node.tryGetContext('attachDomains') === 'true'

const shared = new SharedStack(app, 'UllShared', { env: mumbai, crossRegionReferences: true })

const stages = [
  { id: 'Uat', stageName: 'uat' as const, hosts: ['uat.ullindia.com'], cdnHost: 'cdn-uat.ullindia.com' },
  { id: 'Prod', stageName: 'prod' as const, hosts: ['ullindia.com', 'www.ullindia.com'], cdnHost: 'cdn.ullindia.com' },
]

for (const stage of stages) {
  let certificate: acm.ICertificate | undefined
  if (attach) {
    const names = [...stage.hosts, stage.cdnHost]
    const certStack = new cdk.Stack(app, `Ull${stage.id}Cert`, { env: virginia, crossRegionReferences: true })
    certificate = new acm.Certificate(certStack, 'Cert', {
      domainName: names[0],
      subjectAlternativeNames: names.slice(1),
      validation: acm.CertificateValidation.fromDns(shared.zone),
    })
  }
  new StageStack(app, `Ull${stage.id}`, {
    env: mumbai,
    crossRegionReferences: true,
    stageName: stage.stageName,
    hosts: stage.hosts,
    cdnHost: stage.cdnHost,
    zone: shared.zone,
    github: shared.github,
    certificate,
  })
}
