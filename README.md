# 📚 Gestão de Mangás

Um sistema completo para gerenciar sua coleção de mangás com funcionalidades avançadas de estoque e localização.

## ✨ Funcionalidades

- **Adicionar Mangás** - Cadastro com código de barras, nome, autor, volume e capa
- **Gerenciar Estoque** - Rastrear quantidade de itens com histórico de entrada/saída
- **Localização** - Definir localização (prateleira, setor, etc.) para cada mangá
- **Busca por ISBN** - Busca automática de informações via código de barras
- **Capas** - Upload de capas via URL ou arquivo
- **Histórico** - Acompanhar movimentação de estoque com datas
- **Persistência** - Dados salvos no navegador via LocalStorage

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. Preencha os campos do formulário (Código, Nome, Autor, Volume, Quantidade)
3. Clique em "Adicionar" para cadastrar
4. Use o campo de busca para encontrar mangás
5. Clique em "Editar" para atualizar estoque, localização ou outras informações
6. Acompanhe o histórico de movimentação no modal de detalhes

## 📍 Sistema de Localização

Organize seus mangás por:
- **Prateleira** - Ex: "Prateleira A"
- **Posição** - Ex: "01, 02, 03..."
- **Setor** - Ex: "Shonen, Shoujo, etc"

Exemplo completo: `Prateleira A - Posição 01 - Setor Shonen`

## 📊 Histórico de Estoque

Cada transação registra:
- Data e hora
- Quantidade movimentada
- Tipo (entrada/saída)
- Motivo (Compra, Venda, Devolução, Ajuste, etc)

## 💾 Dados

Todos os dados são armazenados localmente no navegador. Não é necessário servidor ou conexão com banco de dados.

## 🔒 Privacidade

Todos os dados permanecem no seu computador. Nenhuma informação é enviada para servidores externos.
