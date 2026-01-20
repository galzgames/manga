# 🚀 SUPABASE - Setup em 5 Minutos

Supabase é **MUITO mais fácil** que Firebase! Vamos começar.

---

## ⚡ PASSO 1: Criar Conta (2 minutos)

1. Acesse: https://supabase.com
2. Clique **"Sign up"**
3. Use **Google** ou **GitHub** para login
4. Pronto! ✅

---

## ⚡ PASSO 2: Criar Projeto (1 minuto)

1. Clique **"New Project"**
2. Escolha um nome: `gestao-de-mangas`
3. Crie uma **senha segura** (você vai precisar)
4. Escolha região: **South America (São Paulo)** 🇧🇷
5. Clique **"Create new project"**
6. Aguarde 1-2 minutos...

---

## ⚡ PASSO 3: Copiar Credenciais (30 segundos)

Quando o projeto estiver pronto:

1. Vá para **Settings** (engrenagem ⚙️ no canto superior direito)
2. Clique em **"API"**
3. Copie:
   - **Project URL** (parecido com `https://seu-projeto.supabase.co`)
   - **anon key** (chave longa de caracteres)

---

## ⚡ PASSO 4: Preencher Credenciais (1 minuto)

Abra o arquivo: **`supabase-config.js`**

Substitua:
```javascript
const SUPABASE_URL = "https://seu-projeto.supabase.co";  // Cole URL aqui
const SUPABASE_KEY = "seu-anon-key-aqui";                 // Cole chave aqui
```

**Salve o arquivo!**

---

## ⚡ PASSO 5: Criar Tabelas (1 minuto)

Agora vamos criar o banco de dados visualmente!

### Tabela 1: `mangas`

1. No Supabase, vá para **"SQL Editor"**
2. Cole este código:

```sql
CREATE TABLE mangas (
  id BIGINT PRIMARY KEY DEFAULT (gen_random_uuid()),
  codigo VARCHAR(255),
  nome VARCHAR(255) NOT NULL,
  autor VARCHAR(255),
  volume VARCHAR(255),
  estoque INTEGER DEFAULT 1,
  preco DECIMAL(10, 2),
  localizacao VARCHAR(255),
  capa TEXT,
  data VARCHAR(50),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Clique **"Run"** ✅

### Tabela 2: `historico_estoque`

Cole este código:

```sql
CREATE TABLE historico_estoque (
  id BIGINT PRIMARY KEY DEFAULT (gen_random_uuid()),
  manga_id BIGINT REFERENCES mangas(id) ON DELETE CASCADE,
  movimentacoes JSONB DEFAULT '[]'::jsonb,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Clique **"Run"** ✅

---

## ⚡ PASSO 6: Criar Storage (1 minuto)

Agora vamos criar pasta para capas:

1. Vá para **"Storage"** (no menu esquerdo)
2. Clique **"Create new bucket"**
3. Nome: `capas`
4. Deixe **"Public bucket"** marcado ✅
5. Clique **"Create bucket"**

Pronto! 🎉

---

## ⚡ PASSO 7: Teste (2 minutos)

1. Abra seu site: `index.html`
2. Abra Console: **F12**
3. Procure pela mensagem:
   - ✅ `"Supabase iniciado com sucesso!"`
   - ✅ `"X mangás carregados do Supabase"`

Se aparecer, FUNCIONA! 🚀

Teste adicionando um mangá:
- Preencha o formulário
- Selecione uma capa
- Clique "Adicionar"

---

## 🎯 Só Isso!

Você finalizou o setup em ~10 minutos! 

Seu banco de dados está pronto na nuvem! ☁️

---

## 💡 Dicas

✅ **Dados são salvos automaticamente**
- Não precisa fazer nada extra

✅ **Funciona offline com localStorage**
- Sincroniza quando volta online

✅ **Capas são comprimidas automaticamente**
- Economia de espaço

✅ **Gratuito para sempre**
- 500MB banco + 1GB storage

---

## 🔍 Próximos Passos

1. ✅ Setup concluído!
2. ✅ Banco criado!
3. ✅ Storage criado!
4. Use normalmente!

---

## ❓ Problemas?

**Erro: "Supabase não está definido"**
- Verifique se `supabase-config.js` está preenchido
- Recarregue a página (Ctrl+F5)

**Erro ao adicionar mangá**
- Verifique credenciais em `supabase-config.js`
- Verifique se tabelas foram criadas em Supabase

**Capa não faz upload**
- Verifique se pasta `capas` foi criada
- Verifique se está como "Public bucket"

---

**Pronto! Seu site está com Supabase! 🎉**
