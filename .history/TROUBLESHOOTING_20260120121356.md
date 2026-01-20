# 🔧 Troubleshooting Avançado

Guia para resolver problemas específicos com Firebase.

---

## 🆘 Problema: "Firebase não está definido"

### Sintomas
```
Erro no Console: ReferenceError: firebase is not defined
```

### Causas Possíveis

1. **Scripts não carregaram**
   ```
   Solução:
   - Verifique em DevTools (F12) → Network
   - Procure por firebase-app.js, firebase-firestore.js, firebase-storage.js
   - Se faltam ou têm status 404, CDN está bloqueado
   ```

2. **firebase-config.js não foi executado**
   ```
   Solução:
   - Verifique se firebase-config.js está no mesmo diretório que index.html
   - Verifique se tem permissão de leitura
   - Tente atualizar a página (Ctrl+F5)
   ```

3. **Ordem incorreta de scripts**
   ```
   Solução:
   - Firestore deve vir DEPOIS de firebase-app.js
   - Verifique em index.html a ordem dos scripts
   ```

### Passo a Passo de Resolução

```
1. Abra F12 (DevTools)
2. Aba "Network"
3. Recarregue página
4. Procure por "firebase" nos arquivos
5. Se tiver status 404 ou vermelho:
   └─ Problema de CDN bloqueado
   └─ Tente VPN ou outro navegador

6. Se tudo carregar OK (status 200):
   └─ Problema em firebase-config.js
   └─ Verifique sintaxe do arquivo
   └─ Procure por erros na aba "Console"
```

---

## 🔴 Problema: "Erro ao carregar mangás do Firebase"

### Sintomas
```
Console: ❌ Erro ao carregar mangás: ...
Página vazia ou mostra "Nenhum mangá encontrado"
```

### Causas Possíveis

1. **Credenciais incorretas**
   ```
   Verificar:
   - apiKey está preenchida em firebase-config.js?
   - authDomain está correto?
   - projectId está correto?
   
   Solução:
   - Copie NOVAMENTE as credenciais do Firebase Console
   - Cuidado com espaços extras
   - Cuidado com aspas duplas vs simples
   ```

2. **Firestore não foi criado**
   ```
   Verificar:
   - Firebase Console → Firestore Database
   - Deve aparecer "Firestore Database"
   
   Solução:
   - Se não existe, criar novo banco de dados
   - Leia FIREBASE_SETUP.md Passo 4
   ```

3. **Firestore Rules bloqueando leitura**
   ```
   Verificar:
   - Firebase Console → Firestore → Rules
   - Deve ter: allow read, write: if true;
   
   Solução:
   - Atualize as rules
   - Clique "Publicar"
   ```

4. **Nenhum mangá foi adicionado ainda**
   ```
   Verificar:
   - Você já adicionou um mangá?
   - Se não, mensagem "Nenhum mangá encontrado" é normal
   
   Solução:
   - Teste adicionando um mangá novo
   ```

### Passo a Passo de Resolução

```
1. Abra F12 Console
2. Recarregue página (F5)
3. Procure por mensagem de erro exata
4. Se disser "permission denied":
   └─ Problema é Firestore Rules
   └─ Leia "3️⃣  Firestore Rules bloqueando" acima

5. Se disser "invalid API key":
   └─ Credenciais erradas
   └─ Copie novamente do Firebase Console

6. Se disser "Not Found":
   └─ Firestore não existe
   └─ Crie novo banco de dados
```

---

## 🎨 Problema: "Erro ao fazer upload de capa"

### Sintomas
```
Console: ❌ Erro ao fazer upload da capa: ...
Capa não aparece na lista
```

### Causas Possíveis

1. **Storage não foi criado**
   ```
   Verificar:
   - Firebase Console → Storage
   - Deve aparecer um bucket
   
   Solução:
   - Se não existe, crie novo bucket
   - Leia FIREBASE_SETUP.md Passo 6
   ```

2. **Storage Rules bloqueando upload**
   ```
   Verificar:
   - Firebase Console → Storage → Rules
   - Deve ter: allow read, write: if true;
   
   Solução:
   - Atualize as rules
   - Clique "Publicar"
   ```

3. **Arquivo muito grande**
   ```
   Limite: 512 MB por arquivo (limite Firebase)
   
   Se for imagem normal:
   - Arquivo deve ter <10 MB
   - Se tem mais, há algo errado
   
   Solução:
   - Comprima a imagem antes (TinyPNG.com)
   - Ou escolha imagem menor
   ```

4. **Formato de arquivo não suportado**
   ```
   Suportados: JPG, PNG, GIF, WebP
   Não suportados: BMP, SVG, TIFF
   
   Solução:
   - Converta para JPG/PNG
   ```

5. **Arquivo corrompido**
   ```
   Solução:
   - Tente outra imagem
   - Verifique se arquivo abre normalmente
   ```

### Passo a Passo de Resolução

```
1. Abra F12 Console
2. Tente fazer upload novamente
3. Procure pela mensagem de erro
4. Se disser "permission denied":
   └─ Storage Rules está bloqueando
   └─ Leia "2️⃣  Storage Rules bloqueando" acima

5. Se disser "storage/object-not-found":
   └─ Storage bucket não existe
   └─ Crie novo bucket

6. Se disser "storage/retry-limit-exceeded":
   └─ Tempo limite excedido
   └─ Tente novamente, conexão pode estar lenta
```

---

## 🔄 Problema: "Dados não sincronizam com Firebase"

### Sintomas
```
Mangá adicionado localmente mas não aparece em Firebase Console
Dados não sincronizam mesmo com internet
```

### Causas Possíveis

1. **Firestore não foi criado ou não está ativo**
   ```
   Verificar:
   - Firebase Console → Firestore
   - Status deve ser "Iniciado"
   
   Solução:
   - Se status for diferente, crie novo database
   ```

2. **Código de sincronização desativado**
   ```
   Verificar:
   - No código JavaScript, procure por syncMangasWithFirebase()
   - Deve ser chamado quando saveMangas() é executado
   
   Solução:
   - Verifique se há comentários bloqueando código
   - Procure por // ou /* */ cobrindo o código
   ```

3. **Credenciais corretas mas permissões insuficientes**
   ```
   Solução:
   - Verifique se projeto não está deletado/suspenso
   - Vá a Firebase Console e verifique status
   ```

### Teste de Sincronização

```javascript
// Adicione isso no Console (F12):
syncMangasWithFirebase();

// Deve imprimir:
// ✅ Dados sincronizados com Firebase
// (ou erro específico)
```

---

## 📵 Problema: "Offline não funciona"

### Sintomas
```
Ao desativar Wi-Fi:
- Mensagem de erro ao tentar adicionar mangá
- Dados não são salvos
```

### Causas Possíveis

1. **localStorage desativado no navegador**
   ```
   Verificar:
   - F12 → Application → LocalStorage
   - Deve haver dados ali
   
   Solução:
   - Se está vazio, localStorage está desativado
   - Habilite em preferências do navegador
   ```

2. **Erro no código de offline**
   ```
   Verificar:
   - F12 Console ao desconectar internet
   - Deve mostrar: "⚠️ Você está offline"
   
   Se não aparecer:
   - Pode haver bug no código
   ```

### Passo a Passo de Teste

```
1. Abra site e adicione um mangá (online)
2. Desative Wi-Fi/Internet
3. Tente adicionar outro mangá
4. Verifique:
   - ✅ Mangá aparece localmente?
   - ✅ Console mostra "⚠️ Você está offline"?
   - ✅ Se consegue editar/deletar?

5. Reative internet
6. Verifique:
   - ✅ Dados aparecem em Firebase Console?
   - ✅ Console mostra "✅ Dados sincronizados"?
```

---

## 🖼️ Problema: "Capa não aparece na lista"

### Sintomas
```
Mangá adicionado, mas mostra ícone 📚 em vez da capa
```

### Causas Possíveis

1. **URL da capa inválida**
   ```
   Verificar:
   - Clique em "Inspecionar" na imagem (F12)
   - Verifique o src da imagem
   - Tente abrir URL no navegador
   
   Solução:
   - Se URL não abre, está inválida
   - Refaça o upload da capa
   ```

2. **Capa foi deletada do Storage**
   ```
   Verificar:
   - Firebase Console → Storage → Pasta capas/
   - Procure pelo arquivo
   
   Solução:
   - Se não existe, faça upload novamente
   ```

3. **Problema de CORS**
   ```
   Console mostra erro sobre CORS
   
   Solução:
   - Para URL externa, pode ser bloqueado
   - Use URLs de sites confiáveis
   - Ou use upload local (recomendado)
   ```

4. **Imagem corrompida**
   ```
   Solução:
   - Tente outra imagem
   - Verifique se arquivo abre normalmente
   ```

### Debug de Imagem

```javascript
// No Console (F12):
// Para ver qual URL está sendo usada:
mangas[0].capa  // Mostra URL da 1ª capa

// Testar se URL funciona:
fetch(mangas[0].capa)
  .then(r => console.log("OK"))
  .catch(e => console.log("ERRO:", e))
```

---

## 🔐 Problema: "Dados podem ser acessados por qualquer pessoa"

### Aviso
```
Você está usando "Modo Teste" (qualquer pessoa pode ler/escrever)
```

### Solução para Produção
```
1. Implementar Firebase Authentication
   - Leia SEGURANCA.md

2. Atualizar Firestore Rules
   - Exigir login

3. Atualizar Storage Rules
   - Exigir login

4. Testar permissões
   - Tente com outra conta
```

---

## 💥 Problema: "Erro aleatório não documentado"

### Passo a Passo Geral

```
1. Abra F12 Console
2. Copie a mensagem de erro EXATA
3. Procure no Stack Overflow:
   - "firebase [sua mensagem de erro]"
4. Se não encontrar:
   - Vá a Firebase Docs
   - Procure pela função que falha
5. Se ainda não resolver:
   - Considere abrir issue no GitHub
   - Ou contate Firebase Support
```

### Coletar Informações para Suporte

Se precisar reportar bug:

```
Informações úteis:
- Navegador e versão: (Chrome 120?)
- Sistema Operacional: (Windows 11?)
- Firebase SDK versão: (9.22.0?)
- Mensagem de erro EXATA:
- Passos para reproduzir:
- Comportamento esperado:
- Comportamento atual:

Exemplo:
Browser: Chrome 120
OS: Windows 11
Erro: ❌ Erro ao carregar mangás: [code: permission-denied]
Passos: 1. Abri site 2. Vi erro no console
Esperado: Mangás carregam normalmente
Atual: Vê erro e lista vazia
```

---

## 🚨 Problema: "Perdi meus dados!"

### O que fazer IMEDIATAMENTE

```
1. Não pânico! Possívelmente ainda estão lá.

2. Verificar 3 lugares:
   ☐ localStorage (F12 → Application → LocalStorage)
   ☐ Firebase Console → Firestore → Coleção "mangas"
   ☐ Google Drive/Cloud (se tinha backup)

3. Se estão em apenas um lugar:
   ☐ Copie para outro lugar AGORA
   ☐ Não adicione/delete mais nada ainda
   ☐ Sempre tenha 2+ backup
```

### Recuperação de Dados

```javascript
// Se os dados estão em localStorage:
// (F12 Console)
const dados = JSON.parse(localStorage.getItem('mangas'));
console.log(dados);  // Veja seus dados

// Copie para arquivo de texto
// Para segurança futura

// Para restaurar:
localStorage.setItem('mangas', JSON.stringify(dados));
location.reload();
```

---

## 📝 Como Reportar Bugs

Se encontrar problema:

1. **Documentar bem:**
   - Screenshots do erro
   - Mensagem exata do console
   - Passos para reproduzir

2. **Procurar solução:**
   - Verifique este guia primeiro
   - Stack Overflow
   - Firebase Docs

3. **Contatar suporte:**
   - Se for bug do Firebase: Firebase Support
   - Se for do seu código: Stack Overflow

---

## 🧪 Modo Debug Avançado

Adicione ao firebase-manager.js para mais logs:

```javascript
// No início do arquivo:
const DEBUG = true;  // Mude para true

function debugLog(...args) {
    if (DEBUG) console.log('🐛 DEBUG:', ...args);
}

// Use em qualquer função:
debugLog('Carregando mangás...');
debugLog('Dados recebidos:', data);
```

---

## 📊 Checklist de Verificação

Antes de reportar bug, verifique:

- [ ] Console (F12) mostra erro específico?
- [ ] firebase-config.js está preenchido corretamente?
- [ ] Firestore existe no Firebase Console?
- [ ] Storage existe no Firebase Console?
- [ ] Rules são "modo teste"?
- [ ] Internet está funcionando?
- [ ] Página foi recarregada (Ctrl+F5)?
- [ ] Testou em outro navegador?
- [ ] Testou em modo incógnito (sem extensões)?

---

**Se mesmo assim não resolver, procure ajuda em:**
- Stack Overflow (tag: firebase)
- Firebase Google Groups
- Firebase GitHub Issues

**Boa sorte! 🍀**
