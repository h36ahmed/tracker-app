import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check if we can query the database
    const projectCount = await prisma.project.count();
    console.log(`📊 Current project count: ${projectCount}`);

    console.log("✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    console.log("\n💡 Make sure your DATABASE_URL is correct in .env file");
    console.log(
      "💡 For local development, you can use SQLite by updating the schema"
    );
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
