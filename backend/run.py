from app import create_app

app = create_app()
if __name__ == "__main__":
    # TODO: add db initalization if tables are not created
    app.run(debug=True)