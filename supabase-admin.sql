-- ============================================
-- SakuraBy - Adicionar coluna de admin
-- ============================================
-- Execute no SQL Editor do Supabase

-- Adicionar coluna is_admin
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Criar um usuário admin (troque o email pelo seu)
-- Você pode alterar o email depois
UPDATE users SET is_admin = TRUE WHERE email = 'SEU_EMAIL_AQUI';
