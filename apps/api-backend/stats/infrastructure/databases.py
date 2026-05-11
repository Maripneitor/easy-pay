from database import db_instance

# Usamos la instancia centralizada para evitar fugas de memoria y errores de configuración
db = db_instance.get_db("EasyPay_Groups")