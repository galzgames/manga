// Supabase Manager
// Funções para gerenciar mangás no Supabase

/**
 * Carrega todos os mangás do Supabase
 */
async function loadMangasFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('mangas')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        console.log(`✅ ${data?.length || 0} mangás carregados do Supabase`);
        return data || [];
    } catch (error) {
        console.error('❌ Erro ao carregar mangás:', error.message);
        showMessage('Erro ao carregar mangás do Supabase', 'error');
        return [];
    }
}

/**
 * Carrega histórico de estoque do Supabase
 */
async function loadHistoricoFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('historico_estoque')
            .select('*');

        if (error) throw error;

        const historico = {};
        data?.forEach(doc => {
            historico[doc.manga_id] = doc.movimentacoes || [];
        });

        console.log('✅ Histórico de estoque carregado');
        return historico;
    } catch (error) {
        console.error('❌ Erro ao carregar histórico:', error.message);
        return {};
    }
}

/**
 * Salva um novo mangá no Supabase
 */
async function saveMangaToSupabase(manga) {
    try {
        const { data, error } = await supabaseClient
            .from('mangas')
            .insert([manga])
            .select();

        if (error) throw error;

        console.log(`✅ Mangá salvo com ID: ${data[0].id}`);
        return data[0].id;
    } catch (error) {
        console.error('❌ Erro ao salvar mangá:', error.message);
        showMessage('Erro ao salvar mangá no Supabase', 'error');
        throw error;
    }
}

/**
 * Atualiza um mangá existente no Supabase
 */
async function updateMangaInSupabase(mangaId, mangaData) {
    try {
        const { error } = await supabaseClient
            .from('mangas')
            .update(mangaData)
            .eq('id', mangaId);

        if (error) throw error;

        console.log(`✅ Mangá ${mangaId} atualizado`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao atualizar mangá:', error.message);
        showMessage('Erro ao atualizar mangá no Supabase', 'error');
        throw error;
    }
}

/**
 * Deleta um mangá do Supabase
 */
async function deleteMangaFromSupabase(mangaId) {
    try {
        // Deleta o mangá
        const { error: deleteError } = await supabaseClient
            .from('mangas')
            .delete()
            .eq('id', mangaId);

        if (deleteError) throw deleteError;

        // Deleta histórico associado
        await supabaseClient
            .from('historico_estoque')
            .delete()
            .eq('manga_id', mangaId)
            .catch(() => {}); // Ignora erro se não existir

        console.log(`✅ Mangá ${mangaId} deletado`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao deletar mangá:', error.message);
        showMessage('Erro ao deletar mangá do Supabase', 'error');
        throw error;
    }
}

/**
 * Faz upload de uma imagem para Supabase Storage
 */
async function uploadCapaToSupabaseStorage(file, mangaId) {
    try {
        const timestamp = new Date().getTime();
        const fileName = `${mangaId}_${timestamp}.jpg`;

        // Comprime a imagem antes de fazer upload
        const compressedFile = await compressImage(file);

        const { data, error } = await supabaseClient.storage
            .from('capas')
            .upload(fileName, compressedFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Gera URL pública
        const { data: publicUrl } = supabaseClient.storage
            .from('capas')
            .getPublicUrl(fileName);

        console.log(`✅ Capa salva: ${publicUrl.publicUrl}`);
        return publicUrl.publicUrl;
    } catch (error) {
        console.error('❌ Erro ao fazer upload da capa:', error.message);
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
 * Salva histórico de estoque no Supabase
 */
async function saveHistoricoToSupabase(mangaId, movimentacoes) {
    try {
        // Tenta atualizar primeiro
        const { data: existing } = await supabaseClient
            .from('historico_estoque')
            .select('id')
            .eq('manga_id', mangaId)
            .single();

        if (existing) {
            // Atualiza
            const { error } = await supabaseClient
                .from('historico_estoque')
                .update({
                    movimentacoes: movimentacoes,
                    atualizado_em: new Date().toISOString()
                })
                .eq('manga_id', mangaId);

            if (error) throw error;
        } else {
            // Insere novo
            const { error } = await supabaseClient
                .from('historico_estoque')
                .insert([{
                    manga_id: mangaId,
                    movimentacoes: movimentacoes,
                    criado_em: new Date().toISOString()
                }]);

            if (error) throw error;
        }

        console.log(`✅ Histórico do mangá ${mangaId} salvo`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar histórico:', error.message);
        throw error;
    }
}

/**
 * Sincroniza dados com Supabase
 */
async function syncMangasWithSupabase() {
    try {
        for (const manga of mangas) {
            try {
                if (typeof manga.id === 'number') {
                    // Novo mangá, salva no Supabase
                    const docId = await saveMangaToSupabase(manga);
                    manga.id = docId;
                } else {
                    // Mangá existente, atualiza
                    await updateMangaInSupabase(manga.id, manga);
                }
            } catch (error) {
                console.error('Erro ao sincronizar manga:', error);
            }
        }

        // Sincroniza histórico também
        for (const [mangaId, movimentacoes] of Object.entries(historicoEstoque)) {
            await saveHistoricoToSupabase(mangaId, movimentacoes);
        }

        console.log('✅ Dados sincronizados com Supabase');
    } catch (error) {
        console.error('⚠️ Erro ao sincronizar com Supabase:', error);
    }
}

/**
 * Preenche o campo de preço ao clicar em um resultado do Mercado Livre
 */
function preencherPrecoDeMercadoLivre(preco, tipo) {
    const campoPreco = tipo === 'add' ? 'preco' : 'edit-preco';
    document.getElementById(campoPreco).value = preco;
    console.log(`✅ Preço preenchido: R$ ${preco.toFixed(2)}`);
}
