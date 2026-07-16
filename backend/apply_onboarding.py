import re
import os

def update_user_py():
    path = r'd:\hospital_management\startup\backend\app\models\user.py'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add PENDING to RoleEnum
    content = content.replace(
        'class RoleEnum(str, enum.Enum):\n    DOCTOR = "doctor"\n    PATIENT = "patient"\n    RETIRED_POLICE = "retired_police"\n    ADMIN = "admin"',
        'class RoleEnum(str, enum.Enum):\n    DOCTOR = "doctor"\n    PATIENT = "patient"\n    RETIRED_POLICE = "retired_police"\n    ADMIN = "admin"\n    PENDING = "pending"'
    )
    
    # Update default role
    content = content.replace(
        'role = Column(SQLEnum(RoleEnum), default=RoleEnum.PATIENT, nullable=False)',
        'role = Column(SQLEnum(RoleEnum), default=RoleEnum.PENDING, nullable=False)'
    )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated user.py")

def update_auth_py():
    path = r'd:\hospital_management\startup\backend\app\api\v1\auth.py'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add SetRoleRequest schema import if not present, but it's easier to just define it inline or in schemas/auth.py
    # Actually, we can define a small Pydantic model at the top of auth.py
    if "class SetRoleRequest" not in content:
        import_replacement = "from pydantic import BaseModel\n\nclass SetRoleRequest(BaseModel):\n    role: str\n\n"
        content = content.replace("router = APIRouter(prefix=\"/auth\", tags=[\"auth\"])", import_replacement + "router = APIRouter(prefix=\"/auth\", tags=[\"auth\"])")

    # Update /register
    # role=RoleEnum(payload.role.value) if payload.role else RoleEnum.PENDING
    # Wait, payload is RegisterRequest, which requires role? Let's check schemas/auth.py later, but for now we can just force it to PENDING for new users
    content = re.sub(
        r'role=RoleEnum\(payload\.role\.value\),',
        r'role=RoleEnum.PENDING,',
        content
    )

    # Update /google-login
    content = content.replace(
        'role=RoleEnum.PATIENT,',
        'role=RoleEnum.PENDING,'
    )

    # Add /set-role endpoint
    set_role_code = """
@router.post("/set-role", response_model=LoginResponse)
def set_role(payload: SetRoleRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    role_str = payload.role.lower().strip()
    if role_str not in ["doctor", "patient"]:
        raise HTTPException(status_code=400, detail="Invalid role selected")
        
    user.role = RoleEnum(role_str)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token(data={"email": user.email, "role": user.role.value})
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value,
        profile_image=user.profile_image,
        bio=user.bio,
        city=user.city,
        specialization=user.specialization,
        hospital=user.hospital,
        followers_count=user.followers_count or 0,
        following_count=user.following_count or 0,
        posts_count=user.posts_count or 0,
        is_verified=user.is_verified or False,
    )

    return LoginResponse(
        message="Role updated successfully",
        access_token=access_token,
        token_type="bearer",
        user=user_response,
    )
"""
    if "/set-role" not in content:
        content += set_role_code
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated auth.py")

def update_api_js():
    path = r'd:\hospital_management\startup\frontend\src\services\api.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "setUserRole" not in content:
        code = """
export const setUserRole = async (role, token) =>
  request('/api/v1/auth/set-role', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: { role },
  });
"""
        content += code
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated api.js")

def update_app_jsx():
    path = r'd:\hospital_management\startup\frontend\src\App.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_route = """currentRole ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />"""
    new_route = """currentRole && currentRole !== 'pending' ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />"""
    
    content = content.replace(old_route, new_route)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated App.jsx")

def update_login_jsx():
    path = r'd:\hospital_management\startup\frontend\src\pages\LoginNew.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update persistAuthSession
    old_persist = """if (role) {
      localStorage.setItem('currentRole', role);
      setCurrentRole(role);
    }"""
    new_persist = """if (role && role !== 'pending') {
      localStorage.setItem('currentRole', role);
      setCurrentRole(role);
    } else {
      localStorage.removeItem('currentRole');
      setCurrentRole(null);
    }"""
    content = content.replace(old_persist, new_persist)

    # Update role payload in registration
    content = content.replace("role: 'patient',", "role: 'pending',")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated LoginNew.jsx")

if __name__ == "__main__":
    update_user_py()
    update_auth_py()
    update_api_js()
    update_app_jsx()
    update_login_jsx()
