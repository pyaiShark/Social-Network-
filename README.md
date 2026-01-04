# ThreadNet - Modern Social Network Platform

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)

## 📋 Table of Contents

- [ThreadNet - Modern Social Network Platform](#threadnet---modern-social-network-platform)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎯 About The Project](#-about-the-project)
  - [✨ Features](#-features)
    - [🎯 Core Functionality](#-core-functionality)
  - [🛠 Tech Stack](#-tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Development Tools](#development-tools)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
      - [Method 1: Using UV (Recommended)](#method-1-using-uv-recommended)
      - [Method 2: Using pip](#method-2-using-pip)
      - [Method 3: Using Docker](#method-3-using-docker)
    - [Configuration](#configuration)
    - [Running the Application](#running-the-application)
  - [📱 Usage](#-usage)
    - [👤 User Registration \& Login](#-user-registration--login)
    - [📝 Creating Content](#-creating-content)
    - [🤝 Social Interactions](#-social-interactions)
    - [🔍 Navigation](#-navigation)
  - [📁 Project Structure](#-project-structure)
  - [📄 License](#-license)
  - [📞 Contact](#-contact)

## 🎯 About The Project

**ThreadNet** is a modern, Threads-inspired social network platform built with Django. It provides a sleek white-theme interface with real-time interactions, and comprehensive social features. ThreadNet offers a clean, focused experience for meaningful connections and content sharing.

## ✨ Features

### 🎯 Core Functionality

- **User Registration & Authentication** - Secure signup/login with Django auth
- **Post Creation** - Create text posts with image/video uploads
- **Follow System** - Follow/unfollow users with real-time counts

## 🛠 Tech Stack

### Backend

- **Django** - High-level Python web framework
- **SQLite** - Lightweight database for development

### Frontend

- **HTML5** - Semantic markup
- **CSS** - Advanced styling with custom properties
- **JavaScript (ES6+)** - Dynamic functionality
- **Bootstrap 5** - Responsive CSS framework

### Development Tools

- **Docker** - Containerization (optional)
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Git

### Installation

#### Method 1: Using UV (Recommended)

```bash
# Create virtual environment
uv venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Method 2: Using pip

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Method 3: Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

### Configuration

1. **Apply database migrations:**

```bash
python manage.py makemigrations
python manage.py migrate
```

### Running the Application

1. **Start the development server:**

```bash
python manage.py runserver
```

1. **Access the application:**

- Open your browser and navigate to `http://localhost:8000`
- Admin panel: `http://localhost:8000/admin` (if superuser created)

1. **Create a superuser (optional):**

```bash
python manage.py createsuperuser
```

## 📱 Usage

### 👤 User Registration & Login

1. **Register** a new account with username and password
2. **Login** to access your personalized dashboard
3. **Customize** your profile with photos and bio

### 📝 Creating Content

1. **New Post** - Click "Create Post" to share text, images, or videos
2. **Edit Posts** - Update or delete your own posts

### 🤝 Social Interactions

1. **Follow Users** - Click follow on user profiles
2. **Like Posts** - Heart icon to like/unlike posts

### 🔍 Navigation

- **Home** - View all posts in chronological order
- **Following** - See posts from users you follow
- **Profile** - Access your profile and settings

## 📁 Project Structure

```
threadnet/
├── network/                    # Main Django app
│   ├── models.py              # Database models (User, Post, Comment, Like, Follow)
│   ├── views.py               # View logic and API endpoints
│   ├── urls.py                # URL routing
│   └── templates/             # HTML templates
│       ├── network/
│       │   ├── layout.html    # Base template
│       │   ├── index.html     # Main feed
│       │   ├── login.html     # Login page
│       │   └── register.html  # Registration page
├── static/
│   └── network/
│       ├── index.js           # Main JavaScript file
│       ├── styles.css         # Additional CSS
├── requirements.txt           # Python dependencies
├── manage.py                  # Django management script
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
└── README.md                  # This file
```

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## 📞 Contact

Linkedin Profile: [Linkedin](https://www.linkedin.com/in/goutam-mandal-g000m)


---
<p align="center">
  <a href="#readme-top">Back to top ↑</a>
</p>
