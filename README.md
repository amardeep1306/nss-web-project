# 🌟 NSS Connect - IIT Roorkee
> **Empowering Social Change through Digital Innovation.**

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

## 1. Introduction
Non-Governmental Organizations often run online campaigns...
## 1. Introduction
Non-Governmental Organizations often face data loss during online campaigns when users drop off
during the payment process. **NSS Connect** solves this by implementing a backend-driven system that 
separates user registration from the donation flow. This ensures that every supporter's data is captured
regardless of the payment outcome, providing administrators with full visibility into their community.



## 2. Project Objectives
* **Data Integrity**: Capture and save user registration data independently of donation completion.
* **Transparency**: Provide real-time tracking of donation statuses: Success, Pending, or Failed.
* **Ethical Handling**: Ensure no fake or forced payment success logic; only genuine gateway confirmations are recorded.

## 3. Key Features

### Authentication & Access
* **Unified Portal**: A common login and registration page for both users and administrators.
* **Role-Based Access Control (RBAC)**: Automatic redirection after login based on user roles (Admin vs. User).
* **Secure OTP System**: Authentication powered by Nodemailer using Gmail SMTP with Secure App Passwords.

### User Features
* **Independent Registration**: Users can create an account and access the platform without being forced to donate.
* **Donation Tracking**: Users can initiate donations for specific causes and track the status in real-time.
* **History & Profile**: A personalized dashboard to view registration details and full donation history.

### 📊 Admin Features
* **Master Dashboard**: View aggregated stats, including total registrations and total funds raised.
* **User Management**: Access a filtered list of all registered users with data export capabilities.
* **Payment Audit**: Monitor all donation records with precise timestamps and transaction IDs.



## 4. Technical Stack
* **Frontend**: React.js (Vite) with Framer Motion for interactive multi-step forms.
* **Backend**: Node.js & Express.js for robust API management.
* **Database**: MongoDB Atlas for secure, independent storage of user and financial records.
* **Payment Gateway**: Razorpay (Integration in Test/Sandbox mode).
* **Mailing**: Nodemailer configured with Google SMTP App Passwords.

## 5. Project Structure
Based on the current architecture:
```text
├── client/                 # Frontend - React + Vite
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Footer, etc.)
│   │   ├── pages/          # Functional Pages (Volunteer, Login, Admin)
│   │   └── helper.js       # API Base URL configuration
├── server/                 # Backend - Node + Express
│   ├── models/             # Mongoose Schemas (User, Donation, Volunteer)
│   ├── routes/             # API Route Definitions
│   └── index.js            # Main Server Entry Point
```

## ⚙️ Detailed Installation & Setup

Follow these steps to get your development environment running locally.

### 1. Prerequisites
Before starting, ensure you have the following installed:
* **Node.js** (v16.0.0 or higher)
* **npm** (Node Package Manager)
* **Git** for version control
* **MongoDB Atlas Account** (for cloud database)
* **Razorpay Account** (for API keys in Test Mode) (optional) if you have then you can get real feel
* **Google Account** (with 2-Step Verification enabled to generate an App Password)

---

### 2. Initial Setup
Clone the repository to your local machine:
```bash
git clone https://github.com/amardeep1306/nss-web-project.git
cd nss-web-project
```

### 3. Backend Setup (Server)

Follow these steps to configure and launch the server-side environment:

**Navigate to the server directory**:  
Open your terminal and enter the server folder:  

```bash
cd server
```
**Install all required dependencies**:  
Run the following command to download the necessary libraries:  

```bash
npm install express mongoose cors nodemailer razorpay dotenv crypto
```
**Packages Overview**:  
* **express**: The web framework for creating APIs.  
* **mongoose**: Handles the connection and schemas for MongoDB Atlas.  
* **cors**: Allows your frontend (Vercel/Localhost) to communicate with this server.  
* **nodemailer**: Manages the delivery of OTP emails.  
* **razorpay**: Integrates the payment gateway functionality.  
* **dotenv**: Loads your secret credentials from the `.env` file.  
* **crypto**: Used for secure payment signature verification.  

---

**Configure Environment Variables**:  
Create a file named `.env` in the root of the server folder and paste the following configuration:  

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_test_key (if you have) and a little code in line 70 of DonationModel file make(const USE_DUMMY_MODE = false);
RAZORPAY_KEY_SECRET=your_razorpay_test_secret (if you have)
SMTP_MAIL=EMAIL_OF_ADMIN
SMTP_PASSWORD=your_16_digit_gmail_app_password
```
### How to Generate a Gmail App Password

Since modern security prevents using your regular Gmail password for third-party apps, you must generate a **16-digit App Password** to allow `Nodemailer` to send OTPs.

**Step-by-Step Instructions:**

1.  **Enable 2-Step Verification**:
    * Go to your [Google Account Settings](https://myaccount.google.com/).
    * Navigate to **Security** on the left menu.
    * Under the "Signing in to Google" section, ensure **2-Step Verification** is turned **ON**.

2.  **Generate App Password**:
    * In the search bar at the top of your Google Account page, type **"App Passwords"**.
    * Click on the result that says **App Passwords**.
    * **App Name**: Enter a name like `NSS Connect` or `NGO Backend`.
    * Click **Create**.

3.  **Copy the Password**:
    * A window will pop up showing a **16-character code** (e.g., `abcd efgh ijkl mnop`).
    * **Copy this code immediately** (you won't be able to see it again).

4.  **Update your .env file**:
    * Paste the code into your `server/.env` file.
    * **Important**: Remove any spaces between the letters when pasting it into `SMTP_PASSWORD`.

> **⚠️ CRITICAL**: Do not use your regular Gmail login password. Using the 16-digit App Password is the only way to avoid the `535 5.7.8 Authentication failed` error in your terminal.
> **⚠️ CRITICAL**: Ensure there are no spaces after the `=` sign or at the end of the `SMTP_PASSWORD`. Extra spaces are a common cause of the `535 5.7.8 Authentication failed` error.

**Start the Backend Server**:  
Launch the server using the standard npm run dev script or `nodemon` for automatic restarts during development:

```bash
npm run dev
```
**Verify**: You should see the following logs in your terminal upon a successful connection:

```text
🚀 Server Running on Port 5000
✅ MongoDB Atlas Connected Successfully!
```
### 4. Frontend Setup (Client)

Follow these steps to set up the interactive user interface:

**Navigate to the client directory**:  
Open a new terminal window and enter the frontend folder:  

```bash
cd client
```
**Install dependencies**:  
Run the following command to install the necessary libraries for routing, animations, and icons:  

```bash
npm install react-router-dom framer-motion lucide-react axios
```
* **Package Usage**:
    * `react-router-dom`: Handles navigation between pages like Home, Login, and Volunteer.
    * `framer-motion`: Powers the smooth transitions in the multi-step volunteer form.
    * `lucide-react`: Provides the modern icons used throughout the UI.
    * `axios`: Used for making API requests to your Node.js backend.

**Start the dev server**:  
Launch the Vite development environment:  

```bash
npm run dev
```
> **Verification**: The application will typically be accessible at `http://localhost:5173`.

---

## 8. Author

* **Amardeep Kumar , Chandan Kumar and Shashank Saha**
  
