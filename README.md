# Kinot: Expense Tracking System  
_A CS50x 2024 Final Project_

---

## 📌 Overview  
Kinot is a **full-stack CRUD expense tracking system** built as a final project for Harvard’s CS50x 2024. It allows users to manage personal finances, log expenses and income, set saving goals, and visualize monthly financial health.  

The project emphasizes **secure authentication, database-driven persistence, and interactive UI/UX**. With a Flask backend and React + Vite frontend, Kinot demonstrates modern web development practices while remaining approachable for students and self-learners.

---

## ⚙️ Tech Stack  

### **Frontend**
- **React 19 + TypeScript** – Component-based UI  
- **Vite** – Fast build tool and dev server  
- **TailwindCSS** – Utility-first styling  
- **React Router v7** – Client-side routing  
- **React Icons** – Icons for UI  

### **Backend**
- **Flask 3** – Python microframework  
- **Flask-SQLAlchemy** – ORM for relational database  
- **Flask-JWT-Extended** – JSON Web Token auth  
- **Flask-CORS** – Cross-origin requests  
- **Werkzeug** – Secure file handling  

### **Database**
- **SQLAlchemy ORM** → portable across **SQLite / PostgreSQL / MySQL**  
- Schema models: `Users`, `MonthlyFinances`, `Transactions`, `Goals`, `GoalContributions`  

---

## 🗂️ Project Structure  

```
kinot-cs50x/
├── backend/             # Flask API
│   ├── run.py           # App entrypoint
│   └── app/
│       ├── models.py    # SQLAlchemy models
│       ├── routes.py    # API endpoints
│       ├── services/    # Business logic
│       └── utils.py     # JWT + hashing utilities
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Page-level views
│   │   ├── context/     # Global auth + toast
│   │   └── hooks/       # Data hooks
└── requirements.txt     # Python backend deps
```

---

## 🗄️ Database Schema  

Kinot is relational, normalized around the **User** entity.  

### **Users**
| Field              | Type        | Notes |
|--------------------|------------|-------|
| id (PK)           | Integer    | Unique ID |
| fullname          | String(100)| User’s full name |
| username (unique) | String(50) | Login credential |
| _password_hashed  | String(128)| Secured password hash |
| password_salt     | Binary(16) | Random salt |
| secret_question   | String(150)| Recovery Q |
| _secret_answer_hashed | String(150) | Recovery answer hash |
| secret_answer_salt | Binary(16)| Salt for answer |
| profile_path      | String(255)| Profile image |

---

### **MonthlyFinances**
| Field       | Type     | Notes |
|-------------|---------|-------|
| id (PK)     | Integer | Unique ID |
| user_id (FK)| Integer | Links to User |
| date        | DateTime| Defaults to now |
| year        | Integer | Extracted from date |
| month       | Integer | Extracted from date |
| savings     | Float   | Total savings |
| spendings   | Float   | Total expenses |
| allowance   | Float   | Income/allowance |

**Constraint**: unique per `(user_id, year, month)`

---

### **Transactions**
| Field        | Type     | Notes |
|--------------|---------|-------|
| id (PK)      | Integer | |
| user_id (FK) | Integer | |
| category     | String(50)| e.g., `savings`, `expenses` |
| amount       | Float   | Transaction value |
| created_at   | DateTime| Defaults now |
| method       | String(30)| e.g., Cash, Card |
| description  | String(100)| Optional |
| is_deleted   | Boolean | Soft-delete |

---

### **Goals**
| Field         | Type     | Notes |
|---------------|---------|-------|
| id (PK)       | Integer | |
| user_id (FK)  | Integer | |
| title         | String(30)| Goal name |
| description   | String(100)| Optional |
| created_at    | DateTime| Timestamp |
| required_amount | Float | Target |
| current_amount | Float | Progress |
| is_deleted    | Boolean | Soft-delete |
| image_path    | String(255)| Goal image |

---

### **GoalContributions**
| Field       | Type     | Notes |
|-------------|---------|-------|
| id (PK)     | Integer | |
| goal_id (FK)| Integer | |
| amount      | Float   | Contribution |
| added_at    | DateTime| Timestamp |

---

## 🚀 Features  

### **Authentication & Security**
- JWT-based login & registration  
- Password hashing with unique salt  
- Secret Q&A recovery with reset token  
- Profile image upload (secured with `werkzeug`)  

### **Finance Tracking**
- Track **monthly savings, spendings, allowance**  
- Compare current vs previous month with percentage changes  
- Visual progress cards for quick overview  

### **Transactions**
- Add/edit/delete transactions  
- Filter by category (`savings`, `allowance`, `expenses`)  
- See recent 5 transactions on home page  
- Searchable transactions in `/transactions` page
- Export transactions to CSV File

### **Goals**
- Create savings goals with images  
- Contribute funds to goals  
- Delete/archive completed goals  
- Track contributions history  
- Searchable goals in `/goals` page

### **UI/UX**
- Responsive React frontend  
- Protected routes (auth-required)  
- Toast notifications for errors/success  
- Modals for confirmations and forms   

### **Developer Tools**
- **Context API hooks** for auth state  
- **Proxy Setup** for accessing Flask routes from React frontend
- **Directory Aliasing** for quick imports instead of relative paths
---

## 📊 Example User Flow  

1. **Register** → Set username, password, secret Q&A  
2. **Login** → JWT token issued  
3. **Home Dashboard** →  
   - See current finances vs last month  
   - Quick list of latest transactions  
   - Active goals progress  
4. **Add Transaction** → e.g., ₱500 expense on food  
5. **Create Goal** → “New Laptop” ₱40,000 target  
6. **Contribute to Goal** → ₱2,000 monthly  
7. **Account Page** → Update profile, change password, delete account  

---

## 🧪 API Endpoints  

- `POST /register` → Create user  
- `POST /login` → Authenticate user  
- `GET /home` → Dashboard summary (finances, transactions, goals)  
- `POST /finance-update` → Add income/expense  
- `GET /transactions` → Fetch all user transactions  
- `GET /goals` → Fetch all goals  
- `POST /update-goal/<id>` → Contribute to goal  
- `POST /delete-goal/<id>` → Delete goal  
- `GET /account` → User info  
- `PUT /account` → Update profile  
- `DELETE /account` → Remove user  

---

## 🔒 Security Practices  

- Passwords never stored in plain text → salted SHA256 hashing  
- JWT tokens expire (1 hour), used with role claims  
- Profile uploads sanitized with `secure_filename`  
- User-owned resources enforced with `user_required` decorator  

---

## 📈 Future Upgrades and Recommendations

1. **Data Visualization**
   - Add charts for income vs expenses trends  
   - Pie charts for category breakdown  

2. **Budgeting**
   - Allow monthly budget limits  
   - Alerts when nearing overspending  

3. **Sharing / Collaboration**
   - Family/group budgets with shared accounts  
   - Goal co-contribution  

4. **Accessibility**
   - Improve keyboard navigation  
   - Screen-reader compatibility  

---

## 🛠️ Installation & Setup  

### **Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend runs at: `http://127.0.0.1:5000`

---

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

---

### **Proxy**
Configured in `vite.config.ts`:
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
    }
  }
}
```

---

# 👨‍💻 Author  
## John Octavio  
- GitHub: [ChocoCodes](https://github.com/ChocoCodes)  
- Developed as part of **CS50x 2024 Final Project**  
- Contact: [Email](johnrlnd1704@gmail.com)
---

## 📜 License  
MIT License. Free for personal and educational use.  
