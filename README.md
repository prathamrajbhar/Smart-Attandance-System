# Smart Attendance System

An asynchronous, AI-powered multi-layered attendance verification system designed to eliminate buddy punching, proxy check-ins, and attendance fraud. The project consists of a FastAPI backend using TensorFlow/DeepFace, a Next.js web application for administration/teachers, and a Flutter mobile application for students.

---

## 🚀 Key Features

### 1. Multi-Layered AI Verification
To mark attendance, the student uploads a live selfie which undergoes three independent stages of verification:
- **Facial Recognition**: Matches the student's live face embedding against their registered template using the **FaceNet** model (via **DeepFace**) with **128-dimensional** vector embeddings stored in PostgreSQL using `pgvector`.
- **Liveness Detection**: Employs a custom-trained **MobileNetV2** model to check if the submission is a real person, preventing spoofing attempts using photos, videos, or masks.
- **Background Validation**: Utilizes a custom **MobileNetV1** model to verify that the background of the image matches the expected classroom environment.

### 2. Location & Geofencing
- Verifies student's physical location against active class coordinates.
- Teachers define geofenced regions (latitude, longitude, and radius in meters).
- Submissions outside the geofence boundary are automatically flagged or rejected.

### 3. Device Binding (Anti-Proxy)
- Restricts each student account to a single mobile device.
- Generates and binds a unique hardware UUID (`device_uuid`) on first login.
- Students must submit a **Device Change Request** to be approved by administrators/teachers before they can log in on a new device.

### 4. Real-time Communication & Notifications
- Websocket-based live connection to push real-time attendance updates to teachers' dashboards.
- Firebase Cloud Messaging (FCM) integration to dispatch push notifications for new sessions, reminders, and leave status updates.

### 5. Gamification Suite
- Encourages student attendance through engagement features including current/highest streaks, levels, leaderboards, and point systems.

---

## 🛠️ Technology Stack & Versions

| Layer | Technology | Version / Specification | Key Libraries |
| :--- | :--- | :--- | :--- |
| **Backend** | Python 3.11 / FastAPI | `0.115.6` | Prisma ORM, TensorFlow `2.15.0`, DeepFace `0.0.93`, OpenCV `4.10.0`, Redis `5.2.1` |
| **Frontend** | Next.js (React 19) | `16.2.6` | Tailwind CSS `4.x`, Recharts `3.8.1`, Zustand `5.0.13`, Leaflet Map `1.9.4` |
| **Mobile** | Flutter SDK | `^3.8.0` | Riverpod `^2.6.1`, Dio `^5.7.0`, Geolocator `^13.0.2`, Hive `^2.2.3` |
| **Database** | PostgreSQL | 15+ | `pgvector` extension enabled for biometric representations |

---

## 📂 Project Structure

```
.
├── backend/            # FastAPI python application, database migrations, and AI models
│   ├── app/            # Application source code (api, core, db, middleware, services, etc.)
│   ├── models/         # Local folder for downloading/caching TF models
│   ├── prisma/         # Prisma schema and seeding configurations
│   └── main.py         # App entrypoint
├── frontend/           # Next.js web application for admins and teachers
│   ├── src/            # Next.js pages/components
│   └── package.json    # Frontend dependency definitions
└── mobile/             # Flutter student companion app
    ├── lib/            # Flutter implementation source code
    └── pubspec.yaml    # Flutter dependency configuration
```

---

## ⚙️ Getting Started

### Prerequisites
1. **Python 3.11** installed on the host system.
2. **Node.js 20+** and **npm** installed.
3. **Flutter SDK (v3.8.x+)** and target development environment (Android/iOS simulator or physical device).
4. **PostgreSQL** database with `pgvector` extension enabled.
5. **Redis Server** running locally or accessible via network.
6. A **HuggingFace** token (`HF_TOKEN`) to download pre-trained liveness & background models.

---

### 1. Backend Setup

1. **Navigate to the directory**:
   ```bash
   cd backend
   ```

2. **Configure environment variables**:
   Create a `.env` file by copying the template:
   ```bash
   cp .env.example .env
   ```
   Fill in the required fields (database connection strings, Redis URL, JWT Secret, and HF token if required).

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Prepare the database (Prisma)**:
   Ensure your PostgreSQL service is running and has the `pgvector` extension enabled, then run:
   ```bash
   python -m prisma db push
   python -m prisma generate
   ```

5. **Seed the database (Optional)**:
   ```bash
   python prisma/seed.py
   ```

6. **Start the server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Frontend Setup

1. **Navigate to the directory**:
   ```bash
   cd frontend
   ```

2. **Configure environment variables**:
   Ensure a `.env.local` file exists:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The dashboard will be running at [http://localhost:3000](http://localhost:3000).

---

### 3. Mobile Setup

1. **Navigate to the directory**:
   ```bash
   cd mobile
   ```

2. **Get Flutter packages**:
   ```bash
   flutter pub get
   ```

3. **Run the application**:
   Make sure you have an active emulator or connected device:
   ```bash
   flutter run
   ```

---

## 🔒 Security & Verification Parameters
The verification strictness can be controlled globally via the administrator settings page or in `.env`:
* **Face Embedding matching threshold**: Standard threshold is configured to `0.75` (cosine similarity/confidence score).
* **Liveness Detection threshold**: Values above `0.5` denote real face image inputs.
* **Geofencing validation**: Distance calculated dynamically using the Haversine formula based on student's GPS reports and active class geofence boundaries.
