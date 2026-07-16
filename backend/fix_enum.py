import psycopg2

conn = psycopg2.connect('postgresql://postgres:m1yur9@localhost:5432/doctor_safety_network')
conn.autocommit = True
cur = conn.cursor()

try:
    cur.execute("ALTER TYPE roleenum ADD VALUE IF NOT EXISTS 'PENDING'")
    print("Added PENDING")
except Exception as e:
    print(f"Error adding PENDING: {e}")

try:
    cur.execute("ALTER TYPE roleenum ADD VALUE IF NOT EXISTS 'ADMIN'")
    print("Added ADMIN")
except Exception as e:
    print(f"Error adding ADMIN: {e}")

try:
    cur.execute("ALTER TYPE roleenum ADD VALUE IF NOT EXISTS 'pending'")
    print("Added pending")
except Exception as e:
    print(f"Error adding pending: {e}")

cur.execute("SELECT unnest(enum_range(NULL::roleenum))")
print("Current ENUM values:", cur.fetchall())
