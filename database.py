from sqlalchemy import create_engine

DATABASE_URL = "postgresql+psycopg://postgres:1232@localhost:5432/taskdb"

engine = create_engine(DATABASE_URL)