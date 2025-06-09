from app import create_app, db

app = create_app()
if __name__ == "__main__":
    # Initialize DB if tables does not exist
    with app.app_context():
        db.create_all()
        print('DB Created')
    app.run(debug=True)