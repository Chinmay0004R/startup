import pathlib
import py_compile

files = [
    pathlib.Path('app/services/cloudinary_service.py'),
    pathlib.Path('app/api/v1/users.py'),
    pathlib.Path('app/api/v1/doctor_profiles.py'),
    pathlib.Path('app/api/v1/doctors.py'),
]
for file_path in files:
    py_compile.compile(str(file_path), doraise=True)
print('compile ok')
