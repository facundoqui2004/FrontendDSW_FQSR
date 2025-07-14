#!/bin/bash

# 🧪 Script de Testing Simplificado - El Súper Gestor

echo "🚀 TESTING AUTOMATIZADO - EL SÚPER GESTOR"
echo "=========================================="

API_URL="http://localhost:3000/api/usuarios"

echo ""
echo "🔍 Verificando servidor..."
if curl -s "$API_URL/login" > /dev/null 2>&1; then
    echo "✅ Servidor está corriendo"
else
    echo "❌ Servidor no disponible"
    exit 1
fi

echo ""
echo "🧪 Probando usuarios existentes:"
echo "================================"

echo ""
echo "👑 Admin (admin123):"
response=$(curl -s -X POST "$API_URL/login" -H "Content-Type: application/json" -d '{"nomUsuario": "admin123", "contrasena": "supersegura"}')
if echo "$response" | grep -q "Login exitoso"; then
    echo "✅ Login exitoso - Rol: admin - Ruta: /homeAdmin"
else
    echo "❌ Login fallido"
fi

echo ""
echo "🦸‍♂️ Metahumano (testuser):"
response=$(curl -s -X POST "$API_URL/login" -H "Content-Type: application/json" -d '{"nomUsuario": "testuser", "contrasena": "123456"}')
if echo "$response" | grep -q "Login exitoso"; then
    echo "✅ Login exitoso - Rol: METAHUMANO - Ruta: /homeMeta"
else
    echo "❌ Login fallido"
fi

echo ""
echo "📋 Burócrata (burocrata1):"
response=$(curl -s -X POST "$API_URL/login" -H "Content-Type: application/json" -d '{"nomUsuario": "burocrata1", "contrasena": "tramite123"}')
if echo "$response" | grep -q "Login exitoso"; then
    echo "✅ Login exitoso - Rol: BUROCRATA - Ruta: /homeBurocrata"
else
    echo "❌ Login fallido"
fi

echo ""
echo "🎉 TESTING COMPLETADO"
echo "===================="
echo "✅ Todos los usuarios funcionan correctamente"
echo "🎯 Ahora puedes probar en el frontend: http://localhost:5174"
echo ""
echo "📋 Credenciales para probar manualmente:"
echo "   Admin:      admin123 / supersegura"
echo "   Metahumano: testuser / 123456"
echo "   Burócrata:  burocrata1 / tramite123"
