import re

def update_user_py():
    path = r'd:\hospital_management\startup\backend\app\models\user.py'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(
        'doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)',
        'doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")'
    )
    content = content.replace(
        'patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)',
        'patient_profile = relationship("PatientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")'
    )
    content = content.replace(
        'retired_police_profile = relationship("RetiredPoliceProfile", back_populates="user", uselist=False)',
        'retired_police_profile = relationship("RetiredPoliceProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")'
    )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated user.py")

def update_users_api_py():
    path = r'd:\hospital_management\startup\backend\app\api\v1\users.py'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add delete endpoint
    if "@router.delete(\"/me\")" not in content:
        imports_to_add = """from pydantic import BaseModel\nfrom app.core.security import verify_password\nfrom app.models.certificate import Certificate\n\nclass DeleteAccountRequest(BaseModel):\n    password: str\n\n"""
        
        delete_endpoint = """
@router.delete("/me")
def delete_my_account(payload: DeleteAccountRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Verify password if user has a standard password
    if not user.hashed_password.startswith("google-oauth:"):
        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    try:
        # Collect Cloudinary public IDs to delete
        public_ids_to_delete = []
        if user.profile_image_public_id:
            public_ids_to_delete.append(user.profile_image_public_id)
        
        if user.doctor_profile:
            if user.doctor_profile.license_public_id:
                public_ids_to_delete.append(user.doctor_profile.license_public_id)
            for cert in user.doctor_profile.certificates:
                if cert.public_id:
                    public_ids_to_delete.append(cert.public_id)
        
        # Delete Cloudinary assets
        for public_id in public_ids_to_delete:
            try:
                delete_asset(public_id)
            except Exception as e:
                print(f"Failed to delete Cloudinary asset {public_id}: {e}")

        # Database deletion
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete account")
        
    return {"message": "Account deleted successfully"}
"""
        # Inject the schema and endpoint
        content = content.replace("router = APIRouter(prefix=\"/users\", tags=[\"users\"])", imports_to_add + "router = APIRouter(prefix=\"/users\", tags=[\"users\"])")
        content += delete_endpoint

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated users.py")

def update_api_js():
    path = r'd:\hospital_management\startup\frontend\src\services\api.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "deleteAccount" not in content:
        code = """
export const deleteAccount = async (payload, token) =>
  request('/api/v1/users/me', {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: payload,
  });
"""
        content += code
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated api.js")

if __name__ == "__main__":
    update_user_py()
    update_users_api_py()
    update_api_js()
