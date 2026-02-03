/*
  # Add function to create first superadmin

  1. Functions
    - `setup_first_superadmin` - Creates the first superadmin user
      - Only works if no superadmins exist yet
      - Uses SECURITY DEFINER to bypass RLS for initial setup
      - Matches user by email from auth.users

  2. Notes
    - This function can only be called once (when no superadmins exist)
    - After the first superadmin is created, new users must be added through the UI
*/

-- Function to setup the first superadmin (bypasses RLS for bootstrap)
CREATE OR REPLACE FUNCTION setup_first_superadmin(target_email text, target_nombre text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_auth_user_id uuid;
  v_existing_count int;
  v_new_user usuarios_plataforma;
BEGIN
  -- Check if any superadmin already exists
  SELECT COUNT(*) INTO v_existing_count 
  FROM usuarios_plataforma 
  WHERE rol = 'superadmin' AND activo = true;
  
  IF v_existing_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ya existe un superadmin. Use la interfaz para agregar mas usuarios.'
    );
  END IF;
  
  -- Get the auth user id
  SELECT id INTO v_auth_user_id
  FROM auth.users
  WHERE email = target_email;
  
  IF v_auth_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuario no encontrado en auth.users. Registrese primero con el email: ' || target_email
    );
  END IF;
  
  -- Insert the superadmin
  INSERT INTO usuarios_plataforma (auth_user_id, nombre, email, rol, activo)
  VALUES (v_auth_user_id, target_nombre, target_email, 'superadmin', true)
  RETURNING * INTO v_new_user;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Superadmin creado exitosamente',
    'user_id', v_new_user.id,
    'email', v_new_user.email
  );
END;
$$;
