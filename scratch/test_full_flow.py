import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_flow():
    # 1. Register
    print("--- 1. Registering user ---")
    reg_data = {
        "nombre": "Mario Auditor",
        "email": "mario@test.com",
        "password": "mario123"
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    reg_resp = resp.json()
    print(reg_resp)
    user_id = reg_resp.get("user_id")

    # 2. Login
    print("\n--- 2. Logging in ---")
    login_data = {
        "identifier": "mario@test.com",
        "password": "mario123"
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    login_resp = resp.json()
    print(login_resp)
    token = login_resp.get("access_token")
    if not user_id:
        user_id = login_resp.get("user", {}).get("id")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Group (Simulating Mobile)
    print("\n--- 3. Creating group (Mobile Simulation) ---")
    group_data = {
        "admin_id": user_id,
        "nombre": "Cena de Auditoría"
    }
    resp = requests.post(f"{BASE_URL}/groups/create", json=group_data, headers=headers)
    group_resp = resp.json()
    print(group_resp)
    group_id = group_resp.get("group_id")

    # 4. Add Expense (Simulating Mobile)
    print("\n--- 4. Adding expense (Mobile Simulation) ---")
    item_data = {
        "group_id": group_id,
        "nombre": "Pizza de Auditor",
        "precio": 450.0,
        "cantidad": 1,
        "comprador_id": user_id,
        "participantes_ids": [user_id]
    }
    resp = requests.post(f"{BASE_URL}/groups/add-item", json=item_data, headers=headers)
    print(resp.json())

    # 5. Verify from "Web" perspective (Listing groups for user)
    print("\n--- 5. Verifying from Web (Get user groups) ---")
    resp = requests.get(f"{BASE_URL}/groups/user/{user_id}", headers=headers)
    print(resp.json())

if __name__ == "__main__":
    test_flow()
