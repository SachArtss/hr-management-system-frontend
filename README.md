# HR Management System - Frontend
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![AngularMaterial](https://img.shields.io/badge/Angular%2520Material-3F51B5?style=for-the-badge&logo=angular&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

A modern, responsive Angular frontend application for the HR Management System. This interface provides complete management of employees, departments, candidates, and salary information with a beautiful Material Design interface.

## 🌐 Live Application
Production URL: https://office-hr-management.netlify.app

Backend API: Deployed on Render

## 🛠️ Tech Stack
Framework: Angular 8

Language: TypeScript

UI Library: Angular Material

HTTP Client: Angular HttpClient

State Management: RxJS Observables

Deployment: Netlify

Package Manager: npm

## ✨ Features
📊 Employee Management - Complete CRUD operations for employees

🏢 Department Management - Department creation and management

📝 Candidate Tracking - Job applicant management with hiring workflow

💰 Salary Management - Employee compensation records

🎨 Modern UI - Material Design interface with responsive layout

🔄 Real-time Updates - Live data synchronization

📱 Mobile Responsive - Works on all device sizes

## 🚀 Getting Started
Prerequisites
Node.js 16+

Angular CLI 8

npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/hadush-negasi/hr-management-system-frontend.git
cd hr-management-system-frontend
```
2. Install Dependencies
```bash
npm install
```
3. Environment Setup
Update src/environments/environment.ts:
```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001' // Your local backend URL
};
```
4. Start Development Server
```bash
ng serve
```
The application will be available at http://localhost:4200

## 📦 Project Structure
```
src/
├── app/
│   ├── core/                 # Core services and interceptors
│   ├── features/            # Feature modules
│   │   ├── employees/       # Employee management
│   │   ├── departments/     # Department management  
│   │   ├── candidates/      # Candidate tracking
│   │   └── salaries/        # Salary management
│   ├── shared/              # Shared components and models
│   └── app.module.ts        # Root module
├── assets/                  # Static assets
└── environments/            # Environment configurations
```
## 🔧 Configuration
Environment Variables
Update src/environments/environment.prod.ts for production:
```bash
export const environment = {
  production: true,
  apiUrl: 'https://hr-backend.onrender.com' // Your production backend URL
};
```
### Build for Production
```bash
ng build --configuration production
```
The build artifacts will be stored in the dist/ directory.

## 🎨 Components Overview
### Employee Components
EmployeeListComponent - Display all employees with filtering

EmployeeFormComponent - Create/edit employee forms

EmployeeDetailComponent - Employee profile view

### Department Components
DepartmentListComponent - Department listing

DepartmentFormComponent - Department management forms

### Candidate Components
CandidateListComponent - Applicant tracking system

CandidateFormComponent - Candidate application forms

HireCandidateComponent - Candidate hiring workflow

### Salary Components
SalaryListComponent - Salary records management

SalaryFormComponent - Salary creation/editing

## 🙌 Author

Developed by **Hadush Negasi**.  
Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/hadush-brhane/)




