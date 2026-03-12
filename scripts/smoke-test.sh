#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-https://localhost:5001}"
AUTH_URL="$API_BASE_URL/api/auth/login"
PRODUCTS_URL="$API_BASE_URL/api/products"
ORDERS_URL="$API_BASE_URL/api/orders"

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

log() {
  printf "\n[smoke] %s\n" "$1"
}

fail() {
  printf "\n[smoke][FAIL] %s\n" "$1" >&2
  exit 1
}

http_call() {
  local method="$1"
  local url="$2"
  local body_file="$3"
  local out_file="$4"
  local auth_token="${5:-}"

  local headers=(-H "Content-Type: application/json")
  if [[ -n "$auth_token" ]]; then
    headers+=(-H "Authorization: Bearer $auth_token")
  fi

  if [[ -n "$body_file" ]]; then
    curl -k -sS -X "$method" "$url" "${headers[@]}" --data-binary "@$body_file" -o "$out_file" -w "%{http_code}"
  else
    curl -k -sS -X "$method" "$url" "${headers[@]}" -o "$out_file" -w "%{http_code}"
  fi
}

extract_json_value() {
  local key="$1"
  local file="$2"
  sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" "$file" | head -n 1
}

extract_first_product_id() {
  local file="$1"
  sed -n 's/.*"items"[[:space:]]*:[[:space:]]*\[.*/START/p' "$file" >/dev/null || true
  sed -n 's/.*"id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$file" | head -n 1
}

contains_text() {
  local text="$1"
  local file="$2"
  grep -q "$text" "$file"
}

log "Checking API health endpoint via Swagger route"
status="$(curl -k -sS -o "$workdir/swagger.json" -w "%{http_code}" "$API_BASE_URL/swagger/v1/swagger.json" || true)"
[[ "$status" == "200" ]] || fail "API is not reachable at $API_BASE_URL (status: $status). Start backend first."

log "Admin login"
cat > "$workdir/admin-login.json" <<'JSON'
{"username":"admin","password":"Admin123!"}
JSON
status="$(http_call POST "$AUTH_URL" "$workdir/admin-login.json" "$workdir/admin-login-response.json")"
[[ "$status" == "200" ]] || fail "Admin login failed (status: $status)"
admin_token="$(extract_json_value token "$workdir/admin-login-response.json")"
[[ -n "$admin_token" ]] || fail "Admin token missing in response"

log "Customer login"
cat > "$workdir/customer-login.json" <<'JSON'
{"username":"customer","password":"Customer123!"}
JSON
status="$(http_call POST "$AUTH_URL" "$workdir/customer-login.json" "$workdir/customer-login-response.json")"
[[ "$status" == "200" ]] || fail "Customer login failed (status: $status)"
customer_token="$(extract_json_value token "$workdir/customer-login-response.json")"
[[ -n "$customer_token" ]] || fail "Customer token missing in response"

log "Get products with paging/search/filter/sort"
status="$(curl -k -sS -o "$workdir/products.json" -w "%{http_code}" \
  -H "Authorization: Bearer $customer_token" \
  "$PRODUCTS_URL?pageNumber=1&pageSize=10&search=&category=&sortBy=name&sortDirection=asc")"
[[ "$status" == "200" ]] || fail "Product listing failed (status: $status)"
contains_text '"items"' "$workdir/products.json" || fail "Product listing response missing items"
first_product_id="$(extract_first_product_id "$workdir/products.json")"
[[ -n "$first_product_id" ]] || fail "Could not extract product id from listing response"

log "Get product details"
status="$(curl -k -sS -o "$workdir/product-details.json" -w "%{http_code}" \
  -H "Authorization: Bearer $customer_token" \
  "$PRODUCTS_URL/$first_product_id")"
[[ "$status" == "200" ]] || fail "Product details failed (status: $status)"
contains_text '"id"' "$workdir/product-details.json" || fail "Product details response invalid"

log "Admin creates product"
cat > "$workdir/create-product.json" <<'JSON'
{"name":"Smoke Test Product","category":"Testing","description":"Created by smoke test","price":99.99,"stockQuantity":25}
JSON
status="$(http_call POST "$PRODUCTS_URL" "$workdir/create-product.json" "$workdir/create-product-response.json" "$admin_token")"
[[ "$status" == "201" ]] || fail "Admin product creation failed (status: $status)"
new_product_id="$(extract_json_value id "$workdir/create-product-response.json")"
[[ -n "$new_product_id" ]] || fail "Created product id missing"

log "Admin updates product"
cat > "$workdir/update-product.json" <<'JSON'
{"name":"Smoke Test Product Updated","category":"Testing","description":"Updated by smoke test","price":109.99,"stockQuantity":30}
JSON
status="$(http_call PUT "$PRODUCTS_URL/$new_product_id" "$workdir/update-product.json" "$workdir/update-product-response.json" "$admin_token")"
[[ "$status" == "200" ]] || fail "Admin product update failed (status: $status)"
contains_text '"name":"Smoke Test Product Updated"' "$workdir/update-product-response.json" || fail "Updated product response does not reflect expected data"

log "Customer creates order with discount and stock deduction"
cat > "$workdir/create-order.json" <<JSON
{"items":[{"productId":"$new_product_id","quantity":2}],"discountPercentage":10}
JSON
status="$(http_call POST "$ORDERS_URL" "$workdir/create-order.json" "$workdir/create-order-response.json" "$customer_token")"
[[ "$status" == "200" ]] || fail "Order creation failed (status: $status)"
contains_text '"totalAmount"' "$workdir/create-order-response.json" || fail "Order response missing totalAmount"
contains_text '"discountAmount"' "$workdir/create-order-response.json" || fail "Order response missing discountAmount"
contains_text '"items"' "$workdir/create-order-response.json" || fail "Order response missing items"

log "Auth negative test (invalid credentials)"
cat > "$workdir/bad-login.json" <<'JSON'
{"username":"admin","password":"wrong-password"}
JSON
status="$(http_call POST "$AUTH_URL" "$workdir/bad-login.json" "$workdir/bad-login-response.json")"
[[ "$status" == "401" ]] || fail "Expected 401 for invalid credentials but got $status"

printf "\n[smoke][PASS] All checks succeeded against %s\n" "$API_BASE_URL"
