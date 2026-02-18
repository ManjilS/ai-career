const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Clearing IndustryInsight table...');
        await prisma.industryInsight.deleteMany({});
        console.log('IndustryInsight table cleared.');
    } catch (e) {
        console.error('Error clearing table:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
