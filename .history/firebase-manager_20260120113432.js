// Firebase Mangas Manager
// Funções para salvar, carregar e gerenciar mangás no Firebase

const COLLECTION_NAME = 'mangas';
const COLLECTION_HISTORICO = 'historicoEstoque';

// Cache local para melhor performance
let cachedMangas = [];
let cachedHistorico = {};

/**
 * Carrega todos os mangás do Firestore
 */
async function loadMangasFromFirebase() {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();
        cachedMangas = [];
        
        snapshot.forEach(doc => {
            cachedMangas.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ ${cachedMangas.length} mangás carregados do Firebase`);
        return cachedMangas;
    } catch (error) {
        console.error('❌ Erro ao carregar mangás:', error);
        showMessage('Erro ao carregar mangás do Firebase', 'error');
        return [];
    }
}

/**
 * Carrega histórico de estoque do Firestore
 */
async function loadHistoricoFromFirebase() {
    try {
        const snapshot = await db.collection(COLLECTION_HISTORICO).get();
        cachedHistorico = {};
        
        snapshot.forEach(doc => {
            cachedHistorico[doc.id] = doc.data().movimentacoes || [];
        });
        
        console.log('✅ Histórico de estoque carregado');
        return cachedHistorico;
    } catch (error) {
        console.error('❌ Erro ao carregar histórico:', error);
        return {};
    }
}

/**
 * Salva um novo mangá no Firebase
 */
async function saveMangaToFirebase(manga) {
    try {
        const docRef = await db.collection(COLLECTION_NAME).add({
            ...manga,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ Mangá salvo com ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error('❌ Erro ao salvar mangá:', error);
        showMessage('Erro ao salvar mangá no Firebase', 'error');
        throw error;
    }
}

/**
 * Atualiza um mangá existente no Firebase
 */
async function updateMangaInFirebase(mangaId, mangaData) {
    try {
        await db.collection(COLLECTION_NAME).doc(mangaId).update({
            ...mangaData,
            dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ Mangá ${mangaId} atualizado`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao atualizar mangá:', error);
        showMessage('Erro ao atualizar mangá no Firebase', 'error');
        throw error;
    }
}

/**
 * Deleta um mangá do Firebase
 */
async function deleteMangaFromFirebase(mangaId) {
    try {
        await db.collection(COLLECTION_NAME).doc(mangaId).delete();
        
        // Também deleta o histórico associado
        await db.collection(COLLECTION_HISTORICO).doc(mangaId).delete().catch(() => {});
        
        console.log(`✅ Mangá ${mangaId} deletado`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao deletar mangá:', error);
        showMessage('Erro ao deletar mangá do Firebase', 'error');
        throw error;
    }
}

/**
 * Faz upload de uma imagem para Firebase Storage
 */
async function uploadCapaToStorage(file, mangaId) {
    try {
        const timestamp = new Date().getTime();
        const fileName = `capas/${mangaId}_${timestamp}.jpg`;
        const storageRef = storage.ref(fileName);
        
        // Comprime a imagem antes de fazer upload
        const compressedFile = await compressImage(file);
        
        const uploadTask = await storageRef.put(compressedFile);
        const downloadUrl = await uploadTask.ref.getDownloadURL();
        
        console.log(`✅ Capa salva: ${downloadUrl}`);
        return downloadUrl;
    } catch (error) {
        console.error('❌ Erro ao fazer upload da capa:', error);
        showMessage('Erro ao fazer upload da capa', 'error');
        throw error;
    }
}

/**
 * Comprime uma imagem para otimizar o armazenamento
 */
function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Redimensiona para largura máxima de 500px mantendo proporção
                let width = img.width;
                let height = img.height;
                
                if (width > 500) {
                    height = (height * 500) / width;
                    width = 500;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.8);
            };
        };
    });
}

/**
 * Salva histórico de estoque no Firebase
 */
async function saveHistoricoToFirebase(mangaId, movimentacoes) {
    try {
        await db.collection(COLLECTION_HISTORICO).doc(mangaId).set({
            movimentacoes: movimentacoes,
            ultimaAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`✅ Histórico do mangá ${mangaId} salvo`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar histórico:', error);
        throw error;
    }
}

/**
 * Busca um URL de capa do Firebase Storage
 */
async function getCapaUrl(mangaId) {
    try {
        const listResult = await storage.ref(`capas/`).listAll();
        
        for (const item of listResult.items) {
            if (item.name.startsWith(mangaId)) {
                return await item.getDownloadURL();
            }
        }
        
        return null;
    } catch (error) {
        console.error('❌ Erro ao recuperar URL da capa:', error);
        return null;
    }
}

/**
 * Sincroniza dados: Se estiver offline, salva no localStorage
 * Quando voltar online, sincroniza com Firebase
 */
async function syncWithFirebase() {
    try {
        // Verifica se tem dados no localStorage não sincronizados
        const mangasLocais = localStorage.getItem('mangas_pendentes');
        
        if (mangasLocais) {
            const mangas = JSON.parse(mangasLocais);
            for (const manga of mangas) {
                try {
                    await saveMangaToFirebase(manga);
                } catch (error) {
                    console.error('Erro ao sincronizar manga:', error);
                }
            }
            localStorage.removeItem('mangas_pendentes');
            console.log('✅ Dados sincronizados com Firebase');
        }
    } catch (error) {
        console.error('❌ Erro na sincronização:', error);
    }
}

// Monitora a conexão e sincroniza quando voltar online
window.addEventListener('online', syncWithFirebase);
window.addEventListener('offline', () => {
    console.warn('⚠️ Você está offline. Os dados serão sincronizados quando a conexão voltar.');
});
