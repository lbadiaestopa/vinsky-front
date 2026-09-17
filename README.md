# 🎻 Vinsky Frontend

<img width="2488" height="622" alt="image" src="https://github.com/user-attachments/assets/16e5a544-e29d-4af5-8426-c1b3aa56954e" />


React client consuming [Vinsky API](https://github.com/lbadiaestopa/vinsky-api) for managing orchestras, their members, programs, events, and musical scores. It provides structured access control, allowing users to collaborate within orchestras, organize rehearsals and concerts, and manage shared sheet music through secure file uploads.

## 🛠️ Tech Stack
- **Framework:** React 19
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router 7

## 🪄 Features
- Secure user authentication
- User profile management
- Orchestra administration dashboard
- Orchestra member management
- Program creation and management
- Rehearsal and concert scheduling
- Upcoming events overview
- PDF score browsing and downloading
- Role-based interface and permissions

<img width="1469" height="834" alt="Background" src="https://github.com/user-attachments/assets/3a48e05d-8512-4e26-bfb5-fd066e6afd57" />

## 🚧 Setup & Installation
### Prerequisites
- Node.js 18+
- Vinsky API running locally. Follow the API installation instructions [here](https://github.com/lbadiaestopa/vinsky-api#-setup--installation).

### Installation 
1. Clone the repository
```bash
git clone https://github.com/lbadiaestopa/vinsky-front
```
```bash
cd vinsky-front
```
2. Install dependencies
```bash
npm install
```
3. Start the development server
```bash
npm run dev
```
### Base URL
The app will be available at:
```
http://localhost:5173
```

## 🐳 Docker

The project is fully dockerized using Docker Compose, providing the Laravel API, MySQL database, and React frontend as separate services.

### Requirements

- Docker Desktop

### Setup

Clone both repositories into the same parent directory:

- [Vinsky API](https://github.com/lbadiaestopa/vinsky-api)
- [Vinsky Frontend](https://github.com/lbadiaestopa/vinsky-front)

```text
parent-directory/
├── vinsky-api/
└── vinsky-front/
```

Navigate to the backend directory:

```bash
cd vinsky-api
```

Build and start the containers:

```bash
docker compose up -d --build
```

This will start the following services:

- **Backend:** Laravel API at `http://localhost:8000`
- **Frontend:** React application at `http://localhost:5173`
- **Database:** MySQL running inside Docker

To stop the containers:

```bash
docker compose down
```

To start them again:

```bash
docker compose up -d
```

### Database

The MySQL data is persisted in a Docker volume, so restarting or recreating the containers does not remove the database data.

If the database needs to be initialized from scratch, the volume can be removed and recreated:

```bash
docker compose down -v
```
```bash
docker compose up -d --build
```

> **Note:** Removing the volume deletes all database data, including seeded data and Passport credentials.

## 👤 Demo accounts
To test the app, use the demo accounts created by the API seeders or create a new account.
| Role | Email | Password |
|---------|----------|-------------|
| Admin | beethoven@admin.com | password |
| Member | mozart@member.com | password |
| Member | bach@member.com | password |

##

👨🏻‍💻 Project developed by **Lluc Badia Estopà** - [LinkedIn](https://www.linkedin.com/in/lbadiaestopa) · [Github](https://github.com/lbadiaestopa)
