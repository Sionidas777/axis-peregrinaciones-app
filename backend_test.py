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

# Test results
test_results = {
    "auth_register": {"success": False, "details": ""},
    "auth_login": {"success": False, "details": ""},
    "auth_me": {"success": False, "details": ""},
    "groups_get_all": {"success": False, "details": ""},
    "groups_get_one": {"success": False, "details": ""},
    "groups_create": {"success": False, "details": ""},
    "groups_update": {"success": False, "details": ""},
    "itineraries_get": {"success": False, "details": ""},
    "itineraries_create": {"success": False, "details": ""},
    "itineraries_update": {"success": False, "details": ""},
    "destinations_get_all": {"success": False, "details": ""},
    "destinations_get_one": {"success": False, "details": ""},
    "destinations_create": {"success": False, "details": ""},
    "error_handling": {"success": False, "details": ""}
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
    # 1. Test Authentication Endpoints
    test_auth_register()
    test_auth_login()
    test_auth_me()
    
    # 2. Test Pilgrimage Groups Endpoints
    test_groups_create()
    test_groups_get_all()
    test_groups_get_one()
    test_groups_update()
    
    # 3. Test Destinations Endpoints
    test_destinations_create()
    test_destinations_get_all()
    test_destinations_get_one()
    
    # 4. Test Itinerary Endpoints
    test_itineraries_create()
    test_itineraries_get()
    test_itineraries_update()
    
    # 5. Test Error Handling
    test_error_handling()
    
    # Print summary
    print_test_summary()

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