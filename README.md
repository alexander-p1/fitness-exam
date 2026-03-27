# Webbapp Gym 

En mern-stack app för att logga träningspass, bygga pass med övningar och följa utvecklingen över tid.

## Teknologier
- Frontend: React, Tailwind
- Backend: Node.js, Express
- Databas: MongoDB

## Kom igång

Följ stegen för att starta projektet.

### Installera beroenden

Installera dependencies i båda mapparna och även root mappen, då får du med concurrently så kan du starta projektet i root mappen.

Terminal 1 (Backend):
```bash
cd server
npm install
```

Terminal 2 (Frontend):
```bash
cd client
npm install
```

### Miljövariabler
Finns i env.example

### 4. Seeda databasen för övningarna
För att fylla databasen med standardövningar, kör kommando från servermappen
```bash
cd server
node seed/exercises.js
```

### 5. Starta appen såhär eller med concurrently i root

Starta backend-servern:
```bash
cd server
npm run dev
```

Starta frontend-klienten:
```bash
cd client
npm run dev
```