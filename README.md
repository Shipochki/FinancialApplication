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
