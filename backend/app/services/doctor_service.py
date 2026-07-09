from app.models.doctor import Doctor


def get_doctors():
    return [
        Doctor(id=1, name="Dr. Jane Doe", specialty="Cardiology", email="jane.doe@example.com"),
    ]
