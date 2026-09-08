import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.finding.deleteMany();
  await prisma.magicLinkToken.deleteMany();
  await prisma.engagement.deleteMany();
  await prisma.client.deleteMany();

  const acme = await prisma.client.create({
    data: {
      email: "dana@acmecorp.com",
      name: "Acme Corp",
      contactName: "Dana Whitfield",
      engagements: {
        create: {
          name: "Q3 External Network Pentest",
          target: "acmecorp.com",
          stage: "Report",
          liveRunPending: false,
          startedOn: new Date("2026-06-15"),
          findings: {
            create: [
              {
                title: "SQL injection in /api/invoices search parameter",
                severity: "Critical",
                cvss: 9.1,
                asset: "api.acmecorp.com",
                status: "open",
                discoveredOn: new Date("2026-06-22"),
              },
              {
                title: "Outdated TLS ciphers accepted on load balancer",
                severity: "Medium",
                cvss: 5.4,
                asset: "lb-prod-01.acmecorp.com",
                status: "verifying",
                discoveredOn: new Date("2026-06-24"),
              },
              {
                title: "Stored XSS in customer support ticket comments",
                severity: "High",
                cvss: 7.8,
                asset: "support.acmecorp.com",
                status: "open",
                discoveredOn: new Date("2026-06-25"),
              },
              {
                title: "Default credentials on internal Jenkins instance",
                severity: "Critical",
                cvss: 9.8,
                asset: "ci.internal.acmecorp.com",
                status: "fixed",
                discoveredOn: new Date("2026-06-18"),
              },
              {
                title: "Missing rate limiting on password reset endpoint",
                severity: "Low",
                cvss: 3.1,
                asset: "api.acmecorp.com",
                status: "open",
                discoveredOn: new Date("2026-06-27"),
              },
            ],
          },
        },
      },
    },
  });

  const northwind = await prisma.client.create({
    data: {
      email: "ravi@northwindlogistics.com",
      name: "Northwind Logistics",
      contactName: "Ravi Patel",
      engagements: {
        create: {
          name: "Cloud Infrastructure Security Audit",
          target: "northwindlogistics.com",
          stage: "Scan",
          liveRunPending: false,
          startedOn: new Date("2026-07-20"),
          findings: {
            create: [
              {
                title: "S3 bucket allows public list of shipment manifests",
                severity: "High",
                cvss: 7.5,
                asset: "nw-manifests-prod (S3)",
                status: "open",
                discoveredOn: new Date("2026-07-22"),
              },
              {
                title: "IAM role attached to EC2 grants excessive S3 write access",
                severity: "Medium",
                cvss: 6.0,
                asset: "ec2-fleet-tracker",
                status: "open",
                discoveredOn: new Date("2026-07-23"),
              },
              {
                title: "CloudTrail logging disabled in secondary region",
                severity: "Info",
                cvss: 2.0,
                asset: "aws-ap-southeast-1",
                status: "fixed",
                discoveredOn: new Date("2026-07-21"),
              },
            ],
          },
        },
      },
    },
  });

  console.log(`Seeded clients: ${acme.email}, ${northwind.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
