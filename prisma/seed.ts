import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = [
    { id: 'user_alice', email: 'alice@ajaia.com', name: 'Alice Johnson' },
    { id: 'user_bob',   email: 'bob@ajaia.com',   name: 'Bob Smith'     },
    { id: 'user_carol', email: 'carol@ajaia.com', name: 'Carol White'   },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    })
  }

  console.log('✅ Seeded 3 users: Alice, Bob, Carol')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
