# 📋 Exemplo de Credenciais Supabase

Quando você criar um projeto no Supabase, suas credenciais parecerão ASSIM:

## Passo 1: No Supabase Console

Vá para: **Settings → API**

## Passo 2: Você verá algo como:

```
Project URL
https://seu-projeto-xyz123.supabase.co

Service Role key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...

anon key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

## Passo 3: Copie APENAS estes dois:

```
1. Project URL (copie tudo)
2. anon key (copie tudo - a chave longa)
```

## Passo 4: Abra supabase-config.js e substitua:

### ANTES:
```javascript
const SUPABASE_URL = "https://seu-projeto.supabase.co";
const SUPABASE_KEY = "seu-anon-key-aqui";
```

### DEPOIS (com seus valores):
```javascript
const SUPABASE_URL = "https://seu-projeto-xyz123.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...";
```

## ⚠️ IMPORTANTE:

- **NÃO copie** a Service Role key (essa é mais privada)
- **Copie SEMPRE** a anon key (é segura para público)
- **Não compartilhe** suas credenciais
- **Já está em .gitignore** (protegido no Git)

## 🔍 Verificação:

Quando tudo estiver certo:
1. Abra seu site
2. Abra F12 (Console)
3. Procure por: `"✅ Supabase iniciado com sucesso!"`

Se aparecer = Está correto! ✅

---

**Dúvida? Leia SUPABASE_SETUP.md passo a passo!**
