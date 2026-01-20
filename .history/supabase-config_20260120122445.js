// Supabase Configuration
// ⚠️ SUBSTITUA OS VALORES ABAIXO COM SUAS CREDENCIAIS DO SUPABASE
// Acesse https://supabase.com para criar um projeto

const SUPABASE_URL = "https://scgginzhoyichrfmkjjw.supabase.co";
const SUPABASE_KEY = "sb_publishable__VM_apLRL9Gg6wO-InuqWQ_fKrac4TL";

// Inicializa cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Supabase iniciado com sucesso!');
