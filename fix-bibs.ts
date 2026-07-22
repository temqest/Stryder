import prisma from './src/lib/prisma';

async function main() {
  const registrations = await prisma.registration.findMany({
    where: { bibNumber: null }
  });

  console.log(`Found ${registrations.length} registrations without bib numbers.`);

  let startBib = 1000;
  for (const reg of registrations) {
    let success = false;
    while (!success) {
      try {
        await prisma.registration.update({
          where: { id: reg.id },
          data: { bibNumber: startBib.toString() }
        });
        console.log(`Assigned bib ${startBib} to registration ${reg.id}`);
        success = true;
      } catch (e) {
        // Unique constraint might fail if bib already exists
      }
      startBib++;
    }
  }

  console.log("Done assigning bibs.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
