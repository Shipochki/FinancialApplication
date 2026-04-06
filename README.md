# Financial Application

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat&logo=dotnet)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Clean_Architecture-Success?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A modern, scalable, and secure Financial Application built using **.NET (C#)** for the backend and **Angular** (TypeScript/HTML/CSS) for the frontend. The project strictly adheres to **Clean Architecture** principles and the **CQRS** (Command Query Responsibility Segregation) pattern to ensure high maintainability, testability, and a clear separation of concerns.

---

## 📖 Project Concept
The Financial Application is designed to manage, track, and optimize financial records and transactions. By decoupling the core business logic from UI and infrastructure concerns, the application ensures that complex financial rules can be securely processed and heavily tested without dependencies on external frameworks or databases. 

## ✨ Key Features
* **Comprehensive Financial Tracking**: Secure management of user financial data, accounts, and transactions.
* **Modern Single-Page Application (SPA)**: Fast, responsive, and dynamic UI built with Angular.
* **Robust API Backend**: RESTful APIs powered by ASP.NET Core.
* **Data Integrity & Validation**: Strict input constraints handling via FluentValidation to prevent bad financial data.
* **Automated Data Seeding**: Pre-configured database states for rapid development and testing environments.
* **Secure Architecture**: Separation of concerns prevents UI or database logic from bleeding into the core domain.

---

## 🏗️ Architecture & Design Decisions

This project follows **Clean Architecture**, placing the Domain (enterprise business rules) at the absolute center of the application. Dependencies always point inwards, ensuring that the core domain is completely independent of external tools, databases, and UI frameworks.

We utilize the **CQRS Pattern** (often implemented via MediatR) to separate read operations (Queries) from write operations (Commands). This maximizes performance, scalability, and security, especially crucial for financial systems where transactional integrity is paramount.

### Layer Breakdown

#### 1. `FinancialApplication.Domain`
The core of the system. It contains zero external dependencies.
* **Entities**: Core business objects (e.g., Accounts, Transactions).
* **Value Objects**: Immutable concepts (e.g., Money, Currency).
* **Enums & Exceptions**: Domain-specific states and custom business logic exceptions.
* **Interfaces**: Contracts for repositories and services implemented by outer layers.

#### 2. `FinancialApplication.Application`
Contains the business use cases and application logic.
* **Commands & Queries**: The CQRS implementation dictating what the application can *do*.
* **Services**: Interfaces and implementations mapping Domain concepts to application behavior.
* **DTOs (Data Transfer Objects)**: Models structured specifically for client consumption.
* **Validations**: Business rule and input validations (typically utilizing `FluentValidation`) before operations reach the domain.

#### 3. `FinancialApplication.Infrastructure`
The bridge to external systems and data persistence.
* **Entity Framework Core**: The chosen ORM for database interactions.
* **DbContext & Migrations**: Database schema management.
* **Repositories**: Concrete implementations of the interfaces defined in the Domain layer.
* **External Services**: Integrations with third-party APIs, Email providers, or Auth systems.

#### 4. `FinancialApplication` (Web/API)
The entry point of the backend system.
* **Controllers/Endpoints**: Exposes the Application layer's Commands and Queries to the web via HTTP.
* **Middlewares**: Global exception handling, logging, and authentication/authorization routines.
* **Dependency Injection Setup**: Wires up the interfaces from the Application and Domain to their Infrastructure implementations.

#### 5. `financialapplication.angular` (Frontend)
The client-facing Single Page Application.
* **Components**: Modular, reusable UI elements.
* **Services**: HTTP interceptors and API wrappers to communicate with the .NET backend.
* **State Management & Routing**: Handles UI state and client-side navigation.

#### 6. `FinancialApplication.UnitTests`
Dedicated test projects to ensure stability.
* Contains isolated tests specifically validating the `Domain` and `Application` layer logic without requiring a live database.

---

## 🛡️ Validations & Security
Validations are handled at multiple levels to ensure absolute data integrity:
1. **Application Level**: Incoming requests are validated using `FluentValidation` to catch bad formatting, missing fields, or logically inconsistent input before it ever touches the business logic.
2. **Domain Level**: Entities strictly encapsulate their state. They cannot be created or modified in an invalid state, utilizing private setters and constructor validations to protect business rules.

## 🌱 Database Seeding
To streamline development and testing, the infrastructure layer includes an automated database **Seeding Mechanism**. 
* **Initial Setup**: Upon running the application in a development environment, the database is automatically created and migrated.
* **Default Data**: Essential lookup tables, default administrative users, and dummy financial data are seeded. This ensures immediate usability for new developers cloning the repository.

---

## 🚀 Setup Instructions

### Prerequisites
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* A SQL Server instance (LocalDB, Docker, or standalone)

### Backend Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Shipochki/FinancialApplication.git](https://github.com/Shipochki/FinancialApplication.git)
   cd FinancialApplication
Images from the application:
- Home Page without SignIn User
   <img width="1917" height="947" alt="Screenshot 2026-04-06 142731" src="https://github.com/user-attachments/assets/304b99d5-5a18-4e53-9bb0-e90bf6d50262" />
- Home Page with SignIn User (without created accounts) <img width="1919" height="949" alt="Screenshot 2026-04-06 142757" src="https://github.com/user-attachments/assets/5081fc1a-48fd-4307-ae1b-3c1460178d3d" />
- Home Page with SignIn User (with created accounts) <img width="1919" height="946" alt="Screenshot 2026-04-06 142828" src="https://github.com/user-attachments/assets/8f7e7256-5262-4880-81a3-1f546205ca85" />
- Create Account Page
  <img width="1919" height="962" alt="Screenshot 2026-04-06 142814" src="https://github.com/user-attachments/assets/ab34704d-0d9d-4337-bc4d-5c800c3671cb" />
- Account Details Page (It is showing last 3 transaction and navigation buttons)
  <img width="1919" height="967" alt="Screenshot 2026-04-06 142844" src="https://github.com/user-attachments/assets/52fa2fda-3290-4cac-a293-dcd9e4473e87" />
  <img width="1918" height="965" alt="Screenshot 2026-04-06 142856" src="https://github.com/user-attachments/assets/979a1040-07c3-4038-8b13-cdc4aaa9659b" />
- Create Transaction Page
  <img width="1918" height="966" alt="Screenshot 2026-04-06 142910" src="https://github.com/user-attachments/assets/4758e4c8-fc57-4ba1-9c6e-27c92af72472" />
  <img width="1919" height="973" alt="Screenshot 2026-04-06 142933" src="https://github.com/user-attachments/assets/60f17368-30ab-4e5b-be38-175e1fddee2c" />
- All Transactions Page (This page shows all transaction for selected account, with pagination at the bottom)
  <img width="1919" height="977" alt="Screenshot 2026-04-06 142947" src="https://github.com/user-attachments/assets/2c0339d1-5f65-4ae8-a0cc-8db3e7d3ec27" />
  <img width="1919" height="965" alt="Screenshot 2026-04-06 142956" src="https://github.com/user-attachments/assets/c0232e99-8b2c-47e9-b853-a4c4e0b23d60" />
- Transaction Details Page (At the bottom it shows the navigation buttons to edit and delete)
  <img width="1919" height="966" alt="Screenshot 2026-04-06 143010" src="https://github.com/user-attachments/assets/e35be5d9-efb0-4b00-b628-4b8d932d957d" />
- Transaction Delete PopUp
  <img width="1919" height="963" alt="Screenshot 2026-04-06 143026" src="https://github.com/user-attachments/assets/e5d2c801-b43f-4db6-bd61-6307f40d31da" />
- Transaction Edit Page
  <img width="1919" height="962" alt="Screenshot 2026-04-06 143051" src="https://github.com/user-attachments/assets/53443578-ae6d-4703-b785-e750fd058637" />
- All Budgets Page (This page shows all the budgets for selected account)
  <img width="1919" height="971" alt="Screenshot 2026-04-06 143108" src="https://github.com/user-attachments/assets/8ef53638-0db5-4ba3-a9e4-803f7415a9a5" />
- Create Budget Page
  <img width="1919" height="969" alt="Screenshot 2026-04-06 143122" src="https://github.com/user-attachments/assets/f21f83fd-354a-4854-9395-d73d5c33f713" />
  <img width="1919" height="965" alt="Screenshot 2026-04-06 143139" src="https://github.com/user-attachments/assets/b90a64f2-a735-45ab-9063-cc142582e9de" />
- All Categories Page (It shows the global categories and custom created from the current user. Every User can see only the global and created by him self)
  <img width="1919" height="865" alt="Screenshot 2026-04-06 143155" src="https://github.com/user-attachments/assets/8c74c8d5-b34d-46c3-bac6-39a3fc192afc" />
- Create Category Page
  <img width="1919" height="962" alt="Screenshot 2026-04-06 143205" src="https://github.com/user-attachments/assets/fb1019e4-f089-4b34-9b51-c9750d79ac3d" />
- Edit Category PopUp
  <img width="1919" height="965" alt="Screenshot 2026-04-06 143223" src="https://github.com/user-attachments/assets/820d92e3-c762-49af-a786-6cdc4a5e4970" />
- Not Found Page
  <img width="1918" height="943" alt="Screenshot 2026-04-06 144524" src="https://github.com/user-attachments/assets/a40e8e22-b883-42d7-9ea9-1a9358fc4e94" />
- Bad Request Page
  <img width="1919" height="945" alt="Screenshot 2026-04-06 144616" src="https://github.com/user-attachments/assets/8cff22e8-db16-4a87-add0-2ab39d040fba" />









