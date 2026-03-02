from flask import Flask, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "secretkey"

# 🔴 CHANGE USERNAME & PASSWORD
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://sura:sura#007@localhost/leavemanager'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------- MODEL --------
class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(200))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# -------- INIT DB --------
with app.app_context():
    db.create_all()

    user = Staff.query.filter_by(username="staff1").first()
    if not user:
        user = Staff(username="staff1")
        user.set_password("1234")
        db.session.add(user)
        db.session.commit()


# -------- ROUTES --------
@app.route("/")
def home():
    return redirect("/login")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = Staff.query.filter_by(username=username).first()

        if user and user.check_password(password):
            session["user"] = username
            return redirect("/dashboard")
        else:
            return "Login Failed"

    return """
        <h2>Login</h2>
        <form method="POST">
            Username: <input name="username"><br><br>
            Password: <input type="password" name="password"><br><br>
            <input type="submit">
        </form>
    """


@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")

    return f"""
        <h1>Dashboard</h1>
        <p>Welcome {session['user']}</p>
        <a href="/logout">Logout</a>
    """


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True)