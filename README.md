# Teacher–Student CRUD API

Role-based REST API built with Node.js, Express, MongoDB/Mongoose, bcrypt and JWT.

## 1. Requirements
- Node.js (LTS)
- MongoDB running locally, or a MongoDB Atlas connection string
- Postman (for testing)

## 2. Setup
```bash
npm install
```
Copy `.env.example` to `.env`, then set:
- `MONGODB_URL`
- a long, private `JWT_SECRET`
- a private `FACULTY_SIGNUP_CODE`

Start:
```bash
npm run dev
```
or:
```bash
npm start
```

Server: `http://localhost:3000`

## 3. Roles and permissions
- `STUDENT`: signup/login; read and update own account/profile; create own profile.
- `FACULTY`: same self-service operations; list active students/faculty; update student account/profile; soft-delete students.
- Public signup defaults to `STUDENT`.
- `FACULTY` signup requires the private `facultyCode`.
- Clients cannot set `isActive`, change roles after signup, or set another user's profile through self-service routes.

## 4. API endpoints
Base URL: `http://localhost:3000/api/v1/user`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/signup` | Public | Register student or code-authorized faculty |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/me` | Logged-in user | Get own account/profile |
| PUT | `/me` | Logged-in user | Update own name/email |
| POST | `/me/profile` | Logged-in user | Create own profile |
| PUT | `/me/profile` | Logged-in user | Update own profile |
| GET | `/students` | Faculty | List active students |
| GET | `/faculty` | Faculty | List active faculty |
| PUT | `/students/:id` | Faculty | Update active student's name/email |
| PUT | `/students/:id/profile` | Faculty | Update active student's profile |
| DELETE | `/students/:id` | Faculty | Soft-delete student (`isActive=false`) |

For protected routes add this header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 5. Postman examples

### Student signup
`POST /signup`
```json
{
  "name": "Asha",
  "email": "asha@example.com",
  "password": "asha123"
}
```

### Faculty signup
`POST /signup`
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "john123",
  "role": "FACULTY",
  "facultyCode": "YOUR_FACULTY_SIGNUP_CODE"
}
```

### Login
`POST /login`
```json
{
  "email": "asha@example.com",
  "password": "asha123"
}
```
Copy the `token` from the response for protected requests.

### Create own profile
`POST /me/profile`
```json
{
  "age": 21,
  "dob": "2005-05-15",
  "bio": "Engineering student"
}
```

### Update own account
`PUT /me`
```json
{
  "name": "Asha Updated"
}
```

### Update own profile
`PUT /me/profile`
```json
{
  "age": 22,
  "bio": "Final year engineering student"
}
```

### Faculty updates a student
`PUT /students/STUDENT_MONGODB_ID`
```json
{
  "name": "Asha Updated"
}
```

### Faculty updates a student's profile
`PUT /students/STUDENT_MONGODB_ID/profile`
```json
{
  "age": 22,
  "bio": "Updated by faculty"
}
```

### Faculty soft-deletes a student
`DELETE /students/STUDENT_MONGODB_ID`

## 6. Notes
- Passwords are hashed using bcrypt and are never returned in API responses.
- JWT payload contains user ID, email and role. Middleware also checks the current active account and role in MongoDB.
- Soft-deleted users remain in MongoDB but cannot log in or use protected routes.
- This demo uses a shared faculty signup code. For production, replace it with administrator approval or invitation-based faculty provisioning.
- Add rate limiting, stronger input validation, email verification and audit logging before production use.
