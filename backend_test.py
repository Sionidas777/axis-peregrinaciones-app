#!/usr/bin/env python3
import requests
import json
import uuid
import os
from datetime import datetime, timedelta

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1]
            break

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

# Test data with Spanish content
admin_user = {
    "email": f"admin_test_{uuid.uuid4()}@pilgrimageapp.com",
    "password": "Admin123!",
    "name": "Padre Miguel Test",
    "role": "admin"
}

pilgrim_user = {
    "email": f"pilgrim_test_{uuid.uuid4()}@email.com",
    "password": "Pilgrim123!",
    "name": "María Santos Test",
    "role": "pilgrim"
}

# Test data for creating resources
test_group = {
    "name": "Peregrinación a Santiago de Compostela 2025",
    "destination": "Santiago de Compostela",
    "start_date": "2025-06-15",
    "end_date": "2025-06-25",
    "status": "upcoming"
}

test_destination = {
    "name": "Santiago de Compostela",
    "country": "España",
    "description": "Lugar de peregrinación cristiana donde se encuentra la tumba del apóstol Santiago",
    "facts": [
        "El Camino de Santiago es una red de rutas que conducen a la catedral",
        "La catedral alberga el botafumeiro, uno de los incensarios más grandes del mundo",
        "La ciudad fue declarada Patrimonio de la Humanidad por la UNESCO en 1985",
        "La tradición de la peregrinación comenzó en el siglo IX"
    ],
    "spiritual_significance": "Santiago de Compostela es uno de los tres principales lugares de peregrinación cristiana, junto con Jerusalén y Roma.",
    "image_url": "https://images.unsplash.com/photo-1558799244-d3e1b15d2db5"
}

test_itinerary = {
    "group_id": "",  # Will be filled after group creation
    "group_name": "Peregrinación a Santiago de Compostela 2025",
    "flights": {
        "departure": {
            "from": "Madrid",
            "to": "Santiago de Compostela",
            "date": "2025-06-15",
            "time": "10:00",
            "airline": "Iberia",
            "flight_number": "IB3878"
        },
        "return": {
            "from": "Santiago de Compostela",
            "to": "Madrid",
            "date": "2025-06-25",
            "time": "18:30",
            "airline": "Iberia",
            "flight_number": "IB3879"
        }
    },
    "included": [
        "Alojamiento en hoteles de 3 estrellas",
        "Desayuno y cena",
        "Guía espiritual",
        "Transporte entre sitios"
    ],
    "not_included": [
        "Almuerzo",
        "Gastos personales",
        "Seguro de viaje"
    ],
    "daily_schedule": [
        {
            "day": 1,
            "date": "2025-06-15",
            "title": "Llegada a Santiago",
            "activities": [
                "Llegada al aeropuerto de Santiago",
                "Traslado al hotel",
                "Misa de bienvenida en la Catedral"
            ],
            "biblical_quote": "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. - Mateo 11:28",
            "accommodation": "Hotel Compostela"
        },
        {
            "day": 2,
            "date": "2025-06-16",
            "title": "Visita a la Catedral",
            "activities": [
                "Desayuno en el hotel",
                "Visita guiada a la Catedral de Santiago",
                "Tiempo libre para oración personal",
                "Cena y reflexión grupal"
            ],
            "biblical_quote": "Yo soy el camino, la verdad y la vida. - Juan 14:6",
            "accommodation": "Hotel Compostela"
        }
    ]
}

# Store tokens and IDs
tokens = {
    "admin": None,
    "pilgrim": None
}

created_ids = {
    "admin_id": None,
    "pilgrim_id": None,
    "group_id": None,
    "destination_id": None,
    "itinerary_id": None
}

# Test results for spiritual content functionality
test_results = {
    "spiritual_content_get_all": {"success": False, "details": ""},
    "spiritual_content_data_structure": {"success": False, "details": ""},
    "spiritual_content_categories": {"success": False, "details": ""},
    "spiritual_content_by_category": {"success": False, "details": ""},
    "spiritual_content_format_analysis": {"success": False, "details": ""}
}

def print_separator():
    print("\n" + "="*80 + "\n")

def print_test_header(test_name):
    print_separator()
    print(f"TESTING: {test_name}")
    print_separator()

def print_response(response):
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def run_tests():
    # Focus on pilgrim registration functionality as requested
    test_pilgrim_registration_functionality()
    
    # Print summary
    print_test_summary()

def test_pilgrim_registration_functionality():
    """
    Comprehensive test for admin pilgrim registration functionality
    Tests the specific requirements mentioned in the review request
    """
    print_test_header("PILGRIM REGISTRATION FUNCTIONALITY - COMPREHENSIVE TEST")
    
    # Step 1: Setup admin authentication
    admin_token = setup_admin_authentication()
    if not admin_token:
        return
    
    # Step 2: Test GET /api/users endpoint
    test_get_users_endpoint(admin_token)
    
    # Step 3: Test POST /api/auth/register endpoint for pilgrims
    test_register_pilgrim_endpoint(admin_token)
    
    # Step 4: Test validation and error handling
    test_pilgrim_registration_validation()
    
    # Step 5: Test integration with groups
    test_pilgrim_group_integration(admin_token)
    
    # Step 6: Test error handling scenarios
    test_pilgrim_registration_error_handling()

def setup_admin_authentication():
    """Setup admin authentication and return token"""
    print_test_header("SETUP - Admin Authentication")
    
    # First try with existing admin credentials
    existing_admin = {
        "email": "admin@pilgrimageapp.com",
        "password": "admin123"
    }
    
    print("Attempting login with existing admin credentials...")
    response = requests.post(f"{API_URL}/auth/login", json=existing_admin)
    print_response(response)
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("✅ Admin authentication successful with existing credentials")
        return token
    
    # If existing admin doesn't work, create new admin
    print("\nExisting admin login failed, creating new admin...")
    response = requests.post(f"{API_URL}/auth/register", json=admin_user)
    print_response(response)
    
    if response.status_code == 200:
        print("Admin user created, attempting login...")
        response = requests.post(f"{API_URL}/auth/login", json={
            "email": admin_user["email"],
            "password": admin_user["password"]
        })
        print_response(response)
        
        if response.status_code == 200:
            token = response.json()["access_token"]
            print("✅ Admin authentication successful with new credentials")
            return token
    
    print("❌ Failed to setup admin authentication")
    return None

def test_get_users_endpoint(admin_token):
    """Test GET /api/users endpoint"""
    print_test_header("TEST 1: GET /api/users Endpoint")
    
    print("Testing GET /api/users endpoint...")
    response = requests.get(
        f"{API_URL}/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        try:
            users = response.json()
            if isinstance(users, list):
                print(f"✅ Successfully retrieved {len(users)} users")
                
                # Check for pilgrims in the list
                pilgrim_count = 0
                for user in users:
                    if user.get("role") == "pilgrim":
                        pilgrim_count += 1
                        print(f"Found pilgrim: {user.get('name')} ({user.get('email')})")
                
                print(f"Found {pilgrim_count} pilgrims in the user list")
                test_results["pilgrim_registration_get_users"]["success"] = True
                test_results["pilgrim_registration_get_users"]["details"] = f"Successfully retrieved {len(users)} users including {pilgrim_count} pilgrims"
            else:
                test_results["pilgrim_registration_get_users"]["details"] = f"Expected list but got: {type(users)}"
        except Exception as e:
            test_results["pilgrim_registration_get_users"]["details"] = f"Error parsing response: {str(e)}"
    else:
        test_results["pilgrim_registration_get_users"]["details"] = f"Failed with status {response.status_code}: {response.text}"

def test_register_pilgrim_endpoint(admin_token):
    """Test POST /api/auth/register endpoint for pilgrims"""
    print_test_header("TEST 2: POST /api/auth/register for Pilgrims")
    
    # Test data as suggested in the review request
    test_pilgrim_data = {
        "name": "Juan Pérez",
        "email": f"juan.perez.{uuid.uuid4()}@test.com",
        "password": "testpassword123",
        "role": "pilgrim",
        "group_id": "group_001"  # Using existing group from database initialization
    }
    
    print("Registering new pilgrim with complete data...")
    print(f"Test data: {json.dumps(test_pilgrim_data, indent=2)}")
    
    response = requests.post(f"{API_URL}/auth/register", json=test_pilgrim_data)
    print_response(response)
    
    if response.status_code == 200:
        pilgrim_data = response.json()
        
        # Verify all required fields are present and correct
        checks = [
            ("id", pilgrim_data.get("id") is not None),
            ("name", pilgrim_data.get("name") == test_pilgrim_data["name"]),
            ("email", pilgrim_data.get("email") == test_pilgrim_data["email"]),
            ("role", pilgrim_data.get("role") == "pilgrim"),
            ("group_id", pilgrim_data.get("group_id") == test_pilgrim_data["group_id"]),
            ("created_at", pilgrim_data.get("created_at") is not None)
        ]
        
        all_checks_passed = True
        for field, check in checks:
            status = "✅" if check else "❌"
            print(f"{status} {field}: {pilgrim_data.get(field)}")
            if not check:
                all_checks_passed = False
        
        if all_checks_passed:
            print("✅ All field validations passed")
            
            # Store the created pilgrim ID for later tests
            created_ids["pilgrim_id"] = pilgrim_data["id"]
            
            # Test that the pilgrim can login
            print("\nTesting login with newly created pilgrim...")
            login_response = requests.post(f"{API_URL}/auth/login", json={
                "email": test_pilgrim_data["email"],
                "password": test_pilgrim_data["password"]
            })
            print_response(login_response)
            
            if login_response.status_code == 200:
                print("✅ Newly created pilgrim can login successfully")
                test_results["pilgrim_registration_register"]["success"] = True
                test_results["pilgrim_registration_register"]["details"] = "Successfully registered pilgrim with all required fields and verified login capability"
            else:
                test_results["pilgrim_registration_register"]["details"] = f"Pilgrim created but login failed: {login_response.text}"
        else:
            test_results["pilgrim_registration_register"]["details"] = "Pilgrim created but some field validations failed"
    else:
        test_results["pilgrim_registration_register"]["details"] = f"Failed to register pilgrim: Status {response.status_code}, {response.text}"

def test_pilgrim_registration_validation():
    """Test validation of required fields"""
    print_test_header("TEST 3: Validation and Required Fields")
    
    validation_tests = [
        {
            "name": "Missing name field",
            "data": {
                "email": f"test.{uuid.uuid4()}@test.com",
                "password": "testpassword123",
                "role": "pilgrim"
            },
            "expected_status": 422
        },
        {
            "name": "Missing email field",
            "data": {
                "name": "Test User",
                "password": "testpassword123",
                "role": "pilgrim"
            },
            "expected_status": 422
        },
        {
            "name": "Missing password field",
            "data": {
                "name": "Test User",
                "email": f"test.{uuid.uuid4()}@test.com",
                "role": "pilgrim"
            },
            "expected_status": 422
        },
        {
            "name": "Invalid email format",
            "data": {
                "name": "Test User",
                "email": "invalid-email",
                "password": "testpassword123",
                "role": "pilgrim"
            },
            "expected_status": 422
        }
    ]
    
    validation_results = []
    
    for test_case in validation_tests:
        print(f"\nTesting: {test_case['name']}")
        response = requests.post(f"{API_URL}/auth/register", json=test_case["data"])
        print_response(response)
        
        if response.status_code == test_case["expected_status"]:
            print(f"✅ Correctly returned status {response.status_code}")
            validation_results.append(True)
        else:
            print(f"❌ Expected status {test_case['expected_status']}, got {response.status_code}")
            validation_results.append(False)
    
    if all(validation_results):
        test_results["pilgrim_registration_validation"]["success"] = True
        test_results["pilgrim_registration_validation"]["details"] = "All validation tests passed - required fields are properly validated"
    else:
        failed_count = len([r for r in validation_results if not r])
        test_results["pilgrim_registration_validation"]["details"] = f"{failed_count} out of {len(validation_tests)} validation tests failed"

def test_pilgrim_group_integration(admin_token):
    """Test integration with groups"""
    print_test_header("TEST 4: Group Integration")
    
    # First, get available groups
    print("Getting available groups...")
    response = requests.get(
        f"{API_URL}/groups",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    print_response(response)
    
    if response.status_code != 200:
        test_results["pilgrim_registration_group_integration"]["details"] = "Failed to retrieve groups for testing"
        return
    
    groups = response.json()
    if not groups:
        test_results["pilgrim_registration_group_integration"]["details"] = "No groups available for testing"
        return
    
    # Use the first available group
    test_group_id = groups[0]["id"]
    print(f"Using group ID: {test_group_id} ({groups[0]['name']})")
    
    # Register pilgrim with group assignment
    test_pilgrim_with_group = {
        "name": "María González",
        "email": f"maria.gonzalez.{uuid.uuid4()}@test.com",
        "password": "testpassword123",
        "role": "pilgrim",
        "group_id": test_group_id
    }
    
    print("Registering pilgrim with group assignment...")
    response = requests.post(f"{API_URL}/auth/register", json=test_pilgrim_with_group)
    print_response(response)
    
    if response.status_code == 200:
        pilgrim_data = response.json()
        
        if pilgrim_data.get("group_id") == test_group_id:
            print("✅ Pilgrim successfully assigned to group")
            
            # Verify the group now contains the pilgrim
            print(f"\nVerifying pilgrim was added to group {test_group_id}...")
            response = requests.get(
                f"{API_URL}/groups/{test_group_id}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            print_response(response)
            
            if response.status_code == 200:
                group_data = response.json()
                pilgrims_in_group = group_data.get("pilgrims", [])
                
                # Check if our pilgrim is in the group
                pilgrim_found = False
                for pilgrim in pilgrims_in_group:
                    if pilgrim.get("email") == test_pilgrim_with_group["email"]:
                        pilgrim_found = True
                        break
                
                if pilgrim_found:
                    print("✅ Pilgrim successfully added to group's pilgrim list")
                    test_results["pilgrim_registration_group_integration"]["success"] = True
                    test_results["pilgrim_registration_group_integration"]["details"] = "Successfully registered pilgrim with group assignment and verified group membership"
                else:
                    test_results["pilgrim_registration_group_integration"]["details"] = "Pilgrim registered with group_id but not found in group's pilgrim list"
            else:
                test_results["pilgrim_registration_group_integration"]["details"] = f"Failed to verify group membership: {response.text}"
        else:
            test_results["pilgrim_registration_group_integration"]["details"] = f"Expected group_id {test_group_id}, got {pilgrim_data.get('group_id')}"
    else:
        test_results["pilgrim_registration_group_integration"]["details"] = f"Failed to register pilgrim with group: {response.text}"

def test_pilgrim_registration_error_handling():
    """Test error handling scenarios"""
    print_test_header("TEST 5: Error Handling")
    
    # Test duplicate email registration
    duplicate_email = f"duplicate.{uuid.uuid4()}@test.com"
    
    # First registration
    first_pilgrim = {
        "name": "First User",
        "email": duplicate_email,
        "password": "testpassword123",
        "role": "pilgrim"
    }
    
    print("Registering first pilgrim...")
    response = requests.post(f"{API_URL}/auth/register", json=first_pilgrim)
    print_response(response)
    
    if response.status_code == 200:
        print("✅ First pilgrim registered successfully")
        
        # Attempt duplicate registration
        second_pilgrim = {
            "name": "Second User",
            "email": duplicate_email,  # Same email
            "password": "differentpassword",
            "role": "pilgrim"
        }
        
        print("\nAttempting duplicate email registration...")
        response = requests.post(f"{API_URL}/auth/register", json=second_pilgrim)
        print_response(response)
        
        if response.status_code == 400:
            print("✅ Correctly rejected duplicate email registration")
            
            # Verify error message format is compatible with handleAPIError
            try:
                error_data = response.json()
                if "detail" in error_data:
                    print(f"✅ Error response has proper format: {error_data['detail']}")
                    test_results["pilgrim_registration_error_handling"]["success"] = True
                    test_results["pilgrim_registration_error_handling"]["details"] = "Properly handles duplicate email registration with correct error format"
                else:
                    test_results["pilgrim_registration_error_handling"]["details"] = "Error response missing 'detail' field for handleAPIError compatibility"
            except:
                test_results["pilgrim_registration_error_handling"]["details"] = "Error response is not valid JSON"
        else:
            test_results["pilgrim_registration_error_handling"]["details"] = f"Expected status 400 for duplicate email, got {response.status_code}"
    else:
        test_results["pilgrim_registration_error_handling"]["details"] = f"Failed to register first pilgrim for duplicate test: {response.text}"

def test_auth_register():
    print_test_header("Authentication - Register")
    
    # Test admin registration
    print("Registering admin user...")
    response = requests.post(f"{API_URL}/auth/register", json=admin_user)
    print_response(response)
    
    if response.status_code == 200:
        created_ids["admin_id"] = response.json()["id"]
        print(f"Admin user created with ID: {created_ids['admin_id']}")
        
        # Test pilgrim registration
        print("\nRegistering pilgrim user...")
        response = requests.post(f"{API_URL}/auth/register", json=pilgrim_user)
        print_response(response)
        
        if response.status_code == 200:
            created_ids["pilgrim_id"] = response.json()["id"]
            print(f"Pilgrim user created with ID: {created_ids['pilgrim_id']}")
            test_results["auth_register"]["success"] = True
            test_results["auth_register"]["details"] = "Successfully registered both admin and pilgrim users with Spanish names"
        else:
            test_results["auth_register"]["details"] = f"Failed to register pilgrim user: {response.text}"
    else:
        test_results["auth_register"]["details"] = f"Failed to register admin user: {response.text}"

def test_auth_login():
    print_test_header("Authentication - Login")
    
    # Test admin login
    print("Logging in as admin...")
    response = requests.post(f"{API_URL}/auth/login", json={
        "email": admin_user["email"],
        "password": admin_user["password"]
    })
    print_response(response)
    
    if response.status_code == 200:
        tokens["admin"] = response.json()["access_token"]
        print(f"Admin login successful, token received")
        
        # Test pilgrim login
        print("\nLogging in as pilgrim...")
        response = requests.post(f"{API_URL}/auth/login", json={
            "email": pilgrim_user["email"],
            "password": pilgrim_user["password"]
        })
        print_response(response)
        
        if response.status_code == 200:
            tokens["pilgrim"] = response.json()["access_token"]
            print(f"Pilgrim login successful, token received")
            test_results["auth_login"]["success"] = True
            test_results["auth_login"]["details"] = "Successfully logged in with both admin and pilgrim users"
        else:
            test_results["auth_login"]["details"] = f"Failed to login as pilgrim: {response.text}"
    else:
        test_results["auth_login"]["details"] = f"Failed to login as admin: {response.text}"

def test_auth_me():
    print_test_header("Authentication - Get Current User")
    
    if not tokens["admin"]:
        test_results["auth_me"]["details"] = "Skipped because admin login failed"
        return
    
    # Test with admin token
    print("Getting admin user info...")
    response = requests.get(
        f"{API_URL}/auth/me",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        admin_info = response.json()
        if admin_info["name"] == admin_user["name"] and admin_info["role"] == "admin":
            print("Admin user info verified")
            
            # Test with pilgrim token
            if tokens["pilgrim"]:
                print("\nGetting pilgrim user info...")
                response = requests.get(
                    f"{API_URL}/auth/me",
                    headers={"Authorization": f"Bearer {tokens['pilgrim']}"}
                )
                print_response(response)
                
                if response.status_code == 200:
                    pilgrim_info = response.json()
                    if pilgrim_info["name"] == pilgrim_user["name"] and pilgrim_info["role"] == "pilgrim":
                        print("Pilgrim user info verified")
                        test_results["auth_me"]["success"] = True
                        test_results["auth_me"]["details"] = "Successfully retrieved user info for both admin and pilgrim"
                    else:
                        test_results["auth_me"]["details"] = "Pilgrim user info doesn't match expected values"
                else:
                    test_results["auth_me"]["details"] = f"Failed to get pilgrim user info: {response.text}"
            else:
                test_results["auth_me"]["details"] = "Skipped pilgrim test because pilgrim login failed"
        else:
            test_results["auth_me"]["details"] = "Admin user info doesn't match expected values"
    else:
        test_results["auth_me"]["details"] = f"Failed to get admin user info: {response.text}"

def test_groups_create():
    print_test_header("Pilgrimage Groups - Create")
    
    if not tokens["admin"]:
        test_results["groups_create"]["details"] = "Skipped because admin login failed"
        return
    
    print("Creating pilgrimage group...")
    response = requests.post(
        f"{API_URL}/groups",
        json=test_group,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        created_ids["group_id"] = response.json()["id"]
        print(f"Group created with ID: {created_ids['group_id']}")
        
        # Update pilgrim user to add them to the group
        print("\nAdding pilgrim to the group...")
        update_pilgrim = {
            "group_id": created_ids["group_id"]
        }
        
        # We need to update the pilgrim in the database directly since there's no API endpoint for this
        # For testing purposes, we'll just update the test_itinerary with the group_id
        test_itinerary["group_id"] = created_ids["group_id"]
        
        test_results["groups_create"]["success"] = True
        test_results["groups_create"]["details"] = f"Successfully created group with Spanish content: {test_group['name']}"
    else:
        test_results["groups_create"]["details"] = f"Failed to create group: {response.text}"

def test_groups_get_all():
    print_test_header("Pilgrimage Groups - Get All")
    
    if not tokens["admin"]:
        test_results["groups_get_all"]["details"] = "Skipped because admin login failed"
        return
    
    print("Getting all pilgrimage groups (admin only)...")
    response = requests.get(
        f"{API_URL}/groups",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        groups = response.json()
        if isinstance(groups, list):
            print(f"Retrieved {len(groups)} groups")
            
            # Verify our created group is in the list
            if created_ids["group_id"]:
                found = False
                for group in groups:
                    if group["id"] == created_ids["group_id"]:
                        found = True
                        break
                
                if found:
                    print(f"Found our created group in the list")
                    test_results["groups_get_all"]["success"] = True
                    test_results["groups_get_all"]["details"] = f"Successfully retrieved all groups including our test group"
                else:
                    test_results["groups_get_all"]["details"] = "Our created group was not found in the list"
            else:
                test_results["groups_get_all"]["details"] = "Skipped group verification because group creation failed"
        else:
            test_results["groups_get_all"]["details"] = "Response is not a list of groups"
    else:
        test_results["groups_get_all"]["details"] = f"Failed to get all groups: {response.text}"
    
    # Test that pilgrim cannot access all groups
    if tokens["pilgrim"]:
        print("\nAttempting to get all groups as pilgrim (should fail)...")
        response = requests.get(
            f"{API_URL}/groups",
            headers={"Authorization": f"Bearer {tokens['pilgrim']}"}
        )
        print_response(response)
        
        if response.status_code == 403:
            print("Correctly denied access to pilgrim")
        else:
            test_results["groups_get_all"]["details"] += " | WARNING: Pilgrim was not correctly denied access to all groups"

def test_groups_get_one():
    print_test_header("Pilgrimage Groups - Get One")
    
    if not tokens["admin"] or not created_ids["group_id"]:
        test_results["groups_get_one"]["details"] = "Skipped because admin login or group creation failed"
        return
    
    print("Getting specific pilgrimage group as admin...")
    response = requests.get(
        f"{API_URL}/groups/{created_ids['group_id']}",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        group = response.json()
        if group["id"] == created_ids["group_id"] and group["name"] == test_group["name"]:
            print("Group details verified")
            test_results["groups_get_one"]["success"] = True
            test_results["groups_get_one"]["details"] = "Successfully retrieved specific group with Spanish content"
        else:
            test_results["groups_get_one"]["details"] = "Group details don't match expected values"
    else:
        test_results["groups_get_one"]["details"] = f"Failed to get specific group: {response.text}"

def test_groups_update():
    print_test_header("Pilgrimage Groups - Update")
    
    if not tokens["admin"] or not created_ids["group_id"]:
        test_results["groups_update"]["details"] = "Skipped because admin login or group creation failed"
        return
    
    update_data = {
        "name": "Peregrinación a Santiago de Compostela 2025 (Actualizado)",
        "status": "active"
    }
    
    print("Updating pilgrimage group...")
    response = requests.put(
        f"{API_URL}/groups/{created_ids['group_id']}",
        json=update_data,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        updated_group = response.json()
        if (updated_group["id"] == created_ids["group_id"] and 
            updated_group["name"] == update_data["name"] and 
            updated_group["status"] == update_data["status"]):
            print("Group update verified")
            test_results["groups_update"]["success"] = True
            test_results["groups_update"]["details"] = "Successfully updated group with Spanish content"
        else:
            test_results["groups_update"]["details"] = "Updated group details don't match expected values"
    else:
        test_results["groups_update"]["details"] = f"Failed to update group: {response.text}"

def test_destinations_create():
    print_test_header("Destinations - Create")
    
    if not tokens["admin"]:
        test_results["destinations_create"]["details"] = "Skipped because admin login failed"
        return
    
    print("Creating destination...")
    response = requests.post(
        f"{API_URL}/destinations",
        json=test_destination,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        created_ids["destination_id"] = response.json()["id"]
        print(f"Destination created with ID: {created_ids['destination_id']}")
        test_results["destinations_create"]["success"] = True
        test_results["destinations_create"]["details"] = f"Successfully created destination with Spanish content: {test_destination['name']}"
    else:
        test_results["destinations_create"]["details"] = f"Failed to create destination: {response.text}"

def test_destinations_get_all():
    print_test_header("Destinations - Get All")
    
    print("Getting all destinations (public endpoint)...")
    response = requests.get(f"{API_URL}/destinations")
    print_response(response)
    
    if response.status_code == 200:
        destinations = response.json()
        if isinstance(destinations, list):
            print(f"Retrieved {len(destinations)} destinations")
            
            # Verify our created destination is in the list
            if created_ids["destination_id"]:
                found = False
                for dest in destinations:
                    if dest["id"] == created_ids["destination_id"]:
                        found = True
                        break
                
                if found:
                    print(f"Found our created destination in the list")
                    test_results["destinations_get_all"]["success"] = True
                    test_results["destinations_get_all"]["details"] = f"Successfully retrieved all destinations including our test destination with Spanish content"
                else:
                    test_results["destinations_get_all"]["details"] = "Our created destination was not found in the list"
            else:
                test_results["destinations_get_all"]["details"] = "Skipped destination verification because destination creation failed"
        else:
            test_results["destinations_get_all"]["details"] = "Response is not a list of destinations"
    else:
        test_results["destinations_get_all"]["details"] = f"Failed to get all destinations: {response.text}"

def test_destinations_get_one():
    print_test_header("Destinations - Get One")
    
    if not created_ids["destination_id"]:
        test_results["destinations_get_one"]["details"] = "Skipped because destination creation failed"
        return
    
    print("Getting specific destination...")
    response = requests.get(f"{API_URL}/destinations/{created_ids['destination_id']}")
    print_response(response)
    
    if response.status_code == 200:
        destination = response.json()
        if (destination["id"] == created_ids["destination_id"] and 
            destination["name"] == test_destination["name"] and
            destination["country"] == test_destination["country"]):
            print("Destination details verified")
            
            # Verify Spanish content
            if (destination["description"] == test_destination["description"] and
                destination["spiritual_significance"] == test_destination["spiritual_significance"]):
                print("Spanish content verified")
                test_results["destinations_get_one"]["success"] = True
                test_results["destinations_get_one"]["details"] = "Successfully retrieved specific destination with Spanish content"
            else:
                test_results["destinations_get_one"]["details"] = "Spanish content doesn't match expected values"
        else:
            test_results["destinations_get_one"]["details"] = "Destination details don't match expected values"
    else:
        test_results["destinations_get_one"]["details"] = f"Failed to get specific destination: {response.text}"

def test_itineraries_create():
    print_test_header("Itineraries - Create")
    
    if not tokens["admin"] or not created_ids["group_id"]:
        test_results["itineraries_create"]["details"] = "Skipped because admin login or group creation failed"
        return
    
    print("Creating itinerary...")
    response = requests.post(
        f"{API_URL}/itineraries",
        json=test_itinerary,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        created_ids["itinerary_id"] = response.json()["id"]
        print(f"Itinerary created with ID: {created_ids['itinerary_id']}")
        test_results["itineraries_create"]["success"] = True
        test_results["itineraries_create"]["details"] = f"Successfully created itinerary with Spanish content"
    else:
        test_results["itineraries_create"]["details"] = f"Failed to create itinerary: {response.text}"

def test_itineraries_get():
    print_test_header("Itineraries - Get by Group ID")
    
    if not tokens["admin"] or not created_ids["group_id"] or not created_ids["itinerary_id"]:
        test_results["itineraries_get"]["details"] = "Skipped because admin login, group creation, or itinerary creation failed"
        return
    
    print("Getting itinerary by group ID as admin...")
    response = requests.get(
        f"{API_URL}/itineraries/group/{created_ids['group_id']}",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        itinerary = response.json()
        if itinerary["id"] == created_ids["itinerary_id"] and itinerary["group_id"] == created_ids["group_id"]:
            print("Itinerary details verified")
            
            # Verify Spanish content
            if (itinerary["group_name"] == test_itinerary["group_name"] and
                len(itinerary["daily_schedule"]) == len(test_itinerary["daily_schedule"])):
                print("Spanish content verified")
                test_results["itineraries_get"]["success"] = True
                test_results["itineraries_get"]["details"] = "Successfully retrieved itinerary with Spanish content"
            else:
                test_results["itineraries_get"]["details"] = "Spanish content doesn't match expected values"
        else:
            test_results["itineraries_get"]["details"] = "Itinerary details don't match expected values"
    else:
        test_results["itineraries_get"]["details"] = f"Failed to get itinerary: {response.text}"

def test_itineraries_update():
    print_test_header("Itineraries - Update")
    
    if not tokens["admin"] or not created_ids["itinerary_id"]:
        test_results["itineraries_update"]["details"] = "Skipped because admin login or itinerary creation failed"
        return
    
    update_data = {
        "group_name": "Peregrinación a Santiago de Compostela 2025 (Actualizado)",
        "included": [
            "Alojamiento en hoteles de 4 estrellas",
            "Desayuno, almuerzo y cena",
            "Guía espiritual",
            "Transporte entre sitios",
            "Seguro de viaje básico"
        ]
    }
    
    print("Updating itinerary...")
    response = requests.put(
        f"{API_URL}/itineraries/{created_ids['itinerary_id']}",
        json=update_data,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        updated_itinerary = response.json()
        if (updated_itinerary["id"] == created_ids["itinerary_id"] and 
            updated_itinerary["group_name"] == update_data["group_name"]):
            print("Itinerary update verified")
            
            # Verify updated Spanish content
            if len(updated_itinerary["included"]) == len(update_data["included"]):
                print("Updated Spanish content verified")
                test_results["itineraries_update"]["success"] = True
                test_results["itineraries_update"]["details"] = "Successfully updated itinerary with Spanish content"
            else:
                test_results["itineraries_update"]["details"] = "Updated Spanish content doesn't match expected values"
        else:
            test_results["itineraries_update"]["details"] = "Updated itinerary details don't match expected values"
    else:
        test_results["itineraries_update"]["details"] = f"Failed to update itinerary: {response.text}"

def test_error_handling():
    print_test_header("Error Handling")
    
    # Test invalid login
    print("Testing invalid login credentials...")
    response = requests.post(f"{API_URL}/auth/login", json={
        "email": "nonexistent@email.com",
        "password": "wrongpassword"
    })
    print_response(response)
    
    if response.status_code == 401:
        print("Correctly returned 401 for invalid login")
        
        # Test unauthorized access
        print("\nTesting unauthorized access to admin-only endpoint...")
        response = requests.get(f"{API_URL}/groups")  # No token provided
        print_response(response)
        
        if response.status_code in [401, 403]:
            print(f"Correctly returned {response.status_code} for unauthorized access")
            
            # Test non-existent resource
            print("\nTesting access to non-existent resource...")
            response = requests.get(f"{API_URL}/destinations/nonexistent-id")
            print_response(response)
            
            if response.status_code == 404:
                print("Correctly returned 404 for non-existent resource")
                test_results["error_handling"]["success"] = True
                test_results["error_handling"]["details"] = "API correctly handles invalid login, unauthorized access, and non-existent resources"
            else:
                test_results["error_handling"]["details"] = f"API returned {response.status_code} instead of 404 for non-existent resource"
        else:
            test_results["error_handling"]["details"] = f"API returned {response.status_code} instead of 401/403 for unauthorized access"
    else:
        test_results["error_handling"]["details"] = f"API returned {response.status_code} instead of 401 for invalid login"

def print_test_summary():
    print_separator()
    print("TEST SUMMARY")
    print_separator()
    
    all_passed = True
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result["success"] else "❌ FAILED"
        if not result["success"]:
            all_passed = False
        print(f"{test_name}: {status}")
        print(f"  {result['details']}")
        print()
    
    print_separator()
    if all_passed:
        print("🎉 ALL TESTS PASSED! The Spanish pilgrimage app backend API is working correctly.")
    else:
        print("❌ SOME TESTS FAILED. See details above.")
    print_separator()

if __name__ == "__main__":
    run_tests()