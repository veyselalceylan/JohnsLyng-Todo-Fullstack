# Johns Lyng Group Todo Application
Full-stack application with .NET Web API and Angular

## Tech Stack & Versioning
I have utilized the latest ecosystem versions (2026 standards) to ensure the project meets modern industry requirements for performance and security:

### **Frontend (Angular)**
- **Angular Framework:** `21.2.x` (Standalone Components, Signals, & Modern Hydration)
- **PrimeNG:** `21.1.x` (Using the latest **Aura** Design System)
- **E2E Testing:** Playwright `1.60.x`
- **Build Tool:** Vite-based Angular Build Pipeline

### **Backend (.NET)**
- **Runtime:** .NET `10.0.203`
- **Architecture:** Clean Architecture / Repository Pattern
- **API:** RESTful with global error handling and Interceptors support

---

## Key Features & Engineering Decisions

### Enterprise Data Handling
- **Server-Side Pagination:** Implemented to keep the DOM lightweight by fetching only 5-10 items at a time. Essential for large-scale enterprise apps.
- **Bulk Operations:** Users can perform **Bulk Delete** to manage multiple tasks simultaneously.
- **Seed Data (Demo Mode):** I've integrated a "Seed Data" feature. Instead of manually entering tasks one by one, you can click the **Import/Seed** button to instantly populate the database with realistic mock data from `data.json`. This demonstrates pagination and chart logic immediately.

### Reactive Insights
- **Signals-Driven Analytics:** A dedicated dashboard uses **Chart.js** (v4.x) to visualize task completion ratios. It responds instantly to data changes thanks to Angular's reactive Signals.

### Security & "The Bridge"
- **Auth Guard & Interceptors:** Centralized security logic. An HTTP Interceptor automatically injects headers into every request, ensuring a seamless and secure "bridge" between frontend and backend.
- **Strict Typing:** Every data flow is governed by TypeScript Interfaces to ensure zero-runtime errors and high maintainability.

---
## Getting Started

### Frontend
1. **Install dependencies:**
   ```bash
   npm install
2. **Run the development server:**
    ```bash
    npm start
Navigate to http://localhost:4200/

3. **Run End-to-End (E2E) tests:**
    ```bash
    npx playwright test

### Backend
1. **Check version:**
   ```bash
   dotnet --version # Should be 10.0.203
2. **Run project:**
   ```bash
   dotnet run --launch-profile http
3. **Check version:**
   ```bash
   dotnet --version # Should be 10.0.203

### Note to Reviewer"
- I highly recommend using the Seed Data button in the Toolbar first. It populates the system with realistic data to demonstrate the sorting and pagination logic effectively without manual entry.
- By default, the Angular frontend is configured to communicate with the backend via **HTTP**. 
* To run the backend with the default profile: `dotnet run --launch-profile http`
* If you prefer to run with SSL enabled: Change the launch profile to `https` and ensure your environment trusts the dev certificates.
