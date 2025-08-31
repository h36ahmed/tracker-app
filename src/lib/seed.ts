import { prisma } from "./prisma";

const sampleProjects = [
  {
    name: "Crypto Wallet V2",
    slackChannelId: "C1234567890",
    vertical: "CRYPTO",
    description: "Next-generation crypto wallet with DeFi integration",
  },
  {
    name: "Mobile Banking App",
    slackChannelId: "C2345678901",
    vertical: "APP",
    description: "Modern mobile banking application",
  },
  {
    name: "E-commerce Platform",
    slackChannelId: "C3456789012",
    vertical: "COMMERCE",
    description: "Multi-vendor e-commerce platform",
  },
  {
    name: "NFT Marketplace",
    slackChannelId: "C4567890123",
    vertical: "CRYPTO",
    description: "Decentralized NFT trading platform",
  },
  {
    name: "Food Delivery App",
    slackChannelId: "C5678901234",
    vertical: "APP",
    description: "On-demand food delivery mobile app",
  },
  {
    name: "B2B Commerce Portal",
    slackChannelId: "C6789012345",
    vertical: "COMMERCE",
    description: "Enterprise B2B commerce solution",
  },
];

const sampleUpdates = [
  {
    text: "Completed user authentication flow and started working on wallet integration",
    daysAgo: 1,
    userId: "U1234567890",
    userName: "Alice Johnson",
  },
  {
    text: "Fixed critical security vulnerability in smart contract. All tests passing.",
    daysAgo: 2,
    userId: "U2345678901",
    userName: "Bob Smith",
  },
  {
    text: "API integration complete. Working on UI components for transaction history.",
    daysAgo: 1,
    userId: "U3456789012",
    userName: "Carol Davis",
  },
  {
    text: "Blocker: Third-party payment gateway API is down. Investigating alternatives.",
    daysAgo: 3,
    userId: "U4567890123",
    userName: "David Wilson",
  },
  {
    text: "Sprint completed successfully. All user stories delivered on time.",
    daysAgo: 1,
    userId: "U5678901234",
    userName: "Eve Brown",
  },
  {
    text: "Database migration completed. Performance improvements implemented.",
    daysAgo: 4,
    userId: "U6789012345",
    userName: "Frank Miller",
  },
  {
    text: "Issue with deployment pipeline. Working with DevOps to resolve.",
    daysAgo: 6,
    userId: "U7890123456",
    userName: "Grace Lee",
  },
  {
    text: "New feature branch created. Starting work on advanced search functionality.",
    daysAgo: 2,
    userId: "U8901234567",
    userName: "Henry Taylor",
  },
];

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.update.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create projects
  const createdProjects = [];
  for (const project of sampleProjects) {
    const created = await prisma.project.create({
      data: project,
    });
    createdProjects.push(created);
  }

  // Create users
  const users = [
    { slackUserId: "U1234567890", name: "Alice Johnson" },
    { slackUserId: "U2345678901", name: "Bob Smith" },
    { slackUserId: "U3456789012", name: "Carol Davis" },
    { slackUserId: "U4567890123", name: "David Wilson" },
    { slackUserId: "U5678901234", name: "Eve Brown" },
    { slackUserId: "U6789012345", name: "Frank Miller" },
    { slackUserId: "U7890123456", name: "Grace Lee" },
    { slackUserId: "U8901234567", name: "Henry Taylor" },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Create updates
  for (let i = 0; i < sampleUpdates.length; i++) {
    const update = sampleUpdates[i];
    const project = createdProjects[i % createdProjects.length];
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - update.daysAgo);

    await prisma.update.create({
      data: {
        projectId: project.id,
        userId: update.userId,
        userName: update.userName,
        text: update.text,
        createdAt,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${createdProjects.length} projects`);
  console.log(`Created ${users.length} users`);
  console.log(`Created ${sampleUpdates.length} updates`);
}
