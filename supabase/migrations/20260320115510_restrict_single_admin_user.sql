/*
  # Restricción de un único administrador

  ## Descripción
  Este migration asegura que solo exista un usuario administrador en el sistema.
  
  ## Cambios:
  - Agrega función trigger para prevenir más de 1 super_admin
  - Todos los otros usuarios son para reservar citas únicamente
*/

CREATE OR REPLACE FUNCTION check_single_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'super_admin' THEN
    IF (SELECT COUNT(*) FROM admin_users WHERE role = 'super_admin' AND id != NEW.id) > 0 THEN
      RAISE EXCEPTION 'Solo puede existir un administrador super_admin en el sistema';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_single_super_admin ON admin_users;

CREATE TRIGGER trigger_single_super_admin
  BEFORE INSERT OR UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION check_single_super_admin();
