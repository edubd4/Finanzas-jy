# Intake · JoseYbarra
Fecha: 2026-03-26
Estado: COMPLETO

## Negocio
Usuario individual (uso personal). José necesita gestionar sus finanzas personales: ingresos, egresos, gastos, inversiones y préstamos. No hay modelo de monetización — es una herramienta de uso propio.

## Problema principal
No tiene ningún sistema estructurado para registrar sus movimientos financieros. Lleva sus finanzas de forma desordenada o de memoria, lo que le impide tener visibilidad real sobre su situación económica, detectar patrones de gasto, o tomar decisiones informadas sobre inversiones y préstamos.

## Proceso actual
Sin sistema. No usa Excel, app ni papel de forma consistente. Los movimientos no se registran.

## Volumen operativo
- 5 a 10 operaciones diarias (cargas de ingresos, egresos, gastos, etc.)
- 10 a 20 consultas diarias (revisar dashboard, historial, métricas)
- Usuario único (uso personal)

## Herramientas actuales
Ninguna. Sin herramientas estructuradas de gestión financiera.

## Resultado esperado
- Registrar ingresos, egresos, gastos, inversiones y préstamos
- Historial completo de movimientos
- Dashboard con métricas clave y accesos rápidos a las acciones más frecuentes (cargar ingreso, cargar egreso, etc.)
- Interfaz intuitiva, inspirada en apps como Money Manager o YNAB
- MVP funcional lo antes posible, con roadmap de mejoras y escalado posterior

## Restricciones
- Sin experiencia previa con apps de finanzas personales
- Stack equilibrado, similar al usado en GoJulito (sin sobreingeniería)
- Prioridad: velocidad al MVP — luego iterar con nuevas funcionalidades y mejoras de UI/UX
- Sin restricciones de presupuesto o tecnología explícitas mencionadas

## Notas del intake
- El volumen (5-10 ops + 10-20 consultas diarias) es bajo-medio para un usuario único — confirma que una arquitectura tipo Perfil B (dashboard web) es suficiente para el MVP.
- La referencia a Money Manager y YNAB es valiosa: ambas priorizan categorización rápida, visualización por período y claridad en el flujo de caja. Hay que capturar eso en el diseño.
- "Equilibrado como GoJulito" indica: Next.js + Supabase + autenticación básica. Sin backend propio ni infraestructura compleja.
- El módulo `dashboard-shell.md` de MODULOS/ es directamente aplicable.
- La entidad "préstamos" puede tener lógica adicional (cuotas, fechas de vencimiento, intereses) — a definir en el diagnóstico si aplica al MVP o queda para V2.
- Oportunidad: si en el futuro José quiere compartir el sistema o tener multi-usuario, la base en Supabase lo permite sin refactor mayor.
