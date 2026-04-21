import requests
import json
import random

BASE_URL = "http://localhost:8000/api"

def test_atlas_flow():
    # 1. Register a new user
    email = f"atlas_{random.randint(1000, 9999)}@test.com"
    print(f"--- 1. Registering user: {email} ---")
    reg_data = {
        "nombre": "Atlas Tester",
        "email": email,
        "password": "atlas123"
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    reg_resp = resp.json()
    print(reg_resp)
    user_id = reg_resp.get("user_id")

    # 2. Login
    print("\n--- 2. Logging in ---")
    login_data = {
        "identifier": email,
        "password": "atlas123"
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    login_resp = resp.json()
    print(login_resp)
    token = login_resp.get("access_token")
    if not user_id:
        user_id = login_resp.get("user", {}).get("id")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Group "Prueba Atlas Mobile"
    print("\n--- 3. Creating group: Prueba Atlas Mobile ---")
    group_data = {
        "admin_id": user_id,
        "nombre": "Prueba Atlas Mobile"
    }
    resp = requests.post(f"{BASE_URL}/groups/create", json=group_data, headers=headers)
    group_resp = resp.json()
    print(group_resp)
    group_id = group_resp.get("group_id")

    # 4. Add Expense
    print("\n--- 4. Adding expense ---")
    item_data = {
        "group_id": group_id,
        "nombre": "Gasto Nube",
        "precio": 1200.50,
        "cantidad": 1,
        "comprador_id": user_id,
        "participantes_ids": [user_id]
    }
    resp = requests.post(f"{BASE_URL}/groups/add-item", json=item_data, headers=headers)
    print(resp.json())

    # 5. Verify Reading (Web perspective)
    print("\n--- 5. Verifying reading from Cloud ---")
    resp = requests.get(f"{BASE_URL}/groups/user/{user_id}", headers=headers)
    groups = resp.json()
    print(groups)
    
    found = any(g.get("nombre") == "Prueba Atlas Mobile" for g in groups)
    if found:
        print("\nSUCCESS: 'Prueba Atlas Mobile' found in cloud database.")
    else:
        print("\nFAILURE: 'Prueba Atlas Mobile' NOT found.")

if __name__ == "__main__":
    test_atlas_flow()
