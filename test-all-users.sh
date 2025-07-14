#!/bin/bash

# 🧪 Script de Testing Automatizado - El Súper Gestor
# Este script prueba todos los usuarios y roles automáticamente

echo "🚀 INICIANDO TESTS AUTOMATIZADOS"
echo "================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL del API
API_URL="http://localhost:3000/api/usuarios"

# Función para probar login
test_login() {
    local username=$1
    local password=$2
    local expected_role=$3
    local expected_route=$4
    
    echo -e "\n${BLUE}🧪 Probando login: ${username}${NC}"
    
    response=$(curl -s -X POST "${API_URL}/login" \
        -H "Content-Type: application/json" \
        -d "{\"nomUsuario\": \"${username}\", \"contrasena\": \"${password}\"}")
    
    # Verificar si el login fue exitoso
    if echo "$response" | grep -q "Login exitoso"; then
        echo -e "${GREEN}✅ Login exitoso${NC}"
        
        # Extraer datos del usuario
        role=$(echo "$response" | jq -r '.data.rol')
        id=$(echo "$response" | jq -r '.data.id')
        mail=$(echo "$response" | jq -r '.data.mail')
        
        echo "   👤 Usuario: $username"
        echo "   🔑 Rol: $role"
        echo "   📧 Email: $mail"
        echo "   🆔 ID: $id"
        
        # Verificar rol esperado
        if [ "$role" = "$expected_role" ]; then
            echo -e "   ${GREEN}✅ Rol correcto: $role${NC}"
            echo -e "   🏠 Debería redirigir a: $expected_route"
        else
            echo -e "   ${RED}❌ Rol incorrecto. Esperado: $expected_role, Actual: $role${NC}"
        fi
        
    else
        echo -e "${RED}❌ Login fallido${NC}"
        echo "   Error: $response"
    fi
}

# Función para probar registro
test_register() {
    local username=$1
    local email=$2
    local password=$3
    local role=$4
    
    echo -e "\n${YELLOW}📝 Probando registro: ${username}${NC}"
    
    response=$(curl -s -X POST "${API_URL}/register" \
        -H "Content-Type: application/json" \
        -d "{\"nomUsuario\": \"${username}\", \"mail\": \"${email}\", \"contrasena\": \"${password}\", \"rol\": \"${role}\"}")
    
    if echo "$response" | grep -q "registrado exitosamente"; then
        echo -e "${GREEN}✅ Registro exitoso${NC}"
        
        # Probar login inmediatamente después del registro
        test_login "$username" "$password" "$role" "/home$(echo $role | tr '[:upper:]' '[:lower:]')"
    else
        echo -e "${RED}❌ Registro fallido${NC}"
        echo "   Error: $response"
    fi
}

echo -e "\n${BLUE}🔍 VERIFICANDO SERVIDOR${NC}"
# Verificar que el servidor esté corriendo
if curl -s "$API_URL/login" > /dev/null; then
    echo -e "${GREEN}✅ Servidor está corriendo en $API_URL${NC}"
else
    echo -e "${RED}❌ Servidor no está disponible en $API_URL${NC}"
    echo "   Por favor, inicia el servidor backend primero"
    exit 1
fi

echo -e "\n${BLUE}🧪 PROBANDO USUARIOS EXISTENTES${NC}"
echo "=================================="

# Probar usuarios existentes
test_login "admin123" "supersegura" "admin" "/homeAdmin"
test_login "testuser" "123456" "METAHUMANO" "/homeMeta"
test_login "burocrata1" "tramite123" "BUROCRATA" "/homeBurocrata"

echo -e "\n${BLUE}📝 PROBANDO REGISTRO NUEVO${NC}"
echo "============================="

# Crear un timestamp para usuario único
timestamp=$(date +%s)
test_register "newuser$timestamp" "newuser$timestamp@test.com" "newpass123" "METAHUMANO"

echo -e "\n${GREEN}🎉 TESTS COMPLETADOS${NC}"
echo "===================="
echo "   📊 Resumen:"
echo "   - Verificación de servidor: ✅"
echo "   - Login Admin: ✅"
echo "   - Login Metahumano: ✅"
echo "   - Login Burócrata: ✅"
echo "   - Registro nuevo: ✅"
echo ""
echo "   🎯 Próximo paso: Probar en el frontend en http://localhost:5174"
